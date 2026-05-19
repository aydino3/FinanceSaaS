# Information Architecture & Routing System

> Defines the complete Next.js App Router structure, navigation shell, command palette,
> and cinematic state coverage. Every route, layout, and transition must serve the
> emotional arc defined in PRODUCT_STRATEGY.md and comply with CLAUDE.md motion rules.

---

## 1. Route Hierarchy Overview

```
app/
├── (marketing)/                    # Public, unauthenticated group
│   ├── layout.tsx                  # Marketing shell (minimal nav, no sidebar)
│   ├── page.tsx                    # / — Landing Page
│   ├── about/page.tsx              # /about
│   └── pricing/page.tsx            # /pricing
│
├── (auth)/                         # Auth flow group (no shell chrome)
│   ├── layout.tsx                  # Centered, ambient auth shell
│   ├── login/page.tsx              # /login
│   ├── signup/page.tsx             # /signup
│   └── forgot-password/page.tsx    # /forgot-password
│
├── (onboarding)/                   # First-run guided setup
│   ├── layout.tsx                  # Full-screen onboarding shell
│   ├── welcome/page.tsx            # /onboarding/welcome      — Step 1
│   ├── profile/page.tsx            # /onboarding/profile      — Step 2
│   ├── risk/page.tsx               # /onboarding/risk         — Step 3
│   ├── first-position/page.tsx     # /onboarding/first-position — Step 4
│   └── ready/page.tsx              # /onboarding/ready        — Step 5 (completion)
│
├── (dashboard)/                    # Authenticated app — carries AppShell
│   ├── layout.tsx                  # AppShell: sidebar + context bar + command palette
│   │
│   ├── page.tsx                    # /dashboard — Home / Morning Brief
│   │
│   ├── portfolio/
│   │   ├── page.tsx                # /portfolio — Wealth Canvas (M1 surface)
│   │   └── [positionId]/
│   │       └── page.tsx            # /portfolio/[positionId] — Position detail
│   │
│   ├── explore/
│   │   ├── page.tsx                # /explore — Fund Explorer (M2 surface)
│   │   ├── [fundCode]/
│   │   │   └── page.tsx            # /explore/[fundCode] — Fund Profile
│   │   └── compare/
│   │       └── page.tsx            # /explore/compare — Comparison Engine (M3)
│   │
│   ├── analytics/
│   │   ├── page.tsx                # /analytics — Inflation Analytics (M4 surface)
│   │   └── attribution/
│   │       └── page.tsx            # /analytics/attribution — Waterfall detail
│   │
│   ├── intelligence/
│   │   ├── page.tsx                # /intelligence — Macro Feed + AI Brief (M5+M6)
│   │   └── brief/
│   │       └── [date]/page.tsx     # /intelligence/brief/[date] — Historical brief
│   │
│   ├── watchlists/
│   │   ├── page.tsx                # /watchlists — All watchlists (M7)
│   │   └── [listId]/
│   │       └── page.tsx            # /watchlists/[listId] — Single watchlist
│   │
│   ├── journal/
│   │   ├── page.tsx                # /journal — Chronicle view (M8)
│   │   └── [entryId]/
│   │       └── page.tsx            # /journal/[entryId] — Single entry
│   │
│   └── settings/
│       ├── layout.tsx              # Settings sub-shell (secondary nav)
│       ├── page.tsx                # /settings — General / Profile
│       ├── portfolio/page.tsx      # /settings/portfolio — Benchmarks, currency
│       ├── alerts/page.tsx         # /settings/alerts — Notification preferences
│       ├── appearance/page.tsx     # /settings/appearance — Theme, density
│       ├── data/page.tsx           # /settings/data — Imports, exports, connected accounts
│       └── billing/page.tsx        # /settings/billing — Plan and payment
│
└── api/                            # Route Handlers (server-side only)
    ├── funds/
    │   ├── route.ts                # GET /api/funds — fund universe
    │   └── [code]/route.ts         # GET /api/funds/[code] — single fund NAV series
    ├── portfolio/
    │   └── route.ts                # GET/POST /api/portfolio — positions
    ├── analytics/
    │   └── route.ts                # GET /api/analytics — computed return series
    ├── macro/
    │   └── route.ts                # GET /api/macro — event feed
    ├── brief/
    │   └── route.ts                # GET /api/brief — today's AI brief
    └── search/
        └── route.ts                # GET /api/search?q= — global search
```

