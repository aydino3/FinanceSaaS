# Component Inventory Specification

> The authoritative reference for every reusable UI component in the platform.
> Each component specification is a binding contract — implementation must satisfy
> every behavioral, accessibility, and motion rule defined here before the component
> is considered complete.
>
> Cross-reference: All color tokens, spacing values, elevation levels, and motion
> presets referenced here are defined in `DESIGN_SYSTEM.md`. All layout contexts
> referenced here are defined in `INFORMATION_ARCHITECTURE.md`.

---

## Component Philosophy

### The Three Component Laws

**Law 1 — Components do not own their data.**
Every component receives data as props or through a clearly defined slot. No component
fetches its own data (no `fetch` calls, no direct store reads inside presentational
components). Data concerns belong to page-level Server Components or dedicated hooks.

**Law 2 — Every state is a first-class design moment.**
Loading, empty, error, hover, active, disabled, and focused states are specified for
every component. A component without a defined loading state is incomplete. There is no
"we'll handle that later" — unspecified states become embarrassing defaults in production.

**Law 3 — Motion communicates, it does not decorate.**
Every animation in a component must map to one of three purposes:
- **Orientation** — helping the user understand spatial relationships
- **Feedback** — confirming an interaction occurred
- **Delight** — a single moment of surprise that reinforces brand quality

If an animation cannot be assigned to one of these three purposes, it is removed.

---

## Component Registry

| Component | Category | Complexity | Module(s) |
|---|---|---|---|
| `CinematicCard` | Layout / Container | High | All |
| `FundChart` | Data Visualization | Very High | M2, M3, M4 |
| `PortfolioGraph` | Data Visualization | Very High | M1, M4 |
| `AIInsightPanel` | Content Display | High | M6 |
| `CommandPalette` | Navigation / Overlay | Very High | Global |
| `SearchOverlay` | Navigation | High | Global |
| `MetricCounter` | Typography / Animation | Medium | M1, M4, M6 |
| `NavigationShell` | Layout | Very High | Global |

---

---

# 1. CinematicCard

## Purpose

`CinematicCard` is the foundational surface component of the design system. It is not a
generic "card" — it is a spatially-aware container that responds to mouse proximity and
position with a subtle ambient lighting effect, creating the perception that light exists
within the interface. This effect is the primary mechanism for expressing the platform's
depth-layered aesthetic.

Every elevated content container in the platform is a `CinematicCard` at some elevation
level. It is the building block for fund cards, position rows, insight panels, watchlist
items, and comparison surfaces.

---

## Props Philosophy

```
CinematicCard {

  // ─── Elevation & Surface ───────────────────────────────────────
  elevation
    Type:     1 | 2 | 3 | 4
    Default:  1
    Purpose:  Maps directly to the elevation system in DESIGN_SYSTEM.md.
              Controls background color, border opacity, shadow depth, and blur.
              The component renders the correct visual treatment for each level —
              consumers do not manually set backgrounds or shadows.

  variant
    Type:     "default" | "glass" | "inset" | "ghost"
    Default:  "default"
    Purpose:
      "default"  — Solid surface, bg-surface color, standard border
      "glass"    — Glassmorphic treatment, backdrop blur, for floating contexts
      "inset"    — Recessed surface (bg-inset), for chart containers and code areas
      "ghost"    — No background, border only, for subtle grouping without depth

  // ─── Ambient Lighting ──────────────────────────────────────────
  ambientLight
    Type:     boolean
    Default:  true for elevation ≥ 2, false for elevation 1
    Purpose:  Enables or disables the mouse-follow ambient glow effect.
              Always disabled on mobile (no hover intent).
              Always disabled when prefers-reduced-motion is active.

  ambientColor
    Type:     "accent" | "positive" | "negative" | "neutral" | string (hex)
    Default:  "accent"
    Purpose:  The hue of the ambient glow. "accent" uses the signature amber.
              "positive" and "negative" are used on fund performance cards to
              reinforce semantic meaning through ambient light color.
              Raw hex is for special cases only — not a general escape hatch.

  ambientIntensity
    Type:     "subtle" | "moderate" | "strong"
    Default:  "subtle"
    Purpose:  Controls the maximum opacity of the ambient glow at cursor center.
              subtle   → max opacity 0.06
              moderate → max opacity 0.10
              strong   → max opacity 0.16 (use sparingly — large feature cards only)

  // ─── Interaction ───────────────────────────────────────────────
  interactive
    Type:     boolean
    Default:  false
    Purpose:  When true, applies hover elevation lift (elevation + 1 visual treatment)
              and cursor: pointer. Does not add onClick — consumers handle that.
              Interactive cards also get a stronger border on hover.

  selected
    Type:     boolean
    Default:  false
    Purpose:  Selected state — left-border accent line + slightly elevated background.
              Used for selected fund in comparison tray, selected position in portfolio.

  disabled
    Type:     boolean
    Default:  false
    Purpose:  Reduces opacity to 0.38, removes pointer events, disables ambient light.

  // ─── Layout ────────────────────────────────────────────────────
  padding
    Type:     "none" | "compact" | "default" | "relaxed"
    Default:  "default"
    Purpose:
      "none"    → 0px (consumer handles all internal spacing)
      "compact" → space-4 (16px)
      "default" → space-6 (24px)
      "relaxed" → space-8 (32px)

  radius
    Type:     "sm" | "md" | "lg" | "xl" | "none"
    Default:  "lg" (12px)
    Purpose:  Override border radius for specific contexts.

  fullHeight
    Type:     boolean
    Default:  false
    Purpose:  height: 100% — for cards in equal-height grid rows.

  // ─── Slots ─────────────────────────────────────────────────────
  children
    Type:     ReactNode
    Required: true

  header
    Type:     ReactNode
    Default:  undefined
    Purpose:  Rendered above children with a hairline border below.
              Maintains fixed header while children scroll (when scrollable = true).

  footer
    Type:     ReactNode
    Default:  undefined
    Purpose:  Rendered below children with a hairline border above.

  scrollable
    Type:     boolean
    Default:  false
    Purpose:  Children area becomes overflow-y: auto with styled scrollbar.
}
```

---

## Animation Behaviors

### Ambient Lighting Effect

**Mechanism:** A radial gradient overlay, absolutely positioned, tracks the cursor position
within the card boundary. The gradient origin is the cursor position, expressed as
percentage coordinates relative to the card's bounding box.

**Gradient formula:**
```
background: radial-gradient(
  300px circle at {cursor_x}% {cursor_y}%,
  {ambientColor at ambientIntensity opacity},
  transparent 70%
)
```

**Enter behavior (cursor enters card boundary):**
- Gradient fades in: opacity 0 → ambientIntensity, duration 400ms, ease-out-circ
- Gradient position immediately follows cursor (no spring — spring would feel wrong here,
  this should feel like light, which moves at the speed of cursor)

**Move behavior (cursor within card):**
- Gradient position: direct follow with no transition (instant, matches cursor exactly)
- This immediacy is what makes it feel like physical ambient light rather than a lag effect

**Exit behavior (cursor leaves card boundary):**
- Gradient fades out: opacity ambientIntensity → 0, duration 600ms, ease-out-circ
- Position freezes at last known position during fade (does not chase cursor to edge)

**Border response:**
- On cursor enter: border opacity transitions from default to border-strong value
  Duration: 300ms, ease-out-circ
