# "My Life" Dashboard Expansion Plan

## Overview
Transform the degree‑tracking dashboard into a holistic life hub with separate pages for University, Work, Hobbies, Health, Finances, etc. Keep the current dashboard as the University page.

## Technology Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS (already used)
- **UI Library:** shadcn/ui (recommended) – Tailwind‑based, customizable, consistent with existing code.
- **State Management:** React state + localStorage for client‑side persistence; later consider Zustand if needed.
- **Routing:** Next.js dynamic routes (`/work`, `/hobbies`, etc.)

## Why shadcn/ui over Mantine
- Already using Tailwind; shadcn/ui is built on Tailwind.
- Fully customizable; we control the design system.
- Lightweight; add only components we need.
- Great for bespoke dashboards where design matters.
- Mantine is heavier and has its own styling paradigm; could cause conflicts.

## Navigation Structure
```
Navbar (fixed top)
├── University (current dashboard)
├── Work (job tasks, projects, time tracking)
├── Hobbies (reading list, side projects, goals)
├── Health (exercise, sleep, nutrition)
├── Finances (budget, savings, investments)
└── Settings (theme, data export)
```

Each page is a separate route under `app/`:
- `app/page.tsx` → University (current)
- `app/work/page.tsx`
- `app/hobbies/page.tsx`
- etc.

## Phase 1: Foundation (Today–Tomorrow)
1. **Add navigation component** – Horizontal tab bar with Tailwind.
2. **Create layout wrapper** – Move current page into `app/university/page.tsx` and adjust layout.
3. **Set up shadcn/ui** – Install and configure; add button, card, dialog components.
4. **Create placeholder pages** – Basic "Coming soon" for Work, Hobbies, etc.

## Phase 2: Feature Expansion (This Week)
- **Work page:** Task manager (drag‑and‑drop), Pomodoro timer, project timelines.
- **Hobbies page:** Enhanced reading list with notes, side‑project tracker, media log.
- **Health page:** Simple habit tracker (exercise, water, sleep) with charts.
- **Finances page:** Monthly budget planner, savings progress, expense categories.

## Phase 3: Polish & Integration (Next Week)
- **Dark/light mode toggle** (Tailwind CSS theme).
- **Data sync** – Export/import localStorage, optional GitHub Gist backup.
- **Mobile responsiveness** – Ensure all pages work on phones.
- **Notifications** – Browser notifications for daily check‑ins.

## Bulgarian University Option
If Vanyo proceeds, add a toggle between German and Bulgarian university roadmaps. Store selection in localStorage.

## Immediate Next Steps
1. Wait for Vercel deployment to succeed (Pro trial enabled).
2. Verify current features (rings, weekly review) are live.
3. Install shadcn/ui: `npx shadcn@latest init`
4. Create `components/Navbar.tsx` with tab navigation.
5. Move current dashboard to `app/university/page.tsx` and update layout.

## Success Metrics
- Dashboard live with all current features.
- Navigation works between pages.
- shadcn/ui components integrated (button, card).
- User can toggle dark/light mode.