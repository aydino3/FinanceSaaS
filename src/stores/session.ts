import { create } from 'zustand'
import type { MockUser } from '@/types/user'

// ─────────────────────────────────────────────
// MOCK SESSION
//
// Showcase build — no real authentication.
// The session is always pre-authenticated as
// Haluk Sönmez: Persona 1 "The Inflation-Aware
// Wealth Builder" from PRODUCT_STRATEGY.md.
//
// Profile specifics:
//   Archetype:    Strategic SAA allocator, TÜFE-hurdle discipline
//   Tier:         Elite — Özel Portföy Müşterisi
//   TEFAS AUM:    ₺2,847,293 (10-position multi-category portfolio)
//   Total wealth: ₺6,400,000 (incl. gram altın + USD TDs)
//   Risk profile: SPKA 3–4 moderate-conservative
//   Since:        January 2024 (full data engine window)
// ─────────────────────────────────────────────

export const MOCK_USER: MockUser = {
  id: 'client-haluk-sonmez-001',
  fullName: 'Haluk Sönmez',
  firstName: 'Haluk',
  lastName: 'Sönmez',
  initials: 'HS',
  email: 'h.sonmez@finansos.app',
  tier: 'elite',
  tierLabel: 'Özel Portföy Müşterisi',
  memberSince: '2024-01-15',
  portfolioValue: 2_847_293,
  totalAum: 6_400_000,
  archetype: 'inflation-aware-wealth-builder',
  role: 'Direktör, Endüstriyel Operasyonlar',
  sector: 'Sanayi & Üretim',
  riskProfile: 'moderate-conservative',
  spkaRange: '3–4',
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
