'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getHabitsForDate, logHabit, unlogHabit, createHabit, deleteHabit } from '@/lib/api';
import { useActiveDate } from '@/hooks/useActiveDate';

export function useHabits() {
  const { habits, setHabits, setHabitDone, removeHabit } = useDashboardStore();
  const { date } = useActiveDate();

  // Refetch habits with done-state keyed to the currently selected date.
  useEffect(() => {
    getHabitsForDate(date).then((data) => {
      if (data) setHabits(data);
    });
  }, [date]);

  function complete(id: string) {
    setHabitDone(id, true);
    logHabit(id, date);
  }

  function uncomplete(id: string) {
    setHabitDone(id, false);
    unlogHabit(id, date);
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
