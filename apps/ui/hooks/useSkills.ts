'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getSkills, patchSkill } from '@/lib/api';

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

  return { skills, updateSkill };
}
