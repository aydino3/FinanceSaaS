# AI + Data Architecture Specification

> The authoritative reference for every data schema, AI pipeline, caching contract,
> and security boundary in the platform. Implementation must trace every field, index,
> and algorithm back to a decision made here.

---

## Architectural Philosophy

### Data Principles
1. **Real return is the canonical metric.** Nominal values are stored; real values are computed
   on read and cached. The computation is always `f(nominal, CPI_entry, CPI_current)` — never
   store a real return as a permanent field, as CPI revisions would make it stale.
2. **Immutable event log over mutable state.** Portfolio changes are events (buys, sells,
   dividends) not row updates. Current state is always derived from the event log.
3. **Schema versioning from day one.** Every major entity carries a `schema_version` field.
   Turkish regulatory requirements and TEFAS data structures change — the schema must absorb
   this without migrations that destroy history.
4. **Separation of raw data and computed data.** Raw source data (NAV prices, CPI values)
   lives in immutable append-only tables. Computed aggregates live in cache/materialized views.
   If a cache is lost, it can be recomputed from raw data.

### AI Principles
1. **Explainability over accuracy.** An insight the user cannot understand is useless and
   erodes trust. Every AI output carries a `reasoning_chain` that explains how it was derived.
2. **Conservative confidence thresholds.** The AI generates an insight only when confidence
   exceeds a defined threshold. Silence is preferable to a wrong, confident-sounding claim.
3. **Deterministic layer first, probabilistic layer second.** Rule-based signals (cash drag,
   inflation-beating streak end, allocation drift) fire before ML-derived signals. Rules are
   auditable; models are not.
4. **User feedback is ground truth.** Thumbs-down on an insight type suppresses that signal
   category for that user permanently. The system learns what each user considers noise.

---

## Part 1: Data Layer

---

### 1.1 Fund Universe — Static Metadata

**Entity: `Fund`**

Represents a single TEFAS-registered investment fund. This is the master record.
Updated at fund registration and when TEFAS reports structural changes.

```
Fund {
  // Identity
  id                    UUID            Primary key
  schema_version        INT             Schema version for this record
  fund_code             VARCHAR(6)      TEFAS fund code (e.g. "GAF", "AKBGYO")
                                        Unique, immutable after creation
  fund_name_tr          TEXT            Full Turkish name
  fund_name_short       TEXT            Short display name (max 40 chars)
  isin                  VARCHAR(12)     ISIN code if available (nullable)

  // Classification
  fund_type             ENUM            See FundType below
  fund_subtype          ENUM            See FundSubtype below
  risk_class            INT (1–7)       TEFAS risk classification (KIID-based)
                                        1 = lowest, 7 = highest
  umbrella_fund         BOOLEAN         True if this is a sub-fund of an umbrella
  umbrella_parent_code  VARCHAR(6)      Parent fund code if umbrella_fund = true

  // Management
  management_company_id UUID            FK → ManagementCompany
  portfolio_manager     TEXT            Named portfolio manager (nullable)
  inception_date        DATE            Fund launch date
  closure_date          DATE            Null if active

  // Financials
  management_fee_annual DECIMAL(5,4)    Annual management fee as decimal (0.0095 = 0.95%)
  total_expense_ratio   DECIMAL(5,4)    TER including all costs
  performance_fee       DECIMAL(5,4)    Performance fee rate (nullable)
  performance_fee_hurdle DECIMAL(5,4)   Hurdle rate for performance fee (nullable)
  min_investment_try    DECIMAL(18,2)   Minimum initial investment in TRY
  min_subsequent_try    DECIMAL(18,2)   Minimum subsequent investment in TRY

  // Operational
  settlement_days       INT             T+N settlement (typically 1 or 2)
  cut_off_time          TIME            Daily subscription/redemption cut-off
  liquidity_type        ENUM            DAILY | WEEKLY | MONTHLY | LOCKED
  distribution_channel  ENUM[]          TEFAS | DIRECT | BOTH

  // Metadata
  created_at            TIMESTAMPTZ
  updated_at            TIMESTAMPTZ
  data_source           ENUM            TEFAS_OFFICIAL | MANUAL | SCRAPED
  is_active             BOOLEAN
}

FundType ENUM:
  EQUITY                    Hisse senedi fonu
  BOND_TRY                  TL borçlanma araçları fonu
  BOND_FX                   Döviz borçlanma araçları fonu
  MONEY_MARKET              Para piyasası fonu
  MIXED                     Karma fon
  GOLD                      Altın fonu
  COMMODITY                 Emtia fonu
  REAL_ESTATE               Gayrimenkul fonu
  FUND_OF_FUNDS             Fon sepeti
  PARTICIPATION             Katılım fonu (interest-free)
  INDEX                     Endeks fonu
  ETF                       Borsa yatırım fonu

FundSubtype ENUM:
  LARGE_CAP | MID_CAP | SMALL_CAP  (for EQUITY)
  SHORT_DURATION | MEDIUM_DURATION | LONG_DURATION  (for BOND)
  GOVERNMENT | CORPORATE | MIXED  (for BOND)
  TRY_DENOMINATED | USD_DENOMINATED | EUR_DENOMINATED  (for FX types)
  PHYSICAL | SYNTHETIC  (for GOLD)
```

**Entity: `ManagementCompany`**

```
ManagementCompany {
  id                    UUID
  short_code            VARCHAR(8)      (e.g. "GARANTI", "AKBANK", "IS")
  full_name_tr          TEXT
  full_name_en          TEXT
  aum_total_try         DECIMAL(20,2)   Total AUM across all funds (refreshed daily)
  fund_count            INT
  founded_date          DATE
  license_number        TEXT            SPK license number
  website               TEXT
  is_active             BOOLEAN
}
```

---

### 1.2 Fund Time Series — NAV and AUM

**Entity: `FundDailySnapshot`**

Immutable. One record per fund per business day. Never updated — only appended.
This is the core price history table.

```
FundDailySnapshot {
  id                    UUID
  fund_id               UUID            FK → Fund
  snapshot_date         DATE            Business day of this NAV
  
  // Core price data
  nav_per_unit_try      DECIMAL(18,6)   Birim Pay Değeri (BPD) — 6 decimal precision
                                        Critical: TEFAS publishes 6 decimal places
  nav_total_try         DECIMAL(24,2)   Total fund NAV (AUM) in TRY
  unit_count            DECIMAL(24,6)   Total units outstanding
  
  // Derived (computed at ingest, not on read — performance optimization)
  daily_return_pct      DECIMAL(10,6)   (today_nav / yesterday_nav) - 1
  
  // Audit
  published_at          TIMESTAMPTZ     When TEFAS published this (typically 20:00 Turkey time)
  ingested_at           TIMESTAMPTZ     When our system ingested it
  source_checksum       VARCHAR(64)     SHA-256 of raw source data (for integrity verification)
  is_interpolated       BOOLEAN         True if this date had no TEFAS publish (holiday fill)
  
  // Constraint: UNIQUE(fund_id, snapshot_date)
}
```

