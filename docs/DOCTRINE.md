# AuditGraph - Design & Engineering Doctrine

> **For: any contributor picking up this project.**
> Read this entire document before making changes. Every decision in this codebase descends from these principles.

---

## 1. Calm Dashboard - The Doctrine

### Motto

**"Show only what matters, in the moment it matters."**

### Manifesto

1. **Less, but bigger.** Bold typography, generous whitespace, clear visual hierarchy. Fewer elements, more weight per element.
2. **One thing at a time.** Every screen has one primary focus. The next action is always obvious.
3. **Just-in-time UI.** What isn't needed now stays hidden. Complexity lives behind a click, not on the first screen.
4. **Guide, don't lecture.** The page itself walks the user through. No onboarding wizards, no tutorial overlays, no "click here" popups.
5. **Speak human, not jargon.** "Connect a data source" instead of "Configure ingestion endpoint."
6. **Stimulate progress, don't choreograph process.** A checkmark when done. A clear "You're all set" when ready. Never "step 10 of 47."
7. **The hero number is huge.** Findings, revenue, results: visually dominant. Everything else is context.
8. **Desktop, deliberate.** No responsive distraction. One medium, done properly.

### North star
Linear, Notion, Stripe Dashboard, Things: calm, readable, user-guiding.

### Antithesis
Salesforce, SAP, Oracle: dense, small type, everything visible, complexity exposed.

---

## 2. Benefits (why this matters strategically)

### UX
- Lower cognitive load: users see one action, not twenty.
- Faster time-to-first-success: minutes, not hours.
- Confidence over confusion: users come back more.
- Fewer mistakes: destructive options stay tucked away.
- Accessibility by default: bigger type, more contrast, more spacing.

### Adoption
- Lower onboarding cost: the product demos itself.
- Higher word-of-mouth: calm tools get screenshotted.
- Higher activation rates: users reach value, not abandon.
- Broader user pool: COOs, founders, controllers, not just operators.
- Lower churn: calm interfaces don't burn users out.

### Differentiation
- "It feels different": the most defensible moat in software.
- Premium perception: buyers forgive rough edges.
- Brand becomes a feeling, not a logo.
- Designer & engineer magnet.
- Pricing power.

---

## 3. Risks & Guardrails

### Risks (be aware)
- **Power users:** hidden does not mean gone. Advanced options must remain findable.
- **Information density:** when there's a lot to show, one-at-a-time means more clicks. Design depth carefully.
- **"Looks simple = is simple":** demonstrate power through use cases, not screen clutter.
- **Higher design cost per screen:** fewer elements means each must be near-perfect.

### Guardrails (non-negotiable)
1. **Every new element must answer:** _"Must this be here, right now?"_ If no, remove or hide.
2. **Refer to this document** when there's debate about including something.
3. **Consistency across the whole product.** One dense page kills the doctrine.

---

## 4. Voice & Tone

- **Friendly, not cheesy.** Say *"You're all set"*, not *"Awesome! You did it!"*.
- **Direct, not bureaucratic.** *"Connect a data source"*, not *"Initiate data source provisioning workflow"*.
- **Calm, not urgent.** *"Hold tight - we're going through your records."*, not *"PROCESSING... DO NOT CLOSE"*.
- **Confident, not apologetic.** *"Something went wrong"*, not *"We're so sorry, but unfortunately..."*.
- **No emoji** unless explicitly requested by the user.

---

## 5. Visual System

### Design tokens: always use CSS variables, never hardcode

All colors, spacing, font sizes, and radii are defined in `src/styles/tokens.css`. Reference them via `var(--token-name)`.

**Hardcoded values are a code smell.** If a value isn't in tokens but you need it (e.g., a new font size for a hero number), add it to tokens first, then reference.

### Typography scale (strict 5-tier system)

```
--type-hero:          96px   Helvetica Now Display 300, -0.04em
--type-metric:        48px   Helvetica Now Display 300, -0.02em
--type-subtitle:      24px   Helvetica Now Display 700, -0.01em
--type-column-title:  18px   JetBrains Mono 500, 0.10em (uppercase)
--type-body:          16px   Helvetica Now Display 400
--type-data:          14px   JetBrains Mono 400
--type-label:         12px   JetBrains Mono 500, 0.10em (uppercase)
```

**Fonts (MUST):**
- `Helvetica Now Display` for all headings, body, UI text
- `JetBrains Mono` for labels, data, column titles, metadata

### Colors
- Backgrounds: `--bg-white`, `--bg-page`, `--bg-table-header`
- Text: `--text-primary`, `--text-secondary`, `--text-muted`
- Status: live (green), fix (red), pending (amber)
- Primary CTA: `--btn-primary-bg`

