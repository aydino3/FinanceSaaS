'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import { useShellStore, type TabId } from '@/stores/shell'

// ─────────────────────────────────────────────
// MOBILE TAB BAR
//
// 64px fixed bottom bar visible on < lg.
// 4 tabs + centre ⌘K button.
// Tab changes via Zustand activeTab — no router.
// ─────────────────────────────────────────────

interface Tab {
  id:    TabId
  label: string
  icon:  React.ReactNode
}

const LEFT_TABS: Tab[] = [
  {
    id: 'portfolio',
    label: 'Portföy',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2.5A7.5 7.5 0 1 0 17.5 10H10V2.5z" />
        <path d="M12.5 3A7.5 7.5 0 0 1 17 7.5" />
      </svg>
    ),
  },
  {
    id: 'explorer',
    label: 'Fonlar',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="5.5" />
        <path d="M13 13 18 18" />
      </svg>
    ),
  },
]

const RIGHT_TABS: Tab[] = [
  {
    id: 'inflation',
    label: 'Analitik',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 16 7.5 9l4 4.5L16 6l4 1" />
      </svg>
    ),
  },
  {
    id: 'insights',
    label: 'AI Brief',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.1 4.1l1.4 1.4M14.5 14.5l1.4 1.4M4.1 15.9l1.4-1.4M14.5 5.5l1.4-1.4" />
        <circle cx="10" cy="10" r="3" />
      </svg>
    ),
  },
]

interface TabButtonProps {
  tab:            Tab
  isActive:       boolean
  prefersReduced: boolean
  onClick:        () => void
}

function TabButton({ tab, isActive, prefersReduced, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      aria-label={tab.label}
      className={cn(
        'relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2',
        'transition-colors duration-[var(--duration-micro)]',
        'focus-visible:outline-none',
        isActive ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-subtle)]'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="mobile-tab-active"
          className="absolute top-1.5 h-0.5 w-5 rounded-full bg-[var(--color-accent-400)]"
          transition={{
            duration: prefersReduced ? 0 : durations.fast,
            ease: easings.easeOutExpo,
          }}
        />
      )}
      <span className={cn(
        'transition-transform duration-[var(--duration-micro)]',
        isActive ? 'scale-110' : 'scale-100'
      )}>
        {tab.icon}
      </span>
      <span className="type-label-sm">{tab.label}</span>
    </button>
  )
}

export function MobileTabBar() {
  const { activeTab, setActiveTab, openCommandPalette } = useShellStore()
  const prefersReduced = useReducedMotion() ?? false

  return (
    <nav
      aria-label="Mobil navigasyon"
      className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch
                 border-t border-white/[0.07]
                 bg-[rgba(12,12,14,0.92)] lg:hidden"
      style={{
        backdropFilter: 'blur(16px) saturate(120%)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {LEFT_TABS.map((tab) => (
        <TabButton
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          prefersReduced={prefersReduced}
          onClick={() => setActiveTab(tab.id)}
        />
      ))}

      {/* Centre ⌘K */}
      <button
        type="button"
        onClick={openCommandPalette}
        aria-label="Arama ve komut paleti"
        className="relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2
                   focus-visible:outline-none text-[var(--color-fg-subtle)]"
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full
                     bg-[var(--color-accent-400)]/15 border border-[var(--color-accent-400)]/25
                     text-[var(--color-accent-400)]
                     transition-all duration-[var(--duration-micro)] active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5 14 14" />
          </svg>
        </span>
        <span className="type-label-sm text-[var(--color-accent-400)]">Ara</span>
      </button>

      {RIGHT_TABS.map((tab) => (
        <TabButton
          key={tab.id}
          tab={tab}
          isActive={activeTab === tab.id}
          prefersReduced={prefersReduced}
          onClick={() => setActiveTab(tab.id)}
        />
      ))}
    </nav>
  )
}