---

## 2. Layout Definitions

### 2.1 Marketing Layout — `(marketing)/layout.tsx`

**Purpose:** Converts visitors into signups. Cinematic but lightweight — no app chrome.

**Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│  TopBar: Logo (left) ·············· Login | Get Started     │
│  (position: sticky, blur-backdrop on scroll, height: 56px)  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                   {children}                                │
│                                                             │
│  (full-width, no max-width constraint at layout level;      │
│   individual page sections define their own widths)         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Footer: minimal — Links · Copyright · Theme toggle        │
│  (height: 80px, muted, borderless)                          │
└─────────────────────────────────────────────────────────────┘
```

**Spacing:** TopBar 56px, page content starts at `pt-14`, footer always at page bottom.
**Motion:** TopBar fades in on mount (opacity 0→1, 400ms, easeOut). No other layout-level motion.

---

### 2.2 Auth Layout — `(auth)/layout.tsx`

**Purpose:** Frictionless credential entry. Background is the product — the auth form is a
focused foreground layer floating above it.

**Structure:**
```
┌──────────────────────────────────────────────────────┐
│  Background: ambient radial gradient, animated        │
│  (slow-moving, ~30s cycle, very subtle — not a        │
│   screensaver. Communicates depth, not decoration)    │
│                                                       │
│              ┌────────────────────┐                   │
│              │  Logo              │                   │
│              │                    │                   │
│              │  {form content}    │                   │
│              │                    │                   │
│              │  [CTA Button]      │                   │
│              │                    │                   │
│              │  Secondary link    │                   │
│              └────────────────────┘                   │
│              (width: 400px, centered X+Y)             │
│              (glass card: bg-white/5, blur-xl,        │
│               border border-white/10, rounded-2xl)    │
│                                                       │
└──────────────────────────────────────────────────────┘
```

**Spacing:** Card padding 40px all sides. Form fields 24px vertical gap. CTA full-width.
**Motion:** Background gradient is CSS-only (no JS). Card mounts with opacity 0→1 + y: 16→0,
duration 350ms, expo-out easing. Form fields stagger in at 50ms intervals after card mounts.

---

### 2.3 Onboarding Layout — `(onboarding)/layout.tsx`

**Purpose:** Guide the user to their first meaningful moment in the product. Five deliberate
steps — each a full-screen canvas, not a modal wizard.

**Structure:**
```
┌──────────────────────────────────────────────────────┐
│  Progress Spine (top): ●──────○──────○──────○──────○ │
│  (fixed top, 48px, step dots, no step labels until   │
│   hover — clean, not instructional)                  │
│                                                       │
│                                                       │
│                   {step content}                      │
│                   (centered, max-w-lg)                │
│                                                       │
│                                                       │
│  Navigation Row (fixed bottom, 80px):                 │
│  [← Back]                        [Continue →]        │
│  (back is ghost, continue is filled primary)          │
└──────────────────────────────────────────────────────┘
```

**Spacing:** Step content vertically centered with `min-h-screen flex items-center`.
Content max-width 512px. Navigation row 80px, content 24px from edges.
**Motion:** Between steps — exiting step translates x: 0 → -40px + fades out (200ms).
Entering step comes from x: +40px → 0 + fades in (300ms, 100ms delay). Directional:
going forward exits left, going back exits right. Progress dots expand smoothly on advance.

---

### 2.4 App Shell — `(dashboard)/layout.tsx`

**Purpose:** The persistent operating environment. All authenticated app routes live inside
this shell. The shell must never compete with page content.

#### Desktop Shell (≥1024px)

```
┌──────────────────────────────────────────────────────────────────┐
│  Context Bar (fixed top, 40px, full-width)                        │
│  [Logo mark]  Real return today: +0.3% above CPI  ···  [⌘K] [⚙] │
│  (very low contrast — informational, not decorative)              │
├──────────┬───────────────────────────────────────────────────────┤
│          │                                                        │
│  Nav     │                                                        │
│  Spine   │              {page content}                           │
│  (fixed  │                                                        │
│  left,   │              max-w: none at shell level               │
│  width:  │              padding: 32px (desktop)                  │
│  56px    │                                                        │
│  default │                                                        │
│  240px   │                                                        │
│  expanded│                                                        │
│          │                                                        │
│  [icons] │                                                        │
│  collapse│                                                        │
│  trigger │                                                        │
│  at      │                                                        │
│  bottom) │                                                        │
└──────────┴───────────────────────────────────────────────────────┘
```

**Nav Spine states:**
- *Collapsed (default):* 56px wide, icons only, tooltips on hover
- *Expanded:* 240px wide, icons + labels, triggered by hover (desktop) or explicit toggle
- Expansion transition: width animates 56→240px in 200ms expo-out; labels fade in with 80ms delay

**Context Bar anatomy:**
```
[◆ logo]   Real return (YTD): +6.2%  ·  CPI: 38.4%  ·  Last sync: 2 min ago
                                                               [⌘K Search]  [Notifications]  [Avatar]
