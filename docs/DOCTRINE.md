# AuditGraph — Design & Engineering Doctrine

> **For: any contributor — human or AI — picking up this project.**
> Read this entire document before making changes. Every decision in this codebase descends from these principles.

---

## 1. Calm Dashboard — The Doctrine

### Motto

**"Show only what matters, in the moment it matters."**

### Manifesto

1. **Less, but bigger.** Bold typography, generous whitespace, clear visual hierarchy. Fewer elements, more weight per element.
2. **One thing at a time.** Every screen has one primary focus. The next action is always obvious.
3. **Just-in-time UI.** What isn't needed now stays hidden. Complexity lives behind a click, not on the first screen.
4. **Guide, don't lecture.** The page itself walks the user through. No onboarding wizards, no tutorial overlays, no "click here" popups.
5. **Speak human, not jargon.** "Connect a data source" instead of "Configure ingestion endpoint."
6. **Stimulate progress, don't choreograph process.** A checkmark when done. A clear "You're all set" when ready. Never "step 10 of 47."
7. **The hero number is huge.** Findings, revenue, results — visually dominant. Everything else is context.
8. **Desktop, deliberate.** No responsive distraction. One medium, done properly.

### North star
Linear, Notion, Stripe Dashboard, Things — calm, readable, user-guiding.

### Antithesis
Salesforce, SAP, Oracle — dense, small type, everything visible, complexity exposed.

---

## 2. Benefits (why this matters strategically)

### UX
- Lower cognitive load — users see one action, not twenty.
- Faster time-to-first-success — minutes, not hours.
- Confidence over confusion — users come back more.
- Fewer mistakes — destructive options stay tucked away.
- Accessibility by default — bigger type, more contrast, more spacing.

### Adoption
- Lower onboarding cost — the product demos itself.
- Higher word-of-mouth — calm tools get screenshotted.
- Higher activation rates — users reach value, not abandon.
- Broader user pool — COOs, founders, controllers, not just operators.
- Lower churn — calm interfaces don't burn users out.

### Differentiation
- "It feels different" — the most defensible moat in software.
- Premium perception — buyers forgive rough edges.
- Brand becomes a feeling, not a logo.
- Designer & engineer magnet.
- Pricing power.

---

## 3. Risks & Guardrails

### Risks (be aware)
- **Power users:** hidden ≠ gone. Advanced options must remain findable.
- **Information density:** when there's a lot to show, one-at-a-time means more clicks. Design depth carefully.
- **"Looks simple = is simple":** demonstrate power through use cases, not screen clutter.
- **Higher design cost per screen:** fewer elements means each must be near-perfect.

### Guardrails (non-negotiable)
1. **Every new element must answer:** _"Must this be here, right now?"_ — if no, remove or hide.
2. **Refer to this document** when there's debate about including something.
3. **Consistency across the whole product** — one dense page kills the doctrine.

---

## 4. Voice & Tone

- **Friendly, not cheesy.** Say *"You're all set"* — not *"Awesome! You did it!"*.
- **Direct, not bureaucratic.** *"Connect a data source"* — not *"Initiate data source provisioning workflow"*.
- **Calm, not urgent.** *"Hold tight — we're going through your records."* — not *"PROCESSING... DO NOT CLOSE"*.
- **Confident, not apologetic.** *"Something went wrong"* — not *"We're so sorry, but unfortunately..."*.
- **No emoji** unless explicitly requested by the user.

---

## 5. Visual System

### Design tokens — always use CSS variables, never hardcode

All colors, spacing, font sizes, and radii are defined in `src/styles/tokens.css`. Reference them via `var(--token-name)`.

**Hardcoded values are a code smell.** If a value isn't in tokens but you need it (e.g., a new font size for a hero number), add it to tokens first, then reference.

### Typography scale (current)

```
--text-xs:   10px  — micro labels
--text-sm:   11px  — secondary labels
--text-base: 12px  — body small
--text-md:   13px  — body
--text-lg:   14px  — body large
--text-xl:   15px  — emphasis
--text-2xl:  28px  — page titles
```

