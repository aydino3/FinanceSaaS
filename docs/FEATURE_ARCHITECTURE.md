# Feature Architecture & Module System

> All modules are designed under the `cinematic-premium-web` skill defined in `CLAUDE.md`.
> Every visual concept, interaction model, and data contract must serve the emotional arc
> defined in `PRODUCT_STRATEGY.md` — moving users from inflation anxiety to strategic mastery.

---

## Architectural Principles

Before defining individual modules, the following cross-cutting rules govern all of them:

**Progressive Disclosure:** Every module has a Surface Layer (calm, essential, glanceable)
and a Depth Layer (rich data, controls, edge cases) accessible through deliberate interaction —
never dumped upfront.

**Real-Return Primacy:** Every number representing a return, gain, or loss is
inflation-adjusted by default. Nominal figures appear as secondary context.

**Spatial Consistency:** All modules share a unified depth language —
background canvas → midground panels → foreground interactive elements.
Nothing floats unexpectedly; every layer has an established spatial role.

**Data Freshness Signaling:** Users must always know how current their data is.
A subtle ambient indicator (not a disruptive badge) communicates staleness.

**Zero Dead Screens:** Loading, empty, and error states are first-class UI moments —
designed with the same care as the populated state.

---

## Module Map

```
┌─────────────────────────────────────────────────────────────────┐
│  SHELL: Navigation Spine + Context Bar + Ambient Market Pulse   │
├──────────────────┬──────────────────────────────────────────────┤
│                  │  M1: Portfolio Tracking System               │
│   Left Spine     │  M2: TEFAS Fund Explorer                     │
│   (persistent,   │  M3: Intelligent Fund Comparison Engine      │
│   minimal nav)   │  M4: Inflation-Adjusted Analytics Dashboard  │
│                  │  M5: Macroeconomic Intelligence Feed         │
│                  │  M6: AI Investment Insights & Daily Briefing │
│                  │  M7: Smart Watchlists & Dynamic Alerts       │
│                  │  M8: Premium Investment Journal              │
└──────────────────┴──────────────────────────────────────────────┘
```

---

## MODULE 1 — Portfolio Tracking System

### Purpose & User Benefit
The single source of truth for the user's financial position across all instrument types.
Answers the question every user wakes up with: *"What is my real wealth today, and how has
it changed?"* Unifies TEFAS mutual funds, equities (BIST), gold (gram/cumhuriyet altın),
FX holdings (USD, EUR), and TRY cash — all expressed in real purchasing power after CPI.

### Visual UI Concept

**Surface Layer — The Wealth Canvas**
Full-width opening view. Not a grid of cards. A single, breathing wealth statement:

```
  Real Net Worth                          ₺ 1,847,320
  ─────────────────────────────────────────────────────
  Real return (YTD)     +6.2% above CPI   ▲ ₺ 108,420
  Nominal return (YTD)  +71.4%            in USD: ~$52,100

  [Ambient sparkline spanning full width — 12-month arc]
```

Below this, a spatial asset allocation view — not a pie chart. A horizontal depth-layered
band where each instrument class occupies proportional width, with subtle elevation shifts
to communicate performance (high-performing assets slightly elevated, underperformers recessed).

**Depth Layer — Position Detail**
Clicking any asset band opens an in-context expansion (no navigation, no modal) revealing
individual positions, entry prices, real return per position, and AI-generated performance note.

**Color Language**
- Real return positive: muted emerald wash on the background of that band
- Real return negative (below CPI): muted rose — not aggressive red, but unmistakably cautionary
- Neutral / CPI-tracking: slate

### Data Requirements
- **Inputs:** Manual entry (fund code + units + purchase date/price) or broker import (CSV/API)
- **Live data:** TEFAS NAV feeds (daily), BIST equity prices (real-time or 15-min delayed),
  TCMB gold and FX reference rates (daily), TÜİK CPI monthly index
- **Computed:** Real return = ((current_value / entry_value) / (current_CPI / entry_CPI)) - 1
- **Storage schema per position:** instrument_type, instrument_id, units, entry_date,
  entry_price_try, current_price_try, current_cpi_index, entry_cpi_index

### Key Interaction Models
- **Quick Add:** Floating entry trigger (not a form page) — inline, keyboard-first, auto-completes
  fund codes and equity tickers