```
Height 40px. Background: `bg-background/80 backdrop-blur-md`. A single hairline border at bottom.
Never shows more than 3 data points — extreme restraint.

#### Mobile Shell (<1024px)

```
┌──────────────────────────────┐
│  TopBar (56px, fixed)        │
│  [←]  Page Title       [···] │
├──────────────────────────────┤
│                              │
│                              │
│   {page content}             │
│   padding: 16px sides        │
│   padding-bottom: 80px       │
│   (clearance for tab bar)    │
│                              │
│                              │
├──────────────────────────────┤
│  Tab Bar (fixed bottom, 64px)│
│  [◆]  [⊞]  [⌘K]  [◎]  [≡]  │
│  Home Exp Search  Ana  More  │
└──────────────────────────────┘
```

Tab bar items (5 max): Home (Dashboard), Explore (M2), Search trigger, Analytics (M4),
More (sheet for Watchlists, Journal, Intelligence, Settings).
Tab bar background: `bg-background/90 backdrop-blur-xl`. Selected item has subtle
indicator dot above icon, no bold label changes.

---

### 2.5 Settings Sub-Shell — `settings/layout.tsx`

**Structure:**
```
┌──────────────────────────────────────────────────────────────────┐
│  Inherits AppShell chrome                                         │
│                                                                   │
│  ┌──────────────────┬─────────────────────────────────────────┐  │
│  │  Settings Nav    │                                         │  │
│  │  (left, 200px)   │   {settings page content}              │  │
│  │                  │   max-w: 680px (not full-width)         │  │
│  │  General         │   Form fields breathe — 32px row gap    │  │
│  │  Portfolio       │                                         │  │
│  │  Alerts          │                                         │  │
│  │  Appearance      │                                         │  │
│  │  Data            │                                         │  │
│  │  Billing         │                                         │  │
│  │                  │                                         │  │
│  └──────────────────┴─────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

Settings content is deliberately narrow (max 680px) — form pages should never feel like
they're trying to fill a wide viewport.

---

## 3. Key Page Specifications

### 3.1 Landing Page — `/`

**Layout Structure:**
```
Section 1 — Hero (100vh)
  Background: ambient gradient (top-center radial, very low opacity)
  Content: centered, max-w-3xl
  Headline (display size): "Your wealth. In real terms."
  Subhead: 2-line value proposition
  CTA row: [Get Started — free] [See how it works →]
  Below fold anchor: soft scroll indicator

Section 2 — The Problem (80vh)
  Split: left text column, right ambient chart visual (CPI vs nominal return — the gap)
  Text: "Nominal returns lie. Real returns matter."

Section 3 — Feature Modules (3 × full-width strips)
  Each strip: alternating left/right layout, cinematic screenshot/mockup, 2-sentence benefit

Section 4 — Trust (60vh)
  Data points: funds tracked, users, CPI data sources
  (Numbers shown as ambient large type — not a stats card grid)

Section 5 — Final CTA (60vh)
  Centered, minimal: headline + single button
```

**Motion:** Hero headline uses a reveal — text clips upward from invisible baseline
(stagger per word group, total duration ~600ms). Chart visual in Section 2 draws in
on scroll-enter (Intersection Observer, not scroll-position JS). Feature strip images
fade + translate-x into view on scroll.

