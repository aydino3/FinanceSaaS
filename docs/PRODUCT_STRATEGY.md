# Product Strategy — Intelligent Investment Operating System for Turkey

> This document defines the product vision, user personas, differentiators, emotional arc,
> and competitive positioning. It is a living reference — all feature decisions must map
> back to something written here.

---

## 1. Core Value Proposition

### The Problem Turkey's Investors Actually Face

Turkey's retail investor exists in a uniquely hostile financial environment. Inflation is not an
occasional headline risk — it is a structural, persistent adversary. A fund returning 40% annually
feels like a win until you realize CPI ran at 65%. The real return is deeply negative. Yet most
available tools — brokerage portals, TEFAS's own interface, third-party trackers — present nominal
numbers in isolation, stripping away the context that makes the data meaningful.

The result: investors are technically informed but strategically blind.

Beyond inflation, the Turkish financial landscape suffers from:
- **Fragmentation:** Funds live in TEFAS, equities in brokerage accounts, gold in physical vaults,
  FX in separate bank apps. There is no unified view of real wealth.
- **Complexity without clarity:** TEFAS lists 500+ funds with cryptic codes and no intelligent
  filtering. Comparing a Type-A equity fund against a money market fund requires manual spreadsheet
  work.
- **Noise without signal:** News, commentary, and macro data are abundant. Actionable, personalized
  insight is nearly nonexistent.
- **Anxiety as the default state:** In the absence of clarity, the rational response to Turkish
  inflation is low-grade financial anxiety — a chronic, draining cognitive load.

### What This Platform Delivers

**One intelligent operating system that transforms inflation anxiety into strategic clarity.**

Concretely:
- Every return figure is shown in **real terms first**, nominal second — making the CPI enemy visible
- A unified portfolio view that **speaks in wealth, not accounts** — total real purchasing power,
  not scattered balances
- AI-layer that distills 500+ TEFAS funds into **the 5 that are relevant to you, right now**
- An interface so calm and precise that **trusting it feels natural** — no cognitive friction,
  no visual noise

---

## 2. Target User Personas

### Persona 1 — The Inflation-Aware Wealth Builder
**"Haluk Sönmez, 52, Director of Industrial Operations, İstanbul"**

**Portfolio profile:**
- Managed wealth: ₺4.2M–₺8.5M, distributed across TEFAS mutual funds, physical gram altın, USD time deposits, and BIST blue-chip equity
- TEFAS allocation: ~₺2.8M active fund portfolio across 8–12 positions, rebalanced quarterly using a strategic asset allocation (SAA) framework
- Risk profile: SPKA 3–4 — moderate-conservative; absolute-return mindset with explicit TÜFE hurdle rate

**Investment thesis:**
Every position in the portfolio must clear the rolling 12-month TÜFE hurdle before it earns or retains an allocation. Nominal return figures are considered misleading without context; the only meaningful metric is the purchasing-power-adjusted real return relative to the risk taken. Capital preservation in real terms is the primary mandate — alpha generation is secondary.

**Pain points in the current landscape:**
- No available tool unifies TEFAS positions, physical gold, and FX deposits under a single real-purchasing-power ledger
- Monthly reconciliation requires 2–3 hours of manual spreadsheet maintenance; CPI adjustment formulas are built and maintained personally
- TEFAS's own portal and bank apps present nominal NAVs and nominal returns with no inflation context — making informed rebalancing decisions operationally painful
- Identifying which funds within a category have *consistently* beaten TÜFE on a rolling 3-month basis requires custom scripting against TEFAS raw data exports

**Key metrics this persona tracks manually:**
- 18-month rolling real return per position
- Cumulative purchasing-power ratio (current NAV / (cost basis × CPI factor))
- Intra-category TÜFE outperformance spread
- Portfolio-level TÜFE-adjusted Sharpe estimate

**What the platform unlocks:**
The Inflation tab becomes this investor's primary workspace — the CashErosionChart immediately validates the strategic premise ("this is what happens to cash"), and the WealthStatus hero gives them the portfolio-vs-CPI verdict they used to calculate manually. The BenchmarkGrid surfaces BIST 100, USD/TRY, and TÜFE comparisons in a single view. The AI Brief translates macro events (TCMB rate decisions, TÜİK CPI prints) directly into portfolio-level implications — the analytical layer they currently have to build themselves.

**Design implication:**
This persona rewards density and precision. Information should be layered — the top-line real-return verdict is the entry point, with progressive disclosure into per-fund and per-category decomposition. The interface must communicate institutional credibility from the first interaction.

