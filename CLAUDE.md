# CLAUDE.md — System Brain & Engineering Manifesto

> This file is the **ultimate source of truth** for this project.
> Read and apply everything here automatically for every design, UX, motion, and code generation task — no exceptions.

---

## Custom Skill: `cinematic-premium-web`

### Activation
This skill is **always active**. Every task implicitly invokes it. No prompt is needed to trigger it.

---

## 1. CORE PRINCIPLE — Product Identity

This is **not** a generic SaaS dashboard or template admin panel.

It is an **Intelligent Investment Operating System** built for Turkey-focused investors. It surfaces TEFAS-like mutual fund data, inflation-adjusted real returns, portfolio analytics, and AI-powered insights — all within a calm, purposeful, and beautifully crafted interface.

**Emotional target:** The user should feel in control, informed, and confident — not overwhelmed.

**Brand references (aspire to, not copy):**
- **Apple** — restraint, precision, whitespace as a design element
- **Linear** — dense information with zero visual noise, smooth interactions
- **Stripe** — data-rich but never cluttered, trust through polish
- **Arc Browser** — spatial hierarchy, ambient depth, personality without gimmick

---

## 2. DESIGN PHILOSOPHY

### Typography
- Establish a strict typographic hierarchy: display → headline → subhead → body → caption → label
- Use variable fonts where available; prefer Inter or a refined geometric sans-serif
- Never use more than two typefaces in a single view
- Letter-spacing and line-height are deliberate — never default

### Spacing & Rhythm
- All spacing follows an 8px base grid (4px for micro adjustments)
- Sections breathe — generous vertical rhythm, not cramped cards
- Padding scales with viewport intentionally

### Depth & Layering
- Use subtle elevation (shadows, blur, border opacity) to create spatial layers
- Foreground / midground / background must be visually distinct
- No flat single-plane layouts — every screen has perceived depth

### Ambient Lighting
- Backgrounds use very subtle gradient washes or radial glows — never solid flat colors
- Light sources are consistent (top-left or top-center)
- Dark mode is the primary theme; light mode is a first-class variant, not an afterthought

### Color System
- Base: near-black backgrounds (not pure #000000), off-white text (not pure #FFFFFF)
- Accent: one signature color used sparingly and purposefully (suggest: a muted blue-green or warm amber for Turkish/emerging-market feel)
- Semantic colors for data: gains (muted emerald), losses (muted rose), neutral (slate)
- Never use neon, crypto-style gradients, or rainbow palettes

### Forbidden Patterns
- ❌ Generic Tailwind admin UI (shadcn default, Bootstrap-style grids)
- ❌ Template dashboard layouts (sidebar + header + table = done)
- ❌ Neon / crypto / web3 aesthetics
- ❌ Overcrowded information density without visual rest
- ❌ Decorative icons used as filler
- ❌ Modal-heavy workflows when in-context editing works better

---

## 3. MOTION RULES (Framer Motion)

Motion must be **intentional, minimal, smooth, and emotionally meaningful**.

### Principles
- Every animation serves a purpose: orientation, feedback, delight — never distraction
- Enter/exit transitions reveal spatial relationships (things slide from where they logically live)
- Stagger reveals for lists/cards: subtle, fast (0.05–0.08s stagger)
- Page transitions: fade + slight vertical shift (8–12px), duration 250–350ms

### Easing
- Default: `easeOut` or `[0.16, 1, 0.3, 1]` (expo out) for UI elements
- Spring physics only for interactive drag/gesture responses
- Never use default linear or bounce easing for UI transitions

### Forbidden Motion
- ❌ Excessive bouncing or springy effects on standard navigation
- ❌ Infinite looping animations that aren't meaningful data visualizations
- ❌ Attention-grabbing animations that distract from content
- ❌ Animations longer than 500ms for standard UI transitions

---

## 4. TECHNICAL STACK & CONVENTIONS

### Core
- **Framework:** Next.js 14+ (App Router only — no Pages Router)
- **Language:** TypeScript (strict mode, no `any`)
- **Styling:** Tailwind CSS with a custom design token config
- **Animation:** Framer Motion
- **State:** Zustand for client state; React Query / SWR for server state
- **Charts:** Recharts or Visx (styled to match the design system — never default chart themes)

### Code Conventions
- Components are colocated with their styles and types
- No barrel exports from feature folders — explicit imports only
- Server Components by default; opt into `'use client'` deliberately
- All data fetching in Server Components or Route Handlers — never raw fetch in Client Components
- Strict TypeScript: interfaces for all props, no implicit `any`, exhaustive discriminated unions

### File Structure
```
src/
  app/               # Next.js App Router
    (dashboard)/     # Route group for authenticated views
    (marketing)/     # Public-facing pages
    api/             # Route Handlers
  components/
    ui/              # Primitive design system components
    features/        # Domain-specific composite components
    layouts/         # Page shell, nav, sidebar
  lib/               # Utilities, API clients, helpers
  hooks/             # Custom React hooks
  stores/            # Zustand stores
  types/             # Shared TypeScript types
  styles/            # Global CSS, Tailwind config extensions
```

---

## 5. PRODUCT DOMAIN — Turkey Investment Context

- **TEFAS:** Turkey's Electronic Fund Distribution Platform — mutual funds (hisse, borçlanma, karma, para piyasası, etc.)
- **Inflation context:** Turkey has high and volatile inflation (CPI); real returns must always be shown alongside nominal returns
- **Currency:** Primary display in TRY (₺); USD-equivalent as secondary context
- **Key metrics to track:** Fund NAV (Birim Pay Değeri), total return %, real return (inflation-adjusted), Sharpe ratio, fund size (AUM), expense ratio
- **AI insights:** Pattern detection, inflation-beating fund suggestions, portfolio rebalancing nudges

---

## 6. BEHAVIOR INSTRUCTION FOR CLAUDE

1. **Before generating any UI component**, mentally apply the `cinematic-premium-web` skill: check typography, spacing, depth, motion, and color constraints.
2. **Before writing any animation**, verify it serves an orientation or feedback purpose and follows the motion rules above.
3. **Before scaffolding any page layout**, ensure it is NOT a generic admin template — it must feel native to this product's identity.
4. **Always default to dark mode** in design decisions; ensure light mode parity exists.
5. **Challenge generic implementations** — if a pattern feels template-like, redesign it to feel product-native.
6. **This file takes precedence** over any generic web development conventions when they conflict.
