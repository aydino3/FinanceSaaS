export interface AnalyticsPoint {
  date: string                   // 'YYYY-MM'
  portfolioIndexed: number       // 100 at period start
  cpiIndexed: number
  usdTryIndexed: number
  bistIndexed: number
  portfolioNominalPct: number    // cumulative % from absolute start (e.g. 37.3)
  cumulativeCpiPct: number       // cumulative CPI % from absolute start
  usdTryRate: number             // actual USD/TRY rate
}

export interface MonthlyRow {
  date: string
  portfolioMonthly: number       // % MoM change
  cpiMonthly: number             // % MoM change
  isBeating: boolean
}

export interface AnalyticsSummary {
  startDate: string              // 'YYYY-MM'
  endDate: string
  monthCount: number
  initialInvestment: number      // TRY
  finalValue: number             // TRY
  nominalReturn: number          // % (e.g. 137.3)
  realReturn: number             // % (e.g. 43.8)
  cumulativeCpi: number          // % total over period
  currentAnnualCpi: number       // % annualised
  usdTryStart: number
  usdTryCurrent: number
  usdTryChange: number           // % depreciation
  portfolioUsdReturn: number     // portfolio return expressed in USD %
  bistReturn: number             // % nominal
  bistRealReturn: number         // % real
  inflationAdjustedRequired: number  // TRY needed to maintain same purchasing power
  wealthGainedAboveInflation: number // TRY above the inflation floor
  monthsBeatingInflation: number
}

export type AnalyticsPeriod = '3A' | '6A' | '1Y' | 'Tümü'
export const ANALYTICS_PERIODS: AnalyticsPeriod[] = ['3A', '6A', '1Y', 'Tümü']
export const ANALYTICS_PERIOD_POINTS: Record<AnalyticsPeriod, number> = {
  '3A': 4,   // ~3 months back (4 points including current)
  '6A': 7,
  '1Y': 13,
  'Tümü': 0,
}
