// ─────────────────────────────────────────────
// FUND DOMAIN TYPES
// Mirrors the AI_DATA_ARCHITECTURE.md schemas.
// ─────────────────────────────────────────────

export type FundCategory =
  | 'hisse'         // Equity
  | 'borclanma'     // Fixed Income / Bond
  | 'altin'         // Gold
  | 'para-piyasasi' // Money Market
  | 'eurobond'      // Eurobond
  | 'karma'         // Mixed / Balanced

export type RiskScore = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface FundReturns {
  oneWeek:     number // %
  oneMonth:    number // %
  threeMonth:  number // %
  sixMonth:    number // %
  oneYear:     number // % nominal
  ytd:         number // % nominal, year-to-date
  realOneYear: number // % inflation-adjusted 1Y (real return)
}

export interface Fund {
  code:           string       // TEFAS ticker, e.g. "GAF"
  isin:           string       // ISIN, e.g. "TRGAF00T1016"
  name:           string       // Full Turkish fund name
  company:        string       // Management company name
  category:       FundCategory
  returns:        FundReturns
  riskScore:      RiskScore    // SPKA 1–7
  managementFee:  number       // Annual %, e.g. 1.50
  aum:            number       // AUM in TRY millions
  nav:            number       // Birim Pay Değeri (unit NAV)
  investorCount:  number       // Total number of holders ("Yatırımcı Sayısı")
  inceptionDate:  string       // ISO date, e.g. "2015-03-12"
  trending?:      boolean      // Highlighted as trending
  isNew?:         boolean      // Launched < 6 months ago
}

// ── View helpers ──────────────────────────────

export const CATEGORY_LABELS: Record<FundCategory, string> = {
  'hisse':         'Hisse Senedi',
  'borclanma':     'Borçlanma',
  'altin':         'Altın',
  'para-piyasasi': 'Para Piyasası',
  'eurobond':      'Eurobond',
  'karma':         'Karma',
}

export const CATEGORY_COLORS: Record<FundCategory, string> = {
  'hisse':         'text-[var(--color-positive)] bg-[var(--color-positive-bg)] border-[var(--color-positive-border)]',
  'borclanma':     'text-[var(--color-accent-300)] bg-[var(--color-accent-400)]/8 border-[var(--color-accent-400)]/20',
  'altin':         'text-[var(--color-warning-emphasis)] bg-[var(--color-warning-bg)] border-[var(--color-warning-border)]',
  'para-piyasasi': 'text-[var(--color-fg-muted)] bg-white/[0.04] border-white/[0.08]',
  'eurobond':      'text-[var(--color-accent-200)] bg-[var(--color-accent-400)]/6 border-[var(--color-accent-400)]/15',
  'karma':         'text-purple-400 bg-purple-900/20 border-purple-700/30',
}

export type SortField =
  | 'return-1y'
  | 'return-1m'
  | 'return-real'
  | 'risk'
  | 'fee'
  | 'aum'

export type SortDirection = 'desc' | 'asc'
