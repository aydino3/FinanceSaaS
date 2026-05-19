'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CinematicCard } from '@/components/ui/CinematicCard'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import type { PortfolioPosition } from '@/types/portfolio'

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function fmtValue(v: number): string {
  return `₺${Math.round(v).toLocaleString('tr-TR')}`
}

function returnColor(v: number): string {
  if (v >= 10)  return 'text-[var(--color-positive)]'
  if (v >= 0)   return 'text-[var(--color-positive-emphasis)]'
  if (v >= -5)  return 'text-[var(--color-negative)]'
  return 'text-[var(--color-negative-emphasis)]'
}

function dayChangeColor(v: number): string {
  if (v > 0) return 'text-[var(--color-positive)]'
  if (v < 0) return 'text-[var(--color-negative)]'
  return 'text-[var(--color-fg-subtle)]'
}

// ─────────────────────────────────────────────
// POSITION CARD
// ─────────────────────────────────────────────

interface PositionCardProps {
  position: PortfolioPosition
  index: number
  allocationPercent: number
}

function PositionCard({ position, index, allocationPercent }: PositionCardProps) {
  const { fundCode, fundName, company, value, nominalReturn, realReturn, dayChange, nav } = position
  const pnl = value - position.costBasis
  const isPnlPositive = pnl >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: durations.comfortable,
        ease: easings.easeOutExpo,
        delay: 0.4 + index * 0.08,
      }}
    >
      <CinematicCard className="p-0">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                           bg-[var(--color-surface-raised)] border border-white/[0.07]
                           font-mono text-[10px] font-bold tracking-wider
                           text-[var(--color-accent-400)]"
              >
                {fundCode}
              </span>
              <div className="min-w-0">
                <p className="type-body-sm font-medium text-[var(--color-fg)] truncate leading-snug">
                  {fundName}
                </p>
                <p className="type-label-sm text-[var(--color-fg-subtle)] truncate">
                  {company}
                </p>
              </div>
            </div>

            {/* Day change badge */}
            <span
              className={cn(
                'shrink-0 inline-flex items-center rounded-full px-2 py-0.5',
                'type-label-sm tabular-nums font-medium border',
                dayChange > 0
                  ? 'bg-[var(--color-positive-bg)] border-[var(--color-positive-border)] text-[var(--color-positive)]'
                  : dayChange < 0
                  ? 'bg-[var(--color-negative-bg)] border-[var(--color-negative-border)] text-[var(--color-negative)]'
                  : 'bg-white/[0.04] border-white/[0.08] text-[var(--color-fg-subtle)]'
              )}
              suppressHydrationWarning
            >
              {dayChange > 0 ? '+' : ''}{dayChange.toFixed(2)}%
            </span>
          </div>

          {/* Allocation progress bar */}
          <div aria-label={`Portföydeki ağırlık: %${allocationPercent.toFixed(1)}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="type-label-sm text-[var(--color-fg-disabled)]">Portföy ağırlığı</span>
              <span className="type-label-sm text-[var(--color-fg-subtle)] tabular-nums">
                {allocationPercent.toFixed(1)}%
              </span>
            </div>
            <div className="h-0.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[var(--color-accent-400)]"
                initial={{ width: 0 }}
                animate={{ width: `${allocationPercent}%` }}
                transition={{ duration: durations.deliberate, ease: easings.easeOutExpo, delay: 0.5 + index * 0.08 }}
              />
            </div>
          </div>

          {/* Metrics row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="type-label-sm text-[var(--color-fg-disabled)]">Güncel değer</span>
              <span className="type-body-sm font-medium text-[var(--color-fg)] tabular-nums" suppressHydrationWarning>
                {fmtValue(value)}
              </span>
            </div>

            <div className="h-8 w-px bg-white/[0.05]" aria-hidden="true" />

            <div className="flex flex-col items-center gap-0.5">
              <span className="type-label-sm text-[var(--color-fg-disabled)]">1Y Nominal</span>
              <span className={cn('type-body-sm font-medium tabular-nums', returnColor(nominalReturn))}>
                +{nominalReturn.toFixed(1)}%
              </span>
            </div>

            <div className="h-8 w-px bg-white/[0.05]" aria-hidden="true" />

            {/* Real return — accent treatment, our differentiator */}
            <div className="flex flex-col items-center gap-0.5 relative px-2">
              <span
                className="absolute -inset-x-1.5 -inset-y-1 rounded-md bg-[var(--color-accent-400)]/6 border border-[var(--color-accent-400)]/12"
                aria-hidden="true"
              />
              <span className="relative type-label-sm text-[var(--color-accent-300)]">Reel</span>
              <span className={cn('relative type-body-sm font-medium tabular-nums', returnColor(realReturn))}>
                {realReturn > 0 ? '+' : ''}{realReturn.toFixed(1)}%
              </span>
            </div>

            <div className="h-8 w-px bg-white/[0.05]" aria-hidden="true" />

            <div className="flex flex-col items-end gap-0.5">
              <span className="type-label-sm text-[var(--color-fg-disabled)]">K/Z</span>
              <span
                className={cn(
                  'type-body-sm font-medium tabular-nums',
                  isPnlPositive ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'
                )}
                suppressHydrationWarning
              >
                {isPnlPositive ? '+' : ''}{fmtValue(pnl)}
              </span>
            </div>
          </div>

          {/* NAV footer */}
          <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
            <span className="type-label-sm text-[var(--color-fg-disabled)]">
              NAV: <span className="tabular-nums text-[var(--color-fg-subtle)]" suppressHydrationWarning>
                ₺{nav.toFixed(4)}
              </span>
            </span>
            <Link
              href={`/dashboard/explorer/${fundCode}`}
              className="type-label-sm text-[var(--color-accent-400)] hover:underline
                         focus-visible:outline-none focus-visible:ring-1
                         focus-visible:ring-[var(--color-accent-400)]
                         underline-offset-2"
            >
              Detay →
            </Link>
          </div>
        </div>
      </CinematicCard>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// TOP POSITIONS GRID
// ─────────────────────────────────────────────

interface TopPositionsProps {
  positions: PortfolioPosition[]
  totalValue: number
}

export function TopPositions({ positions, totalValue }: TopPositionsProps) {
  return (
    <section aria-label="Portföy pozisyonları">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="type-body-sm font-medium text-[var(--color-fg-muted)]">
          Pozisyonlar
        </h2>
        <Link
          href="/dashboard/explorer"
          className="type-label-sm text-[var(--color-accent-400)] hover:underline
                     focus-visible:outline-none focus-visible:ring-1
                     focus-visible:ring-[var(--color-accent-400)] underline-offset-2"
        >
          Tüm fonları keşfet →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {positions.map((pos, i) => (
          <PositionCard
            key={pos.fundCode}
            position={pos}
            index={i}
            allocationPercent={(pos.value / totalValue) * 100}
          />
        ))}
      </div>
    </section>
  )
}
