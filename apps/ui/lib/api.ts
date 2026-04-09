// Life OS API client — Canopy
import type {
  AuthUser,
  ApiUser,
  ApiSkill,
  ApiResource,
  ApiGoal,
  ApiProject,
  ApiTask,
  ApiHabit,
  ApiHabitLog,
  ApiJournalEntry,
  ApiWeeklyReview,
  ApiHealthLog,
  ApiContact,
  ApiMediaItem,
  ApiHobby,
  ApiNote,
  ApiInboxItem,
  ApiDashboard,
  SearchResult,
} from '@canopy/types';

export type {
  AuthUser,
  ApiUser,
  ApiSkill,
  ApiResource,
  ApiGoal,
  ApiProject,
  ApiTask,
  ApiHabit,
  ApiHabitLog,
  ApiJournalEntry,
  ApiWeeklyReview,
  ApiHealthLog,
  ApiContact,
  ApiMediaItem,
  ApiHobby,
  ApiNote,
  ApiInboxItem,
  ApiDashboard,
  SearchResult,
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '');

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T | null> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include', // send HttpOnly session cookie
    });
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('canopy-auth');
        window.location.href = '/login';
      }
      return null;
    }
    if (!res.ok) return null;
    if (res.status === 204) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export async function authRegister(
  email: string,
  password: string,
  display_name?: string
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, display_name }),
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function authLogin(
  email: string,
  password: string
): Promise<{ user: AuthUser }> {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // receive HttpOnly session cookie
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function authForgotPassword(email: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed');
  return data;
}

export async function authResetPassword(token: string, password: string): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed');
  return data;
}

