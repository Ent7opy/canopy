'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getJournalEntries, upsertJournalEntry, type ApiJournalEntry } from '@/lib/api';

export function useJournal() {
  const { journalEntries, setJournalEntries, upsertJournalEntry: storeUpsert } = useDashboardStore();

  useEffect(() => {
    getJournalEntries(30).then((data) => {
      if (data) setJournalEntries(data);
    });
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = journalEntries.find((e) => e.entry_date === todayStr) ?? null;

  async function save(data: Partial<ApiJournalEntry> & { entry_date: string }) {
    const optimistic = { id: 'temp', body: null, mood: null, energy: null, prompts: {}, ...data };
    storeUpsert(optimistic as ApiJournalEntry);
    const saved = await upsertJournalEntry(data);
    if (saved) storeUpsert(saved);
  }

  return { entries: journalEntries, todayEntry, save };
}
