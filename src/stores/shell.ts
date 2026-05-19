import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ShellState {
  // Persisted — user preference survives page reload
  navPinned: boolean
  // Transient — resets each session
  commandPaletteOpen: boolean
  mobileMoreOpen: boolean

  toggleNavPinned: () => void
  setNavPinned: (v: boolean) => void
  openCommandPalette: () => void
  closeCommandPalette: () => void
  toggleCommandPalette: () => void
  setMobileMoreOpen: (v: boolean) => void
}

export const useShellStore = create<ShellState>()(
  persist(
    (set) => ({
      navPinned: false,
      commandPaletteOpen: false,
      mobileMoreOpen: false,

      toggleNavPinned: () => set((s) => ({ navPinned: !s.navPinned })),
      setNavPinned: (v) => set({ navPinned: v }),
      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
      toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
      setMobileMoreOpen: (v) => set({ mobileMoreOpen: v }),
    }),
    {
      name: 'finansos-shell',
      partialize: (s) => ({ navPinned: s.navPinned }),
    }
  )
)