**Indexes on `FundDailySnapshot`:**
```
PRIMARY:  (id)
UNIQUE:   (fund_id, snapshot_date)
COVERING: (fund_id, snapshot_date DESC, nav_per_unit_try)  -- time-series range scans
PARTIAL:  (snapshot_date) WHERE is_interpolated = false     -- live data queries
```

**Entity: `FundReturnCache`**

Materialized aggregates. Recomputed nightly. Invalidated on NAV revision.

```
FundReturnCache {
  fund_id               UUID
  computed_at           TIMESTAMPTZ
  
  // Nominal return over standard periods
  return_1d             DECIMAL(10,6)
  return_1w             DECIMAL(10,6)
  return_1m             DECIMAL(10,6)
  return_3m             DECIMAL(10,6)
  return_6m             DECIMAL(10,6)
  return_ytd            DECIMAL(10,6)
  return_1y             DECIMAL(10,6)
  return_2y             DECIMAL(10,6)
  return_3y             DECIMAL(10,6)
  return_5y             DECIMAL(10,6)
  return_inception      DECIMAL(10,6)
  
  // Real returns (inflation-adjusted using CPI at period start vs. latest)
  real_return_1m        DECIMAL(10,6)
  real_return_3m        DECIMAL(10,6)
  real_return_6m        DECIMAL(10,6)
  real_return_ytd       DECIMAL(10,6)
  real_return_1y        DECIMAL(10,6)
  real_return_2y        DECIMAL(10,6)
  real_return_3y        DECIMAL(10,6)
  
  // Risk metrics (rolling windows)
  volatility_1y         DECIMAL(10,6)   Annualized std dev of daily returns
  volatility_3y         DECIMAL(10,6)
  sharpe_1y             DECIMAL(10,6)   (return_1y - risk_free_rate_1y) / volatility_1y
  sharpe_3y             DECIMAL(10,6)
  max_drawdown_1y       DECIMAL(10,6)   Maximum peak-to-trough decline
  max_drawdown_3y       DECIMAL(10,6)
  calmar_ratio_3y       DECIMAL(10,6)   CAGR / max_drawdown
  sortino_ratio_1y      DECIMAL(10,6)   Downside deviation adjusted
  
  // CPI-relative metrics
  cpi_beat_months_12    INT             Months in last 12 where monthly return > monthly CPI
  cpi_beat_streak       INT             Current consecutive months beating CPI
  cpi_beat_streak_best  INT             Best ever consecutive CPI-beating streak
  real_cagr_3y          DECIMAL(10,6)   Real compound annual growth rate over 3 years
  
  // AUM metrics
  aum_current_try       DECIMAL(24,2)
  aum_change_1m_pct     DECIMAL(10,6)   AUM % change over 1 month (inflow/outflow signal)
  aum_change_3m_pct     DECIMAL(10,6)
  aum_change_6m_pct     DECIMAL(10,6)
}
```

---

### 1.3 Macroeconomic Reference Data

**Entity: `CPISnapshot`**

Turkish CPI (TÜFE) published monthly by TÜİK. Foundation of all real return calculations.

```
CPISnapshot {
  id                    UUID
  reference_month       DATE            First day of the reference month (e.g. 2026-05-01)
  
  // Core indices
  cpi_index             DECIMAL(12,4)   TÜFE general index value (base year = 2003)
  cpi_mom_pct           DECIMAL(8,4)    Month-over-month change %
  cpi_yoy_pct           DECIMAL(8,4)    Year-over-year change % (headline inflation)
  
  // Sub-indices (for advanced portfolio analysis)
  cpi_food_pct          DECIMAL(8,4)    Food and non-alcoholic beverages
  cpi_housing_pct       DECIMAL(8,4)    Housing, water, electricity
  cpi_transport_pct     DECIMAL(8,4)    Transportation
  cpi_core_pct          DECIMAL(8,4)    Core CPI (excluding food and energy)
  
  // Producer price index (leading indicator for future CPI)
  ppi_mom_pct           DECIMAL(8,4)
  ppi_yoy_pct           DECIMAL(8,4)
  
  // Source
  published_date        DATE            Date TÜİK published this (typically 3rd week of month+1)
  revision_number       INT             0 for initial, 1+ for revisions (TÜİK revises rarely)
  source_url            TEXT            TÜİK publication URL
  
  // UNIQUE(reference_month, revision_number)
}
```

**Entity: `TCMBRateSnapshot`**

Central Bank policy rate and key reference rates. Published by TCMB (CBRT).

```
TCMBRateSnapshot {
  id                    UUID
  effective_date        DATE            Date rate became effective
  
  // Policy rates
  policy_rate           DECIMAL(6,4)    One-week repo rate (main policy instrument)
  overnight_lending     DECIMAL(6,4)    Overnight lending rate
  overnight_borrowing   DECIMAL(6,4)    Overnight borrowing rate
  
  // Reference rates
  risk_free_rate        DECIMAL(6,4)    Used in Sharpe ratio: typically 3-month T-bill yield
  three_month_tbill     DECIMAL(6,4)
  two_year_bond         DECIMAL(6,4)
  ten_year_bond         DECIMAL(6,4)
  
  // FX reference rates (TCMB daily)
  usd_try_rate          DECIMAL(10,4)
  eur_try_rate          DECIMAL(10,4)
  gbp_try_rate          DECIMAL(10,4)
  
  // Gold
  gold_gram_try         DECIMAL(10,4)   Gram gold price in TRY
  gold_ons_usd          DECIMAL(10,4)   Ounce gold price in USD
  
  decision_date         DATE            TCMB MPC meeting date (nullable if no meeting)
  is_mpc_decision       BOOLEAN         True if this reflects an MPC rate change
  mpc_meeting_notes_url TEXT            Link to TCMB statement (nullable)
}
```

**Entity: `BISTMarketSnapshot`**

Istanbul Stock Exchange index data.

```
BISTMarketSnapshot {
  id                    UUID
  snapshot_date         DATE
  
  bist_100_close        DECIMAL(12,2)
  bist_100_return_1d    DECIMAL(8,4)
  bist_30_close         DECIMAL(12,2)
  bist_30_return_1d     DECIMAL(8,4)
  bist_100_volume_try   DECIMAL(20,2)   Daily traded volume
  
  // Sector indices (for fund attribution analysis)
  bist_bank_index       DECIMAL(12,2)
  bist_industry_index   DECIMAL(12,2)
  bist_services_index   DECIMAL(12,2)
  
  // Volatility signal
  bist_100_vol_20d      DECIMAL(8,4)    20-day rolling volatility
}
```

---

### 1.4 Real Return Calculation Schema

**The canonical formula — stored as documentation, not as a column:**

```
REAL_RETURN(position) =
  let nominal_return = (current_nav / entry_nav) - 1
  let cpi_entry      = CPISnapshot WHERE reference_month = floor_month(entry_date)
  let cpi_current    = CPISnapshot WHERE reference_month = latest_published_month
  let inflation_mult = cpi_current.cpi_index / cpi_entry.cpi_index
  in  ((1 + nominal_return) / inflation_mult) - 1

REAL_CAGR(position, years) =
  let holding_period_years = date_diff(exit_date, entry_date) / 365.25
  in  (1 + real_return) ^ (1 / holding_period_years) - 1
```

