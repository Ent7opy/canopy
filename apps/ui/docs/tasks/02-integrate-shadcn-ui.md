# Task 02: Integrate shadcn/ui

## Description
Install and configure shadcn/ui component library to provide consistent, accessible UI components across the dashboard. Replace custom UI elements (buttons, cards, toggles) with shadcn/ui equivalents where appropriate.

## Acceptance Criteria
- [ ] shadcn/ui initialized (`npx shadcn@latest init`) with Tailwind configuration.
- [ ] At least three core components added (Button, Card, Toggle).
- [ ] Existing UI (Navbar, progress rings, weekly review) updated to use shadcn/ui components where suitable.
- [ ] Dark/light mode toggle works with shadcn/ui theming.
- [ ] No visual regressions; dashboard remains fully functional.

## Steps
1. Run `npx shadcn@latest init` in the project root.
2. Follow prompts (choose TypeScript, Tailwind, default path).
3. Add components:
   - `npx shadcn@latest add button`
   - `npx shadcn@latest add card`
   - `npx shadcn@latest add toggle`
4. Replace custom buttons in `components/Navbar.tsx`, `components/ThemeToggle.tsx`, `components/TaskList.tsx` with shadcn/ui Button.
5. Replace custom cards in `components/ResourceCard.tsx` and `app/page.tsx` with shadcn/ui Card.
6. Update dark/light mode toggle to use shadcn/ui Toggle.
7. Test UI across pages (University, Work, Hobbies, Health, Settings).

## Notes
- Keep existing styling (colors, spacing) consistent with current design.
- Ensure accessibility (aria labels, keyboard navigation) is preserved.
- The dashboard is static‑exported; avoid client‑side‑only shadcn/ui features that break static generation.

## References
- [shadcn/ui documentation](https://ui.shadcn.com/)
- [Project Tailwind config](/data/workspace/degree-dashboard/tailwind.config.ts)