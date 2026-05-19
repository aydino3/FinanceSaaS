# Cinematic Design System Specification

> The single authoritative reference for every visual, typographic, spatial, and motion
> decision in this platform. All component work must trace back to a token defined here.
> When a decision is not covered, extend this document — do not improvise.

---

## Governing Aesthetic Contract

**Three words that govern every decision:** Calm. Precise. Weighty.

- **Calm:** Never compete for attention. Let negative space do work. Color conveys meaning, not mood.
- **Precise:** Every measurement is intentional. Arbitrary values are forbidden.
- **Weighty:** The platform deals in real money and real purchasing power. The visual language
  must communicate that gravity without being cold or institutional.

**Anti-patterns that are permanently forbidden:**
- Pure black (`#000000`) or pure white (`#FFFFFF`) as surface or text colors
- Neon, electric, or saturated accent colors
- Gradients with more than 2 stops (except ambient background glows, max 3 stops)
- Drop shadows with color (shadows are always neutral, never tinted)
- Border-radius on data tables or financial grids (only on card surfaces and interactive elements)
- Simultaneous use of more than 2 accent hues on a single screen

---

## 1. Color System

### Design Philosophy
The palette is built on the premise that **restraint is luxury**. Institutional wealth
management communicates trust through what it withholds — no exuberance, no noise.
Dark zinc and slate form the foundation. A single warm-toned accent defines the brand.
Semantic colors are muted enough to convey meaning without alarming.

---

### 1.1 Base Palette — Dark Mode (Primary)

Dark mode is the canonical design target. Light mode is derived from these values.

#### Background Scale
Layered from deepest to nearest. Each step is a distinct spatial plane.

```
bg-canvas          #0C0C0E    Base page background — the deepest plane
                              Near-black with a very slight warm undertone
                              (not cool blue-black, not pure black)

bg-surface         #111114    Primary card/panel surface
                              Slightly elevated from canvas

bg-surface-raised  #18181C    Secondary raised surface — modals, popovers, comparison cards

bg-surface-overlay #1E1E24    Tertiary — deepest foreground layer, command palette
                              Highest elevation, never used as a background for more layers

bg-inset           #0A0A0C    Inset / recessed areas — chart backgrounds, code blocks
                              Deeper than canvas to create perceived depth inward
```

#### Border Scale
Borders define plane edges without competing for attention.

```
border-subtle      rgba(255,255,255,0.06)   Hairline — separates planes, barely visible
border-default     rgba(255,255,255,0.09)   Standard card/panel border
border-strong      rgba(255,255,255,0.14)   Emphasized border — hover states, focus rings
border-accent      rgba(255,255,255,0.22)   Maximum border emphasis — active panel edges
```

#### Text Scale
Text is never pure white. Off-white preserves legibility while softening intensity.

```
text-primary       #F0EFE9    Main body and headline text — warm off-white
text-secondary     #9A9892    Secondary labels, subheadings, supporting copy
                              Warm gray (not cool gray — matches canvas undertone)
text-tertiary      #5C5B57    Tertiary — timestamps, metadata, disabled labels
text-disabled      #3A3936    Disabled state — visually present but inactive
text-inverse       #0C0C0E    For use on light accent backgrounds
```

---

### 1.2 Signature Accent — Brand Color

**Rationale:** Turkey's investment landscape warrants an accent that feels grounded and
considered — not playful, not aggressive. A muted amber-gold reads as measured prosperity
and connects to gold as an asset class (a dominant Turkish investment vehicle). It also
avoids the blue-teal space occupied by most Western fintech (Stripe, Revolut, Robinhood),
providing category differentiation.

```
accent-50          #FFF8EC    Accent tint — ambient background washes
accent-100         #FAEFD5    Light accent fill — hover backgrounds
accent-200         #F0D99A    Softer accent — secondary badges
accent-300         #E4BF5A    Mid accent — illustration elements
accent-400         #D4A42E    Primary accent — the signature color
                              Use sparingly: CTAs, active nav indicators,
                              key data callouts, chart accent line
accent-500         #B8891A    Deep accent — hover state of accent elements
accent-600         #8F6912    Darkest accent — pressed state
```

**Usage rules:**
- Accent-400 is the only accent that appears on dark surfaces as a foreground element
- Maximum one accent element per visible viewport at a time (excluding charts)
- Never use accent as a background fill for large areas — only for small interactive
  elements, indicators, and chart highlights

---

### 1.3 Semantic Color Scale

These colors communicate meaning. They are deliberately desaturated to avoid alarm.
Financial data should inform, not provoke anxiety.

