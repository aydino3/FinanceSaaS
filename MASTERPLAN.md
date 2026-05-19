# MASTERPLAN.md — Engineering Execution Roadmap

> The phase-by-phase execution plan for delivering this platform from design system
> foundation to production deployment. Every phase has clear entry criteria, deliverables,
> exit criteria, risk assessments, and performance contracts.
>
> Cross-reference: `CLAUDE.md` (engineering conventions), `DESIGN_SYSTEM.md` (tokens),
> `COMPONENT_INVENTORY.md` (component specs), `AI_DATA_ARCHITECTURE.md` (data schemas),
> `INFORMATION_ARCHITECTURE.md` (routing), `FEATURE_ARCHITECTURE.md` (module specs).

---

## Execution Philosophy

### How This Roadmap Is Used

This is not a Gantt chart or a product requirements document. It is an **engineering
sequence** — each phase produces working, tested, production-quality artifacts that the
next phase builds upon. No phase begins until the previous phase's exit criteria are met.

**The non-negotiable constraint:** Core Web Vitals targets (defined below) must be met
at the end of every phase. Performance is not a Phase 5 concern — it is a Phase 1
discipline. Shipping fast, beautiful code that scores 45 on Lighthouse is a failure.

### Quality Gates (applied to every phase)

```
TypeScript:    Zero type errors. `strict: true` in tsconfig — no exceptions.
               No `as any` casts. No `@ts-ignore`. Type problems are design problems.

Accessibility: Every interactive element is keyboard-navigable.
               Every image has meaningful alt text or aria-hidden="true".
               WCAG AA contrast ratio compliance on all text.
               Tested with keyboard-only navigation before phase exit.

Performance:   Core Web Vitals targets met (defined in Performance Contract below).
               No new layout shifts introduced by phase work.
               Bundle size delta reviewed on every phase merge.

Motion:        prefers-reduced-motion respected by every animation.
               No animation longer than 500ms (except documented exceptions in DESIGN_SYSTEM.md).

Code review:   No component ships without a second read against COMPONENT_INVENTORY.md spec.
               No page ships without a layout check against INFORMATION_ARCHITECTURE.md.
```

---

## Performance Contract

These targets are binding. They are measured using Lighthouse CI on every phase merge
against a production-equivalent build. Regressions block the merge.

```
Metric                          Target          Critical threshold (blocks deploy)
──────────────────────────────────────────────────────────────────────────────────
Largest Contentful Paint (LCP)  ≤ 1.8s          > 2.5s
First Input Delay (FID)         ≤ 100ms         > 300ms
Cumulative Layout Shift (CLS)   ≤ 0.05          > 0.1
Interaction to Next Paint (INP) ≤ 150ms         > 500ms
Time to First Byte (TTFB)       ≤ 600ms         > 1800ms
Total Blocking Time (TBT)       ≤ 200ms         > 600ms
Lighthouse Performance Score    ≥ 90            < 75
Lighthouse Accessibility Score  ≥ 95            < 90

JavaScript bundle (initial load):
  First-load JS shared chunk:   ≤ 80kb gzipped
  Largest page-specific chunk:  ≤ 120kb gzipped
  Total transferred (dashboard home): ≤ 350kb

Image optimization:
  All images: Next.js Image component, WebP/AVIF format
  No unoptimized raster images in any component
```

---

## Phase 0 — Pre-Phase: Foundation Verification

**Duration:** 1–2 days  
**Status:** Complete (documentation phase done)

### Entry State
All documentation in `/docs` is authored and reviewed:
- `CLAUDE.md` ✓
- `PRODUCT_STRATEGY.md` ✓
- `FEATURE_ARCHITECTURE.md` ✓
- `INFORMATION_ARCHITECTURE.md` ✓
- `DESIGN_SYSTEM.md` ✓
- `AI_DATA_ARCHITECTURE.md` ✓
- `COMPONENT_INVENTORY.md` ✓

### Deliverables
- [x] Next.js 14 App Router scaffold initialized
- [x] TypeScript strict mode configured
- [x] Tailwind CSS installed
- [x] Framer Motion, Zustand, React Query, Recharts installed
- [ ] Tailwind design token configuration (`tailwind.config.ts` with full token set from DESIGN_SYSTEM.md)
- [ ] Global CSS variables mapped (`globals.css` with CSS custom properties for all color tokens)
- [ ] Inter font loaded (variable font, Turkish subset, `font-display: swap`)
- [ ] JetBrains Mono loaded (variable font, subset)
- [ ] `next.config.ts` configured (image domains, bundle analyzer, security headers)
- [ ] ESLint rules enforcing no `any`, import order, no unused variables
- [ ] Husky pre-commit hooks: type check + lint (fast, under 10 seconds)
- [ ] Lighthouse CI configured in CI pipeline (baseline measurement recorded)

### Exit Criteria
- `npm run build` produces zero type errors and zero lint warnings
- Lighthouse CI runs and records baseline scores
- All design tokens from DESIGN_SYSTEM.md are available as Tailwind classes
- Font loading verified in browser (Turkish characters render correctly: ğ ü ş ı ö ç)

---

---

## Phase 1 — Design System Realization, Landing Page & Navigation Shell

**Duration:** 8–12 days  
**Depends on:** Phase 0 complete

### Objective

Build the visual and structural foundation the entire application rests on. Everything
in Phase 1 is infrastructure — it will be used on every page, in every component, forever.
The standard for this phase is therefore higher than any other: Phase 1 decisions are the
hardest to undo.

By the end of Phase 1, a new engineer joining the project must be able to understand the
design system, use its tokens correctly, and build a new page that looks native to the
product without asking questions. The documentation and the code must be that coherent.

---

### 1A — Tailwind Design Token Configuration

**What ships:**

A fully configured `tailwind.config.ts` that exposes every token from `DESIGN_SYSTEM.md`
as a first-class Tailwind utility. No raw hex values appear in component files — only
token names.

```
Token groups to configure:
  colors:        All bg-*, text-*, border-*, positive-*, negative-*, warning-*, accent-* values
  fontFamily:    "sans" (Inter), "display" (Cal Sans/Instrument Serif), "mono" (JetBrains Mono)
  fontSize:      All 14 levels of the type scale with [size, { lineHeight, letterSpacing }] format
  fontWeight:    Named weights: light (300), regular (400), medium (500)
  spacing:       All space-* tokens (space-1 through space-24)
  borderRadius:  All radius-* tokens
  boxShadow:     elevation-1 through elevation-4 shadow values
  backdropBlur:  blur-sm (4px), blur-md (12px), blur-lg (16px), blur-xl (24px)
  animation:     shimmer (skeleton), ambient-glow (background pulse)
  transitionTimingFunction: All 6 named easing curves from DESIGN_SYSTEM.md
  transitionDuration: All 7 named duration values

CSS custom properties (globals.css):
  --color-bg-canvas, --color-accent-400, etc.
  Dark mode: :root { ... } (dark is default)
  Light mode: .light { ... } (class-based theme toggle)
  Framer Motion easing arrays exported as JS constants (for use in motion props)
```

**Validation:** A `src/styles/token-test.tsx` page (dev-only) renders every token as a
visual swatch with its name. Reviewed visually against DESIGN_SYSTEM.md color specs.
Deleted before Phase 2.

---

### 1B — Primitive UI Components

These are the smallest atoms — not the complex components in COMPONENT_INVENTORY.md,
but the building blocks those components use. Every component in later phases is built
from these primitives.

**Components to build:**

```
src/components/ui/

  Button
    Variants:    primary, ghost, destructive, icon-only
    Sizes:       large (48px), default (40px), small (32px), compact (28px)
    States:      default, hover, active, disabled, loading (spinner replaces label)
    Loading:     Spinner appears, label fades out; width is preserved (no layout shift)

  Badge / Chip
    Variants:    neutral, positive, negative, warning, accent, outline
    Sizes:       default (label-sm), compact (caption)
    Interactive: optional — adds hover and click handling

  Input
    Variants:    default, search (with leading icon), textarea
    States:      default, focused (accent border), error (negative border + message), disabled
    Prefix/suffix slots: for currency symbols, icons, units

  Separator
    Variants:    horizontal, vertical
    Styles:      solid (default), dashed
    Always uses: border-subtle token

  Skeleton
    Props:       width, height, radius, animate (shimmer toggle)
    All skeletons use: the CSS-only shimmer defined in COMPONENT_INVENTORY.md

  Tooltip
    Trigger:     hover (desktop), long-press (mobile)
    Position:    top, bottom, left, right, auto (collision-aware)
    Content:     text only (no rich content in tooltips)
    Animation:   instant appear/disappear (150ms fade — no movement)

  Avatar
    Sizes:       sm (24px), md (32px), lg (40px)
    Fallback:    initials from name when no image (consistent color per user)

  ScrollArea
    Custom styled scrollbar (thin, muted, fades on idle)
    Used wherever content may overflow — never raw overflow-y: auto

  Kbd
    For keyboard shortcut display (⌘K, ↵, Esc)
    bg-surface-raised, mono font, border-subtle, radius-sm
```

