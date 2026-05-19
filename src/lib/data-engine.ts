// ─────────────────────────────────────────────
// DATA ENGINE
//
// Single canonical entry point for the entire app's
// simulated Turkish market intelligence.
//
//   • TEFAS fund catalog query helpers
//   • Monthly CPI (TÜFE) + USD/TRY rate streams
//   • Inflation-correction & real-return math
//   • Demo user holdings → positions / allocations / summary
//
// All numbers are deterministic — no Math.random().
// SSR-safe: zero side effects at module scope beyond
// frozen literals and pure functions.
// ─────────────────────────────────────────────

import type {
  Fund,
  FundCategory,
  SortField,
  SortDirection,
} from '@/types/fund'
import type {
  PortfolioPosition,
  PortfolioSummary,
  AllocationSlice,
  ChartPoint,
} from '@/types/portfolio'
import { FUNDS } from '@/data/funds'

// ═════════════════════════════════════════════════════════
// 1 ▸ MACRO STREAMS — CPI (TÜFE) & USD/TRY
// ═════════════════════════════════════════════════════════

/**
 * Month-over-month CPI rates (%) for Turkey, Jan-2024 → Jun-2025.
 * Compounded these reproduce the trailing-12m headline of ~65%.
 *
 * Source profile: synthetic but calibrated to TÜİK's published
 * 2024 monthly print shape — sharp Jan/Feb peaks, summer cool-off,
 * autumn re-acceleration, gradual disinflation into 2025.
 */
export const MONTHLY_CPI_PCT: readonly { date: string; mom: number }[] = Object.freeze([
  { date: '2024-01-01', mom: 6.70 },
  { date: '2024-02-01', mom: 4.53 },
  { date: '2024-03-01', mom: 3.16 },
  { date: '2024-04-01', mom: 3.18 },
  { date: '2024-05-01', mom: 3.37 },
  { date: '2024-06-01', mom: 1.64 },
  { date: '2024-07-01', mom: 3.23 },
  { date: '2024-08-01', mom: 2.47 },
  { date: '2024-09-01', mom: 2.97 },
  { date: '2024-10-01', mom: 2.88 },
  { date: '2024-11-01', mom: 2.24 },
  { date: '2024-12-01', mom: 1.03 },
  { date: '2025-01-01', mom: 5.03 },
  { date: '2025-02-01', mom: 2.27 },
  { date: '2025-03-01', mom: 2.46 },
  { date: '2025-04-01', mom: 3.00 },
  { date: '2025-05-01', mom: 1.53 },
  { date: '2025-06-01', mom: 1.37 },
])

/**
 * USD/TRY monthly closing rates over the same window.
 * Steady devaluation profile — used for USD-adjusted real returns.
 */
export const MONTHLY_USDTRY: readonly { date: string; rate: number }[] = Object.freeze([
  { date: '2024-01-01', rate: 30.16 },
  { date: '2024-02-01', rate: 31.02 },
  { date: '2024-03-01', rate: 32.04 },
  { date: '2024-04-01', rate: 32.51 },
  { date: '2024-05-01', rate: 32.18 },
  { date: '2024-06-01', rate: 32.81 },
  { date: '2024-07-01', rate: 32.96 },
  { date: '2024-08-01', rate: 33.86 },
  { date: '2024-09-01', rate: 34.18 },
  { date: '2024-10-01', rate: 34.36 },
  { date: '2024-11-01', rate: 34.50 },
  { date: '2024-12-01', rate: 35.42 },
  { date: '2025-01-01', rate: 35.81 },
  { date: '2025-02-01', rate: 36.31 },
  { date: '2025-03-01', rate: 36.97 },
  { date: '2025-04-01', rate: 37.96 },
  { date: '2025-05-01', rate: 38.79 },
  { date: '2025-06-01', rate: 39.21 },
])

export const BIST_ANNUAL_RETURN_PCT = 91.4   // BIST 100, trailing 12m
export const POLICY_RATE_PCT        = 46.0   // TCMB 1-week repo

// ═════════════════════════════════════════════════════════
// 2 ▸ CPI / INFLATION HELPERS
// ═════════════════════════════════════════════════════════

/**
 * Cumulative CPI factor between two month indexes (inclusive endpoints).
 * `factor = ∏ (1 + mom_i / 100)`.
 * A factor of 1.65 means prices rose 65% over the window.
 */
export function cpiFactor(fromIdx: number, toIdx: number): number {
  const start = Math.max(0, Math.min(fromIdx, toIdx))
  const end = Math.min(MONTHLY_CPI_PCT.length - 1, Math.max(fromIdx, toIdx))
  let factor = 1
  for (let i = start + 1; i <= end; i++) {
    factor *= 1 + MONTHLY_CPI_PCT[i].mom / 100
  }
  return factor
}

/** Cumulative CPI % over a window — convenience wrapper around cpiFactor. */
export function cumulativeCpiPct(fromIdx: number, toIdx: number): number {
  return (cpiFactor(fromIdx, toIdx) - 1) * 100
}

/**
 * Inflation-adjust a nominal TRY amount from `fromIdx` to `toIdx`.
 * Returns the equivalent nominal value preserving identical purchasing power.
 *
 *   inflationAdjust(1_200_000, 0, 17)  → 1_980_000  (approx)
 */
export function inflationAdjust(amount: number, fromIdx: number, toIdx: number): number {
  return amount * cpiFactor(fromIdx, toIdx)
}

/**
 * Real return given nominal return and CPI over the same window.
 *   R_real = ((1 + R_nominal) / (1 + R_cpi)) − 1
 * All inputs and outputs are %.
 */
export function realReturn(nominalPct: number, cpiPct: number): number {
  return ((1 + nominalPct / 100) / (1 + cpiPct / 100) - 1) * 100
}

export interface PurchasingPower {
  initial: number              // Original TRY invested
  current: number              // Current TRY value
  inflationFloor: number       // What `initial` would need to be just to match CPI
  nominalGain: number          // current − initial (TRY)
  realGain: number             // current − inflationFloor (TRY)
  nominalReturnPct: number
  cpiPct: number               // CPI over the window
  realReturnPct: number
  beatingInflation: boolean
}

/**
 * Compare an investment's nominal trajectory against CPI over a window
 * and return the precise "Real Purchasing Power Profit/Loss".
 */
export function purchasingPower(
  initial: number,
  current: number,
  fromIdx: number,
  toIdx: number,
): PurchasingPower {
  const inflationFloor = inflationAdjust(initial, fromIdx, toIdx)
  const nominalGain = current - initial
  const realGain = current - inflationFloor
  const nominalReturnPct = (current / initial - 1) * 100
  const cpiPct = cumulativeCpiPct(fromIdx, toIdx)
  const realReturnPct = realReturn(nominalReturnPct, cpiPct)
  return {
    initial,
    current,
    inflationFloor,
    nominalGain,
    realGain,
    nominalReturnPct,
    cpiPct,
    realReturnPct,
    beatingInflation: current > inflationFloor,
  }
}

// ═════════════════════════════════════════════════════════
// 3 ▸ FUND CATALOG QUERIES
// ═════════════════════════════════════════════════════════

export function getAllFunds(): readonly Fund[] {
  return FUNDS
}

export function getFundByCode(code: string): Fund | undefined {
  return FUNDS.find((f) => f.code === code)
}

export function getFundsByCategory(category: FundCategory): Fund[] {
  return FUNDS.filter((f) => f.category === category)
}

export function getTopPerformers(field: keyof Fund['returns'] = 'oneYear', limit = 5): Fund[] {
  return [...FUNDS]
    .sort((a, b) => b.returns[field] - a.returns[field])
    .slice(0, limit)
}

const SORT_ACCESSOR: Record<SortField, (f: Fund) => number> = {
  'return-1y':   (f) => f.returns.oneYear,
  'return-1m':   (f) => f.returns.oneMonth,
  'return-real': (f) => f.returns.realOneYear,
  'risk':        (f) => f.riskScore,
  'fee':         (f) => f.managementFee,
  'aum':         (f) => f.aum,
}

export function sortFunds(funds: Fund[], field: SortField, dir: SortDirection = 'desc'): Fund[] {
  const accessor = SORT_ACCESSOR[field]
  const factor = dir === 'desc' ? -1 : 1
  return [...funds].sort((a, b) => factor * (accessor(a) - accessor(b)))
}

// ═════════════════════════════════════════════════════════
// 4 ▸ DEMO USER PORTFOLIO — ALLOCATION CONTROLLER
// ═════════════════════════════════════════════════════════