- This creates a subtle "the card knows you're there" feeling without any movement

### Interactive Card Hover

When `interactive = true`, additionally:
- Background: lightens by one half-step (bg-surface → midpoint between bg-surface and bg-surface-raised)
  Duration: micro (80ms), ease-out-circ
- Box-shadow: transitions from elevation-N to elevation-(N+1) shadow
  Duration: 150ms, ease-out-circ
- No scale transform — scaling cards is a web3/crypto aesthetic pattern, forbidden here

### Mount Animation

`CinematicCard` does not animate itself on mount. The parent is responsible for mount
animation (via `staggerContainer` + `fadeSlideUp` presets). This preserves clean
composition — the card does not know when it enters the scene.

### Selected State Transition

When `selected` toggles:
- Left border: appears with a clip-path reveal from top to bottom, 200ms, ease-out-expo
- Background: transitions to slightly more elevated value, 150ms, ease-out-circ

---

## Responsive Adaptation

```
Desktop (≥ 1024px):
  Ambient light effect: ENABLED
  Hover interactions: ENABLED
  Default padding: space-6 (24px)

Tablet (768–1023px):
  Ambient light effect: DISABLED (no reliable hover on touch devices)
  Hover interactions: DISABLED
  Default padding: space-5 (20px)

Mobile (< 768px):
  Ambient light effect: DISABLED
  Hover interactions: DISABLED
  Default padding: space-4 (16px)
  Border radius: reduced by one step (radius-lg → radius-md)
```

Detection method: CSS `@media (hover: hover)` for hover capability, not viewport width.
A tablet with a mouse should get the hover experience. An iPad without one should not.

---

## Accessibility

```
Role:         Depends on usage context:
              - As a static container: role="region" with aria-label (if meaningful)
              - As a clickable item: rendered as <button> or wrapped in <Link>
              - As a list item: role="listitem" (parent must be role="list")
              - As an informational panel: role="article" (for AI insight panels)

Focus:        When interactive = true:
              - Must be focusable (tabIndex="0" if not a native button/link)
              - Focus ring: 2px solid accent-400, offset 2px
              - Keyboard: Enter and Space trigger click handler

Ambient light: aria-hidden="true" on the gradient overlay element
              Never conveys information — purely decorative

Selected:     aria-selected="true" when selected = true
              Pair with appropriate parent role (listbox, grid, etc.)

Reduced motion: Ambient light effect → disabled entirely
                Hover transitions → instant (0ms)
                Selected border → instant
```

---

## State Design

```
Loading state:
  Consumer renders a CinematicCard with no children and passes a skeleton
  as children. The card itself does not have a loading prop — the skeleton
  is a compositional concern, not a card concern. The skeleton maintains
  the card's exact dimensions to prevent layout shift.

Empty state:
  Consumer is responsible. CinematicCard renders whatever children it receives.
  Recommendation: center-align a single EmptyState component within the card.

Error state:
  Consumer renders an ErrorState component as children. Card visual is unchanged.
  Error does not alter card elevation, border, or color — the error is a content
  concern, not a surface concern.

Disabled state:
  opacity: 0.38 applied to entire card (including children)
  pointer-events: none
  Ambient light: disabled
  Hover transitions: disabled
  aria-disabled="true"
```

---

---

# 2. FundChart

## Purpose

`FundChart` renders a single fund's NAV history with a CPI overlay, making visible the gap
between nominal performance and real purchasing-power change. This is the platform's most
semantically loaded chart — the visual gap between the NAV line and the CPI line is the
primary story. Every design decision prioritizes the legibility of that gap.

Used in: Fund Profile (M2), Fund Comparison Engine (M3), Watchlist sparklines (M7).

---

## Props Philosophy

```
FundChart {

  // ─── Data ─────────────────────────────────────────────────────
  navSeries
    Type:     Array<{ date: string; nav: number }>
    Required: true
    Purpose:  The primary fund NAV time series. Dates as ISO strings.
              Minimum length: 2. Recommended: full period requested.

  cpiSeries
    Type:     Array<{ date: string; cpiIndex: number }>
    Default:  undefined
    Purpose:  CPI index values aligned to the same date range.
              When provided, an indexed version is computed:
              cpi_indexed[t] = (cpiSeries[t] / cpiSeries[0]) × navSeries[0].nav
              This transforms CPI into the same unit as NAV for overlay.
              When omitted, no CPI overlay is rendered.

  benchmarkSeries
    Type:     Array<{ date: string; value: number; label: string }>[]
    Default:  []
    Purpose:  Optional comparison series (BIST-100, gold, T-bill).
              Maximum 2 benchmark series per chart.
              Each series must carry a label for the legend.

  // ─── Display Configuration ────────────────────────────────────
  period
    Type:     "1M" | "3M" | "6M" | "1Y" | "2Y" | "3Y" | "custom"
    Default:  "1Y"
    Purpose:  The active display period. Controls which subset of navSeries
              is rendered and how x-axis ticks are labeled.

  periodTabs
    Type:     boolean
    Default:  true
    Purpose:  Renders the period selector tab row above the chart.
              When false, the parent controls period via the period prop.

  showCPI
    Type:     boolean
    Default:  true
    Purpose:  Toggles the CPI overlay. Only meaningful if cpiSeries is provided.

  showDeltaFill
    Type:     boolean
    Default:  true
    Purpose:  When true, fills the area between NAV and CPI lines:
              Positive delta (NAV above CPI): positive-bg fill
              Negative delta (NAV below CPI): negative-bg fill
              This fill is the most important visual element in the chart.

  showTooltip
    Type:     boolean
    Default:  true
    Purpose:  Enables the custom hover tooltip (disabled in sparkline mode).

  // ─── Appearance ────────────────────────────────────────────────
  variant
    Type:     "full" | "compact" | "sparkline"
    Default:  "full"
    Purpose:
      "full"      — Complete chart with axes, period tabs, legend, tooltip
      "compact"   — Axes and legend only (no period tabs). Used in fund rows.
      "sparkline" — Line only, no axes, no tooltip, no legend, no period tabs.
                    Height determined by container. Used in watchlists and list rows.

  height
    Type:     number (px)
    Default:  "full" → 320, "compact" → 160, "sparkline" → 28
    Purpose:  Explicit height override. Width is always 100% of container.

  // ─── Interaction ──────────────────────────────────────────────
  onPeriodChange
    Type:     (period: string) => void
    Default:  undefined
    Purpose:  Callback when user selects a period tab.
              Parent handles data fetching for the new period.

  onDataPointHover
    Type:     (point: { date: string; nav: number; cpi?: number }) => void
    Default:  undefined
    Purpose:  Callback on tooltip position change — for coordinating with
              external metric displays (e.g., updating the metric row above
              the chart when hovering over a specific date).

  // ─── Loading / Error ──────────────────────────────────────────
  isLoading
    Type:     boolean
    Default:  false

  error
    Type:     string | undefined
    Default:  undefined
}
```

---

## Animation Behaviors

### Mount — Path Draw Animation

On mount (or when `period` changes), the NAV line draws from left to right using an
SVG `stroke-dashoffset` animation:

```
Initial state:  stroke-dashoffset = total path length (line is invisible)
Final state:    stroke-dashoffset = 0 (line is fully visible)
Duration:       500ms (mount) | 350ms (period change)
Easing:         ease-out-expo [0.16, 1, 0.3, 1]
Sequence:       1. NAV line draws (0ms)
                2. CPI line draws (80ms delay after NAV starts)
                3. Benchmark lines draw (120ms delay)
                4. Delta fill area fades in (200ms delay, opacity 0→1, 300ms)
```

