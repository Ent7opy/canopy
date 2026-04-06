'use client';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { getProjects, createProject, patchProject, deleteProject, type ApiProject } from '@/lib/api';

export function useProjects(status?: string) {
  const { projects, setProjects, upsertProject, removeProject } = useDashboardStore();

  useEffect(() => {
    getProjects(status).then((data) => {
      if (data) setProjects(data);
    });
  }, []);

  async function add(name: string, extra?: Partial<ApiProject>) {
    const created = await createProject({ name, ...extra });
    if (created) upsertProject(created);
    return created;
  }

  async function update(id: string, data: Partial<ApiProject>) {
    upsertProject({ ...projects.find((p) => p.id === id)!, ...data });
    patchProject(id, data);
  }

  async function remove(id: string) {
    removeProject(id);
    deleteProject(id);
  }

  return { projects, add, update, remove };
}