---

### 1C — CinematicCard Component

Full implementation per `COMPONENT_INVENTORY.md` specification.

**Implementation sequence:**
1. Static rendering (all variants, all elevations) — visual pass against DESIGN_SYSTEM.md
2. Ambient lighting effect (mouse tracking, radial gradient overlay)
3. Hover interactions (border, background transitions)
4. Selected state (border reveal animation)
5. Accessibility pass (roles, focus, reduced-motion)
6. Responsive adaptation (`@media (hover: hover)` detection)
7. Storybook story (or equivalent visual test) covering all states

**Performance check:** The mouse-tracking radial gradient must use CSS custom properties
updated via JavaScript (`element.style.setProperty`) — not React state updates. Re-rendering
the component on every mouse move is a performance anti-pattern that will cause janky
animations. The gradient overlay is a purely DOM-level operation.

---

### 1D — NavigationShell Component

Full implementation per `COMPONENT_INVENTORY.md` specification.

**Implementation sequence:**
1. Desktop spine — collapsed state (icon-only, 56px)
2. Desktop spine — expanded state (240px, labels)
3. Expand/collapse animation (hover delay, width transition, label stagger)
4. Active indicator (sliding element, layout animation)
5. Context bar (metrics display, MetricCounter integration placeholder)
6. Mobile top bar (page title, back button logic)
7. Mobile tab bar (5 tabs, active indicator)
8. Mobile bottom sheet ("More" destinations, spring animation)
9. ⌘K trigger wiring (calls onCommandPaletteOpen — CommandPalette built in Phase 1E)
10. Accessibility pass (landmarks, skip link, ARIA, focus management)
11. localStorage persistence for spine expand state

**Critical detail:** The context bar's real return and CPI metrics are loaded via a
Server Component that fetches from the portfolio API. The NavigationShell itself is
a Client Component (it has interactivity), but the metrics it displays are fetched
server-side and passed as props. This keeps the initial render fast and avoids
client-side data fetching in the navigation chrome.

---

### 1E — CommandPalette Component

Full implementation per `COMPONENT_INVENTORY.md` specification.

**Implementation sequence:**
1. Global keyboard shortcut listener (⌘K / Ctrl+K), mounted in root layout
2. Static palette UI (input, category sections, result items)
3. Mount/unmount animations (backdrop blur, scale + opacity)
4. Keyboard navigation (↑↓, Enter, Escape, Tab between categories)
5. Sliding selection highlight (layout animation)
6. Search integration (debounced query → API route /api/search)
7. Result categories: pages (static), actions (static), funds (API), positions (props)
8. Result mount animation (stagger on query change)
9. Mobile adaptation (bottom sheet)
10. Accessibility (combobox role, focus trap, live region)

**Search API for Phase 1:** `/api/search` returns only static page routes and quick
actions. Fund and journal search are wired in Phase 2 and Phase 3 respectively when
those data sources exist.

---

### 1F — Landing Page — `/`

The marketing homepage. This page must be cinematic — it is the product's first impression.

**Section breakdown:**

```
Hero Section (100vh):
  Ambient background: radial gradient glow from top-center
  Headline: display-2xl, weight 300, letter-spacing -0.04em
  Animation: word-group reveal (clip-path upward, stagger per group)
  Sub-headline: body-xl, text-secondary
  CTA buttons: primary + ghost
  Scroll indicator: subtle animated chevron, CSS-only

Problem Section (~80vh):
  Split layout: text left, chart visual right
  Chart visual: a static (non-interactive) SVG of the CPI vs. nominal return gap
  This is NOT a Recharts component — it is a crafted SVG illustration
  Animated on scroll-enter: paths draw in when section enters viewport

Feature Strip × 3 (~60vh each):
  Alternating left/right layout
  Feature visual: browser mockup or abstract representation (no stock photos)
  Scroll-triggered: translateX + opacity reveal

Trust Section (~50vh):
  Three ambient large-type statistics: "847 funds tracked" / "5 years of CPI data" / etc.
  No card borders — the numbers float in space

CTA Section (~50vh):
  Minimal: one headline + one button
  Background: slightly different gradient than hero (avoids same-page repetition)

Footer (80px):
  Links, copyright, theme toggle
  No complex layout — a single horizontal flex row
```

**Performance mandate for landing page:**
- Zero client-side JavaScript for above-the-fold content (pure Server Component + CSS)
- Hero section renders with no hydration requirement
- Scroll animations use IntersectionObserver (not scroll event listeners)
- The animated SVG in the Problem section is CSS-animated (no JS)
- LCP element (the hero headline) must render within 1.8s on a 4G connection

---

### 1G — Auth Pages — `/login`, `/signup`, `/forgot-password`

Clean, focused credential pages. No feature complexity.

```
Visual: Full-screen ambient background (CSS-only animated gradient, ~30s cycle)
        Glass card (Elevation 4, glass-strong treatment) centered X+Y
        Card mounts: scale 0.96→1 + opacity 0→1, 350ms, ease-out-expo
        Form fields stagger in at 50ms after card mounts

Forms:  Email + password (login), email + password + name (signup)
        Client-side validation: inline error messages, no toast
        Server action for form submission (Next.js Server Actions)
        Loading state: button shows spinner, fields disabled
        Success: redirect with router.push (no flash)
```

---

### 1H — Onboarding Flow — `/onboarding/*`

Five-step wizard. Each step is a full-screen canvas with consistent shell.

```
Step 1 — Welcome:     Animated greeting, brand moment, "Let's set up your profile"
Step 2 — Profile:     Name, investment goal, investment horizon
Step 3 — Risk:        Risk tolerance slider (1–5, with plain-language descriptions)
Step 4 — First Position: Fund code search + units + date entry (validates against TEFAS)
Step 5 — Ready:       Summary of what was configured, "Enter your portfolio →" CTA

Progress: Step indicator at top, animated between steps (dots expand)
Navigation: Back/Continue at bottom, Back is ghost button

Step transitions: directional fade-slide (forward = exit left, enter from right)
                  Duration: 200ms exit, 300ms enter, 100ms gap
```

---

### Phase 1 Risk Assessment

```
Risk 1: Tailwind token configuration drift
  Likelihood: Medium
  Impact:     High — components built before drift is caught will use wrong values
  Mitigation: The token-test page (1A) is reviewed before 1B begins.
              ESLint rule: disallow raw hex values in className strings (custom rule).
              Design review checkpoint at end of 1A.

Risk 2: CinematicCard ambient light performance
  Likelihood: Medium
  Impact:     Medium — causes visible jank on mid-range devices
  Mitigation: CSS custom property approach (not React state).
              Throttle mousemove handler with requestAnimationFrame.
              Performance profiling on a mid-range Android device before phase exit.
              Fallback: ambient light disabled if frame rate drops below 45fps
              (detected via PerformanceObserver).

Risk 3: NavigationShell hydration mismatch
  Likelihood: Low-Medium
  Impact:     High — causes CLS and a jarring visual flash on load
  Mitigation: Spine expand state read from localStorage in useEffect (not on render).
              Initial render always uses collapsed state (consistent between server and client).
              Test: disable JavaScript, verify shell renders without layout shift.

Risk 4: Font loading causing CLS
  Likelihood: Low (with correct implementation), High (without it)
  Impact:     High — text reflow on font swap destroys CLS score
  Mitigation: `font-display: optional` for display face (only loads if cached).
              `font-display: swap` for Inter with `size-adjust` to match fallback metrics.
              Preload Inter woff2 file in <head> (critical resource, not deferred).
              Test: Chrome DevTools font loading simulation before phase exit.

Risk 5: Landing page animation performance on low-end devices
  Likelihood: Medium
  Impact:     Medium — poor first impression on the product's primary acquisition surface
  Mitigation: Scroll animations use IntersectionObserver (not scroll listeners).
              Hero word reveal is CSS-only (clip-path, no JS).
              Lighthouse mobile simulation must score ≥ 90 before phase exit.
```

### Phase 1 Exit Criteria

```
✓ All primitive UI components built and visually reviewed against DESIGN_SYSTEM.md
✓ CinematicCard: all variants, all states, ambient lighting working
✓ NavigationShell: desktop and mobile, all states, accessible
✓ CommandPalette: open/close, keyboard nav, static results, accessible
✓ Landing page: all sections, animations, responsive (320px to 1920px)
✓ Auth pages: login, signup, forgot-password
✓ Onboarding: all 5 steps, transitions, back/forward navigation
✓ Lighthouse CI: Performance ≥ 90, Accessibility ≥ 95 on landing page
✓ Zero TypeScript errors, zero lint warnings
✓ Keyboard navigation tested manually on all Phase 1 pages
✓ prefers-reduced-motion verified on all animations
✓ Turkish character rendering verified in all font variants
```

---

---

## Phase 2 — Portfolio Ledger, Fund Explorer & Financial Charts