The CPI line draws slightly after NAV — this stagger is meaningful. The user sees the NAV
performance first, then the inflation context appears, making the gap legible as a comparison
rather than as simultaneous noise.

### Period Change Transition

When period changes (tab click or prop change):

```
1. Existing curves fade out: opacity 1→0, 150ms, ease-in-expo
2. Axes reflow: y-axis scale adjusts (no animation — instant reflow)
3. New curves draw in: path draw animation, 350ms, ease-out-expo, 50ms delay
```

The 50ms gap between fade-out and draw-in prevents visual collision.

### Tooltip Appearance

The custom tooltip (FundChartTooltip) uses a crosshair cursor line:
```
Cursor line:    Vertical hairline at cursor x-position
                opacity 0→1 on first hover, 100ms, ease-out-circ
                Follows cursor with no transition (must feel like a physical cursor)
Tooltip panel:  Appears adjacent to cursor line
                Mount: opacity 0→1, 100ms, ease-out-circ
                Repositions horizontally to avoid viewport edge clipping
                NO animation on position change — it tracks the cursor instantly
```

### Delta Fill Region

The filled area between NAV and CPI lines is a dynamic computed path. When the lines cross
(NAV goes below CPI or vice versa), the fill color transitions:

```
Color change at crossover point:
  The fill is actually two separate area segments — one for positive delta, one for negative
  They share the same path but have different fill colors
  No animation on color change (the data is what it is — animation would be misleading)
```

---

## Responsive Adaptation

```
Desktop (≥ 1024px):
  variant "full": height 320px, all features enabled
  Period tabs: horizontal row above chart
  Y-axis: 5 ticks, right-aligned labels
  X-axis: 3 labels (start, mid, end)
  Tooltip: enabled

Tablet (768–1023px):
  height 280px
  Period tabs: same, slightly smaller
  All features enabled

Mobile (< 768px):
  height 200px
  Period tabs: scrollable horizontal chip row (overflow-x: auto, no visible scrollbar)
  Y-axis: 3 ticks
  Tooltip: rendered as a sticky bottom panel (not cursor-following — unreliable on touch)
           Shows data for the touched x-position
  Delta fill: retained (most important visual element, never removed)
```

---

## Accessibility

```
Role:         role="img" with aria-label describing the chart content
              e.g., "GAF-A fund NAV history chart, 1 year period.
              Nominal return: +68%. Real return above CPI: +4.2%."

Data table:   A visually hidden <table> element contains the chart data
              (date, NAV, CPI for each data point) for screen reader access
              Toggled visible via: "View as table" link beneath chart

Period tabs:  role="tablist" with role="tab" children
              aria-selected on active tab
              Keyboard: arrow keys navigate tabs

Tooltip:      aria-live="polite" region that announces values on cursor move
              Throttled to 500ms to prevent announcement flood
              Content: "May 14 2026: NAV +71.4%, Real return +6.2% above CPI"

Color meaning: Never rely solely on color (delta fill color = gain vs. loss)
              Each fill region has a subtle pattern texture (diagonal lines at 5% opacity)
              as a secondary non-color differentiator for color-blind users

Reduced motion:
  Path draw animation → instant (strokeDashoffset = 0 immediately)
  Period change → instant crossfade (no draw animation)
  Tooltip → instant appearance
```

---

## State Design

```
Loading state:
  Chart container maintains its configured height
  Renders: axes lines + gridlines (static, no data) with skeleton shimmer overlay
  Period tabs: rendered but non-interactive (pointer-events: none, opacity: 0.5)
  The axes being present during loading sets the spatial expectation before data arrives

Empty state (navSeries length < 2):
  Renders: axes + gridlines + a flat horizontal line at the midpoint
  Center text: "Insufficient history — data available from [earliest_date]"
  Period tabs: only periods with sufficient data are enabled; others are visually muted

Error state:
  Renders: axes + gridlines (structural elements preserved to maintain dimensions)
  Center overlay: ⚠ [error message] + [Retry] button
  Error is contained — does not affect surrounding layout

Sparkline loading:
  Renders a flat horizontal line at 50% height with shimmer
  Width: 100% of container, Height: matches variant height
```

---

---

# 3. PortfolioGraph

## Purpose

`PortfolioGraph` is the Chronicle Chart described in `INFORMATION_ARCHITECTURE.md` —
the platform's signature visualization. It renders the user's total portfolio real return
over time as a layered area chart where:

- The bottom filled layer is CPI (the adversary — rose tinted area)
- The middle line is portfolio nominal return
- The top layer is the real return band — emerald where above CPI, rose where below

The visual gap between real return and CPI is the primary story of the entire platform,
made permanently visible as a spatial area rather than a number.

Used in: Portfolio Page (M1), Analytics Dashboard (M4).

---

## Props Philosophy

```
PortfolioGraph {

  // ─── Data ─────────────────────────────────────────────────────
  portfolioReturnSeries
    Type:     Array<{ date: string; nominalReturn: number; realReturn: number }>
    Required: true
    Purpose:  Portfolio return time series — both nominal and real.
              Values are cumulative returns from portfolio inception or period start
              (not daily returns). Expressed as decimals: 0.712 = +71.2%

  cpiSeries
    Type:     Array<{ date: string; cumulativeCPI: number }>
    Required: true
    Purpose:  Cumulative CPI growth over the same period.
              Always required — a PortfolioGraph without CPI context is
              a different product and is not supported.

  benchmarks
    Type:     Array<{
                id: string;
                label: string;
                series: Array<{ date: string; value: number }>;
                color?: string;
                enabled: boolean;
              }>
    Default:  []
    Purpose:  Optional benchmarks (BIST-100, gold, T-bill, USD/TRY).
              Maximum 3 active benchmarks simultaneously.
              enabled controls visibility — all are present in data for toggle performance.

  // ─── Period & Range ───────────────────────────────────────────
  period
    Type:     "1M" | "3M" | "6M" | "1Y" | "2Y" | "3Y" | "inception" | "custom"
    Default:  "1Y"

  customRange
    Type:     { from: string; to: string } | undefined
    Default:  undefined
    Purpose:  Active only when period = "custom". ISO date strings.

  brushEnabled
    Type:     boolean
    Default:  true (Analytics page) | false (Portfolio page summary)
    Purpose:  Renders a brush/scrubber control below the main chart.
              Dragging the brush updates the visible range without changing the period.
              The brush is a smaller version of the same chart at 40px height.

  // ─── Annotation Layer ─────────────────────────────────────────
  annotations
    Type:     Array<{
                date: string;
                type: "position_add" | "position_remove" | "rebalance" | "journal";
                label: string;
                journalEntryId?: string;
              }>
    Default:  []
    Purpose:  User-defined markers on the timeline (from Journal Module 8).
              Rendered as subtle vertical tick marks on the x-axis.
              Hovering reveals a small annotation card.

  // ─── Appearance ───────────────────────────────────────────────
  variant
    Type:     "chronicle" | "compact"
    Default:  "chronicle"
    Purpose:
      "chronicle" — Full implementation with all layers, brush, annotations
      "compact"   — Simplified: real return line + CPI line only, no brush, no annotations
                    Used in Dashboard home as portfolio snapshot

  height
    Type:     number
    Default:  360 ("chronicle") | 160 ("compact")

  // ─── What-If Mode ─────────────────────────────────────────────
  whatIfExclusions
    Type:     string[] (instrument codes)
    Default:  []
    Purpose:  When non-empty, renders the chart with a secondary "what-if" return series
              that excludes the specified positions from the historical calculation.
              The excluded positions' contribution is shown as a subtle dashed counterfactual.
              Used in: Analytics depth layer (M4).

  // ─── Interaction ──────────────────────────────────────────────
  onRangeChange
    Type:     (range: { from: string; to: string }) => void
    Default:  undefined
    Purpose:  Fired when brush range changes. Parent recomputes metrics for new range.

  onAnnotationClick
    Type:     (annotation: Annotation) => void
    Default:  undefined
    Purpose:  Navigate to journal entry or position detail.

  isLoading
    Type:     boolean
    Default:  false

  error
    Type:     string | undefined
}
```