**Entity: `RealReturnComputationLog`**

Audit trail for all real return computations. Every time a real return is computed
for a user-facing display, a log entry is created. This enables debugging of "why
did my real return change?" — it always traces to a specific CPI revision or NAV update.

```
RealReturnComputationLog {
  id                    UUID
  computed_at           TIMESTAMPTZ
  computation_type      ENUM          POSITION | FUND | PORTFOLIO | COMPARISON

  // Inputs
  entity_id             UUID          Position ID or Fund ID
  entry_date            DATE
  exit_date             DATE          NULL for open positions (uses today)
  entry_nav             DECIMAL(18,6)
  exit_nav              DECIMAL(18,6) NULL for open positions
  entry_cpi_snapshot_id UUID          FK → CPISnapshot
  exit_cpi_snapshot_id  UUID          FK → CPISnapshot

  // Outputs
  nominal_return        DECIMAL(10,6)
  real_return           DECIMAL(10,6)
  inflation_multiple    DECIMAL(10,6) The CPI ratio used
  
  // Trigger
  triggered_by          ENUM          DAILY_BATCH | CPI_REVISION | USER_REQUEST | NAV_UPDATE
}
```

---

### 1.5 Portfolio Tracking — Event Sourcing Model

**Design decision: Event sourcing, not CRUD.**

Portfolio state is derived entirely from an ordered log of events. This provides:
- Complete, immutable audit history
- Point-in-time portfolio reconstruction (any date in history)
- Correct handling of corporate actions, fund mergers, fee deductions
- No destructive updates — mistakes are corrected by compensating events

**Entity: `PortfolioEvent`**

The single table from which all portfolio state is derived.

```
PortfolioEvent {
  id                    UUID            Immutable primary key
  schema_version        INT
  
  // Ownership
  user_id               UUID            FK → User
  portfolio_id          UUID            FK → Portfolio (a user may have multiple portfolios)
  
  // Event classification
  event_type            ENUM            See PortfolioEventType below
  event_date            DATE            Economic date of the event (when it happened)
  recorded_at           TIMESTAMPTZ     When user entered it into the system
  effective_at          TIMESTAMPTZ     When it takes effect for portfolio calculations
                                        (differs from recorded_at for back-dated entries)
  
  // Asset identification
  instrument_type       ENUM            FUND | EQUITY | GOLD | FX | CASH | CRYPTO
  instrument_id         UUID            FK → Fund (if FUND) | ExternalInstrument
  instrument_code       VARCHAR(20)     Denormalized fund_code or ticker for display
  
  // Transaction amounts
  units                 DECIMAL(24,6)   Units bought/sold (positive = buy, negative = sell)
  price_per_unit_try    DECIMAL(18,6)   NAV or execution price at time of event
  total_amount_try      DECIMAL(18,2)   units × price_per_unit_try (signed)
  fees_try              DECIMAL(10,2)   Transaction fees paid (always positive)
  
  // FX context (for non-TRY instruments)
  price_per_unit_native DECIMAL(18,6)   Price in native currency (e.g. USD for USD-denom fund)
  native_currency       CHAR(3)         ISO 4217 (TRY, USD, EUR, XAU)
  fx_rate_at_event      DECIMAL(10,4)   TRY/native rate at event date
  
  // Metadata
  notes                 TEXT            User annotation (nullable)
  source                ENUM            MANUAL | CSV_IMPORT | API_IMPORT | SYSTEM
  is_corrected          BOOLEAN         True if this event corrects a prior event
  corrects_event_id     UUID            FK → PortfolioEvent (if is_corrected = true)
  is_voided             BOOLEAN         Soft delete — voided events are excluded from state
  
  // CPI context at event time (snapshot for audit)
  cpi_at_event_id       UUID            FK → CPISnapshot
}

PortfolioEventType ENUM:
  BUY                   Standard purchase
  SELL                  Standard redemption/sale
  DIVIDEND_REINVEST     Dividend reinvested as new units
  DIVIDEND_CASH         Dividend paid out as cash
  FUND_MERGE_OUT        Units lost in a fund merger (source fund)
  FUND_MERGE_IN         Units received in a fund merger (target fund)
  SPLIT                 Unit split (e.g. 1:10 split)
  FEE_DEDUCTION         Management fee deducted from account cash
  TRANSFER_IN           Asset transferred in from external broker
  TRANSFER_OUT          Asset transferred out to external broker
  INITIAL_BALANCE       Opening balance for imported historical data
  CORRECTION            Administrative correction (requires corrects_event_id)
```

**Entity: `Portfolio`**

```
Portfolio {
  id                    UUID
  user_id               UUID            FK → User
  name                  TEXT            User-defined name (e.g. "Ana Portföy", "Emeklilik")
  currency              CHAR(3)         Base currency — always TRY for this platform
  is_default            BOOLEAN         One portfolio is designated the primary view
  created_at            TIMESTAMPTZ
  benchmark_fund_id     UUID            FK → Fund (optional user-selected benchmark)
  benchmark_index       ENUM            BIST_100 | BIST_30 | CPI | TCMB_RATE | GOLD
}
```

**Derived View: `PortfolioPositionView`**

Not a stored table — a computed view derived from `PortfolioEvent`. Materialized nightly
and on any event mutation. The platform's most-read entity.

```
PortfolioPositionView {
  portfolio_id          UUID
  instrument_id         UUID
  instrument_type       ENUM
  instrument_code       VARCHAR(20)
  
  // Derived from events
  units_held            DECIMAL(24,6)   Net units (sum of all buy/sell events)
  total_invested_try    DECIMAL(18,2)   Total capital deployed (cost basis)
  average_cost_try      DECIMAL(18,6)   Weighted average cost per unit
  first_entry_date      DATE            Date of first BUY event
  last_event_date       DATE            Date of most recent event
  
  // Current market values (joined from latest NAV)
  current_nav_try       DECIMAL(18,6)
  current_value_try     DECIMAL(18,2)   units_held × current_nav_try
  
  // Return calculations
  nominal_pnl_try       DECIMAL(18,2)   current_value_try - total_invested_try
  nominal_return_pct    DECIMAL(10,6)
  real_return_pct       DECIMAL(10,6)   Computed using RealReturn formula
  
  // CPI context
  entry_cpi_index       DECIMAL(12,4)   CPI at first_entry_date
  current_cpi_index     DECIMAL(12,4)   Latest published CPI
  inflation_multiple    DECIMAL(10,6)   current_cpi / entry_cpi
  
  // Portfolio weight
  portfolio_weight_pct  DECIMAL(8,4)    Position as % of total portfolio value
  
  computed_at           TIMESTAMPTZ
}
```

---

### 1.6 User Profile and Preferences Schema