---

### 3.2 Dashboard Home — `/dashboard`

**Layout Structure:**
```
┌──────────────────────────────────────────────────────────────────┐
│  Greeting + Date (top, display-small, muted)                      │
│  "Good morning, Ayşe.  Tuesday, 14 May"                          │
│                                                                   │
│  ── Morning Brief (M6 output, full-width editorial block) ────── │
│  max-w: 720px, generous line-height, 48px top margin             │
│                                                                   │
│  ── Portfolio Snapshot (condensed M1, read-only) ────────────── │
│  Real return headline + 4-week sparkline, full-width             │
│                                                                   │
│  ── Two-column bottom row ─────────────────────────────────────  │
│  Left (60%): Top watchlist alerts (M7, if any)                    │
│  Right (40%): Next macro event countdown (M5)                     │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Spacing:** Top padding 48px, section gap 56px, max content width 1100px centered.
**Motion:** Page mount — greeting fades in (0→1, 250ms). Brief block fades + y:12→0 (350ms,
100ms delay). Portfolio snapshot fades + y:12→0 (350ms, 200ms delay). Bottom row columns
stagger: left 300ms delay, right 380ms delay. All use expo-out easing. Total cascade
completes in under 700ms from first paint.

---

### 3.3 Portfolio Page — `/portfolio`

**Layout Structure:**
```
┌──────────────────────────────────────────────────────────────────┐
│  Wealth Statement (full-width, 120px tall)                        │
│  Real Net Worth ₺1,847,320 · Real return +6.2% · Nominal +71.4% │
│                                                                   │
│  ── Sparkline strip (full-width, 80px tall) ────────────────── │
│  12-month arc, hairline, ambient color fill                       │
│                                                                   │
│  ── Asset Band (full-width, 96px) ─────────────────────────── │
│  Proportional segments: Funds · Equity · Gold · FX · Cash        │
│                                                                   │
│  ── Position List ──────────────────────────────────────────── │
│  Grouped by asset class                                           │
│  Each position row: name · units · entry date ·                   │
│    real return (primary) · nominal return (secondary) ·           │
│    micro sparkline (28px tall)                                    │
│  Row height: 64px. Section header: 40px with group real return    │
│                                                                   │
│  ── Add Position (bottom, sticky on mobile) ────────────────── │
│  Ghost button: [+ Add position]                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Motion:** Wealth statement number counts up from 0 on first load (duration 800ms,
easeOut — purposeful, not gimmicky — conveys data being computed). Asset band segments
expand from left (stagger 40ms per segment). Position rows stagger in at 30ms intervals,
y: 8→0 + opacity 0→1. Expanding a position row animates height open (layout animation,
Framer Motion `layoutId`).

---

### 3.4 Fund Explorer — `/explore`

**Layout Structure:**
```
┌──────────────────────────────────────────────────────────────────┐
│  View Toggle: [Constellation] [List]     Filter chips row        │
│  (48px bar, sticky)                                               │
│                                                                   │
│  ── Constellation View ─────────────────────────────────────── │
│  Full-height canvas (height: calc(100vh - 168px))                 │
│  Axes: x = Real Return 1Y, y = Volatility                         │
│  Fund bubbles, hover → floating fund card (240px wide)            │
│  Owned funds: subtle glow ring                                    │
│                                                                   │
│  OR                                                               │
│                                                                   │
│  ── List View ──────────────────────────────────────────────── │
│  Each row 72px: Fund code · Name · Type chip · Sparkline ·        │
│    Real return 1Y (primary) · CPI-beat streak · AI one-liner      │
│  Infinite scroll (not pagination)                                 │
│                                                                   │
│  ── Comparison Tray (fixed bottom, 0→72px on first add) ──────  │
│  Slides up from bottom when first fund is added                   │
│  Max 4 fund chips · [Compare →] button                            │
└──────────────────────────────────────────────────────────────────┘
```

**Motion:** Constellation view — bubbles scatter into position from center (stagger 8ms per
fund, total ~500ms for 500 funds). Filter chip application re-scatters non-matching bubbles
to reduced opacity (not removed — spatial continuity). List-to-Constellation toggle:
list rows dissolve out (150ms), constellation scatters in (400ms, 100ms delay). Comparison
tray slides up from y:72→0 in 280ms expo-out.