#### Positive (Real gain above CPI)
```
positive-subtle    #0D2118    Background wash for positive contexts
positive-muted     #14532D    Border/divider in positive contexts
positive-default   #4ADE80    → desaturated to: #6EBF8B   Primary positive text/icon
positive-strong    #86EFAC    → desaturated to: #9ACFAC   Strong positive emphasis
```
**Final positive palette (desaturated emerald):**
```
positive-bg        #0A1F14    Ambient fill — row backgrounds, trend areas
positive-border    #1A4230    Border for positive-state containers
positive-text      #6DBF8A    Text and icon color — positive values
positive-emphasis  #9ACFAC    Emphasized positive value (headline figure)
```

#### Negative (Real loss — below CPI)
```
negative-bg        #1F0A0E    Ambient fill
negative-border    #3D1520    Border
negative-text      #BF6D7A    Text and icon — negative values
negative-emphasis  #D4909A    Emphasized negative value
```
**Important:** Negative colors are rose, not red. Red connotes emergency and alarm.
Rose connotes caution — appropriate for financial data that warrants attention, not panic.

#### Warning (Approaching threshold, requires monitoring)
```
warning-bg         #1C1505    Ambient fill
warning-border     #3D2E0E    Border
warning-text       #C9A84C    Text — amber, distinct from accent-400
warning-emphasis   #E0C070    Emphasized warning
```

#### Neutral (No directional signal — cash, stable instruments)
```
neutral-bg         #12121A    Ambient fill
neutral-border     #25252F    Border
neutral-text       #8A8A9A    Text — cooler than text-secondary, signals neutrality
neutral-emphasis   #ABABBB    Emphasized neutral
```

---

### 1.4 Ambient Effects Palette

Used exclusively for background glows, radial washes, and depth atmospherics.
Never used for interactive elements or data.

```
glow-accent        rgba(212, 164, 46, 0.07)    Warm amber radial — hero areas, feature highlights
glow-neutral       rgba(255, 255, 255, 0.03)   Subtle light source simulation
glow-positive      rgba(109, 191, 138, 0.06)   Positive portfolio state ambient
glow-negative      rgba(191, 109, 122, 0.06)   Negative portfolio state ambient
```

Ambient glows are always radial gradients, positioned at top-center or top-left (consistent
light source), and never exceed the opacity values above.

---

### 1.5 Light Mode Palette

Light mode inverts the depth logic. Background is warm near-white; depth is expressed
by darkening (not lightening). Accent remains amber but deepens for contrast.

```
bg-canvas          #F5F4F0    Warm near-white — slight cream undertone
bg-surface         #EDECE8    Primary surface — slightly darker
bg-surface-raised  #E4E3DF    Raised surface
bg-surface-overlay #DCDBD7    Deepest surface

border-subtle      rgba(0,0,0,0.05)
border-default     rgba(0,0,0,0.08)
border-strong      rgba(0,0,0,0.13)
border-accent      rgba(0,0,0,0.20)

text-primary       #1A1915    Warm near-black
text-secondary     #5A5954    Mid warm gray
text-tertiary      #8A8880    Light warm gray
text-disabled      #B4B2AF    Disabled

accent-400         #B8891A    Deepened for light mode contrast
```

---

## 2. Typography Hierarchy

### Design Philosophy
Typography is the primary carrier of the editorial and institutional character.
The scale is deliberately large at the top (display and headline) to command space,
and progressively tighter at the bottom (caption and label) to respect density.
**Line-height and letter-spacing are not defaults** — every level has a specific value.

---

### 2.1 Typeface Selection

**Primary (UI + Body):** `Inter` — variable font, weights 300–700.
- Rationale: Highest legibility at small sizes, neutral personality that doesn't compete
  with data, excellent number rendering (tabular figures for financial data).
- Load: `font-display: swap`, subsets: latin, latin-ext (for Turkish characters ğ ü ş ı ö ç)

**Display (Large Headlines only):** `Cal Sans` or `Instrument Serif` — use for display-size
headlines only (hero section, onboarding, marketing).
- Rationale: A single serif or expressive face at display size creates editorial warmth
  without compromising the functional UI. Used sparingly — 3 instances maximum per page.
- Alternative if custom font loading is restricted: Inter at weight 300 with wide
  letter-spacing achieves a similar editorial quality.

**Monospace (Data, codes, fund identifiers):** `JetBrains Mono` — variable font.
- Rationale: Fund codes (GAF-A, AKB-K), NAV values, return percentages in data-dense
  contexts benefit from tabular mono rendering. Only for code-like identifiers, not
  general financial numbers.

**Turkish character requirement:** All fonts must include the full Turkish alphabet.
Verify: ğ Ğ ü Ü ş Ş ı İ ö Ö ç Ç

