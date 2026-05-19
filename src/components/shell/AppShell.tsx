'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { useShellStore } from '@/stores/shell'
import { NavigationSpine } from './NavigationSpine'
import { ContextBar } from './ContextBar'
import { MobileTabBar } from './MobileTabBar'
import { MobileBottomSheet } from './MobileBottomSheet'
import { CommandPalette } from '@/components/command-palette/CommandPalette'

// ─────────────────────────────────────────────
// APP SHELL
//
// Main authenticated layout shell.
// Orchestrates:
//   - NavigationSpine (desktop sidebar)
//   - ContextBar (desktop ambient top bar)
//   - MobileTabBar (mobile fixed bottom)
//   - MobileBottomSheet ("More" sheet)
//   - CommandPalette (⌘K global overlay)
//
// Global ⌘K keyboard shortcut registered here.
// ─────────────────────────────────────────────

interface AppShellProps {
  children: React.ReactNode
}

// Stable no-op subscribe — mount-only signal never re-fires.
const subscribeNoop = () => () => {}

export function AppShell({ children }: AppShellProps) {
  const { toggleCommandPalette } = useShellStore()

  // Hydration guard — Zustand persist reads localStorage on client only.
  // useSyncExternalStore returns the server snapshot during SSR and the
  // client snapshot after hydration, with no setState-in-effect.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,   // client snapshot
    () => false,  // server snapshot
  )

  // Global ⌘K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggleCommandPalette()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleCommandPalette])

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-transparent">
      {/* Desktop sidebar — suppress until mounted to avoid hydration mismatch on pinned state */}
      {mounted && <NavigationSpine />}

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Ambient top bar (desktop only) */}
        <ContextBar />

        {/* Scrollable page content */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto overflow-x-hidden
                     pb-16 lg:pb-0
                     focus-visible:outline-none"
          aria-label="Ana içerik"
        >
          {children}
        </main>
      </div>

      {/* Mobile navigation */}
      <MobileTabBar />
      <MobileBottomSheet />

      {/* Global command palette */}
      <CommandPalette />
    </div>
  )
}