**Duration:** 12–16 days  
**Depends on:** Phase 1 exit criteria met

### Objective

Build the data-connected core of the platform. Phase 2 is where the application becomes
real — users can track actual positions, explore actual funds, and see actual financial
charts. The design quality established in Phase 1 must survive contact with real,
messy financial data: missing values, edge cases, partial histories, and extreme numbers.

---

### 2A — Database Schema & Data Access Layer

Before any UI, the data foundation must be in place.

**Schema implementation (in order):**

```
Priority 1 — Core entities:
  Fund, ManagementCompany, FundDailySnapshot
  CPISnapshot, TCMBRateSnapshot
  Portfolio, PortfolioEvent

Priority 2 — Derived / cached:
  FundReturnCache, PortfolioPositionView (materialized)
  RealReturnComputationLog

Priority 3 — User entities:
  User, UserProfile, UserInsightPreference

All schemas are defined in: AI_DATA_ARCHITECTURE.md
All migrations use: a migration tool (Drizzle ORM or Prisma) with version numbering
Zero raw SQL in application code — all queries through the ORM layer
```

**Data Access Layer structure:**

```
src/lib/db/
  schema/          ORM schema definitions (one file per entity group)
  queries/         Named query functions (one file per domain)
    funds.ts       getFundByCode, getFundTimeSeries, searchFunds, getFundScore
    portfolio.ts   getPortfolioPositions, addPortfolioEvent, getEventLog
    analytics.ts   getPortfolioReturnSeries, getCPIForRange, getRealReturn
    macro.ts       getLatestMacroEvents, getCPISnapshots, getTCMBRates
  seed/            Development seed data (realistic Turkish fund data, 3 years of CPI)
```

**Seed data requirements:**
- Minimum 20 representative Turkish funds across all FundType categories
- 3 years of daily NAV data for each seed fund
- 5 years of monthly TÜİK CPI data
- 2 years of daily TCMB rate data
- 2 sample user portfolios with 5–8 positions each (used in development and visual testing)

---

### 2B — API Route Handlers

All data fetching occurs in Route Handlers or Server Components — never in Client Components.

```
src/app/api/

  funds/
    route.ts          GET: Fund list with filtering, sorting, pagination
                       Params: type, min_real_return_1y, beat_cpi, sort_by, page, limit
                       Response: Fund[] with FundReturnCache summary
                       Cache: 24h (Tier 2 warm cache, revalidated nightly)

    [code]/route.ts   GET: Single fund full profile
                       Response: Fund + FundReturnCache + FundAnalysisScore + NAV series
                       Cache: 24h

    [code]/series/route.ts   GET: NAV time series for a fund and period
                              Params: period, from, to
                              Response: Array<{ date, nav, cpi_indexed }>
                              Cache: 24h (NAV data changes once daily)

  portfolio/
    route.ts          GET: User's portfolio positions (PortfolioPositionView)
                       POST: Add a PortfolioEvent (buy/sell/etc.)
                       Auth: Required. Row-level security enforced.
                       Cache: None (user-specific, always fresh)

    [id]/route.ts     GET: Single portfolio with events log
                       PATCH: Update portfolio metadata (name, benchmark)
                       DELETE: Soft-archive portfolio

    events/route.ts   GET: Event log for portfolio
                       DELETE: Void an event (soft delete)

  analytics/
    route.ts          GET: Portfolio return series for a period
                       Params: portfolio_id, period, from, to, benchmarks[]
                       Response: Time series of portfolio return + CPI + benchmarks
                       Computation: Real return formula applied server-side
                       Cache: 15 minutes (portfolio can change, CPI changes monthly)

  search/
    route.ts          GET: Global search
                       Params: q (query), types[] (fund|page|action|position)
                       Response: Grouped results by category
                       Cache: None for positions (personalized), 1h for funds/pages
```

---

### 2C — MetricCounter Component

Full implementation per `COMPONENT_INVENTORY.md`.

**Implementation sequence:**
1. Static rendering (all formats, all sizes, all semantic modes)
2. Count-up animation (custom easing function, not a library)
3. Large number optimization (only last 3 significant digits animate)
4. Value transition (previousValue prop handling)
5. Semantic color flash on value change
6. Noise threshold (< 0.1% change = instant swap)
7. Accessibility (aria-label, aria-live, animation state management)
8. Reduced-motion compliance

**TypeScript note:** The count-up easing function `value(t) = target × (1 - 2^(-10t/dur))`
must be typed to accept and return `number`, must handle `target = 0` gracefully, and must
clamp its output to avoid floating-point overshoot.

---

### 2D — Portfolio Page — `/portfolio`

The Wealth Canvas.

**Data flow:**
```
layout.tsx (AppShell)
  └── page.tsx (Server Component)
        Fetches: GET /api/portfolio (user's positions)
        Passes to: WealthStatement, AssetBand, PositionList
        Streaming: uses Suspense boundaries per section

WealthStatement (Client Component — MetricCounter requires client)
  Receives: total_value_try, real_return_ytd, nominal_return_ytd
  Renders:  MetricCounter × 3 with count-up on mount

AssetBand (Server Component — static layout)
  Receives: positions grouped by instrument_type
  Renders:  Proportional horizontal segments (CSS flex, no chart library)

PositionList (Client Component — interactive)
  Receives: positions[]
  Renders:  Grouped rows per instrument_type, expandable per position
  Features: Sort by real return, nominal return, portfolio weight
            Add position trigger (inline form, not modal)
```

**Add Position flow:**
```
Trigger:    Floating [+ Add position] button (bottom of list, sticky on mobile)
UI:         Inline form slides open above the list (not a modal)
Fields:     Instrument type → Fund code (autocomplete via /api/search) → Units → Date → Price
Validation: Fund code validated against /api/funds/[code] on blur
            Date cannot be in the future
            Price auto-populated from NAV on selected date (editable)
Submission: POST /api/portfolio (Server Action or API call)
            Optimistic update: position appears immediately in list with pending state
            Error: position reverts with inline error message
```

---

### 2E — Fund Explorer — `/explore`

**Implementation sequence:**

```
Phase 2E-1: List View (simpler, ships first)
  Fund list with: code, name, type chip, real return 1Y, CPI-beat streak, sparkline
  Smart filter chips: type, beat_cpi, expense_ratio range, aum_size
  Infinite scroll (React Query + IntersectionObserver, not pagination)
  Sort: real_return_1y, sharpe, aum_current, alphabetical

Phase 2E-2: Comparison Tray
  Persistent bottom drawer (starts hidden)
  Slides up when first fund is added: panelSlideUp animation
  Max 4 funds; each is a dismissible chip
  [Compare →] routes to /explore/compare

Phase 2E-3: Constellation View
  SVG canvas (not Recharts — custom SVG for the scatter plot)
  Each fund: circle (radius proportional to AUM, max 20px min 4px)
  Color: by FundType (one color per type from the chart palette)
  Hover: FundCard floating panel (Elevation 3 glass)
  Owned funds: accent-400 glow ring
  Filter application: non-matching funds reduce to 15% opacity (not removed)
  Zoom: scroll wheel on desktop, pinch on mobile
```

**Fund Profile — `/explore/[fundCode]`:**

```
Data:     Full fund profile from /api/funds/[code]
Layout:   Per INFORMATION_ARCHITECTURE.md spec
Chart:    FundChart component (Phase 2F)
Metrics:  MetricCounter × 6 (real return, Sharpe, max drawdown, etc.)
AI text:  narrative_summary from FundAnalysisScore (static text in Phase 2; AI-generated in Phase 3)
Similar:  Horizontal scroll strip — 4 funds from same type and similar real return range
```

---

### 2F — FundChart & PortfolioGraph Components

Full implementation per `COMPONENT_INVENTORY.md`.

**FundChart implementation sequence:**
1. Basic line chart (NAV only, no CPI, no animation) — verify Recharts integration
2. Custom axis formatting (Turkish locale numbers, date formatting)
3. Custom tooltip component (Elevation 3 glass panel, exactly per spec)
4. CPI overlay line + indexed transformation
5. Delta fill areas (positive/negative between NAV and CPI)
6. Path draw animation on mount (SVG stroke-dashoffset)
7. Period tab selector + period change transition
8. Sparkline variant (no axes, no tooltip, fixed height, instant animation)
9. Compact variant
10. Accessibility (aria-label, hidden data table, live region for tooltip)
11. All loading/empty/error states per COMPONENT_INVENTORY.md