### Spacing
- Content padding: `--content-px` (32px)
- Card radius: `--radius-card` (12px)
- Button radius: `--radius-btn` (8px)
- Generous whitespace > clever packing

### Buttons
- Primary actions: large (44-52px height for hero CTAs, 32-40px for secondary)
- Disabled states: replace with explanatory text ("Complete both steps first") rather than greyed-out buttons whenever possible

---

## 6. Code Conventions

### Stack
- React 18 + TypeScript + Vite
- React Router DOM (routing)
- Zustand (state, see `src/store/app.ts`)
- CSS Modules (`*.module.css` co-located with components)
- Mock data in `src/data/`
- Types in `src/types/index.ts`

### File structure

```
src/
  pages/        route-level pages (each in its own folder)
  components/   reusable UI primitives
    ui/         generic (Modal, Banner, StatusBadge, etc.)
    layout/     app shell (TopNav, AppLayout, SubHeader)
  data/         mock data
  store/        Zustand global state
  styles/       tokens.css, globals.css
  types/        TypeScript types
```

### Rules

- **CSS Modules only.** No inline styles for anything beyond one-off positional tweaks. No global CSS outside `globals.css` and `tokens.css`.
- **Always use design tokens:** `var(--text-md)`, never `font-size: 13px`.
- **No emoji** in code, comments, or UI.
- **No code comments narrating obvious behavior** ("// Set state to true"). Only comment non-obvious intent or constraints.
- **One Zustand store** (`src/store/app.ts`) for global concerns. Local component state via `useState`.
- **No responsive** breakpoints. Desktop only. Don't waste time on media queries.

### Patterns

- **Modal/overlay state:** discriminated union (`type ModalState = { type: 'foo' } | { type: 'bar' } | null`) lifted to the page level.
- **Conditional rendering:** `{state === 'X' && (<...>)}` is preferred over hidden CSS.
- **State derived from data:** prefer computed values over duplicated state (e.g., `allStepsDone = stepA && stepB`).

---

## 7. Sarah's Feedback (verbatim) + Status

Sarah is the primary customer voice on UI/UX. Her feedback (transcribed) drives the v2.0 changes. **Always quote her literally** when justifying a decision.

### Audit page

**Quote:** *"I think it should just be in this page and it should be like a little to do list, you know? Like to run your first audit be like to run your first audit, you need one connect a data source for contract. ... two apply rules. And that's actually all you need to do is like there's two things and so it's all to do list. You can do it in any order."*

**Status:** Done. `NOT_YET_RUN` shows a 2-step checklist (Connect contract source / Apply rules) with any-order completion. Pre-Audit Readiness cards are hidden in this state to keep focus.

**Quote:** *"I hate those onboardings that like take you through this process because you're like, I don't know how long this is going to take. I don't know what the steps are."*

**Status:** Done. No wizard, no progress bar through steps, no "step 1 of 3". Just two boxes.

**Quote:** *"the to do list can kind of just then go up in the corner and be like just this really small thing. And then there's an alert on the to do list if like something breaks."*

**Status:** Done. Status widget (fixed top-right) appears after the first audit (COMPLETE/STOPPED/FAILED states). Shows source + rules status with red dot if something breaks.

**Quote:** *"The findings obviously should be really big because that's, you know, more important."*

**Status:** Done. Findings hero number is 96px in COMPLETE state. Potential recovery next to it at the same scale.

### Audit overlay (finding detail)

**Quote:** *"the audit trail needs to be... I think the audit trail and the recovery should be two different columns not in the same thing."*

**Status:** Done. `FindingDetailOverlay` is two columns: Audit Trail (left) + Recovery (right), panel widened to 900px.

**Quote:** *"we want to have like, this will probably be bigger because we want to have the actual, like a PDF of the actual contract with a part highlighted and then a PDF of the billing record with the part highlighted. And then we want a plain text description of the discrepancy."*

**Status:** Done. Two PDF mocks (contract + billing) with yellow highlighted sections. Plain-text discrepancy description below.

**Quote:** *"let's go ahead and kind of put this in just as an image for now. But it won't really work. ... we'll do the bot flow later so our customers can see it."*

**Status:** Done. Recovery email is a static visual dummy. Buttons exist but trigger only toasts (no real send).

### Rules page

**Quote:** *"It's like... It's like in a list and I think it should maybe be more like a panel with like apply the rules and then the current rules."*

**Status:** Done. Two panel cards: Apply Rules (top) + Current Rules (bottom).

**Quote:** *"these I identified rules. Like we might find like 100 of these. So we probably... that probably just needs to be in a panel with like that you click to a new page and it's something like AI identified roles, like know 100 identified, click to add or something."*

