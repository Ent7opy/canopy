'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getTodayHabits, logHabit, unlogHabit, createHabit, type ApiHabit } from '@/lib/api';

export function useHabits() {
  const { habits, setHabits, setHabitDone } = useDashboardStore();

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

  return { habits, complete, uncomplete, add };
}
