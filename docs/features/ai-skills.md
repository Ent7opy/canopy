# AI-Curated Skills

**Status:** Planned  
**Replaces:** Manual skills section (self-graded sliders, removed)

---

## Problem with the old approach

The previous Skills section asked users to rate themselves on a 0–100 slider. This is fundamentally flawed:

- Users are poor at objectively assessing their own abilities
- A number the user drags themselves carries no signal
- Levels never changed unless the user manually updated them
- No connection to anything the user actually did

---

## Proposed approach

Skills become **emergent from behaviour** rather than self-declared. The AI reads the user's existing data across the app and infers what skills they have, at what level, and what they should do next — grounded in evidence, not self-report.

---

## Data sources

The AI has access to everything already tracked in Canopy:

| Source | What it signals |
|---|---|
| Resources (books, courses, videos, papers) | What the user is learning and has completed |
| Projects | What the user is actively building, shipped work |
| Learning nodes | Explicit study goals and their status |
| Hobbies | Recreational skills and time invested |
| Habits | Consistent daily practices |
| Journal entries | Reflections, mentions of struggles and wins |
| Health logs | Energy/mood patterns that may correlate with output |
| Weekly reviews | Self-reported wins, blockers, focus areas |

---

## Core features

### 1. Skill inference
A Claude API call aggregates user data and produces a structured list of detected skills. Each skill includes:
- **Name** — e.g. "PostgreSQL", "Bouldering", "Writing"
- **Inferred level** — Beginner / Developing / Intermediate / Advanced (not a number)
- **Evidence** — the specific data points used (e.g. "2 completed courses, 3 active projects")
- **Confidence** — how much evidence backs the assessment

### 2. Onboarding Q&A for new skills
When a skill is first detected, the user is prompted with 2–3 targeted questions to calibrate their baseline:
- "Have you shipped anything with this professionally or publicly?"
- "Can you work through problems without documentation?"
- "How long have you been practising this?"

Their answers are stored and feed back into future assessments.

### 3. Skill gap detection
The AI flags mismatches between learning and application:
- Studying a skill with no projects applying it → "Learning without building"
- Active project using a skill with no supporting resources → potential knowledge gap

### 4. Contextual advice
Advice references the user's actual data — not generic tips:
> "You've completed 2 PostgreSQL courses and have 3 projects using it. Consider writing about what you've learned or contributing to an open source project to deepen your understanding."

### 5. Weekly refresh
Skills re-evaluate alongside the weekly review. This keeps the feature feeling alive without requiring manual intervention.

### 6. Skill timeline
Show how each skill's evidence base has grown over time — not just a current snapshot.

---

## UX direction

- Skills are **read-only cards** — no sliders, no user-set numbers
- Each card shows: name, level badge, evidence summary, advice
- A "Refresh" button re-runs inference on demand
- "Last updated" timestamp on each skill
- Users can still **add a skill manually**, which triggers the onboarding Q&A
- Users can **dispute** an AI assessment with a free-text note, which the AI considers in future runs

---

## Open questions

1. **Privacy** — does user data leave the app to hit the Claude API? Needs a clear opt-in and a privacy note. Consider running summarisation locally before sending to the API.
2. **Skills the AI can't infer** — interpersonal skills, physical skills not tracked in the app. Manual add + Q&A flow covers this partially.
3. **Frequency** — weekly refresh is a starting point. Should users be able to disable auto-refresh?
4. **Skill removal** — if a user stops a practice entirely, does the skill decay? How is that communicated?
5. **Prompt design** — the inference prompt needs careful iteration. The quality of skill detection depends heavily on it.

---

## Technical sketch

```
User triggers refresh (or weekly cron)
  → Fetch last 90 days of user data (resources, projects, habits, journal, hobbies, learning nodes)
  → Summarise each source into a compact representation
  → Send to Claude API with structured output schema
  → Parse response: [{ skill, level, evidence[], advice, confidence }]
  → Store in new `ai_skills` table (user_id, skill, level, evidence, advice, refreshed_at)
  → Display in SkillsSection
```

Suggested schema addition:

```sql
CREATE TABLE IF NOT EXISTS ai_skills (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  level        TEXT NOT NULL CHECK (level IN ('beginner','developing','intermediate','advanced')),
  evidence     JSONB NOT NULL DEFAULT '[]',
  advice       TEXT,
  confidence   TEXT CHECK (confidence IN ('low','medium','high')),
  refreshed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name)
);
```