**Calm Dashboard adds (use sparingly, for hero moments):**
- Section title: ~22–28px (already `--text-2xl`)
- Hero number: 64–80px (revenue/findings)
- Hero label: 28–32px

### Colors
- Backgrounds: `--bg-white`, `--bg-page`, `--bg-table-header`
- Text: `--text-primary`, `--text-secondary`, `--text-muted`
- Status: live (green), fix (red), pending (amber)
- Primary CTA: `--btn-primary-bg` (blue)

### Spacing
- Content padding: `--content-px` (32px)
- Card radius: `--radius-card` (12px)
- Button radius: `--radius-btn` (8px)
- Generous whitespace > clever packing

### Buttons
- Primary actions: large (44–52px height for hero CTAs, 32–40px for secondary)
- Disabled states: replace with explanatory text ("Complete both steps first") rather than greyed-out buttons whenever possible

---

## 6. Code Conventions

### Stack
- React 18 + TypeScript + Vite
- React Router DOM (routing)
- Zustand (state — see `src/store/app.ts`)
- CSS Modules (`*.module.css` co-located with components)
- Mock data in `src/data/`
- Types in `src/types/index.ts`

### File structure

```
src/
  pages/        — route-level pages (each in its own folder)
  components/   — reusable UI primitives
    ui/         — generic (Modal, Banner, StatusBadge, etc.)
    layout/     — app shell (TopNav, AppLayout, SubHeader)
  data/         — mock data
  store/        — Zustand global state
  styles/       — tokens.css, globals.css
  types/        — TypeScript types
```

### Rules

- **CSS Modules only.** No inline styles for anything beyond one-off positional tweaks. No global CSS outside `globals.css` and `tokens.css`.
- **Always use design tokens** — `var(--text-md)`, never `font-size: 13px`.
- **No emoji** in code, comments, or UI.
- **No code comments narrating obvious behavior** ("// Set state to true"). Only comment _non-obvious intent_ or _constraints_.
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

**Status:** ✅ Implemented. `NOT_YET_RUN` shows a 2-step checklist (Connect contract source / Apply rules) with any-order completion. Pre-Audit Readiness cards are hidden in this state to keep focus.

**Quote:** *"I hate those onboardings that like take you through this process because you're like, I don't know how long this is going to take. I don't know what the steps are."*

**Status:** ✅ No wizard, no progress bar through steps, no "step 1 of 3". Just two boxes.

**Quote:** *"the to do list can kind of just then go up in the corner and be like just this really small thing. And then there's an alert on the to do list if like something breaks."*

**Status:** ✅ Status widget (fixed top-right) appears after the first audit (COMPLETE/STOPPED/FAILED states). Shows source + rules status with red dot if something breaks. See `.statusWidget` in `AuditPage.module.css`.

**Quote:** *"The findings obviously should be really big because that's, you know, more important."*

**Status:** ⚠️ Partial — current findings summary is 32px. Needs to grow to ~64–80px hero treatment in COMPLETE state.

### Audit overlay (finding detail)

**Quote:** *"the audit trail needs to be... I think the audit trail and the recovery should be two different columns not in the same thing."*

**Status:** ✅ `FindingDetailOverlay` is two columns: Audit Trail (left) + Recovery (right), panel widened to 900px.

**Quote:** *"we want to have like, this will probably be bigger because we want to have the actual, like a PDF of the actual contract with a part highlighted and then a PDF of the billing record with the part highlighted. And then we want a plain text description of the discrepancy."*

**Status:** ✅ Two PDF mocks (contract + billing) with yellow highlighted sections. Plain-text discrepancy description below.

**Quote:** *"let's go ahead and kind of put this in just as an image for now. But it won't really work. ... we'll do the bot flow later so our customers can see it."*

**Status:** ✅ Recovery email is a static visual dummy. Buttons exist but trigger only toasts (no real send).

### Rules page

**Quote:** *"It's like... It's like in a list and I think it should maybe be more like a panel with like apply the rules and then the current rules."*

**Status:** ✅ Two panel cards: Apply Rules (top) + Current Rules (bottom).

**Quote:** *"these I identified rules. Like we might find like 100 of these. So we probably... that probably just needs to be in a panel with like that you click to a new page and it's something like AI identified roles, like know 100 identified, click to add or something."*

