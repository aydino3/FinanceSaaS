import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─────────────────────────────────────────────
// TAB IDs
// The four implemented views of the SPA.
// ─────────────────────────────────────────────

export type TabId = 'portfolio' | 'explorer' | 'inflation' | 'insights'

export const TAB_LABELS: Record<TabId, { short: string; long: string }> = {
  portfolio:  { short: 'Portföy',    long: 'Portföy Genel Bakış' },
  explorer:   { short: 'Fon Keşfi',  long: 'TEFAS Fon Keşfi' },
  inflation:  { short: 'Analitik',   long: 'Reel Getiri Analizi' },
  insights:   { short: 'AI Brief',   long: 'AI Yatırım İçgörüleri' },
}

// ─────────────────────────────────────────────
// SHELL STATE
// ─────────────────────────────────────────────

interface ShellState {
  // Persisted — survive reload
  navPinned: boolean
  activeTab: TabId

  // Transient — reset each session
  commandPaletteOpen: boolean
  mobileMoreOpen: boolean

  toggleNavPinned: () => void
  setNavPinned:    (v: boolean) => void
  setActiveTab:    (tab: TabId) => void
  openCommandPalette:   () => void
  closeCommandPalette:  () => void
  toggleCommandPalette: () => void
  setMobileMoreOpen:    (v: boolean) => void
}

export const useShellStore = create<ShellState>()(
  persist(
    (set) => ({
      navPinned:          false,
      activeTab:          'portfolio',
      commandPaletteOpen: false,
      mobileMoreOpen:     false,

      toggleNavPinned: () => set((s) => ({ navPinned: !s.navPinned })),
      setNavPinned:    (v) => set({ navPinned: v }),
      setActiveTab:    (tab) => set({ activeTab: tab, mobileMoreOpen: false }),

      openCommandPalette:   () => set({ commandPaletteOpen: true }),
      closeCommandPalette:  () => set({ commandPaletteOpen: false }),
      toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
      setMobileMoreOpen:    (v) => set({ mobileMoreOpen: v }),
    }),
    {
      name: 'finansos-shell',
      // Persist nav pin + last active tab — quality-of-life for returning visitors
      partialize: (s) => ({ navPinned: s.navPinned, activeTab: s.activeTab }),
    }
  )
)
