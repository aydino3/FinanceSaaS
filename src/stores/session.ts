import { create } from 'zustand'
import type { MockUser } from '@/types/user'

// ─────────────────────────────────────────────
// MOCK SESSION
//
// This is a showcase build — there is no real
// authentication. A high-net-worth premium
// investor profile is always "signed in" so the
// entire app can be explored without friction.
// ─────────────────────────────────────────────

export const MOCK_USER: MockUser = {
  id: 'demo-user-001',
  fullName: 'Selin Aydın',
  firstName: 'Selin',
  initials: 'SA',
  email: 'selin@finansos.app',
  avatarColor: 'var(--color-accent-400)',
  tier: 'premium',
  tierLabel: 'Premium Yatırımcı',
  memberSince: '2024-03-12',
  netWorth: 2_847_293,
  preferredCurrency: 'TRY',
  locale: 'tr-TR',
}

interface SessionState {
  user: MockUser
  isAuthenticated: true
}

export const useSessionStore = create<SessionState>()(() => ({
  user: MOCK_USER,
  isAuthenticated: true,
}))

export const useCurrentUser = () => useSessionStore((s) => s.user)