---

### 2.2 Type Scale

All sizes in `rem`. Base: 16px. Scale ratio: ~1.25 (Major Third).

```
┌────────────────┬──────────┬────────┬──────────────┬─────────────────────────────────────┐
│ Token          │ Size     │ Weight │ Line-height  │ Letter-spacing  │ Usage              │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ display-2xl    │ 4.5rem   │ 300    │ 1.05         │ -0.04em         │ Hero headline      │
│                │ 72px     │        │              │                 │ (marketing only)   │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ display-xl     │ 3.5rem   │ 300    │ 1.08         │ -0.03em         │ Feature headlines  │
│                │ 56px     │        │              │                 │ Onboarding steps   │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ display-lg     │ 2.75rem  │ 400    │ 1.1          │ -0.025em        │ Wealth statement   │
│                │ 44px     │        │              │                 │ Portfolio headline │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ headline-xl    │ 2rem     │ 500    │ 1.15         │ -0.02em         │ Page titles        │
│                │ 32px     │        │              │                 │ Section headers    │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ headline-lg    │ 1.5rem   │ 500    │ 1.2          │ -0.015em        │ Card headings      │
│                │ 24px     │        │              │                 │ Module titles      │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ headline-md    │ 1.25rem  │ 500    │ 1.25         │ -0.01em         │ Sub-section heads  │
│                │ 20px     │        │              │                 │ Panel titles       │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ body-xl        │ 1.125rem │ 400    │ 1.6          │ -0.005em        │ Lead paragraphs    │
│                │ 18px     │        │              │                 │ AI brief text      │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ body-lg        │ 1rem     │ 400    │ 1.6          │ 0               │ Default body text  │
│                │ 16px     │        │              │                 │ Fund descriptions  │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ body-md        │ 0.9375rem│ 400    │ 1.55         │ 0               │ Supporting body    │
│                │ 15px     │        │              │                 │ Journal entries    │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ body-sm        │ 0.875rem │ 400    │ 1.5          │ 0.005em         │ List items         │
│                │ 14px     │        │              │                 │ Table rows         │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ caption        │ 0.8125rem│ 400    │ 1.4          │ 0.01em          │ Metric labels      │
│                │ 13px     │        │              │                 │ Axis labels        │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ label-lg       │ 0.8125rem│ 500    │ 1.0          │ 0.04em          │ UI labels          │
│                │ 13px     │        │              │                 │ uppercase, spaced  │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ label-sm       │ 0.75rem  │ 500    │ 1.0          │ 0.06em          │ Chips, badges      │
│                │ 12px     │        │              │                 │ uppercase, spaced  │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ mono-md        │ 0.875rem │ 400    │ 1.5          │ 0               │ Fund codes         │
│                │ 14px     │        │              │                 │ NAV values (dense) │
├────────────────┼──────────┼────────┼──────────────┼─────────────────┼────────────────────┤
│ mono-sm        │ 0.8125rem│ 400    │ 1.4          │ 0               │ Table data values  │
│                │ 13px     │        │              │                 │ Precise numbers    │
└────────────────┴──────────┴────────┴──────────────┴─────────────────┴────────────────────┘
```

**Notes:**
- `display-2xl` and `display-xl` use weight 300 — at large sizes, light weight reads as
  sophisticated. Heavy weights at large sizes read as aggressive.
- `label-lg` and `label-sm` are always uppercase with wide letter-spacing. This creates a
  visual tier between "UI scaffolding" and "content."
- Numbers in financial contexts use `font-variant-numeric: tabular-nums` — critical for
  column alignment in tables and charts.

---

### 2.3 Numeric Display Rules

Financial numbers require special handling beyond the type scale.

**Return percentages (primary metric):**
- Positive: `positive-text` color + `+` prefix always explicit
- Negative: `negative-text` color + `-` prefix always explicit
- Zero/neutral: `text-tertiary`, no prefix

**Currency figures:**
- TRY amounts: `₺` symbol before number, no space
- USD equivalents: smaller size (caption or body-sm), `text-tertiary`
- Large numbers use Turkish notation: `1.847.320,45` (period as thousands separator, comma as decimal)

**Percentage formatting:**
- Always 1 decimal place for returns: `+6.2%` not `+6%` or `+6.18%`
- Exception: return values > 100%: 1 decimal still — `+142.4%`
- Exception: expense ratios: 2 decimal places — `0.95%`

---

## 3. Spacing & Rhythm System

### Design Philosophy
Negative space is the primary design element. Every spacing decision communicates
the platform's respect for the user's attention. Crowded layouts signal anxiety.
Generous layouts signal confidence and control.

---

