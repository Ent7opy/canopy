'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getSkills, patchSkill, createSkill, deleteSkill } from '@/lib/api';

export function useSkills() {
  const { skills, setSkills, setSkillValue } = useDashboardStore();

  useEffect(() => {
    getSkills().then((data) => { if (data) setSkills(data); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateSkill(id: string, value: number) {
    setSkillValue(id, value);
    patchSkill(id, { value });
  }

  async function addSkill(name: string, extra?: { category?: string; value?: number; target?: number }) {
    const created = await createSkill({ name, ...extra });
    if (created) setSkills([...skills, created]);
    return created;
  }

  function removeSkill(id: string) {
    setSkills(skills.filter((s) => s.id !== id));
    deleteSkill(id);
  }

  return { skills, updateSkill, addSkill, removeSkill };
}