**Status:** ✅ AI suggestions inline replaced with summary bar ("12 AI-identified rules — Click to review"). Clicking opens `AiSuggestionsPanel` slide-over with all cards (approve/dismiss).

### Connects page

**Quote:** *"we might want this in three columns, like contract, billing, recovery."*

**Status:** ✅ Three-column layout (Contract / Billing / Recovery) using CSS grid in `ConnectsPage.module.css` (`.threeCol`).

### Account section

**Quote:** *"here, like all the messages you can, you know, an account. An account you can control. So you have everything. Profile settings, you can. It will be much more beautiful. Of course. This is just."* / *"Oh, team members. Of course. Thanks for adding that. I love this. Okay. This is so awesome."*

**Status:** ✅ Account section with sub-pages: Profile, Notifications, Team, Roles, Support. Accessed via account menu in top-right of TopNav.

---

## 8. Remaining Work (page-by-page)

Status as of last commit on `main`.

### Audit — NOT_YET_RUN
- ✅ 2-step checklist, any order, with done/pending visual states
- ✅ Hero CTA "Run Audit" only when all steps done
- ✅ "You can do them in any order" hint
- ✅ Pre-Audit Readiness cards hidden in this state

### Audit — RUNNING
- ⏳ Hero progress: large percentage number (~42–48px), thick progress bar (~12–16px)
- ⏳ Friendly text: *"Hold tight — we're going through your records."*
- ⏳ Bigger, less-aggressive Stop button (current is tiny red 28px)
- ⏳ Live findings count visible (proof the audit is working)

### Audit — COMPLETE
- ⏳ Hero findings number: 64–80px (currently 32px) — this is Sarah's explicit ask
- ⏳ Banner "Audit Complete" demoted below hero number, not above
- ⏳ Secondary stats (Coverage, Confidence) smaller and below

### Audit — FAILED / STOPPED
- ⏳ Larger, clearer message
- ⏳ Bigger action buttons (Fix connection / Resume / Start new)
- ⏳ Hide "View error log" under a secondary "Details" click — not first-class

### Audit overlay
- ✅ Two columns
- ✅ PDF mocks with highlights
- ✅ Recovery as dummy
- ⏳ Optional pass: revisit type sizes for calm aesthetic

### Rules
- ✅ Apply Rules + Current Rules panels
- ✅ AI suggestions summary + slide-over panel
- ⏳ Optional pass: bigger section headers, more breathing room

### Connects
- ✅ Three columns
- ⏳ Optional pass: bigger column headers, cleaner source cards

### Reporting
- ⏳ Apply Calm Dashboard — hero metrics, less density
- ⏳ Live state with PDF preview (Sarah liked this)

### Account pages
- ⏳ Visual polish pass to match Calm Dashboard tone (currently functional but generic)

---

## 9. Workflow Conventions

### When implementing a change

1. **Read this document.** Especially section 1 (manifesto) and section 4 (voice).
2. **Read the relevant page** in `src/pages/` and any referenced components.
3. **Read the Sarah quote** for that page (section 7) if applicable.
4. **Propose a plan** to the user before writing code: what changes, in which files, with what intent. Wait for "ok".
5. **Implement** using design tokens, no hardcoded values.
6. **Lint check** (`ReadLints` on edited files) before declaring done.
7. **Summarize** what changed and how the user uses it now.

### When unsure

- If a Sarah quote contradicts the doctrine, **Sarah wins**.
- If a doctrine principle contradicts a generic dashboard convention, **doctrine wins**.
- If something feels dense, cluttered, or "process-y," **it probably is**. Remove it.
- If a label or button text feels enterprise-jargon, rewrite it in human voice.

### Model recommendations (for AI continuation)

- **Aesthetic/polish work** (this stage): Claude Sonnet — strong design sensibility.
- **Architectural decisions, large refactors**: Claude Opus.
- **Pure execution from clear specs** ("bump font in X files"): Composer-2.5-fast.
- **General implementation**: any of the above; Sonnet is the safest default.

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

**End of doctrine. Build calm.**
