import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ApiSkill,
  ApiHabit,
  ApiGoal,
  ApiProject,
  ApiTask,
  ApiJournalEntry,
  ApiHealthLog,
  ApiInboxItem,
  ApiHobby,
  ApiNote,
  ApiWeeklyReview,
} from '@canopy/types';

// ── Store shape ───────────────────────────────────────────────────────────────

interface DashboardState {
  // ── Skills ──────────────────────────────────────────────────────────────
  skills: ApiSkill[];
  setSkillValue: (id: string, value: number) => void;
  setSkills: (skills: ApiSkill[]) => void;

  // ── Habits ───────────────────────────────────────────────────────────────
  habits: ApiHabit[];
  setHabits: (habits: ApiHabit[]) => void;
  setHabitDone: (id: string, done: boolean) => void;

  // ── Goals ─────────────────────────────────────────────────────────────────
  apiGoals: ApiGoal[];
  setApiGoals: (goals: ApiGoal[]) => void;
  upsertApiGoal: (goal: ApiGoal) => void;
  removeApiGoal: (id: string) => void;

  // ── Projects ──────────────────────────────────────────────────────────────
  projects: ApiProject[];
  setProjects: (projects: ApiProject[]) => void;
  upsertProject: (project: ApiProject) => void;
  removeProject: (id: string) => void;

  // ── Tasks (v1) ────────────────────────────────────────────────────────────
  tasksV1: ApiTask[];
  setTasksV1: (tasks: ApiTask[]) => void;
  upsertTaskV1: (task: ApiTask) => void;
  removeTaskV1: (id: string) => void;

  // ── Journal ───────────────────────────────────────────────────────────────
  journalEntries: ApiJournalEntry[];
  setJournalEntries: (entries: ApiJournalEntry[]) => void;
  upsertJournalEntry: (entry: ApiJournalEntry) => void;

  // ── Health ────────────────────────────────────────────────────────────────
  healthLogs: ApiHealthLog[];
  setHealthLogs: (logs: ApiHealthLog[]) => void;
  upsertHealthLog: (log: ApiHealthLog) => void;

  // ── Inbox ─────────────────────────────────────────────────────────────────
  inboxItems: ApiInboxItem[];
  setInboxItems: (items: ApiInboxItem[]) => void;
  addInboxItem: (item: ApiInboxItem) => void;
  removeInboxItem: (id: string) => void;

  // ── Hobbies ───────────────────────────────────────────────────────────────
  hobbies: ApiHobby[];
  setHobbies: (hobbies: ApiHobby[]) => void;
  upsertHobby: (hobby: ApiHobby) => void;
  removeHobby: (id: string) => void;

  // ── Notes ─────────────────────────────────────────────────────────────────
  notes: ApiNote[];
  setNotes: (notes: ApiNote[]) => void;
  upsertNote: (note: ApiNote) => void;
  removeNote: (id: string) => void;

  // ── Weekly Reviews (v1) ───────────────────────────────────────────────────
  weeklyReviews: ApiWeeklyReview[];
  setWeeklyReviews: (reviews: ApiWeeklyReview[]) => void;
  upsertWeeklyReview: (review: ApiWeeklyReview) => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      // Skills
      skills: [],
      setSkillValue: (id, value) =>
        set((s) => ({ skills: s.skills.map((sk) => sk.id === id ? { ...sk, value } : sk) })),
      setSkills: (skills) => set({ skills }),

      // Habits
      habits: [],
      setHabits: (habits) => set({ habits }),
      setHabitDone: (id, done) =>
        set((s) => ({ habits: s.habits.map((h) => h.id === id ? { ...h, done } : h) })),

      // Goals
      apiGoals: [],
      setApiGoals: (apiGoals) => set({ apiGoals }),
      upsertApiGoal: (goal) =>
        set((s) => ({ apiGoals: [...s.apiGoals.filter((g) => g.id !== goal.id), goal] })),
      removeApiGoal: (id) => set((s) => ({ apiGoals: s.apiGoals.filter((g) => g.id !== id) })),

      // Projects
      projects: [],
      setProjects: (projects) => set({ projects }),
      upsertProject: (project) =>
        set((s) => ({ projects: [...s.projects.filter((p) => p.id !== project.id), project] })),
      removeProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      // Tasks v1
      tasksV1: [],
      setTasksV1: (tasksV1) => set({ tasksV1 }),
      upsertTaskV1: (task) =>
        set((s) => ({ tasksV1: [...s.tasksV1.filter((t) => t.id !== task.id), task] })),
      removeTaskV1: (id) => set((s) => ({ tasksV1: s.tasksV1.filter((t) => t.id !== id) })),

      // Journal
      journalEntries: [],
      setJournalEntries: (journalEntries) => set({ journalEntries }),
      upsertJournalEntry: (entry) =>
        set((s) => ({
          journalEntries: [...s.journalEntries.filter((e) => e.entry_date !== entry.entry_date), entry],
        })),

      // Health
      healthLogs: [],
      setHealthLogs: (healthLogs) => set({ healthLogs }),
      upsertHealthLog: (log) =>
        set((s) => ({
          healthLogs: [...s.healthLogs.filter((l) => l.log_date !== log.log_date), log],
        })),

      // Inbox
      inboxItems: [],
      setInboxItems: (inboxItems) => set({ inboxItems }),
      addInboxItem: (item) => set((s) => ({ inboxItems: [item, ...s.inboxItems] })),
      removeInboxItem: (id) => set((s) => ({ inboxItems: s.inboxItems.filter((i) => i.id !== id) })),

      // Hobbies
      hobbies: [],
      setHobbies: (hobbies) => set({ hobbies }),
      upsertHobby: (hobby) =>
        set((s) => ({ hobbies: [...s.hobbies.filter((h) => h.id !== hobby.id), hobby] })),
      removeHobby: (id) => set((s) => ({ hobbies: s.hobbies.filter((h) => h.id !== id) })),

      // Notes
      notes: [],
      setNotes: (notes) => set({ notes }),
      upsertNote: (note) =>
        set((s) => ({ notes: [...s.notes.filter((n) => n.id !== note.id), note] })),
      removeNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

      // Weekly Reviews v1
      weeklyReviews: [],
      setWeeklyReviews: (weeklyReviews) => set({ weeklyReviews }),
      upsertWeeklyReview: (review) =>
        set((s) => ({
          weeklyReviews: [...s.weeklyReviews.filter((r) => r.week_start !== review.week_start), review],
        })),
    }),
    {
      name: 'life-dashboard-v2',
    }
  )
);
