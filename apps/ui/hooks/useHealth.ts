'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getHealthLogs, upsertHealthLog, type ApiHealthLog } from '@/lib/api';
import { useActiveDate } from '@/hooks/useActiveDate';

export function useHealth() {
  const { healthLogs, setHealthLogs, upsertHealthLog: storeUpsert } = useDashboardStore();
  const { date } = useActiveDate();

  useEffect(() => {
    getHealthLogs(30).then((data) => {
      if (data) setHealthLogs(data);
    });
  }, []);

  // Log matching the currently selected date (may be null if none exists yet).
  const activeLog = healthLogs.find((l) => l.log_date === date) ?? null;

  async function log(data: Partial<ApiHealthLog>) {
    const payload = { ...data, log_date: date };
    const optimistic = { id: 'temp', mood: null, energy: null, sleep_hours: null, sleep_quality: null, weight_kg: null, notes: null, ...payload };
    storeUpsert(optimistic as ApiHealthLog);
    const saved = await upsertHealthLog(payload);
    if (saved) storeUpsert(saved);
  }

  return { logs: healthLogs, activeLog, activeDate: date, log };
}
