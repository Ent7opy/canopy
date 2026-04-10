'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getTodayHabits, logHabit, unlogHabit, createHabit, deleteHabit, type ApiHabit } from '@/lib/api';

export function useHabits() {
  const { habits, setHabits, setHabitDone, removeHabit } = useDashboardStore();

  useEffect(() => {
    getTodayHabits().then((data) => {
      if (data) setHabits(data);
    });
  }, []);

  function complete(id: string) {
    setHabitDone(id, true);
    const today = new Date().toISOString().split('T')[0];
    logHabit(id, today);
  }

  function uncomplete(id: string) {
    setHabitDone(id, false);
    const today = new Date().toISOString().split('T')[0];
    unlogHabit(id, today);
  }

  async function add(name: string, frequency = 'daily') {
    const created = await createHabit({ name, frequency });
    if (created) setHabits([...habits, { ...created, done: false }]);
  }

  function remove(id: string) {
    removeHabit(id);
    deleteHabit(id);
  }

  return { habits, complete, uncomplete, add, remove };
}