### 3.1 Base Grid

```
Base unit:     8px
Micro unit:    4px  (half-step, for fine adjustments only)
```

All spacing values are multiples of 8px except micro-adjustments which use 4px.
**Never use odd pixel values** (3px, 5px, 7px etc.) except for border widths.

```
space-1    4px     Micro — icon padding, chip internal gap
space-2    8px     Tight — related element gap
space-3    12px    Close — form field internals, list item padding vertical
space-4    16px    Default — standard component padding
space-5    20px    Comfortable — card padding (mobile)
space-6    24px    Relaxed — card padding (desktop), section content gap
space-8    32px    Loose — section padding, between-card gap
space-10   40px    Open — page section gap (mobile)
space-12   48px    Wide — page section gap (desktop), major visual breaks
space-16   64px    Expansive — between major page sections
space-20   80px    Monumental — hero sections, onboarding step padding
space-24   96px    Maximum — landing page hero vertical padding
```

---

### 3.2 Layout Spacing Contracts

These are binding rules — not suggestions.

**Page-level horizontal padding:**
```
Mobile (< 768px):    padding-x: 16px (space-4)
Tablet (768–1023px): padding-x: 24px (space-6)
Desktop (≥ 1024px):  padding-x: 32px (space-8) within content area
                     (sidebar/shell padding is separate)
```

**Content max-widths:**
```
Editorial content (AI brief, journal, macro feed):  max-w: 720px
Standard page content:                              max-w: 1100px
Settings forms:                                     max-w: 680px
Data-dense content (analytics, explorer lists):     max-w: none (full width within shell)
```

**Vertical section rhythm:**
```
Between major page sections:          space-16 (64px)
Between content groups within section: space-12 (48px)
Between related cards/panels:          space-6 (24px)
Between items in a list/table:         space-3 (12px) — vertical padding per row
Between label and its value:           space-1 (4px)
```

**Card internal padding:**
```
Standard card:    space-6 (24px) all sides (desktop)
                  space-5 (20px) all sides (mobile)
Compact card:     space-4 (16px) all sides
Data row:         space-3 (12px) vertical, space-4 (16px) horizontal
```

---

### 3.3 Component-Level Spacing

**Typography spacing:**
```
After display/headline (before body):   space-4 (16px)
Between body paragraphs:               space-4 (16px)
After section heading (before content): space-6 (24px)
Between heading levels:                 space-3 (12px)
```

**Form elements:**
```
Between form fields:                    space-6 (24px)
Between label and input:                space-2 (8px)
Input internal padding:                 12px vertical, 16px horizontal
```

**Button sizing:**
```
Large button:   height 48px, padding-x 24px, body-lg type
Default button: height 40px, padding-x 20px, body-sm type
Small button:   height 32px, padding-x 16px, caption type
Compact button: height 28px, padding-x 12px, label-sm type
```

---

## 4. Layering & Depth System

### Design Philosophy
The app exists on multiple spatial planes. Each plane has a consistent visual identity.
Depth is expressed through background lightness, border opacity, blur, and shadow —
**never through z-index alone** (z-index is implementation; visual depth is design).

---

### 4.1 Elevation System

Five elevation levels, each corresponding to a spatial plane:

```
Elevation 0 — Canvas
  Background: bg-canvas (#0C0C0E)
  Border: none
  Shadow: none
  Blur: none
  Use: Page background, chart insets

Elevation 1 — Surface
  Background: bg-surface (#111114)
  Border: border-subtle (rgba(255,255,255,0.06))
  Shadow: 0 1px 2px rgba(0,0,0,0.4)
  Blur: none
  Use: Standard cards, list containers, sidebar

Elevation 2 — Raised Surface
  Background: bg-surface-raised (#18181C)
  Border: border-default (rgba(255,255,255,0.09))
  Shadow: 0 4px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)
  Blur: none
  Use: Comparison cards, hover states on cards, pinned panels

Elevation 3 — Floating
  Background: bg-surface-raised (#18181C) + backdrop-filter: blur(16px)
  Border: border-strong (rgba(255,255,255,0.14))
  Shadow: 0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)
  Blur: blur(16px) on background
  Use: Tooltips, hover cards, floating fund cards, tray elements

Elevation 4 — Overlay
  Background: bg-surface-overlay (#1E1E24) + backdrop-filter: blur(24px)
  Border: border-strong (rgba(255,255,255,0.14))
  Shadow: 0 16px 48px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5)
  Blur: blur(24px) on background
  Use: Command palette, modals, bottom sheets, right-panel overlays
```

**Critical rule:** Shadows are always neutral (black-based). Never colored shadows.
The only exception is a very subtle accent-colored glow (glow-accent) used at most once
per page, only for the most important interactive element.