- **Drag to Reorder:** Positions within a category can be reordered by drag; order is persisted
- **Swipe to Archive:** Mobile — swipe left to move a closed position to history
- **Time Scrubber:** A timeline at the bottom of the canvas lets users drag to any past date
  and see their portfolio state at that moment — full historical reconstruction

---

## MODULE 2 — Turkish Fund (TEFAS-Style) Explorer

### Purpose & User Benefit
Makes 500+ TEFAS funds navigable, comparable, and meaningful without requiring the user to
understand fund codes. Surfaces the funds that are actually relevant to this user given their
portfolio, risk tolerance, and inflation context — not an unsorted list.

### Visual UI Concept

**Surface Layer — The Fund Lens**
Not a table. A spatial exploration surface with two modes:

*Constellation View:* Funds plotted on a two-axis canvas — X: real return (1Y), Y: volatility.
Each fund is a subtle circle, sized by AUM, colored by fund type category. Hovering reveals
a floating fund card. The user's current holdings are highlighted with a distinct ambient glow.
This is orientation — where does the universe live relative to each other?

*List View:* For users who want to scan and filter. But even in list mode, each row has
micro-data visualization — a sparkline of real return trend, an inflation-beat streak indicator
(e.g., "Beat CPI 9 of 12 months"), and a single-line AI characterization
("Conservative short-duration, strong CPI-hedge track record").

**Depth Layer — Fund Profile**
Clicking a fund opens a full profile panel that slides in from the right (spatial, not modal):
- 3-year NAV chart with CPI overlay (the gap is the story)
- Fund manager, AUM trend, expense ratio, minimum investment
- Inflation-beat frequency histogram
- "Similar funds in your portfolio" comparison strip
- One-click Add to Watchlist or Add to Portfolio

### Data Requirements
- **Fund universe:** Fund code (TEFAS 3-letter), fund name, fund type (hisse/borçlanma/karma/
  para piyasası/altın etc.), management company, expense ratio, AUM, minimum investment
- **Time series:** Daily NAV (Birim Pay Değeri) — minimum 3 years history
- **Computed:** Real return (1M, 3M, 6M, 1Y, 3Y), CPI-beat frequency, Sharpe ratio,
  max drawdown, volatility (annualized std dev of daily returns)
- **Refresh cadence:** NAV updated by 20:00 each business day (TEFAS standard)

### Key Interaction Models
- **Smart Filter Bar:** Not a dropdown forest. A natural-language-adjacent filter chip system:
  "Beat inflation" · "Low volatility" · "Equity heavy" · "Under 1% expense" — chips compose
- **Fund Code Search:** Type "GAF" or "AKB" and get instant results; also accepts partial
  fund name search
- **Constellation Zoom:** Scroll to zoom into a region of the constellation; pinch on mobile
- **Comparison Tray:** Drag up to 4 funds into a persistent bottom tray for side-by-side
  comparison (feeds Module 3)

---

## MODULE 3 — Intelligent Fund Comparison Engine

### Purpose & User Benefit
Eliminates the spreadsheet workflow. The user selects 2–4 funds and gets a structured,
AI-narrated comparison that highlights what actually matters — not a raw data table.
Answers: *"Which of these funds actually protected my wealth, and in which conditions?"*

### Visual UI Concept

**Surface Layer — The Comparison Stage**
Two to four fund panels arranged horizontally, each with identical vertical layout for
immediate visual scanning. But the layout is not a table — it's a scored card system.

Each metric row has a subtle visual winner indicator (the strongest value gets a muted
emerald left-border highlight — no bold numbers, no trophy icons, just spatial emphasis).

At the top, an AI-generated verdict block:
```
  ┌─────────────────────────────────────────────────────────┐
  │  In high-inflation periods (CPI > 50%), GAF-A has        │
  │  outperformed the group in 8 of 9 comparable windows.   │
  │  For a 2-year horizon with moderate risk tolerance,      │
  │  GAF-A and AKB-K represent the strongest pairing.       │
  └─────────────────────────────────────────────────────────┘
```

**Depth Layer — Scenario Simulator**
Below the comparison cards, a scenario strip: drag a slider to simulate different
CPI environments (e.g., "What if CPI averages 40% for 18 months?") and watch projected
real returns update live across all selected funds. This is the most powerful analytical
tool in the platform — but it lives in the depth layer, not the surface.

