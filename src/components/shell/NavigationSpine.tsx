'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import { useShellStore, type TabId } from '@/stores/shell'
import { MOCK_USER } from '@/stores/session'

// ─────────────────────────────────────────────
// NAV ITEMS
// ─────────────────────────────────────────────

interface PrimaryNavItem {
  id:     TabId
  label:  string
  icon:   React.ReactNode
}

interface SecondaryNavItem {
  id:    string
  label: string
  soon:  true
  icon:  React.ReactNode
}

const primaryNav: PrimaryNavItem[] = [
  {
    id: 'portfolio',
    label: 'Portföy',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2a7 7 0 1 0 7 7H9V2z" />
        <path d="M11.5 2.8A7 7 0 0 1 15.2 6.5" />
      </svg>
    ),
  },
  {
    id: 'explorer',
    label: 'Fon Keşfi',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="5" />
        <path d="M12 12 16 16" />
      </svg>
    ),
  },
  {
    id: 'inflation',
    label: 'Analitik',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 14 6.5 8l3.5 4 3.5-7L17 6" />
      </svg>
    ),
  },
  {
    id: 'insights',
    label: 'AI Brief',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.6 3.6l1.4 1.4M13 13l1.4 1.4M3.6 14.4l1.4-1.4M13 5l1.4-1.4" />
        <circle cx="9" cy="9" r="3" />
      </svg>
    ),
  },
]

const secondaryNav: SecondaryNavItem[] = [
  {
    id: 'journal',
    label: 'Defter',
    soon: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2.5a2.12 2.12 0 0 1 3 3L6 16H3v-3L13 2.5z" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Ayarlar',
    soon: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9" r="2.5" />
        <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.6 3.6l1.4 1.4M13 13l1.4 1.4M3.6 14.4l1.4-1.4M13 5l1.4-1.4" />
      </svg>
    ),
  },
]

// ─────────────────────────────────────────────
// PRIMARY NAV BUTTON
// ─────────────────────────────────────────────

interface NavButtonProps {
  item:           PrimaryNavItem
  isActive:       boolean
  isExpanded:     boolean
  prefersReduced: boolean
  onClick:        () => void
}

function NavButton({ item, isActive, isExpanded, prefersReduced, onClick }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group relative flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left',
        'transition-colors duration-[var(--duration-micro)]',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-[var(--color-accent-400)] focus-visible:ring-offset-1',
        'focus-visible:ring-offset-[var(--color-canvas)]',
        isActive
          ? 'text-[var(--color-fg)]'
          : 'text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-muted)]'
      )}
    >
      {/* Active background pill */}
      {isActive && (
        <motion.div
          layoutId="nav-active-bg"
          className="absolute inset-0 rounded-lg bg-white/[0.07]"
          transition={{
            duration: prefersReduced ? 0 : durations.fast,
            ease: easings.easeOutExpo,
          }}
        />
      )}

      {/* Active left accent line */}
      {isActive && (
        <motion.div
          layoutId="nav-active-line"
          className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2
                     rounded-full bg-[var(--color-accent-400)]"
          transition={{
            duration: prefersReduced ? 0 : durations.fast,
            ease: easings.easeOutExpo,
          }}
        />
      )}

      {/* Hover wash */}
      {!isActive && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-lg opacity-0 transition-opacity
                     duration-[var(--duration-micro)] group-hover:opacity-100 bg-white/[0.04]"
        />
      )}

      <span className="relative shrink-0">{item.icon}</span>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.span
            key="label"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -4 }}
            transition={{
              duration: prefersReduced ? 0 : durations.fast,
              ease: easings.easeOutExpo,
            }}
            className="relative overflow-hidden whitespace-nowrap type-body-sm font-medium"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

// ─────────────────────────────────────────────
// SOON BUTTON (secondary nav)
// ─────────────────────────────────────────────

function SoonButton({
  item,
  isExpanded,
  prefersReduced,
}: {
  item:           SecondaryNavItem
  isExpanded:     boolean
  prefersReduced: boolean
}) {
  return (
    <div
      className="group relative flex h-10 w-full cursor-not-allowed items-center
                 gap-3 rounded-lg px-3 opacity-30 select-none"
      aria-label={`${item.label} — yakında`}
    >
      <span className="relative shrink-0">{item.icon}</span>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="soon-row"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -4 }}
            transition={{
              duration: prefersReduced ? 0 : durations.fast,
              ease: easings.easeOutExpo,
            }}
            className="relative flex min-w-0 flex-1 items-center justify-between"
          >
            <span className="whitespace-nowrap type-body-sm font-medium text-[var(--color-fg-subtle)]">
              {item.label}
            </span>
            <span className="ml-2 rounded-sm border border-white/[0.10] px-1 py-0.5
                             type-label-sm text-[var(--color-fg-disabled)] whitespace-nowrap">
              Yakında
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────
// NAVIGATION SPINE
// ─────────────────────────────────────────────

