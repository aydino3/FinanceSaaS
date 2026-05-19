'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import { useShellStore } from '@/stores/shell'

const MORE_ITEMS = [
  {
    id: 'analytics',
    label: 'Analitik',
    href: '/dashboard/analytics',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 16 7.5 9l4 4 4-7.5 3.5 1" />
      </svg>
    ),
  },
  {
    id: 'macro',
    label: 'Makro',
    href: '/dashboard/macro',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="8" />
        <path d="M2 10h16M10 2a12 12 0 0 1 0 16M10 2a12 12 0 0 0 0 16" />
      </svg>
    ),
  },
  {
    id: 'watchlist',
    label: 'İzleme',
    href: '/dashboard/watchlist',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2h8a1 1 0 0 1 1 1v15l-5-3-5 3V3a1 1 0 0 1 1-1z" />
      </svg>
    ),
  },
  {
    id: 'journal',
    label: 'Defter',
    href: '/dashboard/journal',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.5 3.5a2.5 2.5 0 0 1 3.5 3.5L7 19H3v-4L15.5 3.5z" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Ayarlar',
    href: '/dashboard/settings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="3" />
        <path d="M10 1v3M10 16v3M1 10h3M16 10h3M3.6 3.6l2.1 2.1M14.3 14.3l2.1 2.1M3.6 16.4l2.1-2.1M14.3 5.7l2.1-2.1" />
      </svg>
    ),
  },
]

export function MobileBottomSheet() {
  const { mobileMoreOpen, setMobileMoreOpen } = useShellStore()
  const prefersReduced = useReducedMotion() ?? false
  const sheetRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!mobileMoreOpen) return
    const handleClick = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        setMobileMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [mobileMoreOpen, setMobileMoreOpen])

  // Close on escape
  useEffect(() => {
    if (!mobileMoreOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMoreOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [mobileMoreOpen, setMobileMoreOpen])

  return (
    <AnimatePresence>
      {mobileMoreOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.fast }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            aria-hidden="true"
            onClick={() => setMobileMoreOpen(false)}
          />

          {/* Sheet */}
          <motion.div
            key="sheet-panel"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Daha fazla menü"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: '100%' }}
            transition={{
              duration: prefersReduced ? 0 : durations.comfortable,
              ease: easings.easeOutExpo,
            }}
            drag={prefersReduced ? false : 'y'}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80) setMobileMoreOpen(false)
            }}
            className="fixed inset-x-0 bottom-0 z-50 lg:hidden
                       rounded-t-2xl border-t border-white/[0.08]
                       bg-[rgba(18,18,22,0.96)] pb-safe"
            style={{ backdropFilter: 'blur(20px) saturate(120%)' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2" aria-hidden="true">
              <div className="h-1 w-10 rounded-full bg-white/[0.15]" />
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-3 gap-2 p-4 pb-6">
              {MORE_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMoreOpen(false)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-xl p-3',
                    'border border-white/[0.07] bg-white/[0.04]',
                    'text-[var(--color-fg-subtle)]',
                    'transition-colors duration-[var(--duration-micro)]',
                    'hover:bg-white/[0.07] hover:text-[var(--color-fg-muted)]',
                    'active:bg-white/[0.10]',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-[var(--color-accent-400)]',
                  )}
                >
                  {item.icon}
                  <span className="type-label-sm">{item.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
