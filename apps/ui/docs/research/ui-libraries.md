# UI Libraries Research – shadcn/ui vs Mantine

## Context
The Life Dashboard is built with Next.js 15 (App Router) and Tailwind CSS. Need to decide on a component library for consistent UI and faster development of expanded sections (Work, Hobbies, Health, Settings).

## Options

### shadcn/ui
- **Description**: Not a traditional library; a collection of accessible, customizable components built with Tailwind CSS and Radix UI primitives.
- **Pros**:
  - Fully customizable (Tailwind‑based).
  - No runtime dependency; components are copied into your project.
  - Excellent accessibility (Radix UI).
  - Fits perfectly with existing Tailwind stack.
  - Lightweight, no bundle bloat.
- **Cons**:
  - Requires manual component installation.
  - Less out‑of‑the‑box functionality (no built‑in hooks, form handling, etc.).
  - Smaller community than Mantine.
- **Best for**: Projects already using Tailwind that need fine‑grained control and zero runtime overhead.

### Mantine
- **Description**: Full‑featured React component library with built‑in hooks, form handling, dates, notifications, etc.
- **Pros**:
  - Comprehensive component set (tables, charts, modals, etc.).
  - Built‑in hooks (`use‑form`, `use‑debounce`, etc.).
  - Strong theming system.
  - Active community and frequent updates.
  - Good TypeScript support.
- **Cons**:
  - Larger bundle size.
  - Different styling approach (CSS‑in‑JS via Emotion) that may conflict with Tailwind.
  - Overkill if only basic components needed.
- **Best for**: Rapid prototyping, projects needing advanced UI components and utilities.

## Decision
**Recommendation**: **shadcn/ui** – because:
1. The dashboard already uses Tailwind CSS; shadcn/ui is a natural extension.
2. Customization is crucial for a personal dashboard (branding, unique layouts).
3. We don't need complex charts/tables/forms immediately; can add later.
4. Bundle size matters for a static‑exported GitHub Pages site.

## Integration Plan
1. Install shadcn/ui: `npx shadcn@latest init`
2. Configure `components.json` with Tailwind settings.
3. Add initial components (Button, Card, Input, Toggle, etc.).
4. Gradually replace custom UI with shadcn/ui components.

## Next Steps
- [ ] Run shadcn/ui installation.
- [ ] Add first components (Button, Card) to existing pages.
- [ ] Update Navbar, progress rings, weekly review to use shadcn/ui where appropriate.
- [ ] Ensure dark/light mode compatibility.

## References
- [shadcn/ui documentation](https://ui.shadcn.com/)
- [Mantine documentation](https://mantine.dev/)