export function NavigationSpine() {
  const prefersReduced = useReducedMotion() ?? false
  const { activeTab, setActiveTab, navPinned, toggleNavPinned, openCommandPalette } =
    useShellStore()

  const [hovered, setHovered] = useState(false)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isExpanded = navPinned || hovered

  const handleMouseEnter = useCallback(() => {
    if (navPinned) return
    hoverTimerRef.current = setTimeout(() => setHovered(true), 250)
  }, [navPinned])

  const handleMouseLeave = useCallback(() => {
    if (navPinned) return
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    setHovered(false)
  }, [navPinned])

  return (
    <motion.nav
      aria-label="Ana navigasyon"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ width: isExpanded ? 220 : 60 }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : { duration: durations.comfortable, ease: easings.easeOutExpo }
      }
      className="relative hidden lg:flex h-full shrink-0 flex-col
                 border-r border-white/[0.05]
                 bg-[rgba(10,10,12,0.55)] backdrop-blur-xl backdrop-saturate-150"
      style={{ overflow: 'hidden' }}
    >
      {/* ── Logo ── */}
      <div className="flex h-14 shrink-0 items-center px-3">
        <button
          type="button"
          onClick={() => setActiveTab('portfolio')}
          className="flex items-center gap-3 focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]
                     rounded-lg px-0"
          aria-label="FinansOS — Portföye dön"
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                       bg-[var(--color-accent-400)]/10 border border-[var(--color-accent-400)]/20"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5A6.5 6.5 0 1 0 14.5 8H8V1.5z" fill="var(--color-accent-400)" opacity="0.9" />
              <path d="M10 2.2A6.5 6.5 0 0 1 13.8 6" stroke="var(--color-accent-400)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.span
                key="wordmark"
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -6 }}
                transition={{ duration: prefersReduced ? 0 : durations.fast, ease: easings.easeOutExpo }}
                className="type-body-sm font-semibold text-[var(--color-fg)] whitespace-nowrap tracking-tight"
              >
                FinansOS
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Search / ⌘K ── */}
      <div className="px-1.5 pb-2">
        <button
          type="button"
          onClick={openCommandPalette}
          className={cn(
            'group flex w-full items-center gap-3 rounded-lg px-3 py-2',
            'border border-white/[0.07] bg-white/[0.03]',
            'text-[var(--color-fg-subtle)]',
            'transition-colors duration-[var(--duration-micro)]',
            'hover:border-white/[0.10] hover:bg-white/[0.05] hover:text-[var(--color-fg-muted)]',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-[var(--color-accent-400)]',
          )}
          aria-label="Komut paletini aç (⌘K)"
        >
          <svg aria-hidden="true" className="shrink-0" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="6" r="4" />
            <path d="M9.5 9.5 13 13" />
          </svg>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="search-label"
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -4 }}
                transition={{ duration: prefersReduced ? 0 : durations.fast, ease: easings.easeOutExpo }}
                className="flex min-w-0 flex-1 items-center justify-between"
              >
                <span className="type-body-sm whitespace-nowrap">Ara…</span>
                <kbd
                  className="flex items-center gap-0.5 rounded border border-white/[0.10]
                             bg-white/[0.05] px-1 py-0.5 type-label-sm"
                  aria-hidden="true"
                >
                  <span>⌘</span><span>K</span>
                </kbd>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Primary nav ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-1.5 py-1 space-y-0.5">
        {primaryNav.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activeTab === item.id}
            isExpanded={isExpanded}
            prefersReduced={prefersReduced}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </div>

      {/* ── Divider ── */}
      <div className="mx-3 h-px bg-white/[0.05]" />

      {/* ── Secondary nav (soon) ── */}
      <div className="px-1.5 py-2 space-y-0.5">
        {secondaryNav.map((item) => (
          <SoonButton key={item.id} item={item} isExpanded={isExpanded} prefersReduced={prefersReduced} />
        ))}

        {/* Pin toggle */}
        <button
          type="button"
          onClick={toggleNavPinned}
          className={cn(
            'group relative flex h-10 w-full items-center gap-3 rounded-lg px-3',
            'transition-colors duration-[var(--duration-micro)]',
            'text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-muted)]',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-[var(--color-accent-400)]',
          )}
          aria-label={navPinned ? 'Sabitlemeyi kaldır' : 'Navigasyonu sabitle'}
          aria-pressed={navPinned}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-lg opacity-0 transition-opacity
                       duration-[var(--duration-micro)] group-hover:opacity-100 bg-white/[0.04]"
          />
          <span className="relative shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              className={cn('transition-colors', navPinned && 'text-[var(--color-accent-400)]')}
            >
              {navPinned
                ? <path d="M9 2v14M5 6h8" />
                : <path d="M9 2v5l3 2-3 2v5M6 4l-2 4h2M12 4l2 4h-2" />
              }
            </svg>
          </span>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.span
                key="pin-label"
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -4 }}
                transition={{ duration: prefersReduced ? 0 : durations.fast, ease: easings.easeOutExpo }}
                className={cn('relative whitespace-nowrap type-body-sm', navPinned && 'text-[var(--color-accent-400)]')}
              >
                {navPinned ? 'Sabitleme kaldır' : 'Sabitle'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── User avatar ── */}
      <div className="border-t border-white/[0.05] px-1.5 py-2">
        <div
          className={cn(
            'relative flex h-10 w-full items-center gap-3 rounded-lg px-3',
          )}
        >
          <span
            className="relative flex h-6 w-6 shrink-0 items-center justify-center
                       rounded-full text-[10px] font-semibold"
            style={{ background: 'rgba(212,164,46,0.15)', color: 'var(--color-accent-400)' }}
          >
            {MOCK_USER.initials}
          </span>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="account"
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: -4 }}
                transition={{ duration: prefersReduced ? 0 : durations.fast, ease: easings.easeOutExpo }}
                className="relative min-w-0 flex-1 text-left"
              >
                <p className="type-body-sm font-medium text-[var(--color-fg)] truncate">
                  {MOCK_USER.firstName}
                </p>
                <p className="type-label-sm text-[var(--color-accent-400)] truncate">
                  {MOCK_USER.tierLabel}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  )
}