---

### 4.2 Glassmorphism Specification

Glass effects are used only at Elevation 3 and 4. They are not decorative —
they communicate that an element is floating above the content layer.

```
Glass — Standard:
  background: rgba(24, 24, 28, 0.85)
  backdrop-filter: blur(16px) saturate(120%)
  border: 1px solid rgba(255, 255, 255, 0.09)

Glass — Strong (overlays, command palette):
  background: rgba(30, 30, 36, 0.92)
  backdrop-filter: blur(24px) saturate(130%)
  border: 1px solid rgba(255, 255, 255, 0.12)

Glass — Light (context bar, navigation):
  background: rgba(12, 12, 14, 0.80)
  backdrop-filter: blur(12px) saturate(110%)
  border-bottom: 1px solid rgba(255, 255, 255, 0.06)
```

**Browser compatibility note:** `backdrop-filter` requires `-webkit-backdrop-filter` prefix
for Safari. When `backdrop-filter` is unsupported, fall back to the full opaque background
value (no transparent without blur — never transparent without blur, which creates an
unreadable overlay).

---

### 4.3 Border Radius System

```
radius-none      0px       Data tables, financial grids, chart containers
radius-sm        4px       Chips, badges, small buttons, tooltips
radius-md        8px       Standard buttons, input fields, small cards
radius-lg        12px      Standard cards, list containers
radius-xl        16px      Large cards, panels, command palette
radius-2xl       20px      Bottom sheets, modal dialogs, right panels
radius-full      9999px    Avatars, circular indicators, pill badges
```

**Strict rule:** Data visualization containers (chart wrappers, tables, data grids)
always use `radius-none`. Financial data deserves the precision of a straight edge.

---

### 4.4 Ambient Background Atmospherics

Each major section of the app has an ambient background treatment. These are
CSS-only radial gradients — no JS, no animation (except auth page, which is very slow CSS).

```
Portfolio page:
  radial-gradient(ellipse 80% 40% at 50% 0%, glow-accent, transparent)
  — warm amber top glow, communicates wealth/prosperity

Analytics page:
  radial-gradient(ellipse 60% 30% at 30% 0%, glow-neutral, transparent)
  — neutral top-left glow, communicates clarity/objectivity

Intelligence page:
  radial-gradient(ellipse 70% 35% at 60% 0%, rgba(59,130,246,0.04), transparent)
  — very subtle blue-ish glow, communicates information/intelligence

Landing hero:
  radial-gradient(ellipse 100% 50% at 50% -10%, glow-accent, transparent 70%)
  — larger amber glow for marketing drama (still subtle)
```

All glows are positioned at the top of the page. The light source is always from above.

---

## 5. Chart & Data Visualization Design Language

### Design Philosophy
Financial charts on this platform are **information architecture, not decoration**.
Every visual element in a chart exists to communicate a specific piece of data.
Gridlines, axes, legends, and tooltips are never decorative — they either earn their
presence or are removed.

**Recharts overrides:** All Recharts default styles are stripped. The library is used as
a rendering engine only — no default colors, no default fonts, no default tooltips.

---

### 5.1 Chart Color Language

```
Chart palette — strictly ordered by usage priority:

1. Accent line:        #D4A42E    Signature color — primary data series (portfolio)
2. CPI line:           #BF6D7A    Rose — inflation floor (always an adversary)
3. Secondary series:   #6DBF8A    Muted emerald — benchmarks (BIST, gold)
4. Tertiary series:    #6B7DB3    Muted blue — additional comparison series
5. Quaternary series:  #9A6BBF    Muted violet — fourth series maximum (rare)

Area fills (beneath lines):
   Accent area:        rgba(212, 164, 46, 0.08)
   CPI area:           rgba(191, 109, 122, 0.06)
   Positive delta:     rgba(109, 191, 138, 0.10)   (real return above CPI)
   Negative delta:     rgba(191, 109, 122, 0.10)   (real return below CPI)
```

**Critical rule:** No more than 4 data series on a single chart. If the data requires more,
use multiple coordinated charts. Visual noise is an information failure.

---

### 5.2 Chart Typography

All chart text uses the Inter typeface. Recharts `style` props override all defaults.

```
Axis labels:       caption (13px, 400 weight, text-tertiary)
Axis tick values:  mono-sm (13px, 400 weight, text-secondary)
                   tabular-nums, no letter-spacing
Chart title:       body-sm (14px, 500 weight, text-primary) — used sparingly
Legend labels:     label-sm (12px, 500 weight, uppercase, text-secondary)
Tooltip value:     body-sm (14px, 500 weight, text-primary)
Tooltip label:     caption (13px, 400 weight, text-tertiary)
Annotation text:   caption (13px, 400 weight, text-secondary) italic
Reference label:   label-sm (12px, 500 weight, uppercase, text-tertiary)
```

