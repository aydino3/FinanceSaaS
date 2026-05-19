'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import { useShellStore } from '@/stores/shell'

// ─────────────────────────────────────────────
// MOBILE TAB BAR
//
// 64px fixed bottom bar visible on < lg.
// 5 tabs: Portfolio, Explore, ⌘K (center),
// Brief, More.
// ─────────────────────────────────────────────

const TAB_ITEMS = [
  {
    id: 'dashboard',
    label: 'Portföy',
    href: '/dashboard',
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
    href: '/dashboard/explorer',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="5.5" />
        <path d="M13 13 18 18" />
      </svg>
    ),
  },
  {
    id: 'brief',
    label: 'AI Brief',
    href: '/dashboard/brief',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.1 4.1l1.4 1.4M14.5 14.5l1.4 1.4M4.1 15.9l1.4-1.4M14.5 5.5l1.4-1.4" />
        <circle cx="10" cy="10" r="3" />
      </svg>
    ),
  },
]

interface TabButtonProps {
  id: string
  label: string
  href: string
  icon: React.ReactNode
  isActive: boolean
  prefersReduced: boolean
}

function TabButton({ id, label, href, icon, isActive, prefersReduced }: TabButtonProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2',
        'transition-colors duration-[var(--duration-micro)]',
        'focus-visible:outline-none',
        isActive
          ? 'text-[var(--color-fg)]'
          : 'text-[var(--color-fg-subtle)]'
      )}
    >
      {/* Active indicator dot */}
      {isActive && (
        <motion.div
          layoutId="mobile-tab-active"
          className="absolute top-1.5 h-0.5 w-5 rounded-full
                     bg-[var(--color-accent-400)]"
          transition={{ duration: prefersReduced ? 0 : durations.fast, ease: easings.easeOutExpo }}
        />
      )}

      <span
        className={cn(
          'transition-transform duration-[var(--duration-micro)]',
          isActive ? 'scale-110' : 'scale-100'
        )}
      >
        {icon}
      </span>
      <span className="type-label-sm">{label}</span>
    </Link>
  )
}

export function MobileTabBar() {
  const pathname = usePathname()
  const prefersReduced = useReducedMotion() ?? false
  const { openCommandPalette, setMobileMoreOpen, mobileMoreOpen } = useShellStore()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <nav
      aria-label="Mobil navigasyon"
      className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch
                 border-t border-white/[0.07]
                 bg-[rgba(12,12,14,0.92)] lg:hidden"
      style={{ backdropFilter: 'blur(16px) saturate(120%)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Left tabs */}
      {TAB_ITEMS.slice(0, 2).map((tab) => (
        <TabButton
          key={tab.id}
          {...tab}
          isActive={isActive(tab.href)}
          prefersReduced={prefersReduced}
        />
      ))}

      {/* Center ⌘K button */}
      <button
        type="button"
        onClick={openCommandPalette}
        aria-label="Arama ve komut paleti"
        className={cn(
          'relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2',
          'focus-visible:outline-none',
          'text-[var(--color-fg-subtle)]',
        )}
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full
                     bg-[var(--color-accent-400)]/15
                     border border-[var(--color-accent-400)]/25
                     text-[var(--color-accent-400)]
                     transition-all duration-[var(--duration-micro)]
                     active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5 14 14" />
          </svg>
        </span>
        <span className="type-label-sm text-[var(--color-accent-400)]">Ara</span>
      </button>

      {/* Right tabs */}
      {TAB_ITEMS.slice(2).map((tab) => (
        <TabButton
          key={tab.id}
          {...tab}
          isActive={isActive(tab.href)}
          prefersReduced={prefersReduced}
        />
      ))}

      {/* More button */}
      <button
        type="button"
        onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
        aria-label="Daha fazla"
        aria-expanded={mobileMoreOpen}
        className={cn(
          'relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2',
          'transition-colors duration-[var(--duration-micro)]',
          'focus-visible:outline-none',
          mobileMoreOpen
            ? 'text-[var(--color-fg)]'
            : 'text-[var(--color-fg-subtle)]'
        )}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="4" cy="10" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="16" cy="10" r="1.5" />
        </svg>
        <span className="type-label-sm">Daha Fazla</span>
      </button>
    </nav>
  )
}
