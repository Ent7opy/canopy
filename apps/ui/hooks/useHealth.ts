'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getHealthLogs, upsertHealthLog, type ApiHealthLog } from '@/lib/api';

export function useHealth() {
  const { healthLogs, setHealthLogs, upsertHealthLog: storeUpsert } = useDashboardStore();

  useEffect(() => {
    getHealthLogs(30).then((data) => {
      if (data) setHealthLogs(data);
    });
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = healthLogs.find((l) => l.log_date === todayStr) ?? null;

  async function log(data: Partial<ApiHealthLog> & { log_date: string }) {
    const optimistic = { id: 'temp', mood: null, energy: null, sleep_hours: null, sleep_quality: null, weight_kg: null, notes: null, ...data };
    storeUpsert(optimistic as ApiHealthLog);
    const saved = await upsertHealthLog(data);
    if (saved) storeUpsert(saved);
  }

  return { logs: healthLogs, todayLog, log };
}