**Status:** Done. Suggestions inline replaced with summary bar ("12 identified rules - Click to review"). Clicking opens review panel with all cards (approve/dismiss).

### Connects page

**Quote:** *"we might want this in three columns, like contract, billing, recovery."*

**Status:** Done. Three-column layout (Contract / Billing / Recovery) using CSS grid.

### Account section

**Quote:** *"here, like all the messages you can, you know, an account. An account you can control. So you have everything. Profile settings, you can. It will be much more beautiful. Of course. This is just."* / *"Oh, team members. Of course. Thanks for adding that. I love this. Okay. This is so awesome."*

**Status:** Done. Account section with sub-pages: Profile, Notifications, Team, Roles, Support. Accessed via account menu in top-right of TopNav.

---

## 8. Current Status (all pages)

All pages have been implemented with the Calm Dashboard aesthetic.

### Audit
- NOT_YET_RUN: 2-step checklist (Connect + Rules), any order, with guided onboarding simulator
- RUNNING: hero progress, live findings count, friendly copy
- COMPLETE: hero findings (96px), computed potential recovery, Coverage/Confidence secondary
- FAILED: "Fix connection" navigates to Connects, "Re-run Audit" restarts
- STOPPED: Resume / Start new actions
- Finding detail overlay: two-column (Audit Trail + Recovery), PDF mocks
- First-audit flow: steps marked via user action only, success banners guide forward

### Rules
- Apply Rules + Current Rules panels with 140px header spacing
- Suggestions summary + full-page review panel
- Custom FilterSelect dropdown (not native OS)
- Prominent group headers (Library / User-Defined / Approved)
- Edit, Duplicate, Toggle, Delete modals with implications flow
- Mixed active/inactive library rules

### Connects
- Three-column layout (Contract / Billing / Recovery)
- All modals: Add API, Add OAuth, Add Folder, Configure, Remove, Request Integration
- Reconnect modal for sources with `fix` status (simulated auth re-auth)
- Error banner auto-shows/hides based on failed source count

### Reporting
- Empty state (pre-audit), Draft state, Finalized state
- Permanent document header with hero summary synced to audit data ($12.45M, 1,390 findings, 96%)
- Template switching with confirmation, block management (add/remove)
- Report history sidebar, page format, status badges
- Share Link modal (custom FormSelect, copy link, password protection)
- Revert to Draft modal
- Export PDF / Export CSV (simulated)
- Finalize flow

### Account
- Profile, Notifications, Team, Roles, Support sub-pages
- All use FormSelect with proper label prop

### Shared UI
- Custom dropdowns (FormSelect) everywhere, no native OS selects in user-facing UI
- Modal system (Modal + ConfirmDialog)
- Notifications panel with category filtering
- InlineBanner with dismissable state
- StatusBadge (live/fix/pending/inactive)

---

## 9. Workflow Conventions

### When implementing a change

1. **Read this document.** Especially section 1 (manifesto) and section 4 (voice).
2. **Read the relevant page** in `src/pages/` and any referenced components.
3. **Read the Sarah quote** for that page (section 7) if applicable.
4. **Propose a plan** before writing code: what changes, in which files, with what intent. Wait for "ok".
5. **Implement** using design tokens, no hardcoded values.
6. **Lint check** edited files before declaring done.
7. **Summarize** what changed and how the user uses it now.

### When unsure

- If a Sarah quote contradicts the doctrine, **Sarah wins**.
- If a doctrine principle contradicts a generic dashboard convention, **doctrine wins**.
- If something feels dense, cluttered, or "process-y," it probably is. Remove it.
- If a label or button text feels enterprise-jargon, rewrite it in human voice.

---

## 10. Don't Break the Doctrine

If you find yourself doing any of the following, **stop and reconsider**:

- Adding a third primary CTA to a screen that already has two
- Designing a wizard/multi-step flow with a progress bar through steps
- Using a font size below 12px for content (only labels can go smaller)
- Hardcoding colors or sizes instead of using tokens
- Writing copy that sounds like a developer wrote it ("Initialize", "Configure", "Execute")
- Adding a screen full of stats just because the data exists
- Putting destructive actions (delete, remove) at the same visual weight as safe actions
- Adding emoji "to make it friendly"
- Building responsive breakpoints

---

## 11. Developer Handoff - Backend Integration Guide

### Running the project

```bash
npm install
npm run dev        # Vite dev server at localhost:5173
npm run build      # TypeScript check + Vite production build
```

### What is mocked (needs backend replacement)