---

## Animation Behaviors

### Mount — Layered Reveal

The chart layers reveal in a meaningful sequence that tells the story:

```
Step 1 (0ms):       Gridlines and axes appear instantly (structural skeleton)
Step 2 (100ms):     CPI area fills in from left (the adversary establishes itself first)
                    Duration: 600ms, ease-out-expo
                    Fill only — the line draws after the fill settles
Step 3 (400ms):     CPI line draws over the fill, left to right
                    Duration: 400ms, ease-out-expo
Step 4 (500ms):     Portfolio nominal return line draws, left to right
                    Duration: 500ms, ease-out-expo
Step 5 (800ms):     Real return band fills in (positive/negative delta areas)
                    Opacity 0→1, 400ms, ease-out-circ
                    This is the culminating visual moment — the gap becomes clear
Step 6 (1000ms):    Benchmark lines draw (if enabled), staggered at 100ms each
Step 7 (1200ms):    Annotation ticks fade in simultaneously
                    Duration: 200ms, ease-out-circ
```

**Total sequence: ~1400ms** — deliberate and expressive. This is a first-load moment.
On period/range changes, a faster variant is used (all steps at 40% of above durations).

### Brush Scrubber Interaction

```
Brush handles:  Drag with spring physics (stiffness 400, damping 40)
                — this is direct manipulation, spring is appropriate
Selected range: Both the main chart and brush update synchronously
                No lag between brush and main chart (same state, one render cycle)
Range labels:   Floating above brush handles, fade in on drag start (opacity 0→1, 100ms)
                Fade out 2 seconds after drag ends
```

### What-If Mode

When `whatIfExclusions` changes from empty to non-empty:
```
Existing chart dims: overall opacity 1.0 → 0.7, 200ms
Counterfactual line appears: draws in from left, 400ms, ease-out-expo
                             Color: neutral-text at 60% opacity, dashed
The visual tells the user: "the solid line is what happened; the dashed line is what would have"
```

### Annotation Markers

```
Marker reveal (on mount): fade in after all chart lines are drawn (1200ms delay)
Marker hover: small card scales in from the marker point (origin: bottom-center)
              scale 0.85→1.0, opacity 0→1, 200ms, ease-out-expo
              Journal type annotations: card shows entry excerpt (first 80 chars)
```

---

## Responsive Adaptation

```
Desktop:
  height: 360px ("chronicle"), 160px ("compact")
  Brush: 40px height below main chart, 8px gap
  Y-axis: right-aligned, 5 ticks
  Annotations: visible ticks with hover cards

Tablet:
  height: 280px ("chronicle")
  Brush: retained
  Annotations: retained

Mobile:
  height: 200px ("chronicle"), 120px ("compact")
  Brush: disabled on mobile (pinch-to-zoom replaces it — see below)
  Pinch-to-zoom: two-finger pinch adjusts date range
  Double-tap: resets to default period
  Annotations: tick marks only, tap to reveal card (no hover)
  Y-axis: 3 ticks only
```

---

## Accessibility

```
aria-label:   "Portfolio real return chart. [Period]. Real return: [X]%.
               CPI inflation over period: [Y]%. Real return above/below CPI by [Z]%."
              Updated when period changes.

Data table:   Visually hidden table with columns: Date | Portfolio Return | CPI | Real Return
              "View as table" control beneath chart

Annotations:  Each annotation tick: role="button", aria-label="[type] on [date]: [label]"

Brush:        role="slider" with aria-valuemin, aria-valuemax, aria-valuenow
              Keyboard: arrow keys move brush handles by one data point

Benchmark toggles: role="checkbox" with aria-checked, aria-label
```

---

## State Design

```
Loading state:
  Gridlines and axes render immediately (structural)
  Over the chart area: a subtle skeleton shimmer at 60% chart height
  Brush renders as a muted flat bar (no data shape)
  Period tabs: rendered and interactive (period can be changed before data loads)

Empty state (no portfolio positions):
  CPI line renders alone (no portfolio data)
  Overlay: "Add positions to see your real return history"
           with CTA: [+ Add your first position]
  CPI-only chart is meaningful — it shows the adversary the portfolio needs to beat

Error state:
  Structural elements (gridlines, axes) preserved
  Centered overlay: ⚠ message + Retry

Partial data (portfolio data available, CPI data unavailable):
  Portfolio return line renders
  Where CPI would be: a muted placeholder dashed line at 0% (baseline)
  Tooltip: shows portfolio return only, notes "CPI data temporarily unavailable"
  Never silently omits the CPI context without communicating its absence
```

---

---

# 4. AIInsightPanel

## Purpose

`AIInsightPanel` renders a single insight from the Daily Brief or from the Signal stream.
It is the platform's most editorially considered component — a panel that must communicate
confidence, specificity, and explainability simultaneously. It carries:

- A primary insight statement (confident, no hedging language)
- Reasoning transparency (expandable — the data behind the insight)
- Affected positions (with direct navigation)
- Optional action CTA (conservative — only when genuinely recommended)

The component must never look like a "chatbot bubble" or a generic notification card.
It reads like a well-crafted analyst note — spatial, typographically deliberate, and calm.

---

## Props Philosophy