---

### 5.3 Grid, Axes, and Reference Lines

**Grid lines:**
```
Horizontal gridlines only (no vertical gridlines in time-series charts)
Color: rgba(255, 255, 255, 0.04)
Stroke-width: 1px
Dash pattern: none (solid, at this opacity solid is calm enough)
Count: maximum 5 horizontal lines (data doesn't need more reference points)
```

**Axes:**
```
Axis lines: display: none (the gridlines and chart area define the space)
Tick marks: display: none
Y-axis values: right-aligned, outside chart area, text-tertiary, mono-sm
X-axis values: center-aligned, below chart area, text-tertiary, mono-sm
               For time series: show only start, mid, and end (3 labels maximum)
               Exception: period < 30 days, show weekly; period > 2 years, show quarterly
```

**Zero line / Reference lines:**
```
Zero line (when chart includes negative values):
  Color: rgba(255, 255, 255, 0.12)
  Stroke-width: 1px
  Not dashed — it is a structural reference, not a annotation

CPI line (on portfolio return charts):
  Color: negative-text (#BF6D7A)
  Stroke-width: 1.5px
  Stroke-dasharray: 4 4
  Opacity: 0.7
  Always labeled: "CPI" at right end of line, caption size

Target return line:
  Color: accent-400 (#D4A42E)
  Stroke-width: 1px
  Stroke-dasharray: 6 3
  Opacity: 0.5
```

---

### 5.4 Tooltip Design

The chart tooltip is a floating Elevation 3 element. No Recharts default tooltip.

```
┌────────────────────────────────────────┐
│  14 May 2026                           │  ← caption, text-tertiary
│                                        │
│  ● Portfolio Return   +71.4%           │  ← dot in series color + label + value
│  ● Real Return        +6.2%  ▲ above  │
│  ● CPI                +38.4%           │
│                                        │
│  Portfolio Value      ₺ 1,847,320      │  ← secondary context if relevant
└────────────────────────────────────────┘

Elevation 3 glass styling
Width: 220px (fixed, no dynamic width)
Padding: space-4 (16px) all sides
Row gap: space-2 (8px)
Border-radius: radius-lg (12px)
No animation (tooltip appears/disappears instantly — any delay is frustrating in charts)
```

---

### 5.5 Chart Types and Their Specifications

**Time-Series Line/Area Chart (primary chart type — M4 Analytics):**
- `strokeWidth`: 2px for primary series, 1.5px for secondary
- `dot`: none by default; appears on hover only (8px circle, filled, no stroke)
- `activeDot`: 8px radius, 2px stroke in surface color (creates a clean ring)
- `animationDuration`: 500ms on mount; 300ms on data change
- `animationEasing`: "ease-out"

**NAV History Chart (Fund Profile — M2):**
- Single line (fund NAV) + CPI overlay
- The gap between the two lines is the primary visual story
- Fill between lines: positive delta = positive-bg fill; negative delta = negative-bg fill
- The fill is more important than the lines themselves

**Bar Chart (Attribution Waterfall — M4):**
- Horizontal layout (category names on Y-axis, values on X-axis)
- Bar height: 28px (single bar), 20px gap between bars
- Positive bars: positive-default fill; negative bars: negative-default fill
- `borderRadius`: 0 (waterfall charts are structural — no rounded bars)
- Reference line at zero always present

**Scatter Plot (Fund Constellation — M2 Explorer):**
- Custom SVG rendering via Recharts `customizedDot` — not default circles
- Fund dots: filled circle, 8px default, 12px hover, outline: 2px in series color
- Owned funds: 2px accent-400 ring, no fill change
- Animation: scatter in from center (custom, not Recharts built-in)

**Sparklines (everywhere — fund rows, watchlists, position list):**
- Height: 28px (tight rows), 40px (comfortable rows)
- Width: determined by container (flex)
- Line only — no area fill, no dots, no axes, no tooltip (sparklines are decorative context)
- `strokeWidth`: 1.5px
- Color: positive-text if net positive over period, negative-text if net negative, text-tertiary if flat
- `animationDuration`: 0 (instant — sparklines are always secondary context, never focal)

**Radial/Donut Chart (Asset Allocation — M1, limited use):**
Not used. The horizontal asset band (described in INFORMATION_ARCHITECTURE.md) replaces
the standard donut chart. Donut charts obscure the relative magnitude of holdings.
If a compact allocation summary is needed: use a horizontal stacked bar, not a donut.

