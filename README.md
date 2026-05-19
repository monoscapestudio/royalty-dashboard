# AuditGraph Dashboard

Interactive wireframe prototype for the AuditGraph platform. Built as a frontend-only React app with mock data, ready for backend integration.

## Quick start

```bash
npm install
npm run dev        # localhost:5173
npm run build      # production build (TypeScript + Vite)
```

## What this is

A fully clickable prototype covering the complete user flow:

- **Connects** - data source management (add, configure, reconnect, remove)
- **Rules** - audit rule library, user-defined rules, suggestion review
- **Audit** - run simulation, findings table, finding detail overlay
- **Reporting** - report builder, export, share, finalize

All data is mocked. No backend required to run.

## Simulator: first-audit journey

The prototype includes a guided onboarding flow that lets testers walk through the first-time user experience:

1. On the Audit page, select **`not-yet-run`** from the dev toggle (bottom-right)
2. Follow the two-step checklist: Connect a source → Apply rules → Run Audit

Each step starts empty and provides a clear "next" CTA after completion. See [docs/DOCTRINE.md](docs/DOCTRINE.md) for full details.

## Stack

- React 18 + TypeScript + Vite
- React Router DOM
- Zustand (global state)
- CSS Modules (co-located with components)
- Tanstack React Query (installed, ready for backend hookup)

## Documentation

See [docs/DOCTRINE.md](docs/DOCTRINE.md) for:

- Design principles and visual system
- Typography scale and font requirements
- Code conventions and file structure
- Sarah's feedback (verbatim quotes driving UX decisions)
- Backend integration guide (what is mocked, what needs replacing)
- Dev simulation toggles for testing different states

## Fonts

This project requires two licensed fonts:

- **Helvetica Now Display** (headings, body, UI)
- **JetBrains Mono** (labels, data, metadata)

Font files go in `public/fonts/`. See `src/styles/tokens.css` for the full type scale.

## Deployment

Deployed on Vercel via GitHub push to `main`. Config in `vercel.json`.
