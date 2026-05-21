// ─────────────────────────────────────────────
// USER TYPES
//
// MockUser represents the always-authenticated
// showcase session — a fully realized institutional
// investor profile, not a placeholder.
// ─────────────────────────────────────────────

export type SubscriptionTier = 'elite' | 'premium' | 'pro'

export type InvestorArchetype =
  | 'inflation-aware-wealth-builder'
  | 'active-fund-allocator'
  | 'sophisticated-optimizer'

export type RiskProfile = 'conservative' | 'moderate-conservative' | 'moderate' | 'moderate-aggressive' | 'aggressive'

export interface MockUser {
  id: string
  fullName: string
  firstName: string
  /** Turkish honorific surname reference — used in formal greeting contexts */
  lastName: string
  initials: string
  email: string
  tier: SubscriptionTier
  /** Localized tier label displayed in the navigation spine */
  tierLabel: string
  memberSince: string
  /** Active TEFAS portfolio value in TRY — matches USER_SUMMARY.totalValue */
  portfolioValue: number
  /** Total managed wealth (TEFAS + external instruments) in TRY */
  totalAum: number
  archetype: InvestorArchetype
  /** One-line professional role for contextual display */
  role: string
  /** Primary institution or sector */
  sector: string
  riskProfile: RiskProfile
  /** SPKA risk score band — e.g. "3–4" */
  spkaRange: string
  preferredCurrency: 'TRY'
  locale: 'tr-TR'
}