---

### 5.6 Empty Chart States

An empty chart container does not show a skeleton. It shows its structure (axes, gridlines)
with a subtle horizontal center line and a single-line prompt where the data would be.

```
[Chart axes and grid lines render normally]
[Horizontal center line at chart midpoint, opacity 0.3]
[Centered text: "Add positions to see your return history" — caption, text-tertiary]
```

This approach communicates that the chart is ready and waiting — not broken.

---

## 6. Motion Timing System

### Design Philosophy
Motion is the platform's behavioral signature. It must feel like Apple's OS-level
animations — purposeful, spring-physics-informed, never mechanical. Every duration
and easing value below is derived from a physical analogy: what would this movement
feel like if it had weight?

**Motion budget per interaction:** No more than one primary animation + one secondary
(e.g., a panel sliding in is primary; items staggering inside it is secondary). Tertiary
animations within a view are prohibited — they fragment attention.

---

### 6.1 Duration Scale

```
instant       0ms       State toggles (color changes, opacity toggles for data states)
micro         80ms      Hover state transitions (bg fill, border color)
fast          150ms     Quick dismissals, tab switches, small state changes
standard      250ms     Most UI transitions — the default
comfortable   350ms     Panels opening, content reveals, card expansions
deliberate    500ms     Page-level transitions, chart initial renders
expressive    700ms     Welcome screens, onboarding reveals, hero animations
```

**Rule:** When uncertain, use `standard` (250ms). Faster is almost always better than slower.
The only time to use `expressive` (700ms+) is for first-impression moments that establish
the platform's character.

---

### 6.2 Easing Library

Named curves with their Cubic Bézier values. Use the name, never hardcode the values
inconsistently.

```
ease-out-expo    cubic-bezier(0.16, 1, 0.3, 1)
  — Primary easing for UI elements entering the screen
  — Objects that decelerate quickly, then settle
  — Use: panel open, card reveal, dropdown open, page enter

ease-in-expo     cubic-bezier(0.7, 0, 0.84, 0)
  — Exits and dismissals
  — Objects that accelerate as they leave
  — Use: panel close, dropdown close, page exit

ease-in-out-expo cubic-bezier(0.87, 0, 0.13, 1)
  — Position changes within a scene
  — Objects that accelerate then decelerate
  — Use: navigation active indicator movement, sorting transitions

ease-out-circ    cubic-bezier(0, 0.55, 0.45, 1)
  — Softer version of ease-out-expo for text and subtle reveals
  — Use: text fade-ins, sparkline color transitions, chip state changes

ease-spring      Spring physics: stiffness 300, damping 30, mass 1
  — Direct manipulation responses only
  — Use: drag feedback, dropped items settling, swipe dismissal snap

ease-spring-soft Spring physics: stiffness 200, damping 28, mass 1
  — Gentle spring for panel mounts and bottom sheets
  — Use: bottom sheet open, comparison tray slide-up

ease-linear      linear
  — Only for: opacity-only fades where no spatial movement occurs
  — Use: loading skeleton shimmer, backdrop fade-in/out
```

---

### 6.3 Animation Presets

**Standard presets ready for Framer Motion `variants` implementation:**

```
fadeIn:
  hidden: { opacity: 0 }
  visible: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } }

fadeSlideUp:
  hidden: { opacity: 0, y: 12 }
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }

fadeSlideRight:
  hidden: { opacity: 0, x: -16 }
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }

panelSlideIn (from right):
  hidden: { opacity: 0, x: 32 }
  visible: { opacity: 1, x: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } }
  exit:    { opacity: 0, x: 32, transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] } }

panelSlideUp (bottom sheet):
  hidden: { y: "100%" }
  visible: { y: 0, transition: { type: "spring", stiffness: 200, damping: 28 } }
  exit:    { y: "100%", transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] } }

scaleIn (command palette):
  hidden: { opacity: 0, scale: 0.96 }
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.15, ease: [0.7, 0, 0.84, 0] } }

staggerContainer:
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } }

staggerContainerFast:
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.03 } }

numberReveal (wealth statement, metric count-up):
  Not a Framer Motion variant — uses a custom count-up implementation
  Duration: 800ms, easing: ease-out
  Start from 0, or from previous value on data refresh (transition between values)
```

---

### 6.4 Transition Rules Per Context