```
User {
  id                    UUID
  email                 TEXT            Unique, lowercase
  phone                 TEXT            E.164 format, nullable
  full_name             TEXT
  created_at            TIMESTAMPTZ
  last_active_at        TIMESTAMPTZ
  subscription_tier     ENUM            FREE | PREMIUM | PROFESSIONAL
  subscription_expires  TIMESTAMPTZ
}

UserProfile {
  user_id               UUID            FK → User (1:1)
  
  // Financial profile (set during onboarding)
  risk_tolerance        INT (1–5)       1 = very conservative, 5 = aggressive
  investment_horizon    ENUM            SHORT_1Y | MEDIUM_3Y | LONG_5Y | VERY_LONG_10Y
  primary_goal          ENUM            INFLATION_PROTECTION | WEALTH_GROWTH |
                                        INCOME | CAPITAL_PRESERVATION | RETIREMENT
  monthly_income_try    DECIMAL(14,2)   Nullable, used for cash drag calculation
  monthly_savings_try   DECIMAL(14,2)   Target monthly investment amount
  
  // Preferences
  preferred_currency    CHAR(3)         TRY (default) or USD for display
  show_real_returns     BOOLEAN         Default: true (core platform behavior)
  decimal_separator     CHAR(1)         "," for Turkish notation (default)
  
  // Notification preferences
  brief_delivery_time   TIME            Default: 08:00 local
  brief_enabled         BOOLEAN
  alert_push_enabled    BOOLEAN
  alert_email_enabled   BOOLEAN
  alert_quiet_from      TIME
  alert_quiet_until     TIME
}

UserInsightPreference {
  user_id               UUID
  insight_type          ENUM            See InsightType in AI section
  is_suppressed         BOOLEAN         User dismissed this insight type
  suppressed_at         TIMESTAMPTZ
  feedback_count        INT             Times user gave positive feedback
  dismiss_count         INT             Times user dismissed without feedback
}
```

---

## Part 2: AI Intelligence Layer

---

### 2.1 Signal Registry

All AI outputs begin as **signals** — discrete, typed observations about the data.
Signals are the atomic unit of the AI layer. Insights are compositions of signals.

**Entity: `Signal`**

```
Signal {
  id                    UUID
  generated_at          TIMESTAMPTZ
  
  // Classification
  signal_type           ENUM            See SignalType below
  signal_layer          ENUM            DETERMINISTIC | STATISTICAL | ML_DERIVED
  confidence            DECIMAL(4,3)    0.000 – 1.000
  priority              ENUM            CRITICAL | HIGH | MEDIUM | LOW | INFORMATIONAL
  
  // Scope
  scope_type            ENUM            FUND | PORTFOLIO | USER | MARKET | MACRO
  scope_id              UUID            FK to the relevant entity
  user_id               UUID            NULL if market-wide signal
  
  // Content
  signal_data           JSONB           Structured payload — see per-type schemas below
  reasoning_chain       JSONB           Step-by-step derivation (for explainability)
  
  // Lifecycle
  is_active             BOOLEAN         False when signal condition is no longer true
  expires_at            TIMESTAMPTZ     When this signal should be re-evaluated
  deactivated_at        TIMESTAMPTZ
  deactivation_reason   ENUM            CONDITION_RESOLVED | SUPERSEDED | USER_DISMISSED
                                        EXPIRED | MANUAL_OVERRIDE
  
  // User interaction
  was_surfaced          BOOLEAN         Was this included in a brief or alert?
  user_feedback         ENUM            POSITIVE | NEGATIVE | NEUTRAL | NULL
  feedback_at           TIMESTAMPTZ
}

SignalType ENUM:
  // Deterministic — rule-based, no model
  CASH_DRAG                  TRY cash holding losing real value at >X%/month
  INFLATION_BEAT_STREAK_END  Fund stopped beating CPI after N consecutive months
  INFLATION_BEAT_STREAK_NEW  Fund has beaten CPI for N consecutive months (new record)
  ALLOCATION_DRIFT           Portfolio allocation has drifted >X% from user's target
  EXPENSE_DRAG               Total fund fees exceeding X% of nominal return
  CONCENTRATION_RISK         Single position exceeds X% of portfolio
  MATURITY_MISMATCH          Bond fund duration mismatched to user's investment horizon
  FUND_AUM_DECLINE           Fund AUM declining for N consecutive months (liquidity risk)
  FUND_AUM_RAPID_GROWTH      Fund AUM growing very fast (performance dilution risk)
  NEGATIVE_REAL_RETURN_60D   Position has had negative real return for 60+ days
  SETTLEMENT_DELAY_RISK      User has redemption request near upcoming holiday

  // Statistical — computed from time-series analysis
  MOMENTUM_SHIFT             Fund's return momentum shifting (rolling regression change)
  VOLATILITY_REGIME_CHANGE   Fund volatility significantly above/below historical norm
  CORRELATION_BREAKDOWN      Two historically uncorrelated positions now correlating
  DRAWDOWN_APPROACHING       Position within X% of historical max drawdown
  REVERSION_SIGNAL           Fund showing mean-reversion setup after extended run
  AUM_FLOW_ANOMALY           Abnormal inflow/outflow pattern vs. historical baseline
  MANAGER_ALPHA_DECAY        Manager's alpha vs. benchmark declining over rolling window

  // Macroeconomic
  MACRO_RATE_CHANGE          TCMB policy rate changed
  MACRO_CPI_RELEASE          Monthly CPI data published — above/below consensus
  MACRO_CPI_SURPRISE         CPI significantly deviates from prior trend
  MACRO_FX_MOVE              TRY moved >X% in single session
  MACRO_MARKET_STRESS        BIST-100 drawdown >X% from recent peak

  // ML-derived (lower confidence threshold required)
  FUND_PEER_OUTPERFORMANCE   Fund ranked significantly above peer group (model-scored)
  PORTFOLIO_EFFICIENCY       Portfolio suboptimal on efficient frontier (ML-estimated)
  REBALANCE_OPPORTUNITY      ML-identified rebalancing opportunity with expected impact
  INFLATION_HEDGE_SCORE      Fund's inflation-hedging quality score changed materially
```

---

### 2.2 Automated Fund Analysis Engine

**Purpose:** Continuously score every active fund across multiple dimensions.
Runs nightly after TEFAS NAV ingest. Outputs are `FundAnalysisScore` records.

**Entity: `FundAnalysisScore`**