---

### Persona 2 — The Active Fund Allocator
**"Ziya Tural, 37, Senior Portfolio Analyst, Asset Management Sector, İstanbul"**

**Portfolio profile:**
- Managed wealth: ₺1.5M–₺3M personal TEFAS portfolio, active rotation strategy
- Current allocation: Equity-overweight (SPKA 5–6 range) during risk-on macroeconomic regimes; systematic rotation into Eurobond and gold fund categories on TCMB policy pivot signals
- Rebalancing frequency: Monthly tactical, driven by TCMB meeting calendar and TÜİK CPI print schedule

**Investment thesis:**
TEFAS's 500+ fund universe contains substantial dispersion in risk-adjusted, inflation-corrected alpha — but locating it requires filtering capabilities that the official platform and all consumer apps lack. The real edge is in identifying fund managers who consistently outperform their TEFAS category benchmark on a fee-adjusted, real-return basis — not just on raw 1Y nominal returns, which are trivially distorted by late-2024 base effects. Eurobond funds add a USD/TRY hedge layer that gold funds partially replicate at lower volatility; the allocation between them is a macro call, not a set-and-forget decision.

**Pain points in the current landscape:**
- TEFAS's official screener allows filtering by category but has no risk-adjusted or inflation-adjusted sort — the entire filter mechanism defaults to nominal 1Y return, making it nearly useless for informed fund selection
- Discovering that a high-performing fund has quietly changed its senior manager requires monitoring TEFAS disclosure PDFs manually
- There is no tool that computes information ratio vs. a category benchmark for individual TEFAS funds
- Comparing an equity fund's real return against an equivalent Eurobond position requires building a cross-category model from scratch

**Key metrics this persona tracks:**
- Real 1Y return ranked within TEFAS category (not against all funds)
- Fee-adjusted alpha: (1Y return − category avg return) / management fee ratio
- Risk-adjusted return: return per unit of SPKA risk score
- AUM trend as a proxy for institutional capital flow conviction
- Investor count trend: rising yatırımcı count as a momentum signal

**What the platform unlocks:**
The Explorer tab is this persona's primary surface — the ability to sort 24+ funds by real return, risk score, or fee instantly, and filter to a specific category (Eurobond, Hisse Senedi) where the analytical decision is being made. The FilterBar's real-return sort (`return-real`) is the core action: it re-ranks the fund universe by the metric that actually matters. The AI Brief's fund-specific alerts (manager changes, category momentum signals) surface the early-warning intelligence this persona currently gets only from Bloomberg terminal subscriptions.

**Design implication:**
This persona demands explorer-grade density and responsiveness. Filter state must persist across tab switches. Sort changes should feel instant with smooth FLIP reordering animations. The "Reel" accent column in every fund card is the single most important data point on the page — it should always be visually differentiated from nominal return columns.

---

## 3. Key Differentiators

### 3.1 Real Returns as the Primary Language
Every competitor displays nominal returns. This platform **speaks in real purchasing power by
default**. The inflation adjustment is not a toggle or a footnote — it is the headline number.
This single inversion reframes the entire product category.

> "Your portfolio returned +48% last year" → replaced by → "Your real return was +4.2% above CPI"

### 3.2 Intelligence Over Information
Traditional fintech dashboards are data pipes. They show you everything and help you understand
nothing. This platform applies an AI layer that:
- Filters the TEFAS universe to a personalized shortlist based on risk profile and goals
- Detects when a previously strong fund's real return trend is deteriorating
- Surfaces rebalancing opportunities before they become regrets
- Translates macro events (CBRT rate decisions, CPI prints) into portfolio-specific implications

The interface surfaces **conclusions, not data dumps**.

### 3.3 Unified Wealth View Across Instruments
Turkish investors are inherently multi-instrument by necessity — you hold TRY funds, gold,
USD, maybe equities. This platform is the first to unify them under a single real-purchasing-power
ledger, regardless of where the underlying assets are custodied.

### 3.4 The Experience as a Signal of Quality
Premium design is not aesthetic indulgence here — it is a product decision. In a market where
financial anxiety is endemic, **calm, spatial, and precise UI is itself a therapeutic intervention**.
An interface that feels like Linear or Arc communicates: *this was built by people who take your
money seriously*. That trust signal is a differentiator no feature roadmap can manufacture quickly.

