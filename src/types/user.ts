export type SubscriptionTier = 'premium' | 'pro' | 'enterprise'

export interface MockUser {
  id: string
  fullName: string
  firstName: string
  initials: string
  email: string
  avatarColor: string
  tier: SubscriptionTier
  tierLabel: string
  memberSince: string
  netWorth: number
  preferredCurrency: 'TRY'
  locale: 'tr-TR'
}