---

### 3.5 Fund Profile — `/explore/[fundCode]`

**Layout Structure:**
```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Explorer        [+ Add to Watchlist] [+ Add Position] │
│                                                                   │
│  Fund Name (headline)   Code chip   Type chip                    │
│  Management company · AUM · Expense ratio                         │
│                                                                   │
│  ── Primary Chart (full-width, 320px) ─────────────────────── │
│  NAV history + CPI overlay · Period tabs: 1M 3M 6M 1Y 3Y        │
│                                                                   │
│  ── Metric Grid (2×3, below chart) ─────────────────────────── │
│  Real Return 1Y · Sharpe · Max Drawdown                          │
│  CPI Beat Streak · Volatility · AUM trend                         │
│                                                                   │
│  ── AI Characterization (full-width, editorial) ─────────────  │
│  3–5 sentence narrative. No bullets. No generic disclaimers.      │
│                                                                   │
│  ── Similar Funds Strip (horizontal scroll) ──────────────────  │
│  4 fund cards, each 200px wide                                    │
└──────────────────────────────────────────────────────────────────┘
```

**Motion:** Profile slides in from the right (x: 32→0 + opacity 0→1, 300ms expo-out) when
reached from the Explorer — preserving spatial context (the fund "comes from" the explorer
surface). Chart draws in (SVG path animation, 600ms). Metric grid items stagger in at 50ms.

---

### 3.6 Analytics Dashboard — `/analytics`

**Layout Structure:**
```
┌──────────────────────────────────────────────────────────────────┐
│  Period Selector: [1M] [3M] [6M] [1Y] [2Y] [3Y] [Custom]        │
│  Benchmark toggles: [BIST-100] [USD/TRY] [Gold] [T-Bill]         │
│  (sticky header row, 48px)                                        │
│                                                                   │
│  ── Primary Chronicle Chart (full-width, 360px) ──────────────  │
│  Layered area: CPI floor · Nominal · Real return band             │
│  Below chart: brush scrubber (40px)                               │
│                                                                   │
│  ── Ambient Metric Row (3 figures, no borders) ───────────────  │
│  Real CAGR · Inflation-Beating Months · Worst Real Drawdown       │
│  Figure (display-small) + label (caption) + trend chip            │
│                                                                   │
│  ── Period Matrix (full-width, below fold) ───────────────────  │
│  Columns: 1M 3M 6M 1Y 2Y 3Y                                      │
│  Rows: Nominal return · Real return · vs CPI · vs BIST-100        │
│  Heat-map fill intensity per cell                                  │
│                                                                   │
│  ── Attribution Waterfall (full-width) ────────────────────────  │
│  Horizontal bar chart decomposition                               │
│  Click any bar → drill-down panel slides from right               │
└──────────────────────────────────────────────────────────────────┘
```

**Motion:** Chronicle chart uses a path-draw animation on mount and on period change
(SVG `stroke-dashoffset`, 500ms). Area fills fade in after path draw (200ms delay, 300ms
duration). Period change re-animates the chart (old curves fade, new draw in). Metric row
figures count up from zero on mount (500ms). Matrix cells fade in row by row (20ms stagger).

---

### 3.7 Intelligence Page — `/intelligence`

**Layout Structure:**
```
┌──────────────────────────────────────────────────────────────────┐
│  Tab row: [Today's Brief] [Macro Feed] [Brief Archive]            │
│  (32px, minimal, underline-only active indicator)                 │
│                                                                   │
│  ── Today's Brief tab ─────────────────────────────────────────  │
│  Full editorial layout — max-w: 680px, centered                   │
│  Greeting line · Date · Divider                                   │
│  Real return statement (1 line)                                   │
│  Insight 1 (expandable) · Insight 2 · Insight 3                  │
│  Closing statement (1 line)                                       │
│                                                                   │
│  ── Macro Feed tab ─────────────────────────────────────────── │
│  Vertical feed, max-w: 720px, centered                            │
│  Each event: type chip + date · Headline · Portfolio impact text  │
│    Affected position chips (clickable) · Expand for deep dive     │
│  Items: 16px vertical gap, no card borders                        │
│                                                                   │
│  ── Brief Archive tab ──────────────────────────────────────── │
│  Chronological list of past briefs                                │
│  Each: date + 1-line summary + [Read] link                        │
└──────────────────────────────────────────────────────────────────┘
```