### 3.5 Turkey-Native by Architecture, Not by Localization
Competitors are global platforms translated into Turkish. This platform is built from the ground
up with Turkish financial realities embedded in the data model:
- TRY volatility and inflation as first-class entities
- TEFAS fund taxonomy and fund codes as native types
- TCMB (Central Bank) policy rate as a benchmark, not an afterthought
- Gold (gram altın) as an asset class on par with equities

---

## 4. The Emotional Journey of the User

This is the most important product design document. Features exist to move users through
this emotional arc. If a feature does not serve the arc, it should not be built.

```
STAGE 1: Anxiety
  "I don't actually know if I'm ahead or behind inflation."
  "My money is in 4 different places and I can't see the whole picture."
  "I know I should be investing smarter but I don't know how."
  ↓
  [First encounter with the platform — onboarding, portfolio import]

STAGE 2: Recognition
  "Oh. My real return last year was actually negative."
  "I had no idea this fund has consistently beaten inflation for 3 years."
  "This is the first time I've seen my actual wealth in one place."
  ↓
  [Dashboard becomes the single source of truth]

STAGE 3: Orientation
  "I understand my current position."
  "I can see which instruments are working and which are eroding my wealth."
  "The AI suggestion makes sense — I can evaluate it."
  ↓
  [Regular engagement, weekly/monthly check-ins]

STAGE 4: Agency
  "I made an informed rebalancing decision and I understood why."
  "I'm no longer reacting to news — I have a strategy."
  "I feel like an investor, not a spectator."
  ↓
  [Platform becomes part of their financial identity]

STAGE 5: Mastery
  "I have consistent, compounding real returns."
  "I share this with my family or colleagues."
  "I trust this more than my bank's advisor."
  ↓
  [Advocacy, premium tier, long-term retention]
```

### Design Mandate from This Arc
- **Onboarding must resolve Stage 1 anxiety within 90 seconds** — the portfolio view must load
  fast, look trustworthy, and immediately show something true and meaningful
- **The dashboard is Stage 3, not Stage 1** — don't show everything on load; show orientation first
- **AI insights must feel like a trusted advisor, not a chatbot** — calm, specific, confident

---

## 5. Competitive Positioning

### The Landscape

| Platform | Strength | Fatal Weakness |
|---|---|---|
| **TEFAS.gov.tr** | Official data source | Institutional-grade ugly; zero intelligence |
| **Midas / Invstr** | Modern mobile UX | Global-first, Turkey-surface; nominal returns only |
| **Yapı Kredi / İş Bankası Apps** | Trust, integration | Legacy UI, no cross-instrument view |
| **Bloomberg Terminal** | Depth, data | ₺50K+/year, built for professionals |
| **Excel + Manual** | Full control | Labor-intensive, no automation, error-prone |

### Our Position

This platform occupies a previously vacant quadrant: **consumer-grade experience + professional-grade intelligence + Turkey-native data model**.

```
                    PROFESSIONAL INTELLIGENCE
                              ▲
                              │
             Bloomberg        │    ← THIS PLATFORM →
                              │
   GENERIC ──────────────────────────────────── TURKEY-NATIVE
                              │
                   Midas      │   Bank Apps
                              │
                              ▼
                    CONSUMER SIMPLICITY
```

We are not competing with Bloomberg — we are making Bloomberg-quality insight accessible to
the retail investor who cannot afford or navigate it.

We are not competing with Midas — we are serving a user who has outgrown gamified investing
and needs real portfolio intelligence.

We are competing with **the spreadsheet** — the current best tool of Turkey's sophisticated
retail investor. We win by doing everything a spreadsheet does, automatically, beautifully,
and with intelligence the spreadsheet cannot have.

### Tone of Voice in Market
- Bloomberg: authoritative, institutional, cold
- Midas/Robinhood: friendly, gamified, casual
- **This platform: precise, calm, intelligent, warm** — like a brilliant friend who happens
  to understand Turkish capital markets deeply

---

## 6. Strategic Principles for All Future Decisions

1. **Real returns are sacred.** Never let nominal numbers dominate without CPI context.
2. **Clarity over comprehensiveness.** A user should never feel overwhelmed. Hide depth
   behind deliberate interaction, not upfront.
3. **The AI layer earns trust slowly.** Insights must be explainable and specific.
   "This fund has beaten CPI for 11 of the last 12 months" beats "AI recommends this fund."
4. **Premium is not price — it is respect.** The experience communicates that we take the
   user's financial future as seriously as they do.
5. **Turkey-native is a moat.** Every local data integration (TEFAS, TCMB, TÜİK CPI,
   BIST) deepens the gap between us and generic global players.