export async function authLogout(): Promise<void> {
  await fetch(`${API_URL}/api/v1/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

// ─── v1: USER ─────────────────────────────────────────────────────────────────

export async function getUser(): Promise<ApiUser | null> {
  return apiFetch<ApiUser>('/api/v1/user');
}
export async function patchUser(data: Partial<Pick<ApiUser, 'display_name' | 'timezone' | 'theme' | 'settings'>>): Promise<ApiUser | null> {
  return apiFetch<ApiUser>('/api/v1/user', { method: 'PATCH', body: JSON.stringify(data) });
}

// ─── v1: DASHBOARD ────────────────────────────────────────────────────────────

export async function getDashboard(): Promise<ApiDashboard | null> {
  return apiFetch<ApiDashboard>('/api/v1/dashboard');
}

// ─── v1: SKILLS ───────────────────────────────────────────────────────────────

export async function getSkills(category?: string): Promise<ApiSkill[] | null> {
  const q = category ? `?category=${encodeURIComponent(category)}` : '';
  return apiFetch<ApiSkill[]>(`/api/v1/skills${q}`);
}
export async function createSkill(data: { name: string; category?: string; value?: number; target?: number; icon?: string }): Promise<ApiSkill | null> {
  return apiFetch<ApiSkill>('/api/v1/skills', { method: 'POST', body: JSON.stringify(data) });
}
export async function patchSkill(id: string, data: Partial<ApiSkill>): Promise<ApiSkill | null> {
  return apiFetch<ApiSkill>(`/api/v1/skills/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteSkill(id: string): Promise<void> {
  await apiFetch(`/api/v1/skills/${id}`, { method: 'DELETE' });
}

// ─── v1: RESOURCES ────────────────────────────────────────────────────────────

export async function getResources(params?: { type?: string; status?: string }): Promise<ApiResource[] | null> {
  const q = new URLSearchParams(params as Record<string, string> ?? {}).toString();
  return apiFetch<ApiResource[]>(`/api/v1/resources${q ? '?' + q : ''}`);
}
export async function createResource(data: Partial<ApiResource> & { type: string; title: string }): Promise<ApiResource | null> {
  return apiFetch<ApiResource>('/api/v1/resources', { method: 'POST', body: JSON.stringify(data) });
}
export async function patchResource(id: string, data: Partial<ApiResource>): Promise<ApiResource | null> {
  return apiFetch<ApiResource>(`/api/v1/resources/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteResource(id: string): Promise<void> {
  await apiFetch(`/api/v1/resources/${id}`, { method: 'DELETE' });
}

// ─── v1: GOALS ────────────────────────────────────────────────────────────────

export async function getGoals(params?: { status?: string; timeframe?: string }): Promise<ApiGoal[] | null> {
  const q = new URLSearchParams(params as Record<string, string> ?? {}).toString();
  return apiFetch<ApiGoal[]>(`/api/v1/goals${q ? '?' + q : ''}`);
}
export async function createGoal(data: Partial<ApiGoal> & { title: string }): Promise<ApiGoal | null> {
  return apiFetch<ApiGoal>('/api/v1/goals', { method: 'POST', body: JSON.stringify(data) });
}
export async function patchGoal(id: string, data: Partial<ApiGoal>): Promise<ApiGoal | null> {
  return apiFetch<ApiGoal>(`/api/v1/goals/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteGoal(id: string): Promise<void> {
  await apiFetch(`/api/v1/goals/${id}`, { method: 'DELETE' });
}

// ─── v1: PROJECTS ─────────────────────────────────────────────────────────────

export async function getProjects(status?: string): Promise<ApiProject[] | null> {
  const q = status ? `?status=${status}` : '';
  return apiFetch<ApiProject[]>(`/api/v1/projects${q}`);
}
export async function createProject(data: Partial<ApiProject> & { name: string }): Promise<ApiProject | null> {
  return apiFetch<ApiProject>('/api/v1/projects', { method: 'POST', body: JSON.stringify(data) });
}
export async function patchProject(id: string, data: Partial<ApiProject>): Promise<ApiProject | null> {
  return apiFetch<ApiProject>(`/api/v1/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteProject(id: string): Promise<void> {
  await apiFetch(`/api/v1/projects/${id}`, { method: 'DELETE' });
}

// ─── v1: TASKS (v1) ───────────────────────────────────────────────────────────

export async function getTasksV1(params?: { status?: string; project_id?: string; due?: 'today' | 'week' }): Promise<ApiTask[] | null> {
  const q = new URLSearchParams(params as Record<string, string> ?? {}).toString();
  return apiFetch<ApiTask[]>(`/api/v1/tasks${q ? '?' + q : ''}`);
}
export async function createTaskV1(data: { title: string; project_id?: string; due_date?: string; priority?: number }): Promise<ApiTask | null> {
  return apiFetch<ApiTask>('/api/v1/tasks', { method: 'POST', body: JSON.stringify(data) });
}
export async function patchTaskV1(id: string, data: Partial<ApiTask>): Promise<ApiTask | null> {
  return apiFetch<ApiTask>(`/api/v1/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteTaskV1(id: string): Promise<void> {
  await apiFetch(`/api/v1/tasks/${id}`, { method: 'DELETE' });
}

// ─── v1: HABITS ───────────────────────────────────────────────────────────────

export async function getHabits(): Promise<ApiHabit[] | null> {
  return apiFetch<ApiHabit[]>('/api/v1/habits');
}
export async function getTodayHabits(): Promise<ApiHabit[] | null> {
  return apiFetch<ApiHabit[]>('/api/v1/habits/logs/today');
}
export async function createHabit(data: { name: string; frequency?: string; icon?: string; color?: string }): Promise<ApiHabit | null> {
  return apiFetch<ApiHabit>('/api/v1/habits', { method: 'POST', body: JSON.stringify(data) });
}
export async function patchHabit(id: string, data: Partial<ApiHabit>): Promise<ApiHabit | null> {
  return apiFetch<ApiHabit>(`/api/v1/habits/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function logHabit(id: string, log_date: string, count = 1): Promise<ApiHabitLog | null> {
  return apiFetch<ApiHabitLog>(`/api/v1/habits/${id}/logs`, { method: 'POST', body: JSON.stringify({ log_date, count }) });
}
export async function unlogHabit(id: string, logDate: string): Promise<void> {
  await apiFetch(`/api/v1/habits/${id}/logs/${logDate}`, { method: 'DELETE' });
}

// ─── v1: JOURNAL ──────────────────────────────────────────────────────────────

export async function getJournalEntries(limit = 30): Promise<ApiJournalEntry[] | null> {
  return apiFetch<ApiJournalEntry[]>(`/api/v1/journal?limit=${limit}`);
}
export async function getJournalEntry(date: string): Promise<ApiJournalEntry | null> {
  return apiFetch<ApiJournalEntry>(`/api/v1/journal/${date}`);
}
export async function upsertJournalEntry(data: Partial<ApiJournalEntry> & { entry_date: string }): Promise<ApiJournalEntry | null> {
  return apiFetch<ApiJournalEntry>('/api/v1/journal', { method: 'POST', body: JSON.stringify(data) });
}

// ─── v1: WEEKLY REVIEWS ───────────────────────────────────────────────────────

export async function getWeeklyReviews(limit = 30): Promise<ApiWeeklyReview[] | null> {
  return apiFetch<ApiWeeklyReview[]>(`/api/v1/reviews/weekly?limit=${limit}`);
}
export async function upsertWeeklyReview(data: Partial<ApiWeeklyReview> & { week_start: string }): Promise<ApiWeeklyReview | null> {
  return apiFetch<ApiWeeklyReview>('/api/v1/reviews/weekly', { method: 'POST', body: JSON.stringify(data) });
}

// ─── v1: HEALTH ───────────────────────────────────────────────────────────────

export async function getHealthLogs(limit = 30): Promise<ApiHealthLog[] | null> {
  return apiFetch<ApiHealthLog[]>(`/api/v1/health?limit=${limit}`);
}
export async function getHealthLog(date: string): Promise<ApiHealthLog | null> {
  return apiFetch<ApiHealthLog>(`/api/v1/health/${date}`);
}
export async function upsertHealthLog(data: Partial<ApiHealthLog> & { log_date: string }): Promise<ApiHealthLog | null> {
  return apiFetch<ApiHealthLog>('/api/v1/health', { method: 'POST', body: JSON.stringify(data) });
}

// ─── v1: NOTES ────────────────────────────────────────────────────────────────

export async function getNotes(params?: { entity_type?: string; entity_id?: string; pinned?: boolean }): Promise<ApiNote[] | null> {
  const q = new URLSearchParams(params as Record<string, string> ?? {}).toString();
  return apiFetch<ApiNote[]>(`/api/v1/notes${q ? '?' + q : ''}`);
}
export async function createNote(data: Partial<ApiNote>): Promise<ApiNote | null> {
  return apiFetch<ApiNote>('/api/v1/notes', { method: 'POST', body: JSON.stringify(data) });
}
export async function patchNote(id: string, data: Partial<ApiNote>): Promise<ApiNote | null> {
  return apiFetch<ApiNote>(`/api/v1/notes/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteNote(id: string): Promise<void> {
  await apiFetch(`/api/v1/notes/${id}`, { method: 'DELETE' });
}

// ─── v1: INBOX ────────────────────────────────────────────────────────────────

export async function getInbox(): Promise<ApiInboxItem[] | null> {
  return apiFetch<ApiInboxItem[]>('/api/v1/inbox');
}
export async function createInboxItem(content: string): Promise<ApiInboxItem | null> {
  return apiFetch<ApiInboxItem>('/api/v1/inbox', { method: 'POST', body: JSON.stringify({ content }) });
}
export async function processInboxItem(id: string, routed_to?: string, routed_id?: string): Promise<void> {
  await apiFetch(`/api/v1/inbox/${id}/process`, { method: 'POST', body: JSON.stringify({ routed_to, routed_id }) });
}
export async function deleteInboxItem(id: string): Promise<void> {
  await apiFetch(`/api/v1/inbox/${id}`, { method: 'DELETE' });
}

// ─── v1: PEOPLE ───────────────────────────────────────────────────────────────

export async function getContacts(): Promise<ApiContact[] | null> {
  return apiFetch<ApiContact[]>('/api/v1/people');
}
export async function createContact(data: Partial<ApiContact> & { name: string }): Promise<ApiContact | null> {
  return apiFetch<ApiContact>('/api/v1/people', { method: 'POST', body: JSON.stringify(data) });
}
export async function patchContact(id: string, data: Partial<ApiContact>): Promise<ApiContact | null> {
  return apiFetch<ApiContact>(`/api/v1/people/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function getContactsDue(): Promise<ApiContact[] | null> {
  return apiFetch<ApiContact[]>('/api/v1/people/due');
}
export async function logInteraction(contactId: string, data: { type: string; summary?: string; date?: string }): Promise<void> {
  await apiFetch(`/api/v1/people/${contactId}/interactions`, { method: 'POST', body: JSON.stringify(data) });
}

// ─── v1: MEDIA ────────────────────────────────────────────────────────────────

export async function getMedia(params?: { type?: string; status?: string }): Promise<ApiMediaItem[] | null> {
  const q = new URLSearchParams(params as Record<string, string> ?? {}).toString();
  return apiFetch<ApiMediaItem[]>(`/api/v1/media${q ? '?' + q : ''}`);
}
export async function createMediaItem(data: Partial<ApiMediaItem> & { type: string; title: string }): Promise<ApiMediaItem | null> {
  return apiFetch<ApiMediaItem>('/api/v1/media', { method: 'POST', body: JSON.stringify(data) });
}
export async function patchMediaItem(id: string, data: Partial<ApiMediaItem>): Promise<ApiMediaItem | null> {
  return apiFetch<ApiMediaItem>(`/api/v1/media/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

// ─── v1: HOBBIES ──────────────────────────────────────────────────────────────

export async function getHobbies(status?: string): Promise<ApiHobby[] | null> {
  const q = status ? `?status=${status}` : '';
  return apiFetch<ApiHobby[]>(`/api/v1/hobbies${q}`);
}
export async function createHobby(data: Partial<ApiHobby> & { name: string }): Promise<ApiHobby | null> {
  return apiFetch<ApiHobby>('/api/v1/hobbies', { method: 'POST', body: JSON.stringify(data) });
}
export async function patchHobby(id: string, data: Partial<ApiHobby>): Promise<ApiHobby | null> {
  return apiFetch<ApiHobby>(`/api/v1/hobbies/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function logHobbySession(hobbyId: string, data: { log_date: string; duration_min?: number; notes?: string; rating?: number }): Promise<void> {
  await apiFetch(`/api/v1/hobbies/${hobbyId}/logs`, { method: 'POST', body: JSON.stringify(data) });
}

// ─── v1: SEARCH ───────────────────────────────────────────────────────────────

export async function search(q: string): Promise<SearchResult[] | null> {
  if (!q.trim()) return null;
  const result = await apiFetch<{ results: SearchResult[] }>(`/api/v1/search?q=${encodeURIComponent(q)}`);
  return result?.results ?? null;
}