```
AIInsightPanel {

  // ─── Content ──────────────────────────────────────────────────
  insightNumber
    Type:     1 | 2 | 3 | undefined
    Default:  undefined
    Purpose:  When defined, renders a subtle ordinal indicator (1, 2, 3).
              Used in the Daily Brief to convey that this is a curated list.
              When undefined: standalone insight (e.g., in the signal feed).

  headline
    Type:     string
    Required: true
    Purpose:  The primary insight statement. Max 120 chars. No hedging language.
              Rendered in body-xl (18px) weight 400. This is NOT a title — it
              is a complete sentence that stands alone.

  body
    Type:     string
    Required: true
    Purpose:  2–4 sentences of context. Rendered in body-lg (16px) weight 400,
              line-height 1.6. Max 400 chars. Must be plain English, no jargon.

  reasoningSummary
    Type:     string
    Required: true
    Purpose:  The explainability layer — how this insight was derived.
              Shown only in the expanded state. Max 300 chars.
              Phrased as: "This insight was generated because [data observation]."

  // ─── Classification ───────────────────────────────────────────
  insightType
    Type:     SignalType (from AI_DATA_ARCHITECTURE.md)
    Required: true
    Purpose:  Used to render the correct type chip and icon.

  priority
    Type:     "critical" | "high" | "medium" | "low"
    Default:  "medium"
    Purpose:  Controls the visual weight of the panel.
              "critical" → left-border in negative-text, slightly elevated background
              "high"     → left-border in warning-text
              "medium"   → left-border in accent-400 (standard)
              "low"      → no left-border, ghost treatment

  confidence
    Type:     number (0–1)
    Required: true
    Purpose:  Rendered as a subtle confidence indicator below the reasoning.
              Not shown as a percentage — shown as a semantic label:
              ≥ 0.85 → "High confidence"
              0.65–0.84 → "Moderate confidence"
              < 0.65 → "Indicative" (insight still surfaces if threshold is met)

  // ─── Affected Positions ───────────────────────────────────────
  affectedPositions
    Type:     Array<{
                code: string;
                name: string;
                direction: "positive" | "negative" | "neutral";
                portfolioWeightPct?: number;
              }>
    Default:  []
    Purpose:  Fund/position chips rendered below body text.
              Chips are interactive — clicking navigates to the position in M1 or fund in M2.
              Direction controls chip color (positive → positive-text border, etc.)

  // ─── Action ───────────────────────────────────────────────────
  suggestedAction
    Type:     {
                type: "none" | "review_fund" | "rebalance" | "reduce_cash" | "add_watchlist"
                label: string;
                route: string;
              } | undefined
    Default:  undefined
    Purpose:  When defined and type ≠ "none", renders an action button.
              The action button is a ghost button — never a primary/filled button.
              Insight panels are advisory; they do not command.

  // ─── Interaction State ────────────────────────────────────────
  isExpanded
    Type:     boolean
    Default:  false
    Purpose:  Controls whether reasoning and confidence are visible.
              Controlled externally (parent manages expand state).

  onExpandToggle
    Type:     () => void
    Default:  undefined

  onFeedback
    Type:     (feedback: "positive" | "negative") => void
    Default:  undefined
    Purpose:  Thumbs up/down feedback. Negative feedback suppresses this SignalType.

  onDismiss
    Type:     () => void
    Default:  undefined
    Purpose:  Removes insight from current view. Does not suppress the signal type.

  // ─── Appearance ───────────────────────────────────────────────
  variant
    Type:     "brief" | "feed" | "compact"
    Default:  "brief"
    Purpose:
      "brief"   — Full editorial layout (used in Daily Brief, M6)
      "feed"    — Card format with border and elevation (used in signal feed)
      "compact" — Condensed: headline + chips only (used in Dashboard home preview)

  isLoading
    Type:     boolean
    Default:  false
}
```

---

## Animation Behaviors

### Mount — Editorial Cascade

In "brief" variant, the three insights in the Daily Brief mount in sequence:

```
Each AIInsightPanel:
  Entry: fadeSlideUp (y: 12→0, opacity 0→1)
  Duration: 300ms, ease-out-expo
  Stagger between panels: 120ms
```

In "feed" variant:
```
Entry: fadeSlideUp, 250ms, ease-out-expo
No stagger (each panel is an independent feed item)
```

### Expand / Collapse (Reasoning Section)

```
Expand trigger: click on "See reasoning" or the insight panel body area
Reasoning section height: Framer Motion layout animation
  Open:  height 0 → auto, 300ms, spring (stiffness 280, damping 28)
  Close: height auto → 0, 200ms, ease-in-expo

Content within reasoning section:
  Open:  opacity 0→1, 200ms delay (after height starts opening), ease-out-circ
  Close: opacity 1→0, 80ms (immediately, before height closes)

Chevron icon:
  Rotates: 0→180deg (open) / 180→0deg (close)
  Duration: 200ms, ease-in-out-expo
```

### Affected Position Chips

On mount (after panel is visible):
```
Chips stagger in: opacity 0→1, y: 4→0
Duration: 150ms per chip
Stagger: 40ms between chips
Delay: 200ms after panel mount (chips are secondary to headline content)
```

### Feedback State

When user taps thumbs-up or thumbs-down:
```
Selected thumb: scale 1→1.2→1, duration 200ms, spring
Icon fill: transitions to filled state, 150ms
Unselected thumb: fades to opacity 0.3, 150ms
Feedback confirmation text: fades in below buttons, 200ms
              "Noted — we'll surface more/fewer of these."
Panel after negative feedback: opacity 1→0.5, 300ms delay after confirmation
                                Does not remove immediately — acknowledges before hiding
```

### Dismiss Animation

```
Panel height collapses: height auto→0, 300ms, ease-in-expo
Opacity: 1→0, 200ms simultaneously
Surrounding panels: Framer Motion layout animation re-flows the remaining content
```

---

## Responsive Adaptation

```
Desktop:
  "brief" variant: max-width 720px, centered
  Reasoning section: full width
  Chips: horizontal row, wrapping

Mobile:
  max-width: 100%
  Feedback controls: larger tap targets (min 44px height)
  Chips: horizontal scrollable row (overflow-x: auto) — do not wrap on mobile
  Action button: full-width
  Dismiss: swipe-left gesture alternative (SwipeToDelete pattern)
```

---

## Accessibility

```
Role:         role="article" for "brief" and "feed" variants
              role="listitem" when inside a list of insights

Expand:       The expand trigger has aria-expanded and aria-controls pointing to
              the reasoning section's id. The reasoning section has role="region".

Feedback:     role="group" with aria-label="Insight feedback"
              Each button: aria-label="This insight was helpful" / "Not helpful"
              After selection: aria-label updates to "Marked as helpful — thank you"

Priority:     Priority level communicated via aria-label of the panel:
              "High priority insight: [headline]"

Dismiss:      aria-label="Dismiss this insight"
              After dismiss: focus moves to the next insight or to a confirmation

Screen reader order:
  1. Priority indicator (if critical/high)
  2. Type chip
  3. Headline
  4. Body
  5. Affected positions
  6. Expand reasoning control
  7. Action button (if present)
  8. Feedback controls
```

---

---

# 5. CommandPalette

## Purpose

The global command interface. Activated via `⌘K` (Mac) / `Ctrl+K` (Windows/Linux) or
the search trigger in the navigation shell. It is the power-user's primary navigation
tool — faster than any sidebar click, more contextual than a standard search page.

The palette must feel like a native OS component: instant response to keystrokes, smooth
physics on mount/unmount, and results that feel like they are pre-computed (even when
fetching asynchronously). The aesthetic is a floating lens — it focuses without replacing.

---

## Props Philosophy

```
CommandPalette {

  // ─── State ────────────────────────────────────────────────────
  isOpen
    Type:     boolean
    Required: true
    Purpose:  Controlled externally via keyboard shortcut handler (global event listener).

  onClose
    Type:     () => void
    Required: true

  // ─── Context Injection ────────────────────────────────────────
  portfolioContext
    Type:     { positions: Array<{ code: string; name: string }> } | undefined
    Default:  undefined
    Purpose:  When provided, injects the user's current positions as a priority
              result category ("Your positions") above the general fund search.
              Enables "type 'GAF' and immediately see your GAF-A holding" behavior.

  currentRoute
    Type:     string
    Default:  ""
    Purpose:  The active Next.js pathname. Used to contextually boost certain
              result types (on /explore → fund results ranked higher;
              on /journal → journal entry results ranked higher).

  // ─── Result Handlers ──────────────────────────────────────────
  onNavigate
    Type:     (route: string) => void
    Required: true
    Purpose:  Called when user selects a navigation result. Parent handles routing.

  onAction
    Type:     (actionId: string, payload?: object) => void
    Default:  undefined
    Purpose:  Called when user selects an action result.
              Actions: "add_position", "new_journal_entry", "new_watchlist",
                       "open_settings", "export_journal"

  // ─── Appearance ───────────────────────────────────────────────
  placeholder
    Type:     string
    Default:  "Search funds, positions, pages..."
    Purpose:  The input placeholder text. Changes based on currentRoute context.
}
```

