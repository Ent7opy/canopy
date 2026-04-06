# Task 03: API Integration Frontend

## Description
Connect the dashboard frontend to the backend API (Railway) for persistent storage of tasks, progress, reading list, and weekly review. Use the API configuration panel already present in Settings page.

## Acceptance Criteria
- [ ] Dashboard fetches tasks, progress, reading list, weekly review from API on load.
- [ ] Changes (toggle task, update progress, update reading status, log weekly review) are POSTed/PUT to API.
- [ ] Fallback to localStorage when API is unavailable (offline or not configured).
- [ ] Settings page API configuration works (URL/key saved, connection test passes).
- [ ] All existing interactive features continue to work with API backend.

## Steps
1. Create a shared API client utility (`lib/api.ts`) that:
   - Reads API URL and key from localStorage.
   - Provides `fetch` wrapper with `x-api-key` header.
   - Handles errors gracefully (fallback to localStorage).
2. Update `components/TaskList.tsx`:
   - Load tasks from `/api/tasks` (GET).
   - Toggle task sends PUT to `/api/tasks/:id`.
   - Create new task via POST.
3. Update `components/EditableProgressRing.tsx`:
   - Load progress values from `/api/progress` (GET).
   - Update progress via PUT to `/api/progress`.
4. Update `components/BookList.tsx`:
   - Load reading entries from `/api/reading` (GET).
   - Update status via PUT.
5. Update `components/WeeklyReview.tsx`:
   - Load previous entries from `/api/weekly-review` (GET).
   - Submit new entry via POST.
6. Ensure UI shows loading states while fetching.
7. Test with API live and offline.

## Notes
- The API already has full CRUD endpoints (see `server.js`).
- The default user UUID is `00000000‑0000‑0000‑0000‑000000000000`.
- API key is optional; if not set, skip authentication header.
- Data sync strategy: prefer API, fallback to localStorage, merge conflicts by timestamp (later).

## References
- [API endpoints](https://github.com/Ent7opy/life-dashboard-api/blob/main/server.js)
- [Settings API config](/data/workspace/degree-dashboard/app/settings/page.tsx)