**PortfolioGraph implementation sequence:**
1. Basic multi-line chart (portfolio return + CPI)
2. Layered area chart (three areas: CPI, nominal, real return band)
3. Seven-step mount sequence (critical — this is the platform's signature visualization)
4. Benchmark overlays (toggleable)
5. Brush scrubber component (custom, not Recharts' built-in Brush)
6. Annotation tick marks + hover cards
7. What-if mode (dimming + dashed counterfactual)
8. Period controls
9. Accessibility pass
10. Mobile adaptations (no brush, pinch-to-zoom)

**Recharts configuration note:**
Both charts use Recharts as a rendering engine only. A `chartDefaults.ts` configuration
file defines all global Recharts overrides (no default colors, no default fonts, no default
margins). Every `<LineChart>`, `<AreaChart>`, or `<ComposedChart>` uses these defaults
as a base. No raw Recharts default styling appears in any component.

---

### 2G — Fund Comparison Engine — `/explore/compare`

```
Data:    Up to 4 fund full profiles (fetched in parallel, Promise.all)
Layout:  Horizontal panel layout (2–4 panels side by side)
         On mobile: vertical stack with sticky fund name header per panel

Metric rows:
  Each metric: label | fund1 value | fund2 value | fund3 value | fund4 value
  Winner highlight: muted emerald left-border on the best value per row
  Metric focus: clicking a row → collapses all other rows, expands full-width chart
                showing that metric's time series across all funds

Scenario Simulator (below comparison panels):
  CPI slider: 10% – 100% (annual CPI assumption)
  Projection period: 1Y / 2Y / 3Y
  On slide: update projected real return for each fund
  Computation: server-side (POST /api/analytics with scenario params), debounced 500ms

AI comparison verdict (above comparison panels):
  Populated from FundAnalysisScore narrative fields in Phase 2
  Enhanced with AI-generated comparison in Phase 3
```

---

### 2H — Watchlists — `/watchlists`

```
Data:    User watchlists from a new Watchlist entity (simple: user_id, name, fund_codes[])
UI:      Per INFORMATION_ARCHITECTURE.md spec
         Grouped by watchlist name
         Each row: fund name, code, real return 1M, trend sparkline, alert status
Alert status: static in Phase 2 (no real alerts until Phase 4)
             Visual placeholder: amber left-border on rows where a threshold is defined
Empty:   Per INFORMATION_ARCHITECTURE.md empty state spec
Add:     Drag from Explorer comparison tray, or [+ Add] within watchlist
```

---

### Phase 2 Risk Assessment

```
Risk 1: Real return computation performance at scale
  Likelihood: High (it is a known expensive query)
  Impact:     High — slow portfolio page destroys the product experience
  Mitigation: Real returns are NEVER computed on the read path.
              They are pre-computed nightly in FundReturnCache and PortfolioPositionView.
              The read path only joins to cached results.
              Portfolio page uses Suspense streaming — wealth statement loads first
              (from fast cache hit), position list loads separately.
              Target: portfolio page data load < 300ms for users with < 20 positions.

Risk 2: NAV data gaps (Turkish market holidays, TEFAS delays)
  Likelihood: High (this happens regularly with TEFAS data)
  Impact:     Medium — chart gaps, incorrect return calculations
  Mitigation: FundDailySnapshot has is_interpolated flag.
              Charts render interpolated points as dashed (not solid) line segments.
              Return calculations skip interpolated points for accuracy.
              Tooltip clearly labels interpolated data: "Estimated (market closed)"

Risk 3: Fund code search performance
  Likelihood: Low
  Impact:     Medium — slow autocomplete in the Add Position form
  Mitigation: Fund code and name indexed in database (btree on fund_code, trigram on fund_name).
              API response cached at CDN for 24h (fund data is rarely changing).
              Client-side: debounce 200ms before sending query.
              Target: search results appear within 150ms of debounce completion.

Risk 4: CPI data latency (TÜİK publishes monthly with a 3-week lag)
  Likelihood: Certain (this is a structural constraint, not a risk)
  Impact:     Medium — real returns for the current month cannot be computed until CPI arrives
  Mitigation: When current month CPI is not yet published:
              Use prior month CPI with a visible warning: "Real return estimate — CPI pending"
              warning-text color on the affected metric values
              This is documented behavior, not a bug.

Risk 5: Recharts SVG rendering causing layout shift
  Likelihood: Medium
  Impact:     High — destroys CLS score
  Mitigation: Chart containers always have explicit height set via the height prop.
              Never rely on SVG auto-sizing.
              Wrapper div: height: {height}px, width: 100%, position: relative.
              Chart renders into this fixed container — no layout shift possible.

Risk 6: Complex portfolio event log queries (what-if mode, historical reconstruction)
  Likelihood: Medium
  Impact:     Low-Medium — slow what-if computations, not blocking
  Mitigation: What-if is a non-critical analytics feature.
              Computations run server-side in a background route handler.
              Client shows a loading state in the what-if overlay (not the whole chart).
              Timeout: 5 seconds. If exceeded: "What-if computation timed out" message.
```

### Phase 2 Exit Criteria

```
✓ Database schema deployed with seed data (20+ funds, 3Y NAV history, 5Y CPI)
✓ All API routes functional and returning correct data types
✓ MetricCounter: all formats, animations, accessibility
✓ Portfolio page: wealth statement, asset band, position list, add position form
✓ Fund Explorer: list view, constellation view, filter chips, comparison tray
✓ Fund Profile: full layout, chart, metrics, AI text (static)
✓ Fund Comparison: panels, metric rows, scenario simulator
✓ FundChart: all variants, all states, path draw animation
✓ PortfolioGraph: layered reveal sequence, brush scrubber, annotation ticks
✓ Watchlists: create, add funds, remove funds
✓ Real return calculations verified against manual calculations for seed data
✓ Lighthouse CI: Performance ≥ 90, Accessibility ≥ 95 on all Phase 2 pages
✓ CLS = 0 on portfolio page load (critical — chart and metric rendering must not shift layout)
✓ Portfolio page data load < 300ms (measured against seed data)
✓ Zero TypeScript errors, zero lint warnings
```

---

---

## Phase 3 — AI Intelligence Core, Macro Feed & Personalized Insights

**Duration:** 10–14 days  
**Depends on:** Phase 2 exit criteria met

### Objective

Activate the platform's primary differentiator. Phase 3 turns a data visualization tool
into an intelligent investment operating system. The quality bar for this phase is
correctness and trust — an AI insight that is wrong, vague, or unexplainable is worse
than no insight at all. Every AI output must be specific, explainable, and honest about
its confidence level.

---

### 3A — Signal Generation Engine

The deterministic signal layer from `AI_DATA_ARCHITECTURE.md`.

```
Location: src/lib/intelligence/signals/

Files:
  signal-registry.ts      SignalType definitions, confidence thresholds
  deterministic/
    cash-drag.ts           CASH_DRAG signal computation
    streak-detector.ts     INFLATION_BEAT_STREAK_* signals
    allocation-drift.ts    ALLOCATION_DRIFT signal
    concentration.ts       CONCENTRATION_RISK, SINGLE_MANAGER_CONCENTRATION
    fund-aum.ts            FUND_AUM_DECLINE, FUND_AUM_RAPID_GROWTH
    negative-real.ts       NEGATIVE_REAL_RETURN_60D
  statistical/
    momentum.ts            MOMENTUM_SHIFT (rolling regression)
    volatility-regime.ts   VOLATILITY_REGIME_CHANGE
    correlation.ts         CORRELATION_BREAKDOWN
  macro/
    rate-change.ts         MACRO_RATE_CHANGE signal from TCMBRateSnapshot
    cpi-release.ts         MACRO_CPI_RELEASE, MACRO_CPI_SURPRISE
    fx-move.ts             MACRO_FX_MOVE
  executor.ts              Runs all signal generators, persists to Signal table
  scheduler.ts             Nightly batch trigger, event-triggered re-runs
```

**Signal computation runs:**
- Nightly at 22:00 (after TEFAS NAV ingest at ~20:30)
- On-demand when a new MacroEvent is ingested (macro signals only)
- On-demand when a PortfolioEvent is created (portfolio-specific signals only)

---

### 3B — Fund Analysis Engine

The nightly fund scoring pipeline from `AI_DATA_ARCHITECTURE.md`.

```
Location: src/lib/intelligence/fund-analysis/

Pipeline stages (per AI_DATA_ARCHITECTURE.md Stage 1–7):
  validate.ts        Stage 1: Data quality checks
  returns.ts         Stage 2: FundReturnCache computation
  risk-metrics.ts    Stage 3: Sharpe, Sortino, drawdown, volatility
  peer-compare.ts    Stage 4: Percentile ranks within FundType
  signals.ts         Stage 5: Deterministic signals from fund data
  narrative.ts       Stage 6: Plain-language summary generation
                               Templates with variable substitution
                               NOT a raw LLM call — structured and auditable
  scorer.ts          Stage 7: Composite score, grade, percentile
  pipeline.ts        Orchestrates all stages, handles errors per fund gracefully
                     (one fund's failure does not abort the entire pipeline)
```

**Narrative generation (Phase 3 — template approach):**

The narrative templates in `narrative.ts` use structured substitution:

```
Template: INFLATION_PROTECTION_STRONG
  "{{fund_name}} has beaten CPI in {{cpi_beat_months_12}} of the last 12 months,
  delivering a real return of {{real_return_1y_formatted}} over the past year.
  {{aum_trend_sentence}}"

Template variables:
  fund_name:                 from Fund entity
  cpi_beat_months_12:        from FundReturnCache
  real_return_1y_formatted:  formatted by MetricCounter logic
  aum_trend_sentence:        selected from a set of pre-written conditional sentences
    if aum_change_3m > 0.10: "Strong fund inflows suggest growing investor confidence."
    if aum_change_3m < -0.10: "Declining AUM warrants monitoring for liquidity considerations."
    else:                     "AUM has remained stable over the past quarter."
```

This approach is deterministic, auditable, fast, and cheap. LLM-generated narratives
are considered for Phase 5 as a premium feature upgrade.

---

### 3C — Macroeconomic Intelligence Feed

```
MacroEvent ingestion:
  TCMB rate decisions: webhook from TCMB API or scheduled poll (15-minute check on decision days)
  TÜİK CPI release:   scheduled poll on the 3rd week of each month
  BIST movements:     daily check — flag if BIST-100 moves > 3% in a session
  FX moves:           daily check — flag if TRY/USD moves > 2% in a session

MacroInsight generation (after each MacroEvent):
  src/lib/intelligence/macro/
    event-classifier.ts   Classify event type and surprise direction
    impact-analyzer.ts    Map event to affected FundType categories
    precedent-finder.ts   Query historical MacroEvents of same type + subsequent fund returns
    insight-generator.ts  Compose MacroInsight record from above
    user-impact-fan.ts    Fan-out: create UserMacroImpact for all users with relevant positions
                          Runs async (queue), not on the ingestion hot path
```

**Macro Feed page — `/intelligence` (Macro Feed tab):**

```
Feed rendering:
  Server Component: fetches latest 20 MacroEvents with their MacroInsights
  Each item: MacroEvent headline + UserMacroImpact for the current user
  If no UserMacroImpact: show general MacroInsight (not personalized)
  Empty state: "Watching for macro events relevant to your portfolio"

Item interaction:
  Expand: reveals full MacroInsight (historical precedents, full explanation)
  Affected positions: chip row → clicking navigates to position in portfolio
  Pin to Journal: creates a DailyBrief.insights entry manually (pre-fill Journal entry)
```

---

### 3D — AIInsightPanel Component

Full implementation per `COMPONENT_INVENTORY.md`.

**Implementation sequence:**
1. Static rendering (all variants: brief, feed, compact)
2. Priority-based left-border styling
3. Expand/collapse reasoning section (spring height animation)
4. Affected position chips (interactive, staggered mount)
5. Action button integration (ghost button, route navigation)
6. Feedback controls (thumbs up/down with animation)
7. Dismiss animation (height collapse, re-layout)
8. Accessibility (article role, expand/collapse ARIA, feedback ARIA)
9. Mobile adaptation (full-width action button, swipe dismiss)

---

### 3E — Daily Brief Engine

```
Brief assembly pipeline (nightly at 03:00):
  src/lib/intelligence/brief/
    collector.ts      Collect all active signals for user
    scorer.ts         Score signals by priority × recency × impact
    curator.ts        Select top 3, apply diversity + novelty constraints
    assembler.ts      Map signals to BriefInsight records
    persister.ts      Write DailyBrief record
    scheduler.ts      Trigger delivery at user's configured time

Brief delivery:
  In-app:   DailyBrief record available via GET /api/brief (cached per user)
  Push:     Web Push API (if alert_push_enabled and alert_count > 0)
            Payload: { title: "Your morning brief is ready", route: "/intelligence" }
            No financial data in push payload (security)
```

**Intelligence page — `/intelligence` (Today's Brief tab):**

```
Data:     GET /api/brief → today's DailyBrief for the current user
Rendering: Server Component (brief content is static per day)
Layout:   Editorial, max-width 680px centered (per INFORMATION_ARCHITECTURE.md)
          greeting_line → portfolio_status_line → insights × N → closing_line
Each insight: AIInsightPanel variant="brief"
Loading:  Skeleton matching brief typography layout (not generic skeletons)
Empty:    First-run state ("Your brief will be ready tomorrow morning")
```

---

### 3F — Portfolio Risk Snapshot

The nightly `PortfolioRiskSnapshot` computation enables the Analytics Dashboard's
real-return chronicle and the risk scoring displayed in the portfolio.

```
Risk computation:  src/lib/intelligence/portfolio/
  risk-metrics.ts  Portfolio-level volatility, Sharpe, VaR
  concentration.ts Herfindahl index, largest position %, manager concentration
  factor-exposure.ts equity_beta, duration, gold/FX exposure, rate/CPI sensitivity
  risk-scorer.ts   Composite risk score (0–100), label, tolerance delta
  snapshot.ts      Assembles and persists PortfolioRiskSnapshot

Analytics Dashboard — `/analytics`:
  PortfolioGraph component (from Phase 2) now receives real data:
    portfolioReturnSeries from PortfolioRiskSnapshot history
    cpiSeries from CPISnapshot history
  Ambient metric row: real CAGR, inflation-beating months, worst real drawdown
  Period matrix: 6×4 grid with heat-map fill
  Attribution waterfall: contribution by position (using RealReturnComputationLog)
```

---

### Phase 3 Risk Assessment

```
Risk 1: Signal false positives eroding user trust
  Likelihood: Medium (especially for statistical signals early in deployment)
  Impact:     Very High — a wrong insight is worse than no insight
  Mitigation: Deterministic signals deploy first (Phase 3A), statistical signals second.
              Each SignalType has a minimum confidence threshold (defined in signal-registry.ts).
              Statistical signals require confidence ≥ 0.75 before surfacing to users.
              User feedback (thumbs-down) immediately suppresses that SignalType for that user.
              Weekly internal review of surfaced signals vs. subsequent market outcomes.

Risk 2: Brief generation pipeline failure leaving users without a brief
  Likelihood: Low-Medium
  Impact:     Medium — users open the app expecting a brief and see empty state
  Mitigation: Pipeline runs at 03:00 with 2-hour window before 08:00 delivery.
              If pipeline fails: prior day's brief is served with a muted notice
              "Using yesterday's brief — today's generation is in progress."
              Pipeline failure triggers an ops alert (not a user-visible error).

Risk 3: MacroInsight fan-out performance (many users, each with positions to evaluate)
  Likelihood: Medium (as user count scales)
  Impact:     Medium — brief is delayed for some users
  Mitigation: Fan-out runs in a background queue (not synchronously on event ingestion).
              Priority: users with CRITICAL signal conditions are processed first.
              Timeout per user: 30 seconds. If exceeded, user gets a basic brief
              without personalized macro impact for that event.

Risk 4: TÜİK CPI revision requiring mass real return recomputation
  Likelihood: Low (TÜİK revisions are rare but do occur)
  Impact:     High — all users' real returns change simultaneously
  Mitigation: CPI ingestion is versioned (revision_number field in CPISnapshot).
              On revision: queue ALL FundReturnCache and PortfolioRiskSnapshot
              recomputations with LOWER priority than live user requests.
              Show "Real returns being updated — using prior CPI" during recomputation.
              Complete within 4 hours of revision publication (SLA).

Risk 5: Narrative templates producing grammatically incorrect Turkish-context sentences
  Likelihood: Medium (templates are English; fund names and terms are Turkish)
  Impact:     Medium — erodes trust if sentences read oddly
  Mitigation: Narrative text is English-language throughout (financial language in Turkey
              is routinely in English among target users, especially Persona 3 — Optimizer).
              Turkish fund names and codes are inserted as-is (they are proper nouns).
              Each template variant is reviewed by a human before deployment.
              Templates are stored in a config file (not hardcoded) — easily correctable.
```

### Phase 3 Exit Criteria

```
✓ Signal engine: all 10 deterministic SignalTypes generating correct signals on seed data
✓ Fund analysis pipeline: running nightly, producing FundAnalysisScore for all seed funds
✓ FundAnalysisScore narratives: reviewed for clarity and accuracy on 10 seed funds
✓ Macro feed: MacroEvent ingestion, MacroInsight generation, feed page rendering
✓ AIInsightPanel: all variants, all states, expand/collapse, feedback, dismiss
✓ Daily Brief: pipeline running, brief available at /intelligence by 08:00
✓ Analytics Dashboard: PortfolioGraph with real data, period matrix, attribution waterfall
✓ Portfolio Risk Score: displayed on portfolio page, breakdown available
✓ Intelligence page: Brief tab + Macro Feed tab, both fully functional
✓ Lighthouse CI: Performance ≥ 90, Accessibility ≥ 95 on intelligence and analytics pages
✓ End-to-end test: create portfolio → wait for brief → brief contains at least 1 relevant signal
✓ Zero TypeScript errors, zero lint warnings
```

---

---

## Phase 4 — Alert System, Performance Hardening & Animation Optimization

**Duration:** 8–10 days  
**Depends on:** Phase 3 exit criteria met

### Objective

Make the platform production-grade. Phase 4 is the engineering rigor phase — not new
features, but hardening everything that exists. By the end of Phase 4, the platform must
be measurably fast, demonstrably accessible, reliably accurate, and alert-capable.
This phase has zero tolerance for performance regressions.

---

### 4A — Smart Watchlist Alerts Engine

```
Alert configuration UI:
  Location: Watchlist item → expand → Alert configuration panel
  Alert types: Per COMPONENT_INVENTORY.md spec (plain-English conditions)
  Storage: new UserAlert entity:
    { id, user_id, watchlist_item_id, alert_type, threshold_value, is_active }

Alert evaluation (nightly + on significant data changes):
  src/lib/alerts/
    evaluator.ts   For each active UserAlert, evaluate condition against latest data
    dispatcher.ts  For triggered alerts: persist AlertEvent, dispatch notification
    throttler.ts   Prevent duplicate alerts (same alert, same day = one notification)

Notification delivery:
  In-app:   Alert badge increments on NavigationShell (via React Query polling on tab focus)
  Push:     Web Push to registered devices (PWA manifest + service worker)
            Quiet hours enforced server-side (check UserProfile.alert_quiet_* before dispatch)
  Email:    Optional digest email (daily summary of triggered alerts)

Alert history:
  AlertEvent entity: { id, alert_id, triggered_at, data_snapshot, was_acknowledged }
  Visible in: Watchlist page (per-item alert history expandable)
  Escalation: Unacknowledged alerts after 48h → included in next DailyBrief as priority item
```

---

### 4B — Performance Profiling & Optimization Pass

A systematic, measurement-driven optimization pass across all Phase 1–3 work.

**Bundle analysis:**

```
Tool: @next/bundle-analyzer
Process:
  1. Generate bundle analysis report for all routes
  2. Identify any route with first-load JS > 120kb gzipped
  3. Audit each large dependency:
     - Recharts: ensure only used chart types are imported (tree-shaking)
     - Framer Motion: ensure only used motion components are imported
     - date-fns or similar: ensure locale-specific imports only
  4. Move any large dependency used only on one route to dynamic import with loading state
  5. Re-run analysis and verify reduction

Target: No route exceeds 120kb first-load JS gzipped.
```

**React rendering optimization:**

```
Profiling tool: React DevTools Profiler (production mode build)
Process:
  1. Profile portfolio page with 20 positions during sort interaction
  2. Profile fund explorer with filter chip toggle (250+ funds in list view)
  3. Profile constellation view on hover over 100+ fund bubbles
  4. Profile command palette during rapid typing

For each profiling scenario:
  Target: No component re-renders that take > 16ms (one frame budget)
  Fixes: React.memo on pure list items, useMemo for expensive computations,
         useCallback for stable event handler references

CinematicCard mouse tracking:
  Verify: gradient update does NOT trigger React re-render
  Verify: requestAnimationFrame throttling is in place
  Measure: gradient update must complete within 8ms (half-frame budget)
  Tool: Chrome DevTools Performance tab, frame timeline
```

**Database query optimization:**

```
Slow query log: Enable in development, review any query > 100ms
Critical paths to benchmark:
  - Portfolio position view (target: < 50ms with 20 positions)
  - Fund search autocomplete (target: < 80ms for a 3-char query)
  - Fund explorer list with filters (target: < 100ms for 250 funds)
  - Analytics return series (target: < 200ms for 3Y daily data)

Index review:
  Run EXPLAIN ANALYZE on each critical path query
  Add indexes where table scans appear for large tables
  FundDailySnapshot is the largest table — covering index on (fund_id, snapshot_date DESC, nav_per_unit_try) is critical
```

**Image & font optimization:**

```
Audit all images:
  All illustrations and mockups: verify Next.js Image component usage
  All images have explicit width/height to prevent CLS
  Priority prop on LCP image (hero section illustration)
  Verify WebP/AVIF serving in browser DevTools network tab

Font loading audit:
  Measure LCP with and without font preload — preload must not hurt LCP
  Verify no FOUT (flash of unstyled text) on first load
  If FOUT present: switch Inter from swap to optional and use system fallback metrics
```

---

### 4C — Animation Audit & Optimization

A systematic review of every animation in the platform against the motion rules in
`DESIGN_SYSTEM.md`.

**Audit checklist per animation:**

```
For every Framer Motion animation in the codebase:
  □ Duration is within the 7 named values (no arbitrary ms values)
  □ Easing is one of the 6 named curves (no arbitrary cubic-bezier values)
  □ Has a useReducedMotion() check that collapses to instant or 80ms max
  □ Does not trigger layout recalculation (transform/opacity only for performance)
  □ Motion budget respected: max 1 primary + 1 secondary animation per interaction
  □ No animation longer than 500ms (except documented exceptions)

Layout animation audit (Framer Motion layoutId):
  □ Verify layoutId pairings are unique across the entire component tree
  □ Shared element transition (Fund Constellation → Fund Profile) works correctly
  □ No unintended layout animations from layoutId conflicts

CSS animation audit:
  □ Skeleton shimmer: CSS-only, no JS
  □ Background gradient (auth page): CSS-only, no JS
  □ No CSS animations that change width/height/top/left/right/bottom (use transform)
```

**GPU layer promotion audit:**

```
Every animated element should be on its own GPU layer:
  Verify: will-change: transform on elements with Framer Motion position animations
  Verify: will-change: opacity on elements with fade animations
  Anti-verify: do NOT set will-change on static elements (memory waste)
  Tool: Chrome DevTools → Layers panel → review composited layers
```

---

### 4D — Accessibility Audit

A systematic accessibility review beyond the component-level checks done in prior phases.

```
Keyboard navigation paths (manual testing, no mouse):
  □ Landing page → Login → Onboarding (all 5 steps) → Dashboard
  □ Portfolio page: add position form, position expand/collapse
  □ Fund Explorer: filter chips, constellation view (keyboard-navigable), comparison tray
  □ Fund Profile: period tabs, chart interaction
  □ Command Palette: open, type, navigate results, select, close
  □ Daily Brief: expand insight reasoning, submit feedback, dismiss

Screen reader testing (VoiceOver on macOS + NVDA on Windows):
  □ All chart components announce meaningful content
  □ MetricCounter announces final value after count-up
  □ Navigation landmark structure is correct and announced
  □ CommandPalette announces results as they appear
  □ AIInsightPanel communicates priority and content
  □ Alert notifications announced appropriately

Color contrast audit:
  Tool: axe DevTools browser extension + manual verification
  □ All text/background combinations meet WCAG AA (4.5:1 for normal, 3:1 for large)
  □ Semantic colors (positive-text, negative-text, warning-text) on their respective backgrounds
  □ Focus ring: accent-400 on all background variants — verify contrast ratio ≥ 3:1

Touch target audit (mobile):
  □ All interactive elements: minimum 44×44px touch target
  □ Tab bar items: minimum 44px height
  □ Form fields: minimum 44px height
  □ Chip and badge interactions: minimum 36px height (with padding)
```

---

### 4E — Error Boundary & Resilience Layer

```
Error boundaries:
  Three tiers:
    Route-level: catches errors in page.tsx → renders error.tsx
    Section-level: wraps each major section of a page (prevents one section failure
                   from taking down the entire page)
    Component-level: wraps data-dependent components (chart, metric, brief)

  Each error boundary: renders an inline error state (per INFORMATION_ARCHITECTURE.md spec)
  Errors are logged server-side with full context (user_id, route, component, stack)
  No stack traces visible to users under any circumstances

Data staleness handling:
  All API responses include a data_as_of timestamp
  Client: compares data_as_of to stale threshold (per INFORMATION_ARCHITECTURE.md)
  If stale: renders the freshness indicator (muted amber, per spec)
  If critically stale (> 2× threshold): renders an inline warning

Network resilience:
  React Query retry configuration:
    retries: 3, retryDelay: exponential (1s, 2s, 4s)
  Offline detection: navigator.onLine + network event listeners
  Offline state: non-blocking toast (per INFORMATION_ARCHITECTURE.md error spec)
  Cached data always shown (with staleness indicator) rather than an empty/error state
```

---

### Phase 4 Risk Assessment

```
Risk 1: Alert evaluation creating database load spikes
  Likelihood: Medium (if evaluation is naive — O(users × alerts) per nightly run)
  Impact:     Medium — slows down the nightly batch pipeline
  Mitigation: Alert evaluation uses set-based SQL operations (not per-user loops).
              Query: "find all active alerts whose condition is met by today's data"
              Single query returns all triggered alerts across all users.
              Expected runtime: < 2 minutes for 10,000 active alert configurations.

Risk 2: Web Push API poor browser support / user permission denial
  Likelihood: High (push permission is frequently denied)
  Impact:     Low — push is additive; the platform works without it
  Mitigation: Push is never the only delivery channel.
              In-app alert count (badge) is the primary mechanism.
              Push permission requested contextually (after user sets their first alert,
              not on first page load — timing is critical for acceptance rate).

Risk 3: Animation jank on portfolio page with many positions
  Likelihood: Medium (stagger animations on 30+ positions)
  Impact:     Medium — inconsistent with premium positioning
  Mitigation: Stagger animations respect a maximum total duration.
              If positions.length > 15: reduce stagger to 15ms per item.
              If positions.length > 30: reduce to 8ms and disable y-translation.
              Positions beyond the viewport fold: animate only when scrolled into view
              (IntersectionObserver-triggered animation, not all-at-once).

Risk 4: CLS from MetricCounter count-up animation
  Likelihood: Low (correctly implemented), High (if width is not reserved)
  Impact:     High — CLS score
  Mitigation: MetricCounter container always has min-width based on the maximum expected
              value for that metric (set by consumer). The width is stable before,
              during, and after count-up. If max value is unknown, use ch units
              (e.g., min-width: 8ch for a currency value). Never let count-up change width.
```

### Phase 4 Exit Criteria

```
✓ Alert engine: evaluation, dispatch, in-app badge, push notification (where supported)
✓ Alert history: visible in watchlist, acknowledgment, escalation to brief
✓ Bundle analysis: no route > 120kb gzipped first-load JS
✓ React rendering: no component re-render > 16ms on interaction paths
✓ Database: all critical queries < 100ms (measured on seed data)
✓ Animation audit: all animations use named durations and easings
✓ Animation audit: useReducedMotion() in every animation component
✓ Accessibility audit: keyboard navigation paths tested end-to-end
✓ Screen reader: key flows tested with VoiceOver and NVDA
✓ Error boundaries: all three tiers implemented and tested
✓ Network resilience: offline state handled gracefully
✓ Lighthouse CI: Performance ≥ 92, Accessibility ≥ 97 across all routes
✓ CLS = 0 across all routes (zero tolerance)
✓ Zero TypeScript errors, zero lint warnings
```

---

---

## Phase 5 — Micro-Interaction Polish, Deployment Pipeline & Final Presentation

**Duration:** 6–8 days  
**Depends on:** Phase 4 exit criteria met

### Objective

Take everything from good to exceptional. Phase 5 is about the details that users cannot
name but will feel — the moment a button responds with exactly the right weight, the exact
instant a tooltip appears, the precise easing that makes a chart feel like it's revealing
truth rather than rendering data. It is also the phase that prepares everything for
production: deployment pipelines, monitoring, and the final presentation of the platform
to stakeholders.

---

### 5A — Micro-Interaction Refinement Pass

A qualitative review of every interaction in the platform. Not a checklist — a judgment
pass, evaluated against the emotional targets in `PRODUCT_STRATEGY.md`.

**Interaction categories to review:**

```
Button feedback:
  Every button press must feel immediately responsive.
  Active state must appear at the moment of click (not after JS event handling).
  Check: use CSS :active pseudo-class for the instant visual feedback,
         Framer Motion for the subsequent spring-back.
  Verify on mobile: touch feedback must be as immediate as desktop click feedback.

Form field interactions:
  Focus transition: border color change must be smooth (not instant) — 80ms, ease-out-circ
  Error state reveal: inline error message slides in from above (y: -4→0, opacity 0→1, 150ms)
  Success state: field gets a subtle positive-border treatment, then fades to normal after 2s
  Verify: autofill does not cause visual glitching (test with Chrome's autofill)

Data loading micro-moments:
  When new data arrives (React Query refetch): values cross-fade, not snap
  MetricCounter transitions between values must feel smooth and readable
  Chart period changes: verify the crossfade timing feels correct at normal viewing pace
  (Play the animation at real-time — not in DevTools slow-mo — and evaluate subjectively)

Hover states across all interactive elements:
  Every hover must have a visible, smooth transition (80ms minimum — instant hover changes
  feel digital and cheap)
  Hover states must not change layout (no width/height changes on hover)
  Hover on mobile: must have a tap-equivalent state (active state via :active)

Scroll behavior:
  Infinite scroll in Fund Explorer: new items load before user reaches the bottom (preload
  when within 300px of end)
  Scroll restoration: returning to the explorer list after viewing a fund profile restores
  the user's scroll position (Next.js scrollRestoration config)
  Smooth scroll for anchor navigation (e.g., "See reasoning" link)

Toast / notification delivery:
  All toasts: slide up from bottom-center, auto-dismiss after 4s
  Multiple toasts: stack vertically with 8px gap (not replace each other)
  Maximum 3 toasts visible simultaneously (oldest dismisses to make room)
  Dismiss on click: shrinks horizontally then collapses height
```

---

### 5B — Journal Module — `/journal`

The final module, shipping in Phase 5 because it depends on all other modules
providing data for context injection and outcome tracking.

```
Journal entry creation:
  Quick capture: ⌘J shortcut (global), opens inline composer wherever the user is
  Composer: expands from the trigger position (origin-point animation, not slide-in)
  Auto-context: captures current portfolio state + date + linked macro events
  Entry types: Decision Record, Thesis Note, Reflection, Pinned Insight, Comparison Snapshot
  Rich text: markdown-based, rendered with syntax highlighting for code blocks

Journal entry display:
  Per INFORMATION_ARCHITECTURE.md spec
  Context block: muted, 12px type, automated
  Outcome tracking: auto-computed for position-linked entries
  Tag system: user-defined, auto-suggest from prior tags

Timeline navigation:
  Left timeline: grouped by month, collapsible year sections
  Jump: clicking a month in the timeline scrolls to that month's first entry
  Animation: smooth scroll (CSS scroll-behavior: smooth)

Search within journal:
  Full-text search across entry content, tags, linked positions
  Results highlighted (matched text wrapped in <mark> element)

Privacy note (visible in journal header):
  "Journal entries are encrypted and private. Only you can read them."
  Shown persistently — this is a trust-building element, not a one-time notice.

Export:
  PDF export: formatted beautifully (not raw data dump)
  PDF uses the same typography as the app (embedded Inter font in PDF)
  Export triggers a server-side PDF generation route handler
  Download appears as a file download (not a new tab)
```

---

### 5C — Settings Pages — `/settings/*`

All settings pages using the settings sub-shell layout.

```
/settings            General: name, email, phone
/settings/portfolio  Benchmarks, base currency display, position display preferences
/settings/alerts     Notification preferences (push, email, quiet hours)
/settings/appearance Theme toggle (dark/light), display density (comfortable/compact)
/settings/data       Import (CSV), export (full data JSON or PDF), connected accounts
/settings/billing    Plan details, upgrade CTA, payment management (link to Stripe)

Each settings page:
  Form-based, max-width 680px
  Auto-save where possible (no "Save" button for simple toggles)
  Save confirmation: inline success state on the field/section (not a toast)
  Dangerous actions (delete account, export all data): require confirmation step
```

---

### 5D — Vercel Deployment Pipeline

```
Environment structure:
  Production:   main branch → vercel.com/[project]/production
  Staging:      release/* branches → vercel.com/[project]/staging
  Preview:      All PRs → vercel.com/[project]/[deployment-id]

Environment variables (Vercel dashboard, not in codebase):
  DATABASE_URL          Production PostgreSQL connection string
  REDIS_URL             Upstash Redis URL
  NEXTAUTH_SECRET       JWT signing secret (generated, not human-readable)
  NEXTAUTH_URL          Production URL
  TCMB_API_KEY          TCMB EVDS API key
  TUIK_DATA_URL         TÜİK data endpoint
  WEB_PUSH_PUBLIC_KEY   VAPID public key
  WEB_PUSH_PRIVATE_KEY  VAPID private key (server-only, never exposed to client)

Vercel configuration (vercel.json):
  Security headers:
    Strict-Transport-Security: max-age=63072000; includeSubDomains
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
    Content-Security-Policy: defined (no unsafe-inline for scripts)
    Permissions-Policy: geolocation=(), microphone=(), camera=()

  Caching headers (per route group):
    / (landing):          Cache-Control: public, max-age=3600, stale-while-revalidate=86400
    /api/funds/*:         Cache-Control: public, max-age=86400 (CDN cached)
    /api/portfolio/*:     Cache-Control: private, no-cache (user-specific)
    /api/brief:           Cache-Control: private, max-age=3600 (brief changes once daily)
    Static assets:        Cache-Control: public, max-age=31536000, immutable

  Edge runtime:
    /api/search → Edge runtime (low latency, globally distributed)
    /api/funds/[code] → Edge runtime (globally cached)
    All other API routes → Node.js runtime (database access)

Lighthouse CI in deployment pipeline:
  GitHub Actions workflow:
    Triggered on: PR to main, push to main
    Steps: build → deploy to preview → run Lighthouse CI against preview URL
    Fail PR if: any Lighthouse score below thresholds defined in Performance Contract
    Report: Lighthouse scores posted as PR comment
```

---

### 5E — Monitoring & Observability

```
Error monitoring (Sentry or equivalent):
  All server-side errors: captured with user_id, route, request details
  All client-side errors: captured with component tree, user action context
  Performance: track server-side API route response times
  Alerts: any error affecting > 1% of users within 5 minutes → ops alert

Analytics (privacy-respecting, no personal data sent to third parties):
  Page views: anonymous, no user ID sent
  Feature usage: "viewed fund profile", "created journal entry" — no content
  Performance metrics: Core Web Vitals sent to analytics (helps identify regressions in prod)

Uptime monitoring:
  Health check endpoint: GET /api/health
    Returns: { status: "ok", db: "ok", redis: "ok", data_freshness: { nav: "ok", cpi: "ok" } }
    Checked every 60 seconds from external monitoring service
    Alerts ops team if status ≠ "ok" for 3 consecutive checks

Data pipeline monitoring:
  Each nightly batch job (signal evaluation, fund analysis, brief generation):
    Logs start time, end time, items processed, errors
    If a job fails: alert ops team, do not silently skip
    If a job takes 2× its normal duration: alert (performance regression or data issue)
```

---

### 5F — Final Presentation Design

The platform is presented to stakeholders as a complete, working product. This is not
a slide deck — it is a live demonstration of the platform with prepared scenarios.

```
Demonstration scenarios (scripted, with seed data configured for compelling output):

Scenario 1 — The Inflation Story:
  Show a portfolio where the nominal return (80%) looks strong
  Reveal the real return (4.2%) after CPI adjustment
  The gap in PortfolioGraph tells the story without words

Scenario 2 — The AI Brief:
  Open the platform at "08:00" with a prepared Daily Brief
  Three specific, explainable insights about the seed portfolio
  Expand one insight's reasoning — show the transparency

Scenario 3 — Fund Discovery:
  Open Fund Explorer constellation view
  Apply "Beat inflation" filter — watch non-qualifying bubbles dim
  Navigate to a top fund — constellation bubble morphs into profile header
  (the layoutId shared element transition is the moment)

Scenario 4 — Speed:
  Hard refresh the dashboard
  Measure time from navigation bar visible to AI brief visible
  Target: full portfolio context visible in < 2 seconds on a standard connection

Scenario 5 — Command Palette:
  Open ⌘K
  Type "GAF" — portfolio position appears as top result
  Type "rebalance" — AI action appears instantly
  Demonstrate keyboard-only navigation throughout
```

---

### Phase 5 Risk Assessment

```
Risk 1: Vercel cold starts on Edge runtime affecting TTFB
  Likelihood: Low (Edge runtime has minimal cold starts)
  Impact:     Medium — TTFB spike on first request after dormancy
  Mitigation: Edge runtime for search and fund endpoints (globally distributed, fast)
              Node.js routes for database-heavy operations (already warm from nightly batch)
              Minimum instances: 1 always-on for Node.js functions (Vercel Pro feature)

Risk 2: PDF export quality on journal entries
  Likelihood: Medium (browser-based PDF generation is inconsistent)
  Impact:     Low — premium feature, not on critical path
  Mitigation: Server-side PDF generation (Puppeteer headless or a PDF library)
              Rendered to a specific pixel width (consistent output regardless of server OS)
              Template is simpler than the full app UI (no animations, no gradients)

Risk 3: Content Security Policy blocking legitimate resources
  Likelihood: Medium (CSP is easy to misconfigure)
  Impact:     High — can break entire pages silently in production
  Mitigation: CSP is first deployed in report-only mode (violations logged, not blocked)
              Violations reviewed for 24h before switching to enforce mode
              CSP violations are logged to the error monitoring system

Risk 4: Demonstration scenario performance degrading with real production load
  Likelihood: Low (demo uses seed data, not production scale)
  Impact:     Medium — if demo is run against production with many users
  Mitigation: Demonstration runs on a dedicated staging environment
              Staging is a mirror of production with isolated seed data
              Staging Lighthouse CI passes before demonstration is confirmed
```

### Phase 5 Exit Criteria

```
✓ Journal module: full implementation (create, view, timeline, search, export)
✓ All settings pages: fully functional
✓ Micro-interaction audit: all interactions reviewed and refined
✓ Vercel production deployment: live, accessible, no runtime errors
✓ Security headers: verified via securityheaders.com (target: A rating)
✓ CSP: in enforce mode with no violations for 24h
✓ Monitoring: error tracking, uptime check, data pipeline monitoring all active
✓ Lighthouse CI: Production URL scores Performance ≥ 92, Accessibility ≥ 97
✓ Core Web Vitals: LCP ≤ 1.8s, CLS ≤ 0.05, INP ≤ 150ms — measured from production
✓ Demonstration scenarios: all 5 scripted scenarios work flawlessly on staging
✓ All known issues triaged: P0 (blockers) = 0, P1 (significant) = 0
✓ Zero TypeScript errors, zero lint warnings in production build
```

---

---

## Global Risk Register

Risks that span multiple phases and require sustained attention throughout.

```
RISK-G1: Turkish locale data formatting inconsistencies
  Description: Turkish number notation (periods as thousands separators, comma as decimal)
               must be applied consistently across all numeric displays.
               Inconsistency erodes trust with Turkish users.
  Mitigation:  A single formatNumber(value, format, locale) utility handles all formatting.
               Never use raw .toLocaleString() without explicit locale.
               ESLint rule: flag any .toLocaleString() without 'tr-TR' argument.
               Visual audit of all numeric displays before each phase exit.

RISK-G2: TEFAS data source availability
  Description: TEFAS does not provide an official public API. Data acquisition depends
               on web scraping or unofficial data partners. Source may change or become
               unavailable without notice.
  Mitigation:  Data acquisition layer is isolated behind a DataSource interface.
               Multiple potential data sources identified (TEFAS scraping, fintech data
               providers, direct management company feeds).
               If primary source fails: fallback to secondary, alert ops, serve stale
               data with freshness indicator.
               Seed data and development environment are fully self-contained
               (no dependency on live TEFAS for development).

RISK-G3: CPI data affecting all real returns simultaneously
  Description: When TÜİK publishes a CPI revision, every real return in the platform
               changes. Users may notice their returns change without an obvious reason.
  Mitigation:  CPI revision is surfaced as a MacroEvent (MACRO_CPI_RELEASE or higher).
               UserMacroImpact is generated explaining the change.
               The affected values show a freshness timestamp.
               In-app explanation: "Your real returns updated following TÜİK's CPI release."

RISK-G4: User onboarding drop-off before first portfolio position
  Description: The platform delivers no value until a user enters at least one position.
               If onboarding is too long or confusing, users abandon before experiencing value.
  Mitigation:  Onboarding Step 4 (first position) has an explicit skip option.
               If skipped: user reaches a "demo mode" portfolio using a sample portfolio.
               Demo mode shows what the platform looks like with real data, with a persistent
               CTA to add their own positions.
               Onboarding completion rate measured from deployment week 1.

RISK-G5: TypeScript strict mode causing development velocity friction
  Description: `strict: true` catches real bugs but can slow initial development
               when engineers are not familiar with the stricter requirements.
  Mitigation:  CLAUDE.md documents the strict TypeScript contract explicitly.
               Common patterns (discriminated unions, type guards, generic constraints)
               are documented in src/lib/types/README.md.
               No `@ts-ignore` allowed — type problems must be solved, not suppressed.
               This friction is a feature: it prevents entire categories of runtime bugs.
```

---

## Phase Summary

| Phase | Focus | Duration | Exit Gate |
|---|---|---|---|
| 0 | Foundation verification | 1–2 days | Build passes, tokens configured |
| 1 | Design system, shell, landing | 8–12 days | Lighthouse ≥ 90, zero errors |
| 2 | Portfolio, charts, fund explorer | 12–16 days | Real returns verified, CLS = 0 |
| 3 | AI engine, macro feed, brief | 10–14 days | Signals accurate, brief generated |
| 4 | Alerts, performance, accessibility | 8–10 days | Lighthouse ≥ 92, audit complete |
| 5 | Polish, deployment, presentation | 6–8 days | Production live, CWV targets met |
| **Total** | | **45–62 days** | |

---

## Optimization Targets — Final State

```
Core Web Vitals (production, measured with real users via CrUX):
  LCP:  ≤ 1.8s (Good)
  CLS:  ≤ 0.05 (Good)
  INP:  ≤ 150ms (Good)
  TTFB: ≤ 600ms (Good)

Lighthouse (CI, production URL, mobile simulation):
  Performance:   ≥ 92
  Accessibility: ≥ 97
  Best Practices: ≥ 95
  SEO:           ≥ 90

Application performance:
  Portfolio page time-to-interactive:  < 2.0s (4G connection)
  Fund explorer filter response:        < 150ms (perceived as instant)
  Command palette result latency:       < 100ms for static results, < 300ms for API results
  Chart render (1Y period):             < 500ms to fully animated state
  Daily brief load:                     < 800ms (cached, served from Redis)

Data pipeline:
  Nightly batch completion:             < 90 minutes (for 1,000 active users)
  Signal evaluation:                    < 2 minutes
  Brief generation per user:            < 5 seconds
  Fund analysis pipeline:               < 30 minutes for full fund universe
```
