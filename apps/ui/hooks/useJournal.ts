'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getJournalEntries, upsertJournalEntry, type ApiJournalEntry } from '@/lib/api';
import { useActiveDate } from '@/hooks/useActiveDate';

export function useJournal() {
  const { journalEntries, setJournalEntries, upsertJournalEntry: storeUpsert } = useDashboardStore();
  const { date } = useActiveDate();

  useEffect(() => {
    getJournalEntries(30).then((data) => {
      if (data) setJournalEntries(data);
    });
  }, []);

  // Entry matching the currently selected date (may be null if none exists yet).
  const activeEntry = journalEntries.find((e) => e.entry_date === date) ?? null;

  async function save(data: Partial<ApiJournalEntry>) {
    const payload = { ...data, entry_date: date };
    const optimistic = { id: 'temp', body: null, mood: null, energy: null, prompts: {}, ...payload };
    storeUpsert(optimistic as ApiJournalEntry);
    const saved = await upsertJournalEntry(payload);
    if (saved) storeUpsert(saved);
  }

  return { entries: journalEntries, activeEntry, activeDate: date, save };
}