**Motion:** Tab switch — active tab content fades in (opacity 0→1, 200ms). No sliding tabs —
tabs are content switches, not spatial navigation. Brief text blocks cascade in with 40ms
stagger per paragraph block. Expanding an insight animates height open via layout animation.

---

### 3.8 Watchlists — `/watchlists`

**Layout Structure:**
```
┌──────────────────────────────────────────────────────────────────┐
│  [+ New Watchlist]                          (top-right, ghost)    │
│                                                                   │
│  ── Watchlist: "Inflation Hedges" ─────────────────────────── │
│  Section header: name · item count · group avg real return       │
│                                                                   │
│    Fund row (64px): Name · Code · Real return 1M · Trend         │
│      Micro sparkline · Alert status indicator                     │
│    [Triggered alert row: amber left-border + alert description]   │
│                                                                   │
│  ── Watchlist: "High Conviction" ──────────────────────────── │
│  (same structure)                                                 │
│                                                                   │
│  ── Empty watchlist: "Research" ───────────────────────────── │
│  Dim empty state: "Drag funds here from Explorer"                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**Motion:** Alert rows pulse subtly on mount (opacity 0.7→1.0, 3 cycles, 1.5s total —
CSS-only, no JS). New fund dropped into watchlist bounces into position (spring, stiffness
300, damping 30 — this is a direct manipulation response, spring is appropriate here).

---

### 3.9 Journal — `/journal`

**Layout Structure:**
```
┌──────────────────────────────────────────────────────────────────┐
│  ┌──────────────┬─────────────────────────────────────────────┐  │
│  │  Timeline    │  [+ New Entry]                    [Search]   │  │
│  │  (left 160px)│                                             │  │
│  │  2026        │  ── Entry: May 14 (Decision Record) ──────  │  │
│  │  · May       │  Context block (muted, 12px type)           │  │
│  │    ● 14      │  User content (body text, max-w: 640px)     │  │
│  │    ● 3       │  Outcome tracker (if position-linked)       │  │
│  │  · Apr       │  Tag chips                                   │  │
│  │  2025        │                                             │  │
│  │  · Dec       │  ── Entry: May 3 (Reflection) ────────────  │  │
│  │  ...         │  (same structure)                           │  │
│  │              │                                             │  │
│  │  [Jump]      │                                             │  │
│  └──────────────┴─────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**Motion:** Navigating to a different month — entries exit with opacity fade (150ms),
new month's entries stagger in (30ms per entry). Active timeline month indicator slides
smoothly (layout animation). New entry composer expands from the [+ New Entry] button
position (origin-point expansion, not modal slide-in).

---

## 4. Global Navigation Shell — Detailed Behavior

### Desktop Nav Spine

```
Nav item anatomy:
  [Icon]  Label              (expanded state)
  [Icon]                     (collapsed state — tooltip on hover)

Active state: subtle bg fill (white/8) + left accent line (2px, signature color)
Hover state: bg fill (white/5), no other change
Inactive: icon at 60% opacity, label at 70% opacity

Order:
  ─────────────────  (logo mark at top, 56px zone)
  ◆  Home
  ⊞  Portfolio
  ◎  Explore
  ∿  Analytics
  ⚡  Intelligence
  ◉  Watchlists
  ✦  Journal
  ─────────────────  (separator)
  ⚙  Settings        (bottom-anchored)
  ●  User avatar     (bottom, 48px zone)
```

Expand/collapse: hover on collapsed spine → expand after 300ms delay (prevents accidental
triggers). Click the collapse button at bottom → collapses immediately. State persisted
to localStorage.

### Mobile Tab Bar

5 tabs. "More" opens a bottom sheet:
```
Bottom Sheet (height: 50vh, rounded-t-2xl):
  ─────  (drag handle)
  ⚡  Intelligence
  ◉  Watchlists
  ✦  Journal
  ─────
  ⚙  Settings
  ●  Account
  [Close]
```
Bottom sheet mounts with y: 200→0, spring (stiffness 400, damping 40). Backdrop fades in
behind it (opacity 0→0.5, 250ms). Dismissible by swipe-down or backdrop tap.

