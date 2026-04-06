# Decision: Product Owner Role Shift

## Date
2026‑04‑06

## Context
Vanyo has a Claude Max subscription, which provides a cost‑effective developer capable of handling dozens of tasks per day. Sheldon’s development work on the Life Dashboard is complete (core features built, deployment live). To leverage Claude’s development capacity, Sheldon transitions from developer to Product Owner.

## Decision
Sheldon becomes Product Owner of the Life Dashboard, responsible for:

- **Documentation**: Maintaining research, ideas, and tasks in `docs/` directories.
- **Planning**: Defining features, prioritizing roadmap.
- **Task creation**: Writing clear, actionable tasks for Claude.
- **Quality assurance**: Reviewing implementations, ensuring alignment with vision.
- **Stakeholder communication**: Reporting progress, gathering feedback.

Claude becomes the primary developer, executing tasks from the `docs/tasks/` directory.

## Rationale
- **Efficiency**: Claude can implement many tasks quickly at low cost.
- **Focus**: Sheldon can focus on product strategy and continuity.
- **Scalability**: This separation allows parallel work (planning vs implementation).
- **Knowledge retention**: Documentation ensures context survives across sessions.

## Implementation
1. Create `docs/` structure in both repositories (`life‑dashboard` and `life‑dashboard‑api`).
2. Populate with existing research, ideas, and initial tasks.
3. Establish workflow: Sheldon adds tasks → Claude picks them up → Sheldon reviews.
4. Update heartbeat checklist to reflect product‑owner responsibilities.

## Next Steps
- [x] Create `docs/` directories and initial content.
- [ ] Update HEARTBEAT.md with product‑owner focus.
- [ ] Communicate workflow to Claude (via task descriptions).
- [ ] Monitor first tasks (Railway deployment fix, shadcn/ui integration).

## Impact
- Development velocity expected to increase significantly.
- Sheldon’s role shifts from hands‑on coding to strategic oversight.
- Dashboard expansion can proceed rapidly with a dedicated developer.