```
FundAnalysisScore {
  id                    UUID
  fund_id               UUID
  scored_at             TIMESTAMPTZ
  scoring_period        ENUM            CURRENT | ROLLING_1Y | ROLLING_3Y
  
  // ─────────────────────────────────────────────
  // Dimension 1: Inflation Protection Score (0–100)
  // ─────────────────────────────────────────────
  inflation_protection_score    INT
  // Inputs:
  cpi_beat_months_24            INT       Months beating CPI over 2 years
  real_return_1y                DECIMAL
  real_return_3y                DECIMAL
  real_cagr_3y                  DECIMAL
  // Scoring weights: 40% real_return_1y + 35% cpi_beat_months + 25% real_cagr_3y
  
  // ─────────────────────────────────────────────
  // Dimension 2: Risk-Adjusted Quality Score (0–100)
  // ─────────────────────────────────────────────
  risk_adjusted_score           INT
  // Inputs:
  sharpe_1y                     DECIMAL
  sharpe_3y                     DECIMAL
  sortino_ratio_1y              DECIMAL
  max_drawdown_3y               DECIMAL
  volatility_percentile_3y      INT       Rank among peers (0–100, lower = less volatile)
  // Scoring: normalized and weighted composite

  // ─────────────────────────────────────────────
  // Dimension 3: Manager Consistency Score (0–100)
  // ─────────────────────────────────────────────
  manager_consistency_score     INT
  // Inputs:
  return_consistency_score      INT       Rolling 12-month return quartile consistency
  peer_outperformance_streak    INT       Consecutive months above peer median
  information_ratio_1y          DECIMAL   Active return / tracking error
  alpha_3y                      DECIMAL   CAPM alpha vs. benchmark
  
  // ─────────────────────────────────────────────
  // Dimension 4: Operational Health Score (0–100)
  // ─────────────────────────────────────────────
  operational_score             INT
  // Inputs:
  aum_trend_6m                  ENUM      GROWING | STABLE | DECLINING | RAPID_DECLINE
  aum_size_percentile           INT       AUM size rank vs. peers (large = operationally stable)
  expense_ratio_percentile      INT       Rank among peers (lower = cheaper)
  liquidity_score               INT       Based on AUM size + settlement terms + daily volume
  
  // ─────────────────────────────────────────────
  // Composite Score
  // ─────────────────────────────────────────────
  composite_score               INT       Weighted: 35% inflation + 30% risk + 20% manager + 15% ops
  composite_percentile          INT       Rank within fund type (0–100)
  composite_grade               ENUM      A+ | A | B+ | B | C+ | C | D | F
  
  // AI Narrative
  narrative_summary             TEXT      2–3 sentence plain-language summary
  narrative_key_strength        TEXT      Single strongest attribute in one sentence
  narrative_key_risk            TEXT      Single most significant risk in one sentence
  narrative_generation_version  INT       Model/rule version used to generate narrative
  
  // Signals generated from this analysis
  signal_ids                    UUID[]    FK → Signal[]
}
```

**Fund Analysis Pipeline Stages:**

```
Stage 1: Data Validation
  Input:  FundDailySnapshot (last 3 years), CPISnapshot (last 3 years)
  Check:  Minimum data requirements (need ≥ 252 trading days for 1Y metrics)
  Check:  No anomalous NAV jumps (>±20% daily without a known corporate action)
  Output: VALID | INSUFFICIENT_HISTORY | DATA_QUALITY_ISSUE

Stage 2: Return Computation
  Input:  Validated FundDailySnapshot series
  Compute: All FundReturnCache fields
  Compute: Real returns using CPISnapshot series
  Output: FundReturnCache record (upsert)

Stage 3: Risk Metric Computation
  Input:  FundReturnCache daily returns series
  Compute: Volatility, Sharpe, Sortino, Max Drawdown, Calmar
  Compute: Rolling correlations against BIST-100, CPI, gold, USD/TRY
  Output: Written to FundReturnCache

Stage 4: Peer Comparison
  Input:  All FundReturnCache records for same FundType
  Compute: Percentile ranks across all dimensions
  Compute: Peer median, quartile boundaries
  Output: FundPeerComparison record

Stage 5: Signal Detection (Deterministic Layer)
  Input:  FundReturnCache, FundAnalysisScore (prior), FundDailySnapshot
  Evaluate: Each deterministic SignalType condition against fund data
  Generate: Signal records for any triggered conditions
  Output: Signal records (insert or update existing active signals)

Stage 6: Narrative Generation
  Input:  All computed scores, active signals, fund metadata
  Generate: Plain-language summary using template + variable substitution
             (not a pure LLM call — structured templates with data insertions
             for reliability and cost control)
  Output: narrative_summary, narrative_key_strength, narrative_key_risk

Stage 7: Score Finalization
  Input:  All stage outputs
  Compute: Composite score, percentile, grade
  Upsert: FundAnalysisScore record
```

---

### 2.3 Macroeconomic Insight Generator

**Purpose:** Translate macro data releases and market events into portfolio-specific
implications. Runs on event trigger (new CPISnapshot, TCMBRateSnapshot, or market event)
and on the nightly batch.

**Entity: `MacroEvent`**

```
MacroEvent {
  id                    UUID
  event_type            ENUM            CPI_RELEASE | TCMB_RATE_DECISION | BIST_MOVE
                                        FX_MOVE | BOND_AUCTION | GDP_RELEASE
                                        BUDGET_ANNOUNCEMENT | IMF_REPORT | GLOBAL_RISK
  event_date            TIMESTAMPTZ
  
  // Event data
  headline              TEXT            Short headline (max 100 chars)
  event_data            JSONB           Structured event-specific payload
  // CPI_RELEASE: { yoy_pct, mom_pct, core_pct, vs_consensus, prior_yoy_pct }
  // TCMB_RATE:   { new_rate, prior_rate, change_bps, decision_text_url }
  // BIST_MOVE:   { index, return_1d, from_peak_pct, volume_ratio }
  // FX_MOVE:     { pair, return_1d, return_5d, 52w_position }
  
  // Market surprise measure
  consensus_estimate    DECIMAL(10,4)   Pre-event consensus (where available)
  surprise_magnitude    DECIMAL(8,4)    Actual - consensus (signed)
  surprise_direction    ENUM            HAWKISH | DOVISH | POSITIVE | NEGATIVE | NEUTRAL
  
  // Source
  source_name           TEXT            "TÜİK" | "TCMB" | "BIST" etc.
  source_url            TEXT
}
```

**Entity: `MacroInsight`**

The derived insight — a MacroEvent translated into portfolio-specific language.

```
MacroInsight {
  id                    UUID
  macro_event_id        UUID            FK → MacroEvent
  generated_at          TIMESTAMPTZ
  generation_version    INT
  
  // Content
  portfolio_impact_summary  TEXT        What this means for portfolios (general)
  action_urgency            ENUM        IMMEDIATE | MONITOR | INFORMATIONAL | NO_ACTION
  
  // Affected fund categories
  affected_fund_types       FundType[]  Which fund types are materially affected
  affected_direction        ENUM        POSITIVE | NEGATIVE | MIXED | NEUTRAL
  impact_explanation        TEXT        Why these fund types are affected (1–2 sentences)
  
  // Historical precedent
  historical_precedents     JSONB
  // [{
  //   date: "2023-05-25", event_description: "TCMB held rate at 8.5%",
  //   subsequent_bist_return_30d: -0.031, subsequent_bond_return_30d: 0.018
  // }]
  precedent_confidence      ENUM        STRONG | MODERATE | WEAK | NONE
  
  // Signals generated
  signal_ids                UUID[]
}
```