---

## Animation Behaviors

### Mount (Palette Opens)

```
Backdrop:
  opacity: 0 → 0.6 (rgba black)
  blur: 0 → 4px (backdrop-filter on the page behind)
  Duration: 200ms, ease-linear
  Note: blur on the BACKGROUND, not on the palette itself

Palette panel:
  scale: 0.96 → 1.0
  opacity: 0 → 1
  y: -8 → 0 (slight upward origin)
  Duration: 220ms, ease-out-expo [0.16, 1, 0.3, 1]
  These two properties animate simultaneously

Input field:
  Receives focus immediately after mount animation starts (no delay)
  The cursor is already in the field before the animation completes

Default results (recent + quick actions):
  Stagger in: opacity 0→1, y: 4→0
  Duration: 120ms per item
  Stagger: 20ms between items
  Start: 80ms after palette mount begins
```

### Unmount (Palette Closes)

```
Palette:
  scale: 1.0 → 0.96
  opacity: 1 → 0
  Duration: 150ms, ease-in-expo (faster than mount — dismissal should feel snappy)

Backdrop:
  opacity: 0.6 → 0
  blur: 4px → 0
  Duration: 150ms, ease-linear
  Slightly outlasts palette fade for a clean reveal
```

### Search Results Transition

As user types, results update. The transition must feel like refinement, not replacement:

```
Departing results: opacity 1→0, y: 0→-4, duration: 100ms, ease-in
New results:       opacity 0→1, y: 4→0, duration: 150ms, ease-out, 80ms delay
                   Stagger: 15ms between items (fast — results should feel instant)

If result count changes:
  Container height: Framer Motion layout animation, spring (stiffness 300, damping 30)
  This prevents jarring height jumps between result sets
```

### Keyboard Navigation Highlight

```
Selection moves between items: the highlight translates vertically
  The highlight is a background fill element (not opacity on text)
  It slides from previous position to new position using layout animation
  Duration: 100ms, ease-in-out-expo
  This "sliding pill" effect is the signature interaction of the palette
```

---

## Result Categories and Ordering

```
Category priority (default):
  1. Your positions (if portfolioContext and query matches a position)
  2. Quick actions (if query is empty or matches action keywords)
  3. Funds (if query matches fund codes or names)
  4. Pages (navigation targets)
  5. Journal entries (if query matches content)
  6. Macro events (if query matches event descriptions)

Each result item anatomy:
  [Type icon (16px)]  [Primary label]          [Secondary context]  [Shortcut badge?]
  Example fund:
  [◎ circle]          GAF-A                    Hisse · +68.4% YTD  [Enter ↵]

  Example action:
  [+ plus]            New journal entry        Journal             [⌘J]

  Example page:
  [◆ nav icon]        Analytics Dashboard      /analytics

Category headers: label-sm, uppercase, text-tertiary, no separator line
                  (the category label is enough — a line would be visual noise)
```

---

## Responsive Adaptation

```
Desktop (≥ 768px):
  Width: 560px, fixed
  Max height: 480px (scrollable results below)
  Position: centered horizontally, 15% from top (vertical golden ratio)
  Backdrop: full-screen blur overlay

Mobile (< 768px):
  Position: bottom sheet (not a centered overlay)
  Width: 100%
  Border-radius: radius-2xl at top, 0 at bottom
  Height: 85vh maximum
  Input: at top of sheet
  Results: below input, full height
  Mount animation: slide up from bottom (panelSlideUp preset)
  Dismiss: swipe down or tap backdrop
```

---

## Accessibility

```
Role:         role="dialog" with aria-modal="true" and aria-label="Command palette"

Input:        role="combobox"
              aria-expanded="true" when open
              aria-autocomplete="list"
              aria-controls="[results-list-id]"
              aria-activedescendant="[selected-item-id]"

Results list: role="listbox" with id matching aria-controls
              Each result: role="option" with unique id
              Selected result: aria-selected="true"

Backdrop:     Clicking backdrop closes palette (aria-hidden="true" on backdrop element)

Focus trap:   While palette is open, Tab cycles within palette only
              Shift+Tab reverses cycle
              Escape closes palette, returns focus to the triggering element

Screen reader: On open: announces "Command palette open. [N] recent items shown."
               On query change: announces "[N] results for [query]" via aria-live="polite"
               On selection: route change or action confirmation announced
```

---

---

# 6. MetricCounter

## Purpose

`MetricCounter` renders a financial metric (currency amount, percentage, ratio) with a
kinetic count-up animation on mount and a smooth cross-fade transition when the value
changes. It is the component responsible for the "portfolio value counting up" moment
that is one of the platform's primary delight interactions.

The animation serves a purpose (orientation — confirming data has loaded and computed)
not just decoration. It must feel weighty and precise, like a real-time calculation
resolving to a final answer.

---

## Props Philosophy

```
MetricCounter {

  // ─── Value ────────────────────────────────────────────────────
  value
    Type:     number
    Required: true
    Purpose:  The numeric value to display. Raw number — formatting is handled
              by the component based on format prop.

  previousValue
    Type:     number | undefined
    Default:  undefined
    Purpose:  When provided and different from value, triggers a cross-fade
              transition from previousValue to value instead of a count-up.
              Used when refreshing data in an already-mounted component.

  // ─── Formatting ───────────────────────────────────────────────
  format
    Type:     "currency_try" | "currency_usd" | "percent" | "percent_signed"
              | "ratio" | "number" | "compact"
    Required: true
    Purpose:
      "currency_try"    → ₺ 1.847.320    (Turkish notation, no decimals for large amounts)
      "currency_usd"    → $ 52,100       (US notation, for secondary context display)
      "percent"         → 68.4%          (no sign for absolute percentages)
      "percent_signed"  → +68.4% / -3.2% (always show sign, color-coded)
      "ratio"           → 1.42           (2 decimal places, no symbol)
      "number"          → 1,847          (integer, Turkish notation)
      "compact"         → ₺ 1.8M / ₺ 450B (abbreviated for space-constrained contexts)

  decimalPlaces
    Type:     number
    Default:  Inferred from format (percent → 1, ratio → 2, currency_try → 0 for >100K)
    Purpose:  Override the inferred decimal precision.

  // ─── Semantic Color ───────────────────────────────────────────
  semantic
    Type:     "auto" | "positive" | "negative" | "neutral" | "none"
    Default:  "auto"
    Purpose:
      "auto"     → Derive from value sign (positive value = positive color,
                   negative = negative, zero = neutral)
                   Only applies to "percent_signed" and values with meaningful sign
      "positive" → Always render in positive-emphasis color
      "negative" → Always render in negative-emphasis color
      "neutral"  → Always render in text-secondary
      "none"     → Always render in text-primary (no semantic coloring)

  // ─── Typography ───────────────────────────────────────────────
  size
    Type:     "display" | "headline" | "body" | "caption"
    Default:  "headline"
    Purpose:  Maps to the type scale:
              "display"  → display-lg (44px, weight 400, tracking -0.025em)
              "headline" → headline-xl (32px, weight 500, tracking -0.02em)
              "body"     → body-lg (16px, weight 500, tracking 0)
              "caption"  → caption (13px, weight 400, tracking 0.01em)

  // ─── Animation ────────────────────────────────────────────────
  animate
    Type:     boolean
    Default:  true
    Purpose:  Enables/disables the count-up animation.
              Always false when prefers-reduced-motion is active (enforced internally).

  countUpDuration
    Type:     number (ms)
    Default:  800
    Purpose:  Duration of the count-up animation.
              Ignored when previousValue is provided (uses transition instead).

  countUpFrom
    Type:     number
    Default:  0
    Purpose:  Starting value for count-up. Default 0 creates the "computing from zero" feel.
              Set to previousValue for smooth value transitions.

  // ─── Prefix / Suffix ─────────────────────────────────────────
  prefix
    Type:     string | ReactNode | undefined
    Default:  Inferred from format (₺, $, etc.)
    Purpose:  Override the auto-prefix.

  suffix
    Type:     string | ReactNode | undefined
    Default:  Inferred from format (%, etc.)
    Purpose:  Override the auto-suffix.
              Both prefix and suffix remain static during count-up
              (only the number animates — symbol stability is important).
}
```

