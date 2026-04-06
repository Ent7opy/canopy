# Canopy

> your life, tended carefully

A personal life OS — track goals, habits, projects, journal, health, and more.

## Structure

```
canopy/
├── apps/
│   ├── api/     Express.js + PostgreSQL backend
│   └── ui/      Next.js frontend
└── packages/
    └── types/   Shared TypeScript types
```

## Development

```bash
npm install        # install all workspaces
npm run dev:api    # start API on :3001
npm run dev:ui     # start UI on :3000
```

## Stack

- **Frontend:** Next.js 16, Tailwind v4, Zustand, CVA
- **Backend:** Express.js, PostgreSQL, Zod, JWT, Resend
- **Design:** Solarpunk — parchment, forest green, botanical motifs