**Entity: `UserMacroImpact`**

The personalized version — MacroInsight applied to a specific user's portfolio.
Generated per-user during the nightly batch or on event trigger for high-urgency events.

```
UserMacroImpact {
  id                    UUID
  user_id               UUID
  macro_insight_id      UUID            FK → MacroInsight
  generated_at          TIMESTAMPTZ
  
  // User's specific exposure
  affected_positions    JSONB
  // [{
  //   instrument_code: "GAF-P", instrument_name: "...",
  //   portfolio_weight_pct: 28.4, impact_direction: "POSITIVE",
  //   impact_explanation: "Para piyasası funds benefit from elevated short rates"
  // }]
  
  total_portfolio_impact_direction  ENUM    POSITIVE | NEGATIVE | MIXED | MINIMAL
  impact_magnitude                  ENUM    SIGNIFICANT | MODERATE | MARGINAL | NEGLIGIBLE
  
  // Recommended action (conservative — explicit opt-in for suggestions)
  suggested_action      ENUM            NONE | REVIEW | CONSIDER_REBALANCE | URGENT_REVIEW
  suggested_action_text TEXT            Specific, non-generic recommendation (nullable)
  
  // Was shown to user?
  included_in_brief_id  UUID            FK → DailyBrief (nullable)
  shown_at              TIMESTAMPTZ
}
```

---

### 2.4 Portfolio Intelligence & Risk Scoring System

**Entity: `PortfolioRiskSnapshot`**

Computed nightly. One record per portfolio per day.

```
PortfolioRiskSnapshot {
  id                    UUID
  portfolio_id          UUID
  computed_at           TIMESTAMPTZ
  
  // ─────────────────────────────────────────────
  // Portfolio-level return metrics
  // ─────────────────────────────────────────────
  total_value_try             DECIMAL(20,2)
  total_invested_try          DECIMAL(20,2)
  unrealized_pnl_try          DECIMAL(20,2)
  nominal_return_ytd          DECIMAL(10,6)
  nominal_return_1y           DECIMAL(10,6)
  real_return_ytd             DECIMAL(10,6)
  real_return_1y              DECIMAL(10,6)
  real_cagr_inception         DECIMAL(10,6)
  cpi_beat_months_12          INT
  
  // ─────────────────────────────────────────────
  // Portfolio risk metrics
  // ─────────────────────────────────────────────
  portfolio_volatility_1y     DECIMAL(10,6)   Weighted volatility using covariance matrix
  portfolio_sharpe_1y         DECIMAL(10,6)
  portfolio_sortino_1y        DECIMAL(10,6)
  max_drawdown_1y             DECIMAL(10,6)
  value_at_risk_95_1m         DECIMAL(10,6)   95% VaR over 1 month (parametric)
  
  // ─────────────────────────────────────────────
  // Concentration & Diversification
  // ─────────────────────────────────────────────
  herfindahl_index            DECIMAL(6,4)    Portfolio concentration (0 = diversified, 1 = single)
  effective_n_positions       DECIMAL(6,2)    1 / Herfindahl (diversification equivalent N)
  largest_position_pct        DECIMAL(6,4)
  largest_fund_type_pct       DECIMAL(6,4)
  single_manager_max_pct      DECIMAL(6,4)    Max exposure to any single management company
  
  // ─────────────────────────────────────────────
  // Inflation exposure quality
  // ─────────────────────────────────────────────
  weighted_inflation_protection_score   INT   Weighted by position size
  portfolio_real_return_quality         ENUM  STRONG | ADEQUATE | WEAK | NEGATIVE
  cash_drag_monthly_pct                 DECIMAL(8,4)  Real value lost/month from TRY cash
  cash_position_pct                     DECIMAL(6,4)  % of portfolio in cash equivalents
  
  // ─────────────────────────────────────────────
  // Factor exposures (beta to macro factors)
  // ─────────────────────────────────────────────
  equity_beta_bist100         DECIMAL(6,4)
  duration_years              DECIMAL(6,2)    Weighted average bond duration
  gold_exposure_pct           DECIMAL(6,4)    Direct + indirect gold exposure
  fx_exposure_pct             DECIMAL(6,4)    Non-TRY exposure
  rate_sensitivity            DECIMAL(8,4)    Portfolio value change per 100bps rate move
  cpi_sensitivity             DECIMAL(8,4)    Portfolio value change per 1% CPI change
  
  // ─────────────────────────────────────────────
  // Risk Score (composite, 0–100, higher = more risk)
  // ─────────────────────────────────────────────
  risk_score                  INT
  risk_score_label            ENUM            CONSERVATIVE | MODERATE | BALANCED
                                              GROWTH | AGGRESSIVE
  risk_vs_tolerance_delta     INT             risk_score - user risk_tolerance*20
                                              Positive = riskier than stated tolerance
  
  // Signals generated
  signal_ids                  UUID[]
}
```

**Portfolio Risk Signal Generation Rules:**

```
Rule: CONCENTRATION_RISK
  Condition: largest_position_pct > 0.35 (35%)
  Priority: HIGH
  Signal data: { position_code, current_pct, threshold_pct: 0.35 }

Rule: CASH_DRAG
  Condition: cash_position_pct > 0.15 AND cash_drag_monthly_pct > 0.02
  Priority: MEDIUM
  Signal data: { cash_amount_try, monthly_loss_try, annualized_loss_try }

Rule: RISK_TOLERANCE_BREACH
  Condition: abs(risk_vs_tolerance_delta) > 20
  Priority: HIGH
  Signal data: { risk_score, tolerance_score, delta, direction }

Rule: NEGATIVE_REAL_PORTFOLIO
  Condition: real_return_ytd < 0
  Priority: MEDIUM
  Signal data: { real_return_ytd, cpi_ytd, underperformance_pct }

Rule: SINGLE_MANAGER_CONCENTRATION
  Condition: single_manager_max_pct > 0.50
  Priority: MEDIUM
  Signal data: { manager_name, exposure_pct }

Rule: HIGH_RATE_SENSITIVITY_AHEAD_OF_MEETING
  Condition: abs(rate_sensitivity) > 0.05 AND tcmb_meeting_within_7_days = true
  Priority: MEDIUM
  Signal data: { rate_sensitivity, meeting_date, directional_exposure }
```

---

### 2.5 Daily Personalized Financial Briefing System

**Entity: `DailyBrief`**

One record per user per calendar day. Assembled by the nightly batch pipeline
(runs at 03:00 local time to be ready for 08:00 delivery).

