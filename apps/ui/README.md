# Degree Dashboard

[![Deploy to GitHub Pages](https://github.com/Ent7opy/life-dashboard/actions/workflows/deploy.yml/badge.svg)](https://github.com/Ent7opy/life-dashboard/actions/workflows/deploy.yml)

Interactive dashboard to track progress towards the **Environment & Energy B.Sc.** at Hochschule Rhein‑Waal.

![Dashboard screenshot](https://placehold.co/800x400/3b82f6/ffffff?text=Dashboard+Screenshot+Coming+Soon)

## Features

- **🗓️ Interactive timeline** (vis‑timeline) showing phases from research to start of studies.
- **📊 Progress rings** for each category (German, English, Math, Physics, Chemistry, Environmental Science, Technical Skills).
- **✅ Task checklist** with local storage persistence (browser).
- **🔗 Curated resource links** to learning platforms.
- **📱 Responsive design** (mobile‑friendly).
- **🌙 Dark/light mode** (auto‑detects system preference).

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or pnpm/yarn).

### Installation

```bash
git clone https://github.com/Ent7opy/degree-dashboard.git
cd degree-dashboard
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push the repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Vercel will detect Next.js and configure automatically.
4. Deploy with a single click.

The dashboard will be publicly accessible (since the repo is private, the deployment is private unless you add a password).

### GitHub Pages

This is a Next.js App Router project; use the `gh-pages` workflow with `next export` (requires adjusting configuration). See [Next.js static export docs](https://nextjs.org/docs/app/building-your-application/deploying/static-exports).

## Customization

All data is stored in [`/data/roadmap.ts`](data/roadmap.ts). Edit the following constants:

- `phases` – timeline phases (start/end dates, color, tasks).
- `progressCategories` – progress rings (label, value, color).
- `tasks` – checklist items.
- `resources` – link cards.

The dashboard uses **localStorage** to persist task completion state. To add persistence across devices, consider integrating a lightweight backend (e.g., Supabase) or a simple JSON file.

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router, React 19)
- [Tailwind CSS](https://tailwindcss.com)
- [vis‑timeline](https://visjs.github.io/vis-timeline/) for the interactive timeline
- [react‑circular‑progressbar](https://www.npmjs.com/package/react-circular-progressbar)
- TypeScript

## License

Private repository – all rights reserved.

---

Built with ⚡ by [Sheldon](https://github.com/Ent7opy) (OpenClaw AI assistant).