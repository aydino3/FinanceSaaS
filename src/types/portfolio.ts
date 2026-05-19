// ─────────────────────────────────────────────
// PORTFOLIO DOMAIN TYPES
// All dates are ISO strings — never Date objects —
// to guarantee identical server/client rendering.
// ─────────────────────────────────────────────

export interface ChartPoint {
  date: string               // ISO date "2024-01-01" — formatted client-side only
  value: number              // Portfolio TRY value
  inflationBaseline: number  // ₺1.2M × cumulative CPI — what it takes to break even
  bistBaseline: number       // BIST 100 indexed to same starting value
}

/** Named time windows for chart range selection */
export type TimePeriod = '1A' | '3A' | '6A' | '1Y' | 'Tümü'

export const TIME_PERIODS: TimePeriod[] = ['1A', '3A', '6A', '1Y', 'Tümü']

export const TIME_PERIOD_POINTS: Record<TimePeriod, number> = {
  '1A': 3,
  '3A': 5,
  '6A': 8,
  '1Y': 14,
  'Tümü': 0, // 0 = all
}

export interface AllocationSlice {
  id: string
  label: string       // Display label, e.g. "Hisse Senedi"
  sublabel: string    // Category description
  value: number       // TRY market value
  percent: number     // 0–100, sum must equal 100
  color: string       // CSS hex color
  returnYtd: number   // YTD nominal return %
}

export interface PortfolioPosition {
  fundCode: string
  fundName: string
  company: string
  value: number       // Current TRY market value
  costBasis: number   // Purchase cost TRY
  units: number       // Units held
  nav: number         // Current Birim Pay Değeri
  nominalReturn: number
  realReturn: number
  dayChange: number   // %
}

export interface PortfolioSummary {
  totalValue: number
  totalCost: number
  dayChange: number
  dayChangePercent: number
  nominalReturn: number   // % since inception
  realReturn: number      // % inflation-adjusted since inception
  bistDelta: number       // Outperformance vs BIST 100 over same period
  positionCount: number
  lastUpdated: string     // ISO date string — never use new Date() in render
}
