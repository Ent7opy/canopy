'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getHobbies, createHobby, patchHobby, logHobbySession, type ApiHobby } from '@/lib/api';

export function useHobbies(status?: string) {
  const { hobbies, setHobbies, upsertHobby, removeHobby } = useDashboardStore();

  useEffect(() => {
    getHobbies(status).then((data) => {
      if (data) setHobbies(data);
    });
  }, []);

  async function add(name: string, extra?: Partial<ApiHobby>) {
    const created = await createHobby({ name, ...extra });
    if (created) upsertHobby(created);
    return created;
  }

  async function update(id: string, data: Partial<ApiHobby>) {
    upsertHobby({ ...hobbies.find((h) => h.id === id)!, ...data });
    patchHobby(id, data);
  }

  async function logSession(hobbyId: string, duration_min?: number, notes?: string) {
    const today = new Date().toISOString().split('T')[0];
    await logHobbySession(hobbyId, { log_date: today, duration_min, notes });
  }

  return { hobbies, add, update, logSession };
}