| Area | Mock location | What it provides | Backend endpoint needed |
|------|--------------|-----------------|----------------------|
| Data sources | `src/data/mock.ts` | Source list, status, lastSync | GET /sources, PATCH /sources/:id |
| Rules | `src/data/mockRules.ts` | Library, User, rules + suggestions | GET /rules, POST /rules, PATCH /rules/:id |
| Audit results | `src/data/mockAudit.ts` | 1,390 findings with contracts, values, confidence | GET /audits/:id/findings |
| Audit state | Zustand `auditStateBySilo` | NOT_YET_RUN/RUNNING/COMPLETE/FAILED/STOPPED | WebSocket or polling for run status |
| Notifications | Zustand `INITIAL_NOTIFICATIONS` | Notification feed | WebSocket push or GET /notifications |
| Report data | Hardcoded in `ReportingPage.tsx` | Document header metrics, block content | GET /reports/:id |

### Simulated behaviors (will need real implementation)

1. **Audit run** - Currently `setInterval` with fake progress. Replace with WebSocket connection to audit engine.
2. **Reconnect source** - Currently `setTimeout` that flips status to `live`. Replace with OAuth re-auth flow.
3. **Export PDF/CSV** - Currently `setTimeout` with toast. Replace with backend generation + download.
4. **Share link** - Currently static URL. Replace with API-generated signed link.
5. **Suggestions** - Currently static array. Replace with ML pipeline output.

### State management approach

- **Global state** (`src/store/app.ts`): Zustand store. Holds active silo, notifications, audit state, per-silo readiness flags (`auditReadinessBySilo`).
- **Page-local state**: `useState` within each page component. Modals, form fields, UI toggles.
- **Derived state**: Computed inline (e.g., `failedSources = sources.filter(s => s.status === 'fix')`).

When adding backend, the recommended approach is:
1. Keep Zustand for UI state (panels open, active selections)
2. Add React Query (`@tanstack/react-query` already installed) for server data fetching
3. Replace mock imports with `useQuery` hooks

### Design tokens contract

All visual decisions are in `src/styles/tokens.css`. Backend developers should not need to change these. If a new status or color is needed, add a token, never hardcode.

### Dev simulation toggles

Each page has a `SIMULATE STATE` dropdown (bottom-right, dev only) to force different states:
- Audit: `?audit-state=NOT_YET_RUN|RUNNING|COMPLETE|FAILED|STOPPED`
- Reporting: `?reporting-state=reporting-empty|reporting-draft|reporting-finalized`

These should be removed before production deploy.

### First-audit onboarding simulator

The wireframe includes a full guided journey for first-time users. To test it:

1. Go to **Audit** and select `not-yet-run` from the SIMULATE STATE toggle.
2. Both checklist steps reset to incomplete.
3. Click **"Go to Connects"** → opens Connects in empty first-audit mode (`?first-audit=1`).
4. Add a contract source through the normal flow (click "+ Add contract source").
5. A green success banner appears: **"Step 1 complete"** with a CTA **"Next: Apply Rules →"**.
6. Click the CTA → opens Rules in empty first-audit mode (`?first-audit=1`).
7. Load industry library or add a custom rule.
8. A green success banner appears: **"Step 2 complete"** with a CTA **"Run your first audit →"**.
9. Click the CTA → returns to Audit with both steps done and "Run Audit" enabled.
10. Click "Run Audit" → simulation starts (progress bar, findings appearing in real time).

**Key design decisions for the onboarding:**

- `?first-audit=1` param creates a clean-slate context (empty data) on Connects and Rules pages.
- Readiness state is per-silo and stored in Zustand (`auditReadinessBySilo`).
- Steps are marked complete only through explicit user actions (adding a source / loading rules), never on page load.
- Success banners use the "next" pattern, not "back" — they always guide forward.
- The flow works as a linear wizard without actually being a wizard (no step indicators, no locked gates). Users can still navigate freely via the top nav.
- Selecting `not-yet-run` from the Audit dev toggle resets readiness for the active silo.

### Data consistency (single source of truth)

All numerical stats across pages derive from the same mock data source:

| Metric | Source | Used by |
|--------|--------|---------|
| Recovery value | Computed from `ALL_FINDINGS` in `mockAudit.ts` | Audit banner, FindingsSummary, Reporting doc header |
| Findings count | `MOCK_AUDIT_RESULT.findingsCount` | Audit toast, banner, Reporting |
| Records processed | `MOCK_AUDIT_RESULT.recordsProcessed` | Audit readiness, FindingsSummary, Reporting coverage |
| Coverage | `MOCK_AUDIT_RESULT.coverage` | Same as above |
| Active rules count | Computed from `mockRulesPopulated` | Audit readiness cards, SubHeader, status widget |
| Live sources count | Computed from `mockSources` | Audit readiness cards, SubHeader, status widget |

Never hardcode these values in page components. Always import and compute from mock data files.

---

**End of doctrine. Build calm.**
