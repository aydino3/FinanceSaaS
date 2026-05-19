import type { ChartPoint, AllocationSlice, PortfolioPosition, PortfolioSummary } from '@/types/portfolio'

// ─────────────────────────────────────────────
// MOCK PORTFOLIO DATA
//
// 18 months of monthly snapshots (Jan 2024 → Jun 2025).
// Starting portfolio: ₺1,200,000 (three-fund mix).
// Ending portfolio:   ₺2,847,293
// Nominal return:     +137.3%
// Real return (÷CPI): +43.8%  (using trailing 65% annual CPI)
//
// inflationBaseline: how much ₺1.2M must become each month
//   to merely track CPI (~4.3% monthly compounded).
// bistBaseline: BIST 100 indexed to same ₺1.2M origin.
// ─────────────────────────────────────────────

export const CHART_DATA: ChartPoint[] = [
  { date: '2024-01-01', value: 1_200_000, inflationBaseline: 1_200_000, bistBaseline: 1_200_000 },
  { date: '2024-02-01', value: 1_268_400, inflationBaseline: 1_251_600, bistBaseline: 1_264_800 },
  { date: '2024-03-01', value: 1_341_200, inflationBaseline: 1_305_418, bistBaseline: 1_342_100 },
  { date: '2024-04-01', value: 1_298_400, inflationBaseline: 1_361_751, bistBaseline: 1_398_300 },
  { date: '2024-05-01', value: 1_386_700, inflationBaseline: 1_420_747, bistBaseline: 1_452_100 },
  { date: '2024-06-01', value: 1_482_900, inflationBaseline: 1_482_559, bistBaseline: 1_519_400 },
  { date: '2024-07-01', value: 1_598_400, inflationBaseline: 1_547_348, bistBaseline: 1_578_200 },
  { date: '2024-08-01', value: 1_672_100, inflationBaseline: 1_615_274, bistBaseline: 1_624_100 },
  { date: '2024-09-01', value: 1_624_800, inflationBaseline: 1_686_511, bistBaseline: 1_659_800 },
  { date: '2024-10-01', value: 1_782_300, inflationBaseline: 1_761_231, bistBaseline: 1_718_200 },
  { date: '2024-11-01', value: 1_941_600, inflationBaseline: 1_839_614, bistBaseline: 1_789_900 },
  { date: '2024-12-01', value: 2_084_200, inflationBaseline: 1_921_839, bistBaseline: 1_864_400 },
  { date: '2025-01-01', value: 2_182_800, inflationBaseline: 2_008_089, bistBaseline: 1_948_100 },
  { date: '2025-02-01', value: 2_348_400, inflationBaseline: 2_098_556, bistBaseline: 2_024_200 },
  { date: '2025-03-01', value: 2_512_700, inflationBaseline: 2_193_434, bistBaseline: 2_084_700 },
  { date: '2025-04-01', value: 2_614_800, inflationBaseline: 2_292_924, bistBaseline: 2_148_300 },
  { date: '2025-05-01', value: 2_748_100, inflationBaseline: 2_397_232, bistBaseline: 2_218_900 },
  { date: '2025-06-01', value: 2_847_293, inflationBaseline: 2_506_569, bistBaseline: 2_296_200 },
]

export const ALLOCATIONS: AllocationSlice[] = [
  {
    id: 'hisse',
    label: 'Hisse Senedi',
    sublabel: 'BIST Hisse Fonları',
    value: 996_553,
    percent: 35,
    color: '#6DBF8A',   // var(--color-positive)
    returnYtd: 138.4,
  },
  {
    id: 'altin',
    label: 'Altın',
    sublabel: 'Altın Katılım Fonları',
    value: 711_823,
    percent: 25,
    color: '#C9A84C',   // var(--color-warning)
    returnYtd: 134.8,
  },
  {
    id: 'para-piyasasi',
    label: 'Para Piyasası',
    sublabel: 'Likit & Kısa Vadeli',
    value: 569_459,
    percent: 20,
    color: '#5C5B57',   // var(--color-fg-subtle)
    returnYtd: 67.3,
  },
  {
    id: 'borclanma',
    label: 'Borçlanma',
    sublabel: 'Devlet & Özel Tahvil',
    value: 341_675,
    percent: 12,
    color: '#D4A42E',   // var(--color-accent-400)
    returnYtd: 78.4,
  },
  {
    id: 'eurobond',
    label: 'Eurobond',
    sublabel: 'Döviz Bazlı Tahvil',
    value: 227_783,
    percent: 8,
    color: '#9B8EC4',   // muted purple
    returnYtd: 72.6,
  },
]

export const TOP_POSITIONS: PortfolioPosition[] = [
  {
    fundCode: 'GAH',
    fundName: 'Galata Portföy Hisse Senedi Fonu',
    company: 'Galata Portföy',
    value: 498_276,
    costBasis: 190_000,
    units: 50_394,
    nav: 9.8840,
    nominalReturn: 162.2,
    realReturn: 59.2,
    dayChange: 1.84,
  },
  {
    fundCode: 'ZAF',
    fundName: 'Ziraat Portföy Altın Katılım Fonu',
    company: 'Ziraat Portföy',
    value: 498_277,
    costBasis: 213_000,
    units: 156_507,
    nav: 3.1840,
    nominalReturn: 134.0,
    realReturn: 42.0,
    dayChange: 2.14,
  },
  {
    fundCode: 'YKL',
    fundName: 'Yapı Kredi Portföy Likit Fon',
    company: 'Yapı Kredi Portföy',
    value: 569_459,
    costBasis: 342_000,
    units: 116_661,
    nav: 4.8831,
    nominalReturn: 66.5,
    realReturn: 1.2,
    dayChange: 0.92,
  },
  {
    fundCode: 'GAE',
    fundName: 'Galata Portföy Eurobond Fonu',
    company: 'Galata Portföy',
    value: 227_783,
    costBasis: 132_000,
    units: 27_706,
    nav: 8.2218,
    nominalReturn: 72.6,
    realReturn: 4.6,
    dayChange: 0.72,
  },
]

export const PORTFOLIO_SUMMARY: PortfolioSummary = {
  totalValue: 2_847_293,
  totalCost: 1_200_000,
  dayChange: 38_241,
  dayChangePercent: 1.36,
  nominalReturn: 137.3,
  realReturn: 43.8,
  bistDelta: 23.9,   // outperformed BIST 100 by 23.9pp over same period
  positionCount: 4,
  lastUpdated: '2025-06-01',
}