### Data Requirements
- All data from Module 2 fund profiles
- **Correlation matrix** between selected funds (for portfolio construction guidance)
- **Scenario engine inputs:** CPI projection curve, TCMB rate path assumption,
  fund category historical beta to macro variables
- **Computed comparisons:** relative Sharpe, head-to-head real return across time windows,
  drawdown comparison during historical stress periods (2021 currency crisis, 2023 earthquake)

### Key Interaction Models
- **Tray-to-Stage:** Funds dragged into the comparison tray (Module 2) automatically populate
  the comparison stage; add/remove without leaving the view
- **Metric Focus Mode:** Clicking any metric row (e.g., "Real Return 1Y") collapses all other
  rows and expands a full-width chart of just that metric across all selected funds over time
- **Export Insight:** One-tap export of the AI comparison summary as a formatted PDF or
  shareable image — premium feature
- **Save Comparison:** Named comparison snapshots persist in the user's Journal (Module 8)

---

## MODULE 4 — Inflation-Adjusted Return Analytics Dashboard

### Purpose & User Benefit
The analytical core of the platform. Deep-dive visualization of how the user's portfolio
has performed against inflation across time. Moves beyond "did I make money" to
"did I preserve and grow real purchasing power." This is where Stage 3 (Orientation) becomes
Stage 4 (Agency) in the emotional arc.

### Visual UI Concept

**Surface Layer — The Real Return Chronicle**
A full-width cinematic chart — not a line chart with a legend. A layered area chart where:
- The bottom layer is the CPI curve (filled, muted rose tint) — the floor of adequacy
- The middle layer is the portfolio nominal return curve (muted slate)
- The top layer is the portfolio real return (filled emerald where above CPI, rose where below)

The gap between real return and CPI is the story. The chart makes the gap visceral.

Flanking the chart, three ambient metric blocks (not cards — borderless, spaced):
```
  Real CAGR (3Y)        Inflation-Beating        Worst Real Drawdown
    +4.8% p.a.          Months: 28 of 36          -12.3% (Mar–Oct 2021)
```

