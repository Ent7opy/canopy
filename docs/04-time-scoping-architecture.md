# Time Scoping Architecture Proposal

## The Problem
Canopy tracks two fundamentally different types of data:
1. **Daily snapshots** (Journal, Health, Habits) — "What happened on April 1st?"
2. **Living entities** (Goals, Skills, Projects, Hobbies) — "What's my current state?"

The app needs a date-selectable UI that handles both correctly. A user should be able to select a past date and see what their day looked like (Events) while also understanding what their Goals/Skills looked like at that point (States). Today there is no date picker — everything shows "today" or "current."

## The State vs Event Model

### Events (Transient)
| Section | Key Field | Semantics |
|---------|-----------|-----------|
| Journal | `entry_date` | One entry per day. Selecting Apr 1 shows that day's journal. |
| Health | `log_date` | One log per day. Selecting Apr 1 shows sleep/activity for that day. |
| Habits | `habit_logs.log_date` | Completion records per date. Selecting Apr 1 shows which habits were done. |
| Weekly Review | `week_start` | One per week. Selecting any day shows that week's review. |
| Mind Log | `created_at` | Captured at a moment. Selecting Apr 1 shows items created that day. |

**Behavior when selecting a date:**
- Show the snapshot for that date (read-only if in the past)
- Allow creating/editing entries for today (and optionally for recent past dates — "backfilling")
- Past entries are immutable snapshots

### States (Persistent)
| Section | Key Fields | Semantics |
|---------|-----------|-----------|
| Goals | `status`, `created_at`, `updated_at` | Living entity with status transitions |
| Projects | `status`, `created_at`, `updated_at` | Living entity with status transitions |
| Skills | `value`, `created_at`, `updated_at` | Progressively updated value |
| Hobbies | `status`, `created_at`, `updated_at` | Status can change (active/paused) |
| Learning | `status`, `progress_current` | Active resources with progress |
| Reading | `status`, `progress_current` | Books with reading progress |

**Behavior when selecting a date:**
- Always show **current state** by default
- When viewing a past date, show a read-only "as of" view:
  - Filter to entities that existed by that date (`created_at <= selectedDate`)
  - Show the status they had at that time (requires version history, see below)
- Editing a State while on today's date works normally
- Editing a State while viewing a past date: **not allowed** (read-only mode)

## Implementation Design

### 1. Zustand State Addition

Add to `apps/ui/store/dashboardStore.ts`:

```typescript
// Date selection
selectedDate: string; // ISO date string "YYYY-MM-DD", defaults to today
setSelectedDate: (date: string) => void;
```

Since the store uses `persist`, this will survive page refreshes. On mount, check if selectedDate is stale (past day) and reset to today.

### 2. DatePicker Component

**New file:** `apps/ui/components/DatePicker.tsx`

Placed in `Sidebar.tsx` below the wordmark, above the nav items.

UI design:
```
  ←  Apr 8, 2026  →
```

- Left/right arrows to navigate days
- Clicking the date text opens a mini calendar popover
- "Today" badge/button to snap back to current date
- When viewing a past date, a subtle indicator shows "Viewing history"
- Styled with forest/amber/parchment theme (matches sidebar)

### 3. Hook Updates

Each Event hook gets a `date` parameter:

```typescript
// useHabits.ts
export function useHabits(date?: string) {
  const selectedDate = useDashboardStore(s => s.selectedDate);
  const targetDate = date ?? selectedDate;
  // Fetch habits for targetDate instead of hardcoded "today"
}

// useHealth.ts  
export function useHealth(date?: string) {
  const selectedDate = useDashboardStore(s => s.selectedDate);
  const targetDate = date ?? selectedDate;
  // Use getHealthLog(targetDate) instead of todayStr
}
```

### 4. API Changes

The habit logs endpoint needs to accept arbitrary dates:
```
GET /api/v1/habits/logs/:date   (new — returns habits with done flag for any date)
```

The inbox endpoint needs date filtering:
```
GET /api/v1/inbox?date=YYYY-MM-DD   (filters by created_at::date)
```

Journal and Health already support date-based queries.

### 5. Read-Only Mode for State Sections

When `selectedDate !== today`:

```typescript
const isViewingPast = selectedDate < todayStr;
```

State section components receive an `isReadOnly` prop:
- Hide add/edit/delete buttons
- Show a subtle banner: "Viewing as of {selectedDate}"
- Display entities that existed at that point

### 6. Version History (Future Enhancement)

To show "what a Goal's status was on April 1st," we need a state change log. Two approaches:

**A. Audit log table (recommended):**
```sql
CREATE TABLE entity_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,  -- 'goal', 'skill', 'project', etc.
  entity_id   UUID NOT NULL,
  field       TEXT NOT NULL,  -- 'status', 'value', etc.
  old_value   TEXT,
  new_value   TEXT NOT NULL,
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
```

This can be populated by a PostgreSQL trigger on UPDATE, or explicitly in the API routes.

**B. Use `updated_at` approximation (simpler):**
- Filter entities by `created_at <= selectedDate`
- Show current status with a note "Status may have changed since this date"
- Less accurate but zero schema changes

**Recommendation:** Start with approach B for v1, add audit log in v2 when users request historical accuracy.

## Backfilling Design

When a user selects a past date and wants to log data they missed:

### Events (allowed for recent past)
- **Journal:** `entry_date` is set to the selected date. The existing `upsertJournalEntry` already supports arbitrary dates.
- **Health:** `log_date` is set to the selected date. The existing `upsertHealthLog` already supports arbitrary dates.
- **Habits:** `log_date` is set to the selected date. The existing `logHabit` already supports arbitrary dates.

### States (not allowed)
- Goals, Skills, Projects, Hobbies: show read-only when viewing past dates
- Any edits go to current state, not historical

### UX consideration
When backfilling, show a subtle warning: "You are logging for {date}, not today."

## Review Loops — Closing Out a Period

### Weekly Close-Out
The existing Weekly Review section already handles week-level summaries with wins, blockers, and focus items.

Enhancement: When a user submits a Weekly Review, auto-populate:
- `hours_logged`: sum of habit completions and hobby log durations for the week
- `mood_avg`: average of journal mood entries for the week
- Suggested wins: goals completed this week
- Suggested blockers: goals still at 0% progress

### Monthly Close-Out (future)
A new "Monthly Review" could aggregate:
- Skills: delta in value vs previous month
- Goals: status changes this month
- Habits: completion rate percentage
- Reading: books finished

This would be a new table/section, following the same pattern as weekly_reviews.

## Execution Sequence

1. **Phase A:** Add `selectedDate` to Zustand store + DatePicker component in Sidebar
2. **Phase B:** Update Event hooks to use `selectedDate` instead of hardcoded today
3. **Phase C:** Add read-only mode flag to State section components
4. **Phase D:** Enable backfill for past dates (Journal, Health, Habits)
5. **Phase E:** Add `entity_history` audit table and trigger-based logging
6. **Phase F:** Monthly review section

Each phase is independently shippable. Phase A-C is the minimum viable implementation.
