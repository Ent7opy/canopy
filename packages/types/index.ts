// Shared TypeScript types for the Canopy monorepo

export interface AuthUser {
  id: string;
  email: string;
  display_name: string;
  timezone: string;
  theme: string;
  settings: Record<string, unknown>;
}

export interface ApiUser {
  id: string;
  email: string;
  display_name: string;
  timezone: string;
  theme: string;
  settings: Record<string, unknown>;
}

export interface ApiSkill {
  id: string;
  name: string;
  category: string | null;
  value: number;
  target: number | null;
  icon: string | null;
}

export interface ApiResource {
  id: string;
  type: 'book' | 'course' | 'article' | 'video' | 'podcast' | 'paper' | 'other';
  title: string;
  author: string | null;
  url: string | null;
  status: 'backlog' | 'active' | 'completed' | 'abandoned' | 'reference';
  rating: number | null;
  progress_current: number | null;
  progress_total: number | null;
}

export interface ApiGoal {
  id: string;
  title: string;
  type: string;
  timeframe: string;
  status: string;
  target_date: string | null;
  metric_name: string | null;
  metric_target: number | null;
  metric_current: number;
}

export interface ApiProject {
  id: string;
  name: string;
  description: string | null;
  status: 'idea' | 'active' | 'paused' | 'completed' | 'abandoned';
  type: string | null;
  url: string | null;
  repo_url: string | null;
}

export interface ApiTask {
  id: string;
  label: string;
  title: string | null;
  completed: boolean;
  status: string;
  priority: number;
  due_date: string | null;
  project_id: string | null;
  phase_id: string;
}

export interface ApiHabit {
  id: string;
  name: string;
  frequency: string;
  target_count: number;
  color: string | null;
  icon: string | null;
  active: boolean;
  done?: boolean; // populated by /habits/logs/today
}

export interface ApiHabitLog {
  id: string;
  habit_id: string;
  log_date: string;
  count: number;
  note: string | null;
}

export interface ApiJournalEntry {
  id: string;
  entry_date: string;
  body: string | null;
  mood: number | null;
  energy: number | null;
  prompts: Record<string, string>;
}

export interface ApiWeeklyReview {
  id: string;
  week_start: string;
  hours_logged: number | null;
  reflection: string | null;
  wins: string[] | null;
  blockers: string[] | null;
  next_week_focus: string[] | null;
}

export interface ApiHealthLog {
  id: string;
  log_date: string;
  mood: number | null;
  energy: number | null;
  sleep_hours: number | null;
  sleep_quality: number | null;
  weight_kg: number | null;
  notes: string | null;
  metadata?: Record<string, unknown>;
}

export interface ApiContact {
  id: string;
  name: string;
  relationship: string | null;
  email: string | null;
  keep_in_touch_freq: string | null;
  last_contact: string | null;
}

export interface ApiMediaItem {
  id: string;
  type: string;
  title: string;
  creator: string | null;
  status: string;
  rating: number | null;
}

export interface ApiHobby {
  id: string;
  name: string;
  category: string | null;
  status: string;
  description: string | null;
}

export interface ApiNote {
  id: string;
  title: string | null;
  body: string | null;
  entity_type: string | null;
  entity_id: string | null;
  pinned: boolean;
}

export interface ApiInboxItem {
  id: string;
  content: string;
  processed: boolean;
  created_at?: string;
}

export interface ApiDashboard {
  today: {
    journal: ApiJournalEntry | null;
    habits: ApiHabit[];
    health: ApiHealthLog | null;
  };
  week: {
    review: ApiWeeklyReview | null;
    tasks_due: ApiTask[];
    hours_logged: number;
  };
  snapshot: {
    active_projects: number;
    active_goals: number;
    inbox_unprocessed: number;
    contacts_due: number;
    skills_count: number;
    resources_active: number;
  };
}

export interface SearchResult {
  type: string;
  id: string;
  title: string;
  snippet: string;
}
