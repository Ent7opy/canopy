'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getGoals, createGoal, patchGoal, deleteGoal, type ApiGoal } from '@/lib/api';

export function useGoals(params?: { status?: string; timeframe?: string }) {
  const { apiGoals, setApiGoals, upsertApiGoal, removeApiGoal } = useDashboardStore();

  useEffect(() => {
    getGoals(params).then((data) => {
      if (data) setApiGoals(data);
    });
  }, []);

  async function add(title: string, extra?: Partial<ApiGoal>) {
    const created = await createGoal({ title, ...extra });
    if (created) upsertApiGoal(created);
    return created;
  }

  async function update(id: string, data: Partial<ApiGoal>) {
    upsertApiGoal({ ...apiGoals.find((g) => g.id === id)!, ...data });
    patchGoal(id, data);
  }

  async function remove(id: string) {
    removeApiGoal(id);
    deleteGoal(id);
  }

  return { goals: apiGoals, add, update, remove };
}