```
Route navigation (page change):
  Exit:  fadeOut, 150ms, ease-in-expo
  Enter: fadeSlideUp, 300ms, ease-out-expo, 50ms delay
  Shell: does not animate (persists across navigation)

Drill-down (list → detail):
  Exit:  none (list stays, detail overlaps)
  Enter: panelSlideIn, 320ms, ease-out-expo
  Exit the panel: panelSlideIn exit, 200ms, ease-in-expo

Tab / view switch:
  Exit current tab:  fadeOut, 150ms, ease-linear
  Enter new tab:     fadeIn, 200ms, ease-linear, 50ms delay
  (No spatial movement — tabs are content states, not locations)

Accordion / expand:
  Framer Motion layout animation (height: auto)
  Spring: stiffness 300, damping 30
  Content inside: fadeSlideUp with 80ms delay after expand starts

Hover state (cards, rows, buttons):
  Duration: micro (80ms), ease: ease-out-circ
  Properties: background-color only (no scale, no shadow jump)

Active state (click/press):
  Duration: instant (0ms) — snap to pressed state
  Release: micro (80ms) back to hover state

Tooltip:
  Mount: fadeIn, fast (150ms), no delay
  Unmount: fadeOut, micro (80ms)
  No movement — tooltips appear in place, no directional origin

Loading → Loaded transition:
  Skeleton fade out: 200ms, ease-linear
  Content fade in:   300ms, ease-out-circ, stagger children at 30ms
  (Skeleton and content cross-fade — no flash of empty space)

Error state:
  Mount: fadeSlideUp, standard (250ms) — errors are calm, not alarming
  No bounce, no attention-grabbing motion
```

---

### 6.5 Reduced Motion Contract

All animations must respect `prefers-reduced-motion: reduce`.

**When reduced motion is active:**
- All duration values collapse to `instant` (0ms) or `micro` (80ms) maximum
- Spatial transitions (slide, scale) are replaced with opacity-only fades
- Count-up number animations are replaced with instant value display
- Chart draw animations are replaced with instant full render
- Stagger delays are removed (all children appear simultaneously)

Implementation: Framer Motion's `useReducedMotion()` hook is used in every animation
component. This is not optional — it is an accessibility requirement.

---

## 7. Interactive State Specifications

### 7.1 Focus States

Focus indicators must be visible but aesthetically consistent. They do not break the visual language.

```
Focus ring:
  outline: 2px solid accent-400 (#D4A42E)
  outline-offset: 2px
  border-radius: matches element's border-radius
```

Never remove focus outlines. Never use `outline: none` without providing an alternative.
Focus states are critical for keyboard navigation (which this platform fully supports).

### 7.2 Selection States

```
Selected row (table, list):
  background: bg-surface-raised
  left-border: 2px solid accent-400
  No scale change

Selected chip/filter:
  background: rgba(212, 164, 46, 0.12)
  border-color: accent-400 at 50% opacity
  text-color: accent-400

Selected nav item:
  background: rgba(255, 255, 255, 0.06)
  left-border: 2px solid accent-400
  icon + label: text-primary (full opacity)
```

### 7.3 Disabled States

```
Disabled elements:
  opacity: 0.38 (Material Design's standard — legible but clearly inactive)
  cursor: not-allowed
  No hover effects
  No pointer events
```

---

## 8. Component Design Tokens Summary

A flat reference for the most frequently used token combinations:

```
Standard card:
  bg: bg-surface | border: border-subtle | radius: radius-lg | padding: space-6
  shadow: elevation-1 shadow

Raised card (hover/selected):
  bg: bg-surface-raised | border: border-default | radius: radius-lg
  shadow: elevation-2 shadow

Floating panel:
  bg: glass-standard | border: border-strong | radius: radius-xl
  shadow: elevation-3 shadow | backdrop: blur(16px)

Overlay (command palette, modals):
  bg: glass-strong | border: border-strong | radius: radius-xl
  shadow: elevation-4 shadow | backdrop: blur(24px)

Primary button:
  bg: accent-400 | text: text-inverse | radius: radius-md | height: 40px
  hover: accent-500 | active: accent-600 | transition: micro

Ghost button:
  bg: transparent | border: border-default | text: text-secondary | radius: radius-md
  hover: bg-surface | active: bg-surface-raised | transition: micro

Destructive button:
  bg: transparent | border: negative-border | text: negative-text | radius: radius-md
  hover: negative-bg | transition: micro

Badge / Chip (neutral):
  bg: bg-surface-raised | border: border-subtle | text: text-secondary
  radius: radius-sm | padding: space-1 space-3 | type: label-sm uppercase

Badge (positive):
  bg: positive-bg | border: positive-border | text: positive-text

Badge (negative):
  bg: negative-bg | border: negative-border | text: negative-text

Input field:
  bg: bg-inset | border: border-default | text: text-primary | radius: radius-md
  focus-border: accent-400 | placeholder: text-tertiary
  padding: 12px vertical, 16px horizontal
```