---

## Animation Behaviors

### Count-Up Animation

The count-up uses a custom easing function — not a library's built-in:

```
Easing curve:   ease-out-expo equivalent applied to value interpolation
                value(t) = targetValue × (1 - 2^(-10 × t/duration))
                where t is elapsed time in ms

This means the counter moves fast initially and decelerates to the final value,
creating the sense of a precise calculation landing on its answer.

Large values (> 1,000,000):
  Count up only the last 3 significant digits (others are instant)
  e.g., ₺ 1.847.320 — the 1.847 appears instantly, then 000→320 counts up
  This prevents the animation from being distracting for already-visible integers

Decimal animation:
  Decimals count separately after the integer settles
  Integer settles at countUpDuration × 0.85
  Decimals count from 0 to final in remaining 15% of duration
  Creates: "1.847.320" then ".45" — integer is the headline
```

### Value Transition (previousValue → value)

When value changes in a mounted component:

```
If value increased:
  The number counts from previousValue to value
  Color briefly intensifies (positive-emphasis) then settles to semantic color
  Duration: max(400ms, change_magnitude_scaled) — larger changes animate slightly longer
  Easing: ease-out-expo

If value decreased:
  Same as increased but with negative-emphasis flash
  Color: negative-emphasis briefly, then settles

If change is < 0.1% of previousValue:
  No animation (noise threshold — prevents micro-animation on insignificant ticks)
  Instant value swap
```

### Semantic Color Transitions

```
When semantic color changes (e.g., goes from positive to negative):
  Color cross-fades: duration 300ms, ease-out-circ
  This prevents a jarring snap from green to rose
```

---

## Responsive Adaptation

```
The size prop is fixed by the consumer. MetricCounter does not self-adapt.
Consumers are responsible for choosing the appropriate size for each breakpoint.

Recommendation pattern:
  Mobile:  size="body" or size="caption" for secondary metrics
  Desktop: size="headline" or size="display" for primary metrics
  Use responsive props at the consumer level, not within this component.
```

---

## Accessibility

```
aria-label:   "Portfolio value: 1 million 847 thousand 320 Turkish Lira"
              Full spoken-word value. Not the formatted string — the numeric value.
              Updated after each animation completes (not during — prevents announcement spam)

aria-live:    "polite" for routine updates (data refresh)
              "assertive" for CRITICAL signal triggered value changes (rare)

Count-up:     Screen readers do not announce intermediate values during count-up
              The aria-label is updated only at animation completion
              The animated element is aria-hidden="true" during animation;
              a sibling element with the final value (visually hidden) is aria-live

Reduced motion:
  animate = false (enforced)
  Value appears instantly at final value
  Color is applied immediately (no transition)
  aria-label set immediately (no delay)
```

---

---

# 7. NavigationShell

## Purpose

`NavigationShell` is the persistent application chrome that surrounds all authenticated
dashboard routes. It has fundamentally different implementations for desktop and mobile —
they are not responsive variants of the same component but two distinct interaction
models sharing a routing contract.

**Desktop:** A collapsible vertical navigation spine on the left, paired with a
persistent ambient context bar at the top. The spine collapses to icon-only (56px) and
expands to labeled (240px) on hover. It never overlaps content.

**Mobile:** A top bar with contextual page title and a fixed bottom tab bar with 5
primary destinations. Secondary destinations live in a spring-animated bottom sheet.
Navigation is always within thumb reach.

---

## Props Philosophy

```
NavigationShell {

  // ─── Routing State ────────────────────────────────────────────
  currentPath
    Type:     string
    Required: true
    Purpose:  Active Next.js pathname. Used to highlight active nav item,
              render breadcrumb (desktop), and page title (mobile).

  // ─── Context Bar Data ─────────────────────────────────────────
  contextMetrics
    Type:     {
                realReturnToday: number;
                realReturnYTD: number;
                cpiYOY: number;
                lastSyncAt: Date | undefined;
              } | undefined
    Default:  undefined
    Purpose:  The three data points shown in the ambient context bar.
              When undefined: context bar shows skeleton state.

  // ─── User ─────────────────────────────────────────────────────
  user
    Type:     {
                name: string;
                avatarUrl?: string;
                subscriptionTier: "free" | "premium" | "professional";
              }
    Required: true

  // ─── Configuration ────────────────────────────────────────────
  defaultExpanded
    Type:     boolean
    Default:  false (read from localStorage "nav_expanded")
    Purpose:  Initial expanded/collapsed state of desktop spine.
              Persisted to localStorage on toggle.

  onCommandPaletteOpen
    Type:     () => void
    Required: true
    Purpose:  Trigger to open the CommandPalette (⌘K button click).

  // ─── Notification State ───────────────────────────────────────
  alertCount
    Type:     number
    Default:  0
    Purpose:  Unread alert count. Displayed as a subtle badge on the
              notifications icon in the context bar (desktop) and the
              home tab on mobile.
              If 0: no badge. If > 9: shows "9+". Never shows "0".

  // ─── Children ─────────────────────────────────────────────────
  children
    Type:     ReactNode
    Required: true
    Purpose:  The page content rendered within the shell's content area.
}
```

---

## Desktop Animation Behaviors

### Spine Expand / Collapse

```
Expand (hover or toggle):
  Width: 56px → 240px
  Duration: 220ms, ease-out-expo
  Easing rationale: the spine should feel like it glides open, not snaps

  Labels (text + secondary info):
    Appear after width reaches ~60% of target: 120ms delay
    opacity 0→1, duration 150ms, ease-out-circ
    translateX: -8→0 (slight slide from left into position)

  Hover trigger has a 300ms delay before expanding:
    Prevents accidental expansion on cursor pass-through
    Delay resets immediately if cursor leaves before 300ms

Collapse (toggle or cursor leave):
  Labels disappear first: opacity 1→0, 80ms, no delay
  Width: 240px → 56px
  Duration: 180ms, ease-in-expo (slightly faster than expand — feels snappier)

  If cursor leaves before hover delay completes: no animation runs at all
```

### Active Indicator