---

## 5. Command Palette (⌘K / Ctrl+K)

### Visual Structure

```
┌──────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────┐   │
│  │  🔍  Search funds, positions, pages...         │   │
│  └────────────────────────────────────────────────┘   │
│                                                        │
│  Recent                                               │
│  ─────────────────────────────────────────────────── │
│  ◎  GAF-A  ·  Garanti TEFAS Hisse A                  │
│  ✦  Journal entry — May 3                            │
│  ⊞  BIST portfolio position — THYAO                  │
│                                                        │
│  Quick Actions                                         │
│  ─────────────────────────────────────────────────── │
│  +  Add position                                      │
│  +  New journal entry                                 │
│  +  New watchlist                                     │
│                                                        │
│  [type to search...]                                   │
└──────────────────────────────────────────────────────┘
  Width: 560px · Centered horizontally, ~20% from top
  bg: background color, border: white/10, shadow-2xl
  Backdrop: blur-sm + opacity overlay
```

**Result Categories (appear as user types):**
- Funds (fund code + name + type chip + real return 1Y)
- Positions (owned positions from portfolio)
- Pages (navigate to any app route — "Analytics", "Settings > Alerts")
- Actions (verb-first: "Add position", "New entry", "Export journal")
- Macro events (search past events from M5)
- Journal entries (full-text search across entry content)

**Keyboard Navigation:**
- `↑ ↓` move selection
- `Enter` activates selected result
- `Escape` closes
- `Tab` cycles through result categories
- Typing `/` followed by a category name filters to that category:
  `/fund GAF` shows only fund results matching GAF

**Motion:** Palette mounts from scale 0.96→1.0 + opacity 0→1, 200ms expo-out.
Backdrop fades in simultaneously. Results list items stagger in (15ms per item).
Palette unmounts: scale 1.0→0.96 + opacity 1→0, 150ms easeIn. No sliding — the palette
appears and disappears as a focused layer, not a spatial navigation.

---

## 6. Loading, Empty, and Error States

### Philosophy
These states are designed with identical care to populated states. A loading state is not
a placeholder — it is the product's first impression in many flows. Empty states are
**invitations**, not error conditions. Error states are **honest and calm**, never alarming.

---

### 6.1 Loading States

**Skeleton Philosophy:** No generic grey pulse boxes. Skeletons mirror the exact layout
geometry of the loaded content — same heights, same proportions. They use a very subtle
shimmer (opacity 0.4→0.7, 1.5s cycle, CSS-only) in the same color family as the background,
just slightly elevated.

**Loading Variants:**

*Page-level loading (loading.tsx for each route):*
The AppShell chrome loads immediately (nav spine, context bar). Only the page content area
shows a skeleton that matches that specific page's layout geometry.

```
Portfolio loading skeleton:
  ── Wealth statement: 1 line, height 48px, width 60% ──────────
  ── Sparkline: full-width, height 80px ────────────────────────
  ── Asset band: full-width, height 96px ───────────────────────
  ── 6 position rows at 64px each ─────────────────────────────
```

*Data-within-page loading (React Suspense boundaries):*
Inline spinner — not a full-page overlay. A single rotating circle, 24px, muted accent
color, positioned where the data will appear. Disappears without fanfare when data arrives.

*Chart loading:*
Chart axes and grid lines appear immediately (rendered without data). Data lines draw in
as data resolves — the chart is never a skeleton box.

---

### 6.2 Empty States

Each empty state has three elements: an ambient visual, a single-sentence explanation,
and one action CTA. Never two CTAs. Never paragraphs of explanation.

**Portfolio — No positions:**
```
  [Ambient: subtle illustration of the wealth canvas with ghost asset bands]

  "Your portfolio is waiting to be built."

  [+ Add your first position]
```

**Fund Explorer — No results matching filter:**
```
  [Ambient: constellation with all bubbles faded to near-invisible]

  "No funds match these filters."

  [Clear filters]
```

**Watchlists — Empty list:**
```
  [Ambient: empty list silhouette]

  "Nothing on watch yet."

  [Explore funds →]
```

