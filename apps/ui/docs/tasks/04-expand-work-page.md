# Task 04: Expand Work Page

## Description
The Work page (`/work`) currently is a placeholder. Implement a useful task/project management interface with drag‑and‑drop tasks, Pomodoro timer, and project timelines.

## Acceptance Criteria
- [ ] Work page displays a Kanban‑style board (To‑Do, In Progress, Done) with draggable tasks.
- [ ] Tasks can be added, edited, deleted; stored in API (or localStorage fallback).
- [ ] Pomodoro timer with start/pause/reset, customizable work/break intervals.
- [ ] Simple project timeline showing upcoming deadlines (visual calendar).
- [ ] Mobile‑responsive layout.
- [ ] Data persists across sessions (via API or localStorage).

## Steps
1. Design UI layout (columns for Kanban, timer sidebar, timeline below).
2. Install drag‑and‑drop library (e.g., `@dnd‑kit/core`).
3. Implement Kanban board component:
   - Fetch tasks from API endpoint `/api/tasks` with category `work`.
   - Support drag between columns.
   - Update task status via PUT.
4. Implement Pomodoro timer component:
   - Countdown timer (25 min work, 5 min break).
   - Play/pause/reset buttons.
   - Notifications when timer ends (optional).
5. Implement timeline component:
   - Use `vis‑timeline` (already in project) or simple custom calendar.
   - Display tasks with due dates.
6. Add new task form (input, assign column, due date).
7. Style with Tailwind and shadcn/ui components.
8. Test across screen sizes.

## Notes
- Keep complexity manageable; MVP features first.
- Ensure timer works even when tab is inactive (use Web Workers if needed).
- Use existing API tasks table; add `category` field to distinguish work tasks.
- Consider adding a "Work" progress ring for weekly work hours tracking.

## References
- [dnd‑kit documentation](https://dndkit.com/)
- [Vis‑Timeline usage in project](/data/workspace/degree-dashboard/components/Timeline.tsx)
- [API tasks endpoint](https://github.com/Ent7opy/life-dashboard-api/blob/main/server.js#L75)