'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { easings, durations } from '@/lib/motion'
import { FundCard } from './FundCard'
import { FundCardSkeleton } from './FundCardSkeleton'
import type { Fund } from '@/types/fund'

// ─────────────────────────────────────────────
// FUND GRID
//
// Animated CSS grid using Framer Motion layout
// transitions (FLIP) for smooth reordering when
// sort/filter changes.
//
// Animation strategy:
//   - AnimatePresence mode="popLayout" removes
//     exiting cards from flow immediately so
//     remaining cards start repositioning without
//     waiting for exit to complete.
//   - Each card has `layout` prop — Framer Motion
//     measures old/new positions and animates the
//     delta using CSS transforms (compositor thread).
//   - Initial mount: staggered fade+rise, 40ms delay
//     per card (capped so the last card never waits
//     more than 320ms).
//   - Exit: fast opacity fade (120ms).
// ─────────────────────────────────────────────

const STAGGER_CAP = 320 // ms — max delay for any card

interface FundGridProps {
  funds: Fund[]
  isLoading: boolean
  skeletonCount?: number
}

export function FundGrid({ funds, isLoading, skeletonCount = 8 }: FundGridProps) {
  const prefersReduced = useReducedMotion() ?? false

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        aria-label="Fonlar yükleniyor"
        aria-busy="true"
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <FundCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (funds.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.standard, ease: easings.easeOutExpo }}
        className="flex flex-col items-center gap-3 py-24 text-center"
        role="status"
        aria-live="polite"
      >
        <svg
          aria-hidden="true"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--color-fg-disabled)]"
        >
          <circle cx="18" cy="18" r="12" />
          <path d="M27 27 36 36" />
          <path d="M14 18h8M18 14v8" />
        </svg>
        <p className="type-body-sm text-[var(--color-fg-muted)]">
          Bu kriterlere uyan fon bulunamadı
        </p>
        <p className="type-label-sm text-[var(--color-fg-subtle)]">
          Filtreleri değiştirerek tekrar deneyin
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      role="list"
      aria-label={`${funds.length} fon listeleniyor`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {funds.map((fund, i) => {
          const delayMs = prefersReduced
            ? 0
            : Math.min(i * 40, STAGGER_CAP)

          return (
            <motion.div
              key={fund.code}
              layout
              role="listitem"
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{
                layout: {
                  duration: prefersReduced ? 0 : durations.comfortable,
                  ease: easings.easeOutExpo,
                },
                opacity: {
                  duration: prefersReduced ? 0 : durations.standard,
                  ease: 'linear',
                  delay: prefersReduced ? 0 : delayMs / 1000,
                },
                y: {
                  duration: prefersReduced ? 0 : durations.comfortable,
                  ease: easings.easeOutExpo,
                  delay: prefersReduced ? 0 : delayMs / 1000,
                },
                scale: {
                  duration: prefersReduced ? 0 : durations.fast,
                },
              }}
            >
              <FundCard fund={fund} />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}
