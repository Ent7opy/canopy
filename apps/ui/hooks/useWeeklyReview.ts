'use client';
import { useEffect, useMemo } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getWeeklyReviews, upsertWeeklyReview, type ApiWeeklyReview } from '@/lib/api';

export function useWeeklyReview() {
  const { weeklyReviews, setWeeklyReviews, upsertWeeklyReview: storeUpsert } = useDashboardStore();

  useEffect(() => {
    getWeeklyReviews(12).then((data) => { if (data) setWeeklyReviews(data); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const streak = useMemo(() => {
    if (!weeklyReviews.length) return 0;
    const sorted = [...weeklyReviews].sort((a, b) => b.week_start.localeCompare(a.week_start));
    let count = 0;
    for (const r of sorted) {
      if (r.hours_logged && r.hours_logged > 0) count++;
      else break;
    }
    return count;
  }, [weeklyReviews]);

  async function saveReview(data: Partial<ApiWeeklyReview> & { week_start: string }) {
    const optimistic: ApiWeeklyReview = {
      id: 'temp',
      hours_logged: null,
      reflection: null,
      wins: null,
      blockers: null,
      next_week_focus: null,
      ...data,
    };
    storeUpsert(optimistic);
    const saved = await upsertWeeklyReview(data);
    if (saved) storeUpsert(saved);
  }

  function currentWeekStart(): string {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  }

  return { reviews: weeklyReviews, streak, saveReview, currentWeekStart };
}