**Depth Layer — Attribution & Decomposition**
What drove real returns? A waterfall decomposition breaks down:
- Contribution by asset class
- Contribution by individual position
- Drag from expenses (management fees in real terms)
- Currency effect (TRY/USD movement's impact on USD-denominated holdings)

Each bar in the waterfall is interactive — clicking opens a time-series drill-down.

**Period Comparison View**
A matrix of time periods (columns: 1M, 3M, 6M, 1Y, 2Y, 3Y) by metric
(rows: nominal return, real return, CPI, real CAGR). Cells use a muted heat-map
fill — no raw color, just subtle intensity variation to guide the eye.

### Data Requirements
- Portfolio position history with purchase dates (from Module 1)
- TÜİK monthly CPI index (historical, minimum 5 years)
- TCMB policy rate history (for opportunity cost benchmarking)
- **Computed:** Real return time series, real CAGR, inflation-beat streak,
  portfolio-level volatility, real Sharpe ratio, contribution attribution

### Key Interaction Models
- **Date Range Brush:** Below the main chart, a narrow brush control to select any
  sub-period; all metrics update to reflect the selected window
- **Benchmark Toggle:** Overlay benchmarks — BIST-100, USD/TRY, gold price —
  against the portfolio real return curve
- **Annotation Layer:** Users can pin personal notes to specific dates on the chart
  ("Added AKB-K position here") — feeds Module 8 Journal
- **What-If Mode:** Remove a position from the historical calculation to see
  counterfactual — "What would my real return have been without this fund?"

---

## MODULE 5 — Macroeconomic Intelligence Feed

### Purpose & User Benefit
Translates macro events into portfolio-specific implications — not a news aggregator.
Every item in the feed answers: *"What does this mean for my portfolio?"*
Eliminates the cognitive labor of reading a CBRT press release and wondering
"okay, but what do I actually do?"

### Visual UI Concept

**Surface Layer — The Intelligence Stream**
A calm, editorial-feeling vertical feed. Not cards with borders — each item is a
text-first editorial unit with generous whitespace. Think Financial Times online,
not Bloomberg Terminal.

Each item has a fixed anatomy:
```
  [Event Type Chip]   [Date + Source]

  CBRT holds policy rate at 42.5%

  What this means for your portfolio:
  Your money-market funds (3 positions) will continue to benefit from
  elevated short-term yields. Your equity exposure may face near-term
  pressure as high rates persist. No action required.

  [Affected positions: ↗ GAF-P, ↗ YAP-B, → BIST exposure]
```

The "Affected positions" strip is hyperlinked — tapping any position navigates
directly to it in Module 1 with the macro context retained in a floating note.

**Depth Layer — Event Deep Dive**
Expanding any feed item reveals:
- Full event detail and source data
- Historical precedent: "Last 3 times the CBRT held rates in a high-CPI environment..."
- Chart: the relevant macro indicator's history
- Community signal (premium): how other anonymous users in similar portfolios responded

### Data Requirements
- **Macro events:** TCMB rate decisions, TÜİK CPI/PPI releases, BDDK banking regulation,
  Treasury auction results, BIST-100 significant moves (±3%)
- **International:** US Fed decisions, EUR/TRY-relevant ECB actions, emerging market risk index
- **Data sources:** TCMB open API, TÜİK data portal, financial news APIs
  (filtered and summarized, not raw)
- **Portfolio linkage:** Rules engine that maps event types to affected instrument categories,
  then to the user's specific positions

### Key Interaction Models
- **Relevance Filter:** Feed defaults to "relevant to my portfolio" — toggle to "all macro events"
- **Digest Mode:** Weekly AI-generated macro summary in long-form — one elegant document,
  not 14 individual feed items
- **Pin to Journal:** Any feed item can be pinned to the Investment Journal (Module 8)
  as a decision context record
- **Alert Integration:** Feed items with high portfolio relevance can trigger push alerts
  (routes to Module 7 alert system)

---

## MODULE 6 — AI Investment Insights & Daily Briefing Engine

### Purpose & User Benefit
The platform's most differentiating capability. Not a chatbot, not a generic AI assistant —
a structured, portfolio-aware intelligence layer that delivers specific, explainable insights.
Answers the question: *"What should I be thinking about today?"*

### Visual UI Concept

**Surface Layer — The Morning Brief**
Opens as the first view users see upon login (if configured). A single, full-width editorial
surface — not a dashboard of widgets. One cohesive document for the day:

```
  Good morning, Ayşe.                          Tuesday, 14 May 2026

  ─────────────────────────────────────────────────────────────────

  Your real portfolio return this month: +1.2% above CPI

  Three things worth your attention today:

  1. GAF-A has outperformed its category for 6 consecutive months —
     its AUM growth is slowing, which historically precedes a
     performance plateau. Worth monitoring.

  2. Your TRY cash position (₺240,000) is losing real value at
     ~3.2% monthly given current CPI. Consider a short-duration
     fund allocation before end of month.

  3. The CBRT meeting Thursday may move short-term yields.
     Your para piyasası exposure (28% of portfolio) is well-positioned
     for a hold or hike scenario.

  ─────────────────────────────────────────────────────────────────
  No action required today. Your allocation is within your
  defined parameters.
```

The brief is **confident and specific**. Vague AI hedging ("you might want to consider perhaps...")
is strictly prohibited. If the AI cannot be specific, it does not generate an insight.

**Depth Layer — Insight Detail & Reasoning**
Each numbered insight is expandable. Expanding it shows:
- The data that generated the insight (transparent reasoning)
- Historical context ("Here's what happened the last 3 times this signal appeared")
- Suggested action options (not mandates) with one-tap execution routing
- A "Dismiss this insight type" control — the AI learns what the user finds useful

**Insight Library**
A chronological archive of all past briefs and insights. Searchable. Shows which insights
led to actions and what the outcome was.

### Data Requirements
- Full portfolio state (Module 1)
- Fund performance time series (Module 2)
- Macro event stream (Module 5)
- User-defined risk parameters and investment goals (onboarding profile)
- **AI model inputs:** Portfolio concentration metrics, fund momentum signals,
  cash drag calculation, macro event–portfolio correlation rules
- **Insight generation rules (deterministic layer):**
  - Cash drag alert: TRY cash > X% for > Y days
  - Fund momentum: N consecutive months of category outperformance
  - Rebalancing drift: allocation vs. target drift > threshold
  - Inflation exposure: positions with negative real return trending > 60 days

### Key Interaction Models
- **Brief Timing:** User-configurable delivery time; default 08:00 local
- **Insight Feedback:** Thumbs up/down on each insight — trains relevance model
- **Action Routing:** Each insight can route directly to the relevant module for action
  (e.g., "Review this fund" opens its Module 2 profile; "Rebalance" opens Module 1)
- **Ask Follow-Up:** A single text input below the brief for one follow-up question
  ("Why is AUM growth slowing a negative signal?") — answered in-context, not as a chatbot

---

## MODULE 7 — Smart Watchlists & Dynamic Alerts

### Purpose & User Benefit
Persistent monitoring without cognitive overhead. The user defines what matters to them,
and the system watches it — alerting only when something genuinely changes, not on every
price tick. Serves the Disciplined Accumulator who checks weekly and the Sophisticated
Optimizer who wants precision triggers.

### Visual UI Concept

**Surface Layer — The Watch Surface**
Not a table of tickers. Grouped, named watchlists displayed as spatial clusters:
each watchlist is a titled section with its instruments shown as minimal rows —
fund name, real return (1M), trend indicator, last alert (if any).

The watch surface is calm by default — most rows should read as "no action needed."
The design deliberately uses visual quietude as a signal: when something turns amber
or rose, it stands out precisely because everything else is neutral.

**Alert State Visualization**
Active alerts use an ambient left-border pulse (CSS animation, subtle, not blinking):
```
  ┃ GAF-A     Real return trend declining 3 consecutive weeks
  ┃ AKB-B     NAV drop > 2% in single session — threshold breached
```

The pulse stops once the user acknowledges the alert. Acknowledged alerts move to
a muted "reviewed" state — they don't disappear, they are just de-emphasized.

**Depth Layer — Alert Configuration**
Each instrument in a watchlist has an alert configuration panel (right-side expansion).
Alert types are offered as clear English conditions, not formula inputs:
- "Real return drops below CPI for 30+ days"
- "NAV falls more than X% in a single day"
- "Fund AUM drops below ₺Y billion (potential liquidity risk)"
- "Inflation-beat streak ends after N consecutive months"
- "Macro event affects this fund category"

### Data Requirements
- Watchlist items: same instrument data as Module 2
- Alert engine: rule evaluations run on each daily data refresh
- Alert history: timestamped log of all triggered alerts per instrument
- **Delivery:** In-app notification + optional push notification + optional weekly digest

### Key Interaction Models
- **Drag to Watchlist:** From Module 2 Fund Explorer, drag a fund directly onto a named watchlist
- **Named Lists:** Users create and name watchlists ("Inflation Hedges," "High Conviction," "Research")
- **Batch Alert Edit:** Select multiple items and apply a common alert template
- **Quiet Hours:** User-configurable alert suppression windows (e.g., no push after 22:00)
- **Alert Escalation:** If a triggered alert is not acknowledged within 48 hours, it escalates
  to the next day's AI Brief (Module 6) as a priority item

---

## MODULE 8 — Premium Investment Journal

### Purpose & User Benefit
The platform's most human module. A private, structured record of investment decisions,
thesis documentation, and outcome tracking. Closes the feedback loop between insight and
action — the user who journals their reasoning makes better decisions over time.

Transforms the platform from a data tool into a **personal financial intelligence record**.
This is where the Sophisticated Optimizer persona (Deniz) finds the most differentiation
from anything else on the market.

### Visual UI Concept

**Surface Layer — The Chronicle**
An editorial, paper-like surface. Not a notes app, not a spreadsheet. A chronological
journal with rich media support (charts, fund snapshots, macro context captures).

Each entry has an automatic context block injected by the system:
```
  May 14, 2026 — 09:42

  Portfolio State at Entry Time:
  Real return (YTD): +6.2%  ·  CPI context: 38.4%  ·  Dominant position: GAF-A (22%)

  ─────────────────────────────────────────────────────────────────

  [User's written entry appears here]

  Linked positions: GAF-A, AKB-K
  Linked macro events: CBRT Rate Decision (May 13)
  Tagged: #rebalancing #inflation-hedge #conviction
```

The automatic context block is the key differentiator. Years later, reading back through
the journal, the user has the full financial environment of each decision — not just their words.

**Depth Layer — Decision Outcomes**
Each journal entry that references a position decision gains an automatic "Outcome" block
that updates over time:
```
  Decision: Added GAF-A (May 14, 2026)

  Outcome Tracking:
  30-day real return since entry:   +1.8%
  90-day real return since entry:   +4.2%
  Current real return since entry:  +6.1% ✓ Thesis confirmed
```

This creates a closed-loop accountability system — the user's investment thesis is
measured against reality, automatically.

**Entry Types**
- **Decision Record:** Documenting a buy/sell/rebalance decision and the reasoning
- **Thesis Note:** Long-form thesis for a fund or macro position (no action taken yet)
- **Reflection:** Periodic (weekly/monthly) portfolio review in the user's own words
- **Pinned Insight:** Saved AI brief item or macro event (from Modules 5 and 6)
- **Comparison Snapshot:** Saved fund comparison from Module 3

### Data Requirements
- Journal entries: rich text (markdown-based), timestamps, user-authored content
- Automatic context injection: portfolio snapshot at entry time (cached daily state),
  linked macro events from Module 5, linked positions from Module 1
- Outcome computation: ongoing real return of any referenced positions since entry date
- **Privacy:** Journal entries are end-to-end encrypted and never used for AI training
  without explicit user consent — must be stated clearly in onboarding

### Key Interaction Models
- **Quick Capture:** Keyboard shortcut from anywhere in the app opens a floating
  journal entry composer — context is auto-populated from the current view
- **Timeline Navigation:** Vertical timeline on the left; entries grouped by month;
  jump to any period
- **Tag System:** User-defined tags with auto-suggest; tags become filterable across all entries
- **Export:** Full journal export as formatted PDF — typeset beautifully, not raw data dump
- **Retrospective Mode:** "Show me all entries where I mentioned this fund" — search
  across entry text, linked positions, and tags

---

## Cross-Module Integration Map

```
  Portfolio (M1) ←──────────────────── provides context to ──────────────────→ AI Brief (M6)
       ↑                                                                              ↓
       │                                                                    routes actions to
       │                                                                              ↓
  Fund Explorer (M2) ──── feeds ────→ Comparison Engine (M3)         Watchlists (M7)
       │                                      │                              ↑
       │                                      │                    triggers alerts from
       └──── fund data ────→ Analytics (M4) ──┘                              │
                                   ↑                                   Macro Feed (M5)
                                   │                                         ↑
                              CPI + history                           TCMB / TÜİK data
                                   │
                              Journal (M8) ←── captures decisions from ── all modules
                                   │
                              outcome tracking feeds back to Portfolio (M1)
```

---

## Navigation Architecture

The shell navigation spine follows these principles:
- **Six top-level destinations maximum** — no mega-menus, no nested sub-navigation
- **Persistent ambient context bar** — always shows real portfolio return (today) and
  CPI delta in a single line at the top; never competes with module content
- **Command palette** (⌘K) for power navigation — search funds, jump to position,
  create journal entry, set alert — without touching the mouse

```
  Left Spine (collapsed by default on desktop, icon-only):
    ○  Portfolio          (M1)
    ○  Explore Funds      (M2 + M3)
    ○  Analytics          (M4)
    ○  Intelligence       (M5 + M6 combined)
    ○  Watchlists         (M7)
    ○  Journal            (M8)
    ─────────────────────
    ○  Settings
    ○  Profile
```

---

## Empty & Loading State Design Mandates

Each module must define its zero-state experience:

| Module | Empty State Concept |
|---|---|
| Portfolio (M1) | Atmospheric onboarding prompt — "Begin with your first position" with a calm illustration of the wealth canvas waiting to be filled |
| Fund Explorer (M2) | Constellation view renders with ghost/skeleton funds; filters are available immediately |
| Comparison (M3) | "Drag funds here to compare" — the stage is visible but empty, inviting action |
| Analytics (M4) | Shows CPI history alone as a reference line with a prompt to add portfolio data |
| Macro Feed (M5) | Shows today's date with "Watching for macro events relevant to your portfolio" |
| AI Brief (M6) | First-run: "Your brief will be ready tomorrow morning — here's what we'll be watching" |
| Watchlists (M7) | "Nothing on watch yet" with a direct link to Fund Explorer |
| Journal (M8) | A single prompt: "Record your first investment decision" with today's context auto-populated |