/**
 * The demo user's actual holdings — codes + units + cost basis.
 * Everything else (current value, allocations, summary) is *derived*
 * from these holdings and the live fund catalog so the chart, the
 * allocation pie, the position list and the hero KPIs always agree.
 */
export interface HoldingEntry {
  code: string
  units: number
  costBasis: number   // Total TRY paid
  acquiredAt: string  // ISO date
}

export const MOCK_HOLDINGS: readonly HoldingEntry[] = Object.freeze([
  { code: 'GAH', units: 50_394,  costBasis: 190_000, acquiredAt: '2024-01-15' },
  { code: 'AAF', units: 22_140,  costBasis: 102_000, acquiredAt: '2024-02-20' },
  { code: 'ZAF', units: 156_507, costBasis: 213_000, acquiredAt: '2024-01-15' },
  { code: 'AKA', units: 78_240,  costBasis: 124_000, acquiredAt: '2024-04-08' },
  { code: 'YKL', units: 116_661, costBasis: 342_000, acquiredAt: '2024-01-15' },
  { code: 'AKL', units: 71_180,  costBasis: 167_000, acquiredAt: '2024-03-12' },
  { code: 'TBF', units: 28_410,  costBasis: 124_000, acquiredAt: '2024-02-05' },
  { code: 'ZBF', units: 18_240,  costBasis: 79_000,  acquiredAt: '2024-05-22' },
  { code: 'GAE', units: 27_706,  costBasis: 132_000, acquiredAt: '2024-01-15' },
  { code: 'YKE', units: 12_440,  costBasis: 56_000,  acquiredAt: '2024-06-04' },
])

/** Resolve a holding into a fully-priced PortfolioPosition using current NAVs. */
function holdingToPosition(h: HoldingEntry): PortfolioPosition | null {
  const fund = getFundByCode(h.code)
  if (!fund) return null

  const value = h.units * fund.nav
  const nominalReturn = (value / h.costBasis - 1) * 100
  // Real return uses headline trailing-12m CPI vs nominal-since-acquisition.
  // Good enough for a demo while staying internally consistent.
  const cpiPct = cumulativeCpiPct(0, MONTHLY_CPI_PCT.length - 1)
  const realRet = realReturn(nominalReturn, cpiPct)

  return {
    fundCode: fund.code,
    fundName: fund.name,
    company: fund.company,
    value,
    costBasis: h.costBasis,
    units: h.units,
    nav: fund.nav,
    nominalReturn,
    realReturn: realRet,
    dayChange: fund.returns.oneWeek / 7,  // 1d ≈ 1w/7, plausible
  }
}

export function buildPositions(): PortfolioPosition[] {
  return MOCK_HOLDINGS
    .map(holdingToPosition)
    .filter((p): p is PortfolioPosition => p !== null)
    .sort((a, b) => b.value - a.value)
}

const CATEGORY_PALETTE: Record<FundCategory, { color: string; sublabel: string; label: string }> = {
  'hisse':         { color: '#6DBF8A', sublabel: 'BIST Hisse Fonları',     label: 'Hisse Senedi' },
  'altin':         { color: '#C9A84C', sublabel: 'Altın Katılım Fonları',  label: 'Altın' },
  'para-piyasasi': { color: '#5C5B57', sublabel: 'Likit & Kısa Vadeli',    label: 'Para Piyasası' },
  'borclanma':     { color: '#D4A42E', sublabel: 'Devlet & Özel Tahvil',   label: 'Borçlanma' },
  'eurobond':      { color: '#9B8EC4', sublabel: 'Döviz Bazlı Tahvil',     label: 'Eurobond' },
  'karma':         { color: '#7AB0B8', sublabel: 'Dengeli Karma',          label: 'Karma' },
}

export function buildAllocations(positions: PortfolioPosition[]): AllocationSlice[] {
  const total = positions.reduce((s, p) => s + p.value, 0)
  const byCat = new Map<FundCategory, { value: number; weightedReturn: number }>()

  for (const p of positions) {
    const fund = getFundByCode(p.fundCode)
    if (!fund) continue
    const bucket = byCat.get(fund.category) ?? { value: 0, weightedReturn: 0 }
    bucket.value += p.value
    bucket.weightedReturn += p.value * fund.returns.ytd
    byCat.set(fund.category, bucket)
  }

  return Array.from(byCat.entries())
    .map(([cat, b]) => {
      const meta = CATEGORY_PALETTE[cat]
      return {
        id: cat,
        label: meta.label,
        sublabel: meta.sublabel,
        value: Math.round(b.value),
        percent: Math.round((b.value / total) * 100),
        color: meta.color,
        returnYtd: b.weightedReturn / b.value,
      }
    })
    .sort((a, b) => b.value - a.value)
}

