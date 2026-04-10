'use client';
// ─── useWeeklyDashboard ───────────────────────────────────────────────────────
// Aggregates one week's worth of real data from across Canopy into the shape
// the /review page needs. Reads already-loaded journal / health / inbox data
// from the Zustand store, and fetches two things directly from the API that
// aren't in the store yet:
//
//   1. `GET /habits/logs/range` — one row per active habit, with the set of
//      dates it was completed inside the week. Cheaper than firing 7 parallel
//      `/logs/:date` calls.
//   2. `GET /resources?status=completed` — so we can show which resources
//      crossed the finish line inside the week (filtered by `completed_at`).
//
// Everything else (mood/energy averages, habit completion rate, etc.) is
// derived client-side inside a single memo so the page has zero glue code.

import { useEffect, useMemo, useState } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import {
  getJournalEntries,
  getHealthLogs,
  getInbox,
  getResources,
  getHabitsLogsRange,
  type ApiJournalEntry,
  type ApiHealthLog,
  type ApiInboxItem,
  type ApiResource,
  type WeeklyHabitRow,
} from '@/lib/api';
import { todayISO } from '@/hooks/useActiveDate';

export interface WeeklyPulse {
  // Raw slices of the week
  journal: ApiJournalEntry[];
  health: ApiHealthLog[];
  inbox: ApiInboxItem[];
  habits: WeeklyHabitRow[];
  completedResources: ApiResource[];
  // KPIs
  daysJournaled: number;
  habitCompletionRate: number | null; // 0..1, or null when no habits exist
  habitDoneCount: number;
  habitScheduledCount: number; // habits × days-so-far-in-week
  avgMood: number | null;
  avgEnergy: number | null;
  avgSleep: number | null;
  mindLogCaptures: number;
  // Time series (aligned to the week's 7 days, null when no entry for that day)
  moodByDay: Array<number | null>;
  energyByDay: Array<number | null>;
  sleepByDay: Array<number | null>;
}

export function useWeeklyDashboard(weekStart: string, weekEnd: string, days: string[]) {
  const {
    journalEntries, setJournalEntries,
    healthLogs, setHealthLogs,
    inboxItems, setInboxItems,
  } = useDashboardStore();

  const [habits, setHabits] = useState<WeeklyHabitRow[]>([]);
  const [completedResources, setCompletedResources] = useState<ApiResource[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Refresh the store-backed data once on mount. Other parts of the app may
  // have mutated or paginated it; `/review` wants a clean snapshot.
  useEffect(() => {
    getJournalEntries(30).then((d) => { if (d) setJournalEntries(d); });
    getHealthLogs(30).then((d) => { if (d) setHealthLogs(d); });
    getInbox().then((d) => { if (d) setInboxItems(d); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch the week-scoped data whenever the selected week changes.
  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    Promise.all([
      getHabitsLogsRange(weekStart, weekEnd),
      getResources({ status: 'completed' }),
    ]).then(([h, r]) => {
      if (cancelled) return;
      setHabits(h ?? []);
      setCompletedResources(r ?? []);
      setLoaded(true);
    });
    return () => { cancelled = true; };
  }, [weekStart, weekEnd]);

  const pulse: WeeklyPulse = useMemo(() => {
    const inWeek = (iso: string) => iso >= weekStart && iso <= weekEnd;
    const today = todayISO();

    // Slice store data into the week.
    const journal = journalEntries
      .filter((e) => inWeek(e.entry_date))
      .sort((a, b) => a.entry_date.localeCompare(b.entry_date));
    const health = healthLogs
      .filter((l) => inWeek(l.log_date))
      .sort((a, b) => a.log_date.localeCompare(b.log_date));
    const inbox = inboxItems
      .filter((i) => typeof i.created_at === 'string' && inWeek(i.created_at.slice(0, 10)))
      .sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? ''));

    // Completed resources whose completed_at falls in the week.
    const weekCompleted = completedResources.filter((r) => {
      if (!r.completed_at) return false;
      return inWeek(r.completed_at.slice(0, 10));
    });

    // Averages — ignore null entries rather than skewing toward 0.
    const pickNumbers = <T,>(arr: T[], key: (x: T) => number | null) =>
      arr.map(key).filter((v): v is number => typeof v === 'number');
    const avg = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

    const moods = pickNumbers(journal, (e) => e.mood);
    const energies = pickNumbers(journal, (e) => e.energy);
    const sleeps = pickNumbers(health, (l) => l.sleep_hours);

    // Per-day series aligned to `days` — null = no entry for that day.
    const journalByDate = new Map(journal.map((e) => [e.entry_date, e]));
    const healthByDate = new Map(health.map((l) => [l.log_date, l]));
    const moodByDay = days.map((d) => journalByDate.get(d)?.mood ?? null);
    const energyByDay = days.map((d) => journalByDate.get(d)?.energy ?? null);
    const sleepByDay = days.map((d) => healthByDate.get(d)?.sleep_hours ?? null);

    // Habit completion rate over *days-so-far* — future days don't count
    // against you, which matters for week-to-date reads.
    const daysSoFar = days.filter((d) => d <= today);
    let doneCount = 0;
    for (const h of habits) {
      const hits = new Set(h.log_dates);
      for (const d of daysSoFar) if (hits.has(d)) doneCount += 1;
    }
    const scheduledCount = habits.length * daysSoFar.length;
    const rate = scheduledCount > 0 ? doneCount / scheduledCount : null;

    return {
      journal,
      health,
      inbox,
      habits,
      completedResources: weekCompleted,
      daysJournaled: journal.length,
      habitCompletionRate: rate,
      habitDoneCount: doneCount,
      habitScheduledCount: scheduledCount,
      avgMood: avg(moods),
      avgEnergy: avg(energies),
      avgSleep: avg(sleeps),
      mindLogCaptures: inbox.length,
      moodByDay,
      energyByDay,
      sleepByDay,
    };
  }, [journalEntries, healthLogs, inboxItems, habits, completedResources, weekStart, weekEnd, days]);

  return { pulse, loaded };
}