```
DailyBrief {
  id                    UUID
  user_id               UUID
  brief_date            DATE            The date this brief is for
  generated_at          TIMESTAMPTZ
  generation_version    INT             Pipeline version
  
  // ─────────────────────────────────────────────
  // Brief Assembly Inputs
  // ─────────────────────────────────────────────
  portfolio_snapshot_id       UUID      FK → PortfolioRiskSnapshot used
  macro_events_considered     UUID[]    FK → MacroEvent[] evaluated
  signals_evaluated           UUID[]    FK → Signal[] evaluated before curation
  
  // ─────────────────────────────────────────────
  // Brief Content Structure
  // ─────────────────────────────────────────────
  greeting_line               TEXT      "Good morning, [first_name]."
  
  portfolio_status_line       TEXT      Single sentence: real return context for today
  // "Your portfolio real return this month is +1.2% above CPI."
  
  insight_count               INT       Number of insights in this brief (max 3)
  insights                    JSONB     Ordered array of BriefInsight (see below)
  
  closing_line                TEXT      Single calming sentence
  // "No action required today. Your allocation is within your defined parameters."
  // OR: "One item worth your attention — see insight 2."
  
  // ─────────────────────────────────────────────
  // Delivery State
  // ─────────────────────────────────────────────
  delivered_at                TIMESTAMPTZ   NULL until delivered
  opened_at                   TIMESTAMPTZ   NULL until user opens it
  read_duration_seconds       INT           Time spent reading (from client heartbeat)
  
  // Signals that were surfaced in this brief
  surfaced_signal_ids         UUID[]
}

BriefInsight {
  // Embedded JSONB in DailyBrief.insights array
  
  insight_number              INT (1–3)
  signal_id                   UUID          Source signal for this insight
  insight_type                SignalType
  
  headline                    TEXT          One sentence, specific, no hedging
  body                        TEXT          2–4 sentences of context and reasoning
  reasoning_summary           TEXT          Plain-language explanation of derivation
  
  action_required             BOOLEAN
  suggested_action_type       ENUM          NONE | REVIEW_FUND | CONSIDER_REBALANCE
                                            ADD_TO_WATCHLIST | REDUCE_CASH | REVIEW_ALLOCATION
  suggested_action_route      TEXT          Deep link within the app (e.g. "/portfolio")
  affected_instrument_codes   VARCHAR[]     Fund codes directly relevant to this insight
  
  confidence                  DECIMAL(4,3)  From source signal
  is_recurring                BOOLEAN       True if this same insight appeared in prior 7 days
  last_surfaced_date          DATE          When this was last in a brief
}
```

**Brief Assembly Pipeline:**

```
Step 1: Signal Collection (inputs)
  Query: All active signals for this user with expires_at > now()
  Query: MacroInsights generated in past 48 hours with user impact
  Query: Portfolio signals from latest PortfolioRiskSnapshot
  Query: Fund signals for user's held positions
  Filter: Remove signals where UserInsightPreference.is_suppressed = true

Step 2: Signal Scoring & Ranking
  Score each signal by: priority_weight × recency_weight × portfolio_impact_weight
  priority_weight:       CRITICAL=1.0, HIGH=0.8, MEDIUM=0.5, LOW=0.2, INFO=0.05
  recency_weight:        exp(-days_since_generated / 7)  — signals decay over 7 days
  portfolio_impact_weight: position_weight × confidence
  Sort descending by composite score

Step 3: Deduplication
  If two signals of same SignalType exist for same instrument:
    Keep highest-confidence signal; mark other as SUPERSEDED

Step 4: Insight Selection (max 3)
  Select top 3 scored signals post-dedup
  Apply diversity constraint: no more than 2 signals of same category in one brief
    (e.g., max 2 fund-level signals, must include a portfolio or macro if available)
  Apply novelty constraint: if insight appeared in last 3 briefs, demote unless CRITICAL

Step 5: Content Generation
  For each selected signal: map SignalType → BriefInsight template
  Fill template variables from signal_data and entity metadata
  Generate reasoning_summary from reasoning_chain (structured extraction, not LLM)

Step 6: Closing Line Selection
  if any insight has action_required = true → "One item worth your attention — see insight N."
  elif risk_vs_tolerance_delta > 20 → "Your portfolio risk has drifted — worth reviewing."
  else → "No action required today. Your allocation is within your defined parameters."
  
Step 7: Brief Finalization
  Persist DailyBrief record
  Mark surfaced signals as was_surfaced = true
  Schedule delivery for user's configured brief_delivery_time
```

---

## Part 3: System Integration

---

### 3.1 Data Ingestion Architecture

**External data sources and their latency profiles:**

```
Source              Update Frequency    Latency      Method
──────────────────────────────────────────────────────────────────
TEFAS NAV data      Business days       ~20:30 TRT   HTTP poll / scrape
TÜİK CPI            Monthly             ~3rd week    HTTP fetch (TÜİK API)
TCMB rates          Daily / on decision Daily 15:30  TCMB EVDS API
BIST indices        Trading hours       15-min delay BIST data feed / proxy
TCMB FX rates       Daily               ~15:30 TRT   TCMB EVDS API
Gold prices         Continuous          15-min delay Exchange feed / proxy
```

**Ingestion Pipeline:**

```
Ingestor → Raw Staging Table → Validator → Canonical Table → Cache Invalidator

Raw Staging: every raw payload is stored before processing
  - Enables replay if processing has a bug
  - Immutable — never deleted, only marked as processed
  - Stored as: { source, fetched_at, raw_payload: JSONB, processing_status, error_message }

Validator: checks data quality before promotion to canonical tables
  - NAV validation: |(today_nav / yesterday_nav) - 1| < 0.20 (flag if >20% daily change)
  - CPI validation: |yoy_pct - prior_yoy_pct| < 30 percentage points (flag large revisions)
  - TCMB FX: |today_rate / yesterday_rate - 1| < 0.15 (flag >15% single-day moves)
  - Failed validation: stage with status=FLAGGED, alert ops team, do not promote
  - Validated: promote to canonical table, trigger Cache Invalidator

Cache Invalidator: after every canonical write
  - Identify which FundReturnCache records are stale
  - Identify which PortfolioRiskSnapshot records need recomputation
  - Queue recomputation jobs (async, priority queued)
  - Do NOT block the ingestion pipeline on recomputation
```

---

### 3.2 Caching Strategy

**Cache taxonomy — four distinct cache tiers:**

```
Tier 1: Hot Cache (Redis, in-memory)
  Purpose:     Sub-100ms response for user-facing read paths
  Contents:    Latest NAV per fund, user portfolio view, today's AI brief
  TTL:         NAV → invalidate on new ingest (event-driven)
               Portfolio view → 5 minutes (user changes invalidate immediately)
               Brief → until next brief generation (24 hours)
  Key pattern: nav:{fund_id}:latest
               portfolio:{portfolio_id}:positions
               brief:{user_id}:{date}

Tier 2: Warm Cache (Redis, longer-lived)
  Purpose:     Computed aggregates that are expensive to recompute
  Contents:    FundReturnCache (all periods), FundAnalysisScore, peer percentiles
  TTL:         FundReturnCache → 24h (refreshed nightly after NAV ingest)
               FundAnalysisScore → 24h
               Peer percentiles → 24h
  Key pattern: fund:{fund_id}:returns
               fund:{fund_id}:score
               peer:{fund_type}:percentiles

Tier 3: Computed View Cache (PostgreSQL materialized views)
  Purpose:     Complex joins that span multiple tables (PortfolioPositionView, etc.)
  Contents:    PortfolioPositionView, FundPeerComparison
  Refresh:     CONCURRENTLY on nightly batch, and on portfolio event mutation
               CONCURRENTLY = no read lock during refresh
  Staleness:   Portfolio views may be up to 5 minutes stale after a user trade entry
               Fund comparison views are daily-fresh

Tier 4: Static/Slow Cache (CDN + long-lived Redis)
  Purpose:     Rarely changing reference data
  Contents:    Fund metadata (name, type, manager), ManagementCompany records,
               CPI historical series (before current month), TCMB rate history
  TTL:         Fund metadata → 7 days (changes only on fund amendments)
               Historical CPI → 30 days (rarely revised)
               Historical TCMB rates → 30 days
  Cache-Control: public, max-age=86400 for API responses serving this data
```