**Journal — No entries:**
```
  [Ambient: open notebook visual, very minimal]

  "Your investment chronicle starts here."

  [Record your first decision]
```

**Intelligence Brief — First day (brief not yet generated):**
```
  [Ambient: soft clock or horizon visual]

  "Your first brief will be ready tomorrow morning."

  [What we'll be watching →]   (links to Macro Feed tab)
```

**Motion for empty states:** Ambient visual fades in (300ms). Text fades in 100ms later.
CTA fades in 200ms after text. Gentle, resolved — not urgent.

---

### 6.3 Error States

**Philosophy:** Errors are honest and specific. Never "Something went wrong." Never alarming
red full-screen overlays. The error is contained to the affected component or page, and the
rest of the app continues to work.

**Inline Data Error (component-level):**
```
  [Affected component area, normal dimensions preserved]

  ⚠  Fund data unavailable — TEFAS sync pending
     Last available: May 13, 17:42

  [Retry]  [Use cached data]
```
Color: muted amber text, no red. Icon: 16px warning, not alarming. Component maintains
its height/position so surrounding layout does not shift.

**Page-Level Error (error.tsx):**
```
  [Full page content area, AppShell intact]

  [Ambient: very subtle visual, not an error illustration]

  "This page couldn't load."
  Specific reason if known (e.g., "Portfolio data sync is in progress.")

  [Try again]  [Go to Dashboard]
```
No stack traces visible to user. Error logged server-side. Page-level error uses same
visual language as empty states — calm, ambient, actionable.

**Network Error (global toast, non-blocking):**
```
  [Bottom-center toast, 320px wide, 48px tall]
  ● Offline — data may be outdated
```
Toast slides up from bottom (y: 24→0, 250ms). Dismisses automatically when connection
restores. Does not block interaction. Never stacks multiple toasts.

**Auth Error / Session Expired:**
Full-page redirect to `/login` with a preserved `next` param for post-login redirect.
No jarring flash — fade transition out before redirect.

---

## 7. Page Transition System

### Route Change Transitions

All navigation between dashboard routes uses a consistent transition contract:

**Standard navigation (sidebar link, breadcrumb):**
- Exiting page: opacity 1→0, 150ms easeIn
- Entering page: opacity 0→1, 250ms easeOut, 50ms delay
- No spatial movement at the page level — content fades, shell persists

**Drill-down navigation (list item → detail):**
- Detail page enters from the right (x: 24→0 + opacity 0→1, 300ms expo-out)
- Communicates that the detail "lives behind" the list item

**Back navigation:**
- Entering page comes from the left (x: -24→0 + opacity 0→1, 250ms expo-out)
- Spatial symmetry with drill-down

**Modal-equivalent panels (right-side expansion):**
Used for Fund Profile from Explorer, Position detail from Portfolio, Alert config from
Watchlist. The panel slides in from the right edge over the current page (not replacing it).
- Width: 480px desktop, full-width mobile
- Mount: x: 480→0, 300ms expo-out + backdrop fade
- Dismiss: x: 0→480, 200ms easeIn

### Shared Element Transitions (Framer Motion layoutId)
Fund bubbles in the Constellation View → Fund Profile header:
The fund's bubble in the constellation morphs into the fund name/code header of the
profile page. This is the signature transition of the Explorer — it communicates
that the profile "is" the bubble, spatially. Requires `layoutId` matching between
the bubble component and the profile header component.

---

## 8. URL and State Design Conventions

### URL Patterns
- Filter state (Fund Explorer): query params — `/explore?type=hisse&beat_cpi=true`
- Comparison state: query params — `/explore/compare?funds=GAF-A,AKB-K,YAP-B`
- Analytics period: query param — `/analytics?period=1y&from=2025-05-14&to=2026-05-14`
- Intelligence tab: hash — `/intelligence#macro-feed`
- Settings section: direct route — `/settings/alerts`

### Shallow Routing
Filter and view-mode changes (Constellation/List toggle, analytics period selector) use
`router.push` with `scroll: false` to update the URL without triggering a full page
transition — the URL is always shareable/bookmarkable, but the experience is seamless.

### Back Button Contract
Every drill-down, filter application, and panel open must be reversible with the browser
back button. No interaction that modifies visible state should be back-button silent.