```
The active indicator is a 2px left border that moves between nav items:
  The border is a single absolutely-positioned element that translates vertically
  When route changes: the indicator slides from the previous item's Y to the new item's Y
  Duration: 200ms, ease-in-out-expo
  This "sliding pill" motion is consistent with the CommandPalette selection behavior

  On initial mount (no previous item): indicator fades in without sliding
  Duration: 150ms, ease-out-circ
```

### Context Bar

```
Context bar mount: opacity 0→1, 300ms, ease-out
Metric values in context bar use MetricCounter with:
  size="caption", animate=true, countUpDuration=600

Data refresh (contextMetrics prop update):
  The three metrics cross-fade to new values using MetricCounter's transition behavior
  Last sync indicator: text updates instantly, color briefly turns to accent-400 then
  fades back to text-tertiary over 1 second (confirms data freshness)
```

---

## Mobile Animation Behaviors

### Tab Bar

```
Tab bar mount (first load):
  Slides up from y: 64→0 (its own height), duration 300ms, ease-out-expo
  50ms delay after page content begins mounting
  (Tab bar should appear to "settle" after the page content is in place)

Active tab indicator:
  A subtle dot above the active tab icon
  Transitions: same sliding pill approach as desktop, but horizontal
  Duration: 200ms, ease-in-out-expo

Tab icon tap:
  Scale: 1→0.85→1, duration 200ms, spring (stiffness 400, damping 20)
  This tactile feedback confirms the tap registered
```

### Bottom Sheet ("More" destinations)

```
Open:
  Backdrop: opacity 0→0.6, duration 250ms, ease-linear
  Sheet: y: 100%→0, spring (stiffness 200, damping 28)
  Items inside sheet: stagger in (30ms each), opacity 0→1, y: 8→0

Close (tap backdrop or drag down):
  Sheet: y: 0→100%, duration 280ms, ease-in-expo
  Backdrop: opacity 0.6→0, duration 280ms, ease-linear

Drag to dismiss (swipe down):
  Sheet follows finger position in real-time (direct manipulation)
  If released above 40% of sheet height: spring back to full open
  If released below 40%: spring to closed
  Release spring: stiffness 300, damping 30
```

### Mobile Top Bar Page Title

```
When route changes:
  Previous title: opacity 1→0, x: 0→-16, duration 150ms, ease-in-expo
  New title: opacity 0→1, x: 16→0, duration 200ms, ease-out-expo, 100ms delay
  The directional shift (left-to-right for drill-down, right-to-left for back)
  matches the page transition direction — spatial consistency
```

---

## Responsive Adaptation

```
Desktop (≥ 1024px):
  Left spine (position: fixed, left: 0, top: 40px, bottom: 0)
  Context bar (position: fixed, top: 0, left: 0, right: 0, height: 40px)
  Content area: margin-left: 56px (collapsed) or 240px (expanded), margin-top: 40px
  Content margin transitions in sync with spine width animation

Tablet (768–1023px):
  Same as desktop but spine is always collapsed (56px)
  No hover-to-expand behavior (hover is unreliable on tablets)
  Expand is toggle-only (click the collapse button)

Mobile (< 768px):
  Top bar (position: fixed, top: 0, left: 0, right: 0, height: 56px)
  Bottom tab bar (position: fixed, bottom: 0, left: 0, right: 0, height: 64px)
  Content area: padding-top: 56px, padding-bottom: 64px
  Safe area: padding-bottom: max(64px, 64px + env(safe-area-inset-bottom))
  Left spine: does not exist on mobile
```

---

## Accessibility

```
Landmark roles:
  Context bar:      role="banner" (top-of-page header landmark)
  Left spine:       role="navigation" aria-label="Main navigation"
  Mobile tab bar:   role="navigation" aria-label="Main navigation"
  Content area:     role="main"
  Bottom sheet:     role="dialog" aria-modal="true" when open

Nav items:
  Each item: role="link" or wrapped in <Link>
  Active item: aria-current="page"
  Keyboard: Tab navigates all items; no trap in nav (Tab moves to main content)
  Skip link: "Skip to main content" visually hidden, first focusable element in DOM

Context bar metrics:
  Wrapped in: aria-label="Portfolio context: real return today [X]%, CPI [Y]%"
  Live updates: aria-live="polite" — announces only on explicit refresh, not on tick

Bottom sheet (mobile):
  Focus trap while open
  Escape key closes sheet
  First focusable element receives focus on open
  On close: focus returns to the "More" tab button

Spine expand state:
  aria-expanded on the spine element
  On collapse: tooltips provide nav item labels (title attribute for native tooltip)
  On expand: labels are visible — tooltips suppressed to avoid redundancy

Alert badge:
  aria-label="[N] unread alerts" on the notifications icon
  When 0: element is visually hidden AND aria-hidden (not present to screen readers)
```

---

## State Design

```
Loading state (contextMetrics = undefined):
  Context bar: three metric positions show skeleton shimmer (same width as typical content)
  Spine/tab bar: fully rendered and interactive (navigation works before data loads)
  Content area: renders children (page-level loading is a page concern)

No alerts (alertCount = 0):
  Badge element is not rendered (not hidden — absent from DOM)
  aria-label on notifications icon: "Notifications"

Auth error / session expiry:
  NavigationShell detects 401 from any child's data fetch (via error boundary or global handler)
  Displays a non-blocking toast: "Your session has expired. Signing you out..."
  After 2 seconds: redirects to /login with next= param
  Does not show an error state in the shell itself
```

---

---

## Component Composition Rules

The following rules govern how these components are combined:

**Rule A — CinematicCard wraps, it does not compose with itself.**
Do not nest CinematicCard inside another CinematicCard unless the inner card is at
a higher elevation level. Nesting at the same elevation creates visual confusion
about spatial hierarchy.

**Rule B — Charts are always wrapped in a CinematicCard variant="inset".**
FundChart and PortfolioGraph are always rendered inside an inset card. The inset
treatment creates the recessed effect that makes charts feel like windows into data
rather than flat surfaces.

**Rule C — MetricCounter governs all animated numeric values.**
Any financial metric that updates, loads, or changes state uses MetricCounter.
Raw `<span>` elements with numbers are forbidden in the dashboard — they cannot
handle animation, semantic coloring, or accessibility correctly.

**Rule D — NavigationShell is never replicated.**
There is exactly one NavigationShell instance in the application, rendered in the
`(dashboard)/layout.tsx`. Page components receive NavigationShell's context
(current route, user) through React context, never through prop drilling.

**Rule E — AIInsightPanel never fetches its own data.**
The parent (Daily Brief page, signal feed) receives all signal data and passes it
down. AIInsightPanel is a pure presentation component with no async dependencies.

---

## Loading Skeleton System

All component skeletons share a common shimmer treatment:

```
Shimmer definition:
  Background: linear-gradient(
    90deg,
    rgba(255,255,255,0.04) 0%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.04) 100%
  )
  Background-size: 200% 100%
  Animation: backgroundPosition 0% 0% → -200% 0%
  Duration: 1500ms, linear, infinite
  This is CSS-only — no JS, no Framer Motion for skeletons

Skeleton shapes always match exact layout geometry of loaded content.
No generic grey boxes — a heading skeleton is the same height as the heading.
A sparkline skeleton is 28px tall (matching sparkline height).
Skeletons never have border-radius unless the loaded content has border-radius.
```