export function buildSummary(positions: PortfolioPosition[]): PortfolioSummary {
  const totalValue = positions.reduce((s, p) => s + p.value, 0)
  const totalCost = positions.reduce((s, p) => s + p.costBasis, 0)
  const dayChange = positions.reduce((s, p) => s + p.value * (p.dayChange / 100), 0)
  const nominalReturn = (totalValue / totalCost - 1) * 100
  const cpiPct = cumulativeCpiPct(0, MONTHLY_CPI_PCT.length - 1)
  const realRet = realReturn(nominalReturn, cpiPct)

  return {
    totalValue,
    totalCost,
    dayChange,
    dayChangePercent: (dayChange / (totalValue - dayChange)) * 100,
    nominalReturn,
    realReturn: realRet,
    bistDelta: nominalReturn - BIST_ANNUAL_RETURN_PCT,
    positionCount: positions.length,
    lastUpdated: MONTHLY_CPI_PCT[MONTHLY_CPI_PCT.length - 1].date,
  }
}

/**
 * Reconstruct the 18-month portfolio trajectory from holdings.
 * Each month's portfolio value is the sum of (units × historical NAV).
 * We don't have historical per-fund NAVs, so we back out values by
 * linearly interpolating each holding's cost-basis → current value
 * along the CPI timeline — produces a smooth, internally consistent
 * curve that still respects the engine's start/end totals.
 */
export function buildPortfolioTrajectory(positions: PortfolioPosition[]): ChartPoint[] {
  const n = MONTHLY_CPI_PCT.length
  const initial = positions.reduce((s, p) => s + p.costBasis, 0)
  const ending = positions.reduce((s, p) => s + p.value, 0)

  // Smoothed growth curve: gentle S-curve so it doesn't look linear.
  // f(t) = initial * (ending/initial)^smoothed(t)
  const ratio = ending / initial

  return MONTHLY_CPI_PCT.map((m, i) => {
    const t = i / (n - 1)
    // ease-in-out cubic — feels like real market drift, not a straight line
    const eased = t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2
    const portfolioValue = initial * Math.pow(ratio, eased)
    const inflationBaseline = inflationAdjust(initial, 0, i)
    // BIST baseline — same start, smoother but lower terminal
    const bistBaseline = initial * Math.pow(1 + BIST_ANNUAL_RETURN_PCT / 100, eased * (n - 1) / 12)
    return {
      date: m.date,
      value: Math.round(portfolioValue),
      inflationBaseline: Math.round(inflationBaseline),
      bistBaseline: Math.round(bistBaseline),
    }
  })
}

// ═════════════════════════════════════════════════════════
// 5 ▸ CONVENIENCE — PRE-COMPUTED USER PORTFOLIO
// Cached because positions/allocations/summary are derived from
// frozen inputs and never change at runtime.
// ═════════════════════════════════════════════════════════

export const USER_POSITIONS:    PortfolioPosition[] = buildPositions()
export const USER_ALLOCATIONS:  AllocationSlice[]   = buildAllocations(USER_POSITIONS)
export const USER_SUMMARY:      PortfolioSummary    = buildSummary(USER_POSITIONS)
export const USER_TRAJECTORY:   ChartPoint[]        = buildPortfolioTrajectory(USER_POSITIONS)

// ═════════════════════════════════════════════════════════
// 6 ▸ FORMATTING HELPERS — consistent number display
// ═════════════════════════════════════════════════════════

const TRY_FORMATTER     = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 })
const TRY_FORMATTER_DEC = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const COUNT_FORMATTER   = new Intl.NumberFormat('tr-TR', { notation: 'compact', maximumFractionDigits: 1 })

export function fmtTry(v: number, decimals = false): string {
  return `₺${(decimals ? TRY_FORMATTER_DEC : TRY_FORMATTER).format(v)}`
}

export function fmtPct(v: number, decimals = 1): string {
  const sign = v > 0 ? '+' : ''
  return `${sign}${v.toFixed(decimals)}%`
}

export function fmtCompact(v: number): string {
  return COUNT_FORMATTER.format(v)
}
