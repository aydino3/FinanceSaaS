'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useShellStore } from '@/stores/shell'
import { easings, durations } from '@/lib/motion'

// Feature panels
import { DashboardClient } from '@/components/features/dashboard/DashboardClient'
import { ExplorerClient } from '@/components/features/explorer/ExplorerClient'
import { AnalyticsClient } from '@/components/features/analytics/AnalyticsClient'
import { InsightsClient } from '@/components/features/insights/InsightsClient'

// Data — pre-computed, frozen, safe to import in a Client Component
import {
  USER_SUMMARY,
  USER_TRAJECTORY,
  USER_ALLOCATIONS,
  USER_POSITIONS,
} from '@/lib/data-engine'
import { ANALYTICS_POINTS, MONTHLY_ROWS, ANALYTICS_SUMMARY } from '@/data/analytics'
import { FUNDS } from '@/data/funds'
import { INSIGHTS, DAILY_BRIEF } from '@/data/insights'

// Shell chrome
import { NavigationSpine } from './NavigationSpine'
import { ContextBar } from './ContextBar'
import { MobileTabBar } from './MobileTabBar'
import { MobileBottomSheet } from './MobileBottomSheet'
import { CommandPalette } from '@/components/command-palette/CommandPalette'

// ─────────────────────────────────────────────
// APP SHELL
//
// Single-page operating system shell.
// activeTab (Zustand) drives which panel renders;
// AnimatePresence provides a cinematic tab-switch.
//
// All feature data is passed as props so panels
// render immediately — zero client waterfalls.
// ─────────────────────────────────────────────

// Hydration guard — useSyncExternalStore pattern (no setState-in-effect)
const subscribeNoop = () => () => {}

export function AppShell() {
  const { activeTab, toggleCommandPalette } = useShellStore()

  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  )

  // Global ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggleCommandPalette()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleCommandPalette])

  const WRAPPER = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8'

  const pageHeadings: Record<string, { title: string; sub: string }> = {
    portfolio: {
      title: 'Portföy',
      sub:   'Anlık değer, nominal ve enflasyon düzeltmeli reel getiri.',
    },
    explorer: {
      title: 'Fon Keşfi',
      sub:   'Tüm TEFAS fonlarını reel getiri odaklı sıralayın.',
    },
    inflation: {
      title: 'Reel Getiri Analizi',
      sub:   'Portföyünüzü TÜFE, USD/TRY ve BIST 100 ile karşılaştırın.',
    },
    insights: {
      title: 'AI İçgörüler',
      sub:   'Portföyünüze özel günlük yapay zeka yatırım analizi.',
    },
  }

  function renderPanel() {
    switch (activeTab) {
      case 'portfolio':
        return (
          <div className={WRAPPER}>
            <DashboardClient
              summary={USER_SUMMARY}
              chartData={USER_TRAJECTORY}
              allocations={USER_ALLOCATIONS}
              positions={USER_POSITIONS.slice(0, 4)}
            />
          </div>
        )
      case 'explorer':
        return (
          <div className={WRAPPER}>
            <div className="mb-8 space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="type-headline-lg text-[var(--color-fg)]">
                  {pageHeadings.explorer.title}
                </h1>
                <span className="inline-flex items-center rounded-full border border-white/[0.08]
                                 bg-white/[0.04] px-2.5 py-0.5 type-label-sm text-[var(--color-fg-subtle)]">
                  {FUNDS.length} fon
                </span>
              </div>
              <p className="type-body-sm text-[var(--color-fg-subtle)] max-w-xl">
                Tüm TEFAS fonlarını{' '}
                <span className="text-[var(--color-accent-400)]">reel getiri</span>
                {' '}odaklı sıralayın. Nominal rakamların arkasındaki gerçek performansı görün.
              </p>
            </div>
            <ExplorerClient funds={FUNDS} />
          </div>
        )
      case 'inflation':
        return (
          <div className={WRAPPER}>
            <div className="mb-8 space-y-1">
              <h1 className="type-headline-lg font-medium text-[var(--color-fg)]">
                {pageHeadings.inflation.title}
              </h1>
              <p className="type-body-sm text-[var(--color-fg-subtle)] max-w-xl">
                {pageHeadings.inflation.sub}
              </p>
            </div>
            <AnalyticsClient
              summary={ANALYTICS_SUMMARY}
              points={ANALYTICS_POINTS}
              monthlyRows={MONTHLY_ROWS}
            />
          </div>
        )
      case 'insights':
        return (
          <div className={WRAPPER}>
            <InsightsClient
              brief={DAILY_BRIEF}
              insights={INSIGHTS}
            />
          </div>
        )
    }
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-transparent">
      {/* Desktop sidebar */}
      {mounted && <NavigationSpine />}

      {/* Main content column */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <ContextBar />

        {/* Scrollable panel — AnimatePresence provides tab-switch animation */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto overflow-x-hidden pb-16 lg:pb-0 focus-visible:outline-none"
          aria-label="Ana içerik"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{
                duration: durations.comfortable,
                ease: easings.easeOutExpo,
              }}
            >
              {renderPanel()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile navigation */}
      <MobileTabBar />
      <MobileBottomSheet />

      {/* Global overlay */}
      <CommandPalette />
    </div>
  )
}