**Cache Invalidation Rules:**

```
Event: New FundDailySnapshot ingested
  → Invalidate: Tier 1: nav:{fund_id}:latest
  → Queue:      Tier 2 recompute for fund_id (FundReturnCache)
  → Queue:      Tier 3 refresh for any portfolio containing this fund
  → Queue:      Nightly analysis pipeline for this fund

Event: New CPISnapshot ingested
  → Queue:      ALL FundReturnCache recomputation (CPI affects all real returns)
  → Queue:      ALL PortfolioRiskSnapshot recomputation for all active portfolios
  → Invalidate: All Tier 2 fund return caches (bulk invalidation)
  NOTE: CPI ingestion is high-impact — process during low-traffic window

Event: PortfolioEvent created/voided
  → Invalidate: Tier 1: portfolio:{portfolio_id}:positions
  → Queue:      Tier 3 materialized view refresh for portfolio_id
  → Queue:      PortfolioRiskSnapshot recomputation for portfolio_id
  → Queue:      DailyBrief regeneration for user_id (if event is significant)

Event: New MacroEvent created
  → Queue:      MacroInsight generation
  → Queue:      UserMacroImpact generation for all affected users (fan-out)
  NOTE: High-urgency events (TCMB rate decision) bypass queue → immediate processing
```

---

### 3.3 Real-Time Update Patterns

**Update delivery to the client:**

```
Pattern A: Server-Sent Events (SSE) for portfolio value updates
  Endpoint:   GET /api/stream/portfolio/{portfolio_id}
  Events:     nav_updated (new NAV for a held fund), portfolio_value_changed
  Client:     EventSource API, auto-reconnect
  Server:     Redis Pub/Sub → SSE bridge
  Rate limit: 1 event per fund per 60 seconds to the client (debounced)

Pattern B: Polling for brief and signals
  Brief:      Polled at page load + after configured delivery time (not SSE)
  Signals:    GET /api/signals?since={last_checked_at} — lightweight poll on focus
  Interval:   On tab focus only (not background polling) — IntersectionObserver pattern

Pattern C: Webhook for critical alerts
  Channel:    Push notification (PWA Web Push API)
  Trigger:    CRITICAL or HIGH priority signals where alert_push_enabled = true
  Payload:    { signal_type, headline, action_route } — minimal, no sensitive data in payload
  Quiet hours: Respected at server-side before dispatch

Pattern D: Stale-While-Revalidate for fund data
  Most fund data (NAV, scores) uses SWR pattern:
  - Return cached data immediately
  - Revalidate in background
  - Update UI when fresh data arrives (smooth value transition, not jarring replacement)
  Implementation: React Query with staleTime = 5min, gcTime = 30min
```

---

### 3.4 Security Architecture

**Authentication & Authorization:**

```
Auth model:     JWT-based sessions (short-lived access token + rotating refresh token)
Access token:   15-minute expiry — short to limit exposure if intercepted
Refresh token:  30-day expiry, stored httpOnly cookie (not localStorage)
Rotation:       Refresh token is rotated on every use (token family revocation)
Revocation:     Refresh token families tracked in Redis — compromised family = full revocation

Authorization:  Row-level security (RLS) in PostgreSQL
  All portfolio queries include: WHERE user_id = auth.uid()
  Enforced at DB level — not just application level
  No query can access another user's data even with application bug
```

**Data Security:**

```
Sensitive field encryption (at rest, in addition to disk encryption):
  UserProfile.monthly_income_try     AES-256-GCM, key in KMS
  UserProfile.monthly_savings_try    AES-256-GCM
  PortfolioEvent.notes               AES-256-GCM (user journal-adjacent)
  DailyBrief content                 AES-256-GCM (contains personal financial analysis)

Journal entries (Module 8):
  Encrypted at rest with user-derived key (KDF from user password + server pepper)
  Server cannot read journal content without user's session — by design
  Explicitly stated in onboarding and privacy policy

API rate limiting:
  Authenticated endpoints:  300 requests / minute per user_id
  Search endpoint:          60 requests / minute per user_id
  Brief endpoint:           10 requests / minute per user_id
  Ingestion endpoints:      IP-allowlisted (server-to-server only)

Input validation boundaries:
  Fund code:         Regex: /^[A-Z]{2,6}$/ — strict, no injection surface
  Date fields:       ISO 8601 only, validated against reasonable range (1990–2100)
  Decimal amounts:   Positive only, max 18 integer digits + 6 decimal places
  Free text (notes): Max 2000 chars, stripped of HTML, stored as plain text
  URLs:              Allowlist of known financial data source domains only
```

**Audit Logging:**

```
AuditLog {
  id              UUID
  timestamp       TIMESTAMPTZ
  user_id         UUID          NULL for system actions
  action          TEXT          Verb-noun format: "portfolio.position.create"
  resource_type   TEXT
  resource_id     UUID
  ip_address      INET
  user_agent      TEXT
  result          ENUM          SUCCESS | FAILURE | FORBIDDEN
  failure_reason  TEXT
  request_id      UUID          Correlation ID for distributed tracing
}

Audited actions: all write operations, all auth events, all data export/download,
all brief delivery, all signal generation, all permission escalations.
Read operations are NOT audited (performance) except for sensitive fields (journal content).
Audit logs are append-only and retained for minimum 5 years (regulatory requirement).
```

---

### 3.5 Data Freshness Contract (User-Visible)

The platform always communicates data freshness to users. This is a UX and trust requirement.

```
Data type               Freshness shown to user           Stale threshold
──────────────────────────────────────────────────────────────────────────
Fund NAV                "Updated [date] at 20:30"         > 1 business day
Portfolio value         "As of [time]" (live or delayed)  > 15 minutes
CPI index               "TÜİK [month] [year]"             > 35 days
TCMB rates              "TCMB [date]"                     > 1 business day
AI Brief                "Generated [date] at [time]"      > 24 hours
Signals / Alerts        Relative time ("2 hours ago")     > 48 hours triggers re-eval
```

When data exceeds its stale threshold, the UI shows a muted amber freshness indicator
adjacent to the affected metric — not a blocking banner. The platform continues to
function with stale data, clearly labeled. It never silently shows stale data as current.
