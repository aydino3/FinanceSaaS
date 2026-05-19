import type { AnalyticsPoint, MonthlyRow, AnalyticsSummary } from '@/types/analytics'

// 18 monthly points: Jan 2024 → Jun 2025
// All indexed series start at 100.
// Portfolio: ₺1.2M → ₺2.847M (+137.3% nominal, +43.8% real)
// CPI: +65% cumulative (≈4.3% avg monthly compound → 65% total)
// USD/TRY: 29.50 → 40.71 (+38.0%)
// BIST 100: +95.0% nominal

export const ANALYTICS_POINTS: AnalyticsPoint[] = [
  { date: '2024-01', portfolioIndexed: 100.0, cpiIndexed: 100.0, usdTryIndexed: 100.0, bistIndexed: 100.0, portfolioNominalPct:   0.00, cumulativeCpiPct:  0.00, usdTryRate: 29.50 },
  { date: '2024-02', portfolioIndexed: 104.2, cpiIndexed: 103.2, usdTryIndexed: 101.9, bistIndexed: 102.8, portfolioNominalPct:   4.20, cumulativeCpiPct:  3.20, usdTryRate: 30.06 },
  { date: '2024-03', portfolioIndexed: 110.8, cpiIndexed: 106.5, usdTryIndexed: 104.0, bistIndexed: 109.4, portfolioNominalPct:  10.80, cumulativeCpiPct:  6.50, usdTryRate: 30.68 },
  { date: '2024-04', portfolioIndexed: 117.6, cpiIndexed: 109.9, usdTryIndexed: 106.4, bistIndexed: 116.2, portfolioNominalPct:  17.60, cumulativeCpiPct:  9.90, usdTryRate: 31.39 },
  { date: '2024-05', portfolioIndexed: 124.8, cpiIndexed: 113.5, usdTryIndexed: 108.9, bistIndexed: 122.4, portfolioNominalPct:  24.80, cumulativeCpiPct: 13.50, usdTryRate: 32.13 },
  { date: '2024-06', portfolioIndexed: 132.4, cpiIndexed: 117.2, usdTryIndexed: 111.6, bistIndexed: 129.0, portfolioNominalPct:  32.40, cumulativeCpiPct: 17.20, usdTryRate: 32.92 },
  { date: '2024-07', portfolioIndexed: 140.6, cpiIndexed: 121.0, usdTryIndexed: 114.5, bistIndexed: 135.8, portfolioNominalPct:  40.60, cumulativeCpiPct: 21.00, usdTryRate: 33.78 },
  { date: '2024-08', portfolioIndexed: 149.2, cpiIndexed: 125.0, usdTryIndexed: 117.6, bistIndexed: 141.6, portfolioNominalPct:  49.20, cumulativeCpiPct: 25.00, usdTryRate: 34.69 },
  { date: '2024-09', portfolioIndexed: 159.0, cpiIndexed: 129.1, usdTryIndexed: 121.0, bistIndexed: 147.8, portfolioNominalPct:  59.00, cumulativeCpiPct: 29.10, usdTryRate: 35.70 },
  { date: '2024-10', portfolioIndexed: 169.4, cpiIndexed: 133.3, usdTryIndexed: 124.6, bistIndexed: 155.4, portfolioNominalPct:  69.40, cumulativeCpiPct: 33.30, usdTryRate: 36.76 },
  { date: '2024-11', portfolioIndexed: 181.2, cpiIndexed: 137.7, usdTryIndexed: 128.4, bistIndexed: 163.6, portfolioNominalPct:  81.20, cumulativeCpiPct: 37.70, usdTryRate: 37.88 },
  { date: '2024-12', portfolioIndexed: 194.8, cpiIndexed: 142.2, usdTryIndexed: 132.4, bistIndexed: 172.4, portfolioNominalPct:  94.80, cumulativeCpiPct: 42.20, usdTryRate: 39.06 },
  { date: '2025-01', portfolioIndexed: 206.4, cpiIndexed: 146.8, usdTryIndexed: 134.2, bistIndexed: 180.6, portfolioNominalPct: 106.40, cumulativeCpiPct: 46.80, usdTryRate: 39.59 },
  { date: '2025-02', portfolioIndexed: 216.0, cpiIndexed: 151.6, usdTryIndexed: 135.8, bistIndexed: 188.2, portfolioNominalPct: 116.00, cumulativeCpiPct: 51.60, usdTryRate: 40.07 },
  { date: '2025-03', portfolioIndexed: 224.2, cpiIndexed: 156.5, usdTryIndexed: 136.8, bistIndexed: 194.4, portfolioNominalPct: 124.20, cumulativeCpiPct: 56.50, usdTryRate: 40.36 },
  { date: '2025-04', portfolioIndexed: 230.8, cpiIndexed: 161.5, usdTryIndexed: 137.4, bistIndexed: 200.6, portfolioNominalPct: 130.80, cumulativeCpiPct: 61.50, usdTryRate: 40.54 },
  { date: '2025-05', portfolioIndexed: 235.0, cpiIndexed: 163.2, usdTryIndexed: 137.7, bistIndexed: 198.4, portfolioNominalPct: 135.00, cumulativeCpiPct: 63.20, usdTryRate: 40.62 },
  { date: '2025-06', portfolioIndexed: 237.3, cpiIndexed: 165.0, usdTryIndexed: 138.0, bistIndexed: 195.0, portfolioNominalPct: 137.30, cumulativeCpiPct: 65.00, usdTryRate: 40.71 },
]

export const MONTHLY_ROWS: MonthlyRow[] = ANALYTICS_POINTS.slice(1).map((pt, i) => {
  const prev = ANALYTICS_POINTS[i]
  const portfolioMonthly = (pt.portfolioIndexed / prev.portfolioIndexed - 1) * 100
  const cpiMonthly       = (pt.cpiIndexed       / prev.cpiIndexed       - 1) * 100
  return { date: pt.date, portfolioMonthly, cpiMonthly, isBeating: portfolioMonthly >= cpiMonthly }
})

// Real Return Formula:
//   R_real = ((1 + R_nominal) / (1 + R_cpi)) - 1
//   → ((1 + 1.373) / (1 + 0.65)) - 1 = 2.373 / 1.65 - 1 = 0.4382 ≈ +43.8%
//
// USD-adjusted return:
//   Portfolio factor: 2.373  |  USD/TRY factor: 1.38
//   R_usd = (2.373 / 1.38) - 1 ≈ +72.0%
//
// BIST real return:
//   ((1 + 0.95) / (1 + 0.65)) - 1 = 1.95 / 1.65 - 1 ≈ +18.2%

export const ANALYTICS_SUMMARY: AnalyticsSummary = {
  startDate: '2024-01',
  endDate:   '2025-06',
  monthCount: 18,
  initialInvestment: 1_200_000,
  finalValue:        2_847_293,
  nominalReturn:   137.3,
  realReturn:       43.8,
  cumulativeCpi:    65.0,
  currentAnnualCpi: 65.0,
  usdTryStart:   29.50,
  usdTryCurrent: 40.71,
  usdTryChange:  38.0,
  portfolioUsdReturn:  72.0,
  bistReturn:     95.0,
  bistRealReturn: 18.2,
  inflationAdjustedRequired: 1_980_000,  // 1.2M × 1.65
  wealthGainedAboveInflation:  867_293,  // 2,847,293 − 1,980,000
  monthsBeatingInflation: 14,
}
