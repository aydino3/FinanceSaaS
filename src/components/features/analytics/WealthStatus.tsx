'use client'

import { motion } from 'framer-motion'
import { CinematicCard } from '@/components/ui/CinematicCard'
import { MetricCounter, fmtPercent, fmtTRY } from '@/components/ui/MetricCounter'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import type { AnalyticsSummary } from '@/types/analytics'

// ─────────────────────────────────────────────
// WEALTH STATUS — hero verdict card
// ─────────────────────────────────────────────

interface WealthStatusProps {
  summary: AnalyticsSummary
}

export function WealthStatus({ summary }: WealthStatusProps) {
  const {
    realReturn,
    nominalReturn,
    cumulativeCpi,
    wealthGainedAboveInflation,
    monthsBeatingInflation,
    monthCount,
    finalValue,
    inflationAdjustedRequired,
  } = summary

  const isWinning = realReturn > 0
  const beatRate = Math.round((monthsBeatingInflation / (monthCount - 1)) * 100)

  return (
    <CinematicCard
      className="p-6 sm:p-8"
      glowColor={isWinning ? 'rgba(212,164,46,0.12)' : 'rgba(191,109,122,0.10)'}
      glowRadius={280}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        {/* Left — verdict + real return */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: durations.comfortable, ease: easings.easeOutExpo }}
            className="flex items-center gap-2.5"
          >
            {/* Status indicator */}
            <span
              className={cn(
                'inline-flex h-2 w-2 rounded-full',
                isWinning ? 'bg-[var(--color-positive)]' : 'bg-[var(--color-negative)]'
              )}
              style={isWinning ? { boxShadow: '0 0 8px rgba(100,200,130,0.6)' } : undefined}
              aria-hidden="true"
            />
            <span className="type-label-sm text-[var(--color-fg-subtle)] tracking-widest uppercase">
              {isWinning ? 'Satın Alma Gücü Artıyor' : 'Satın Alma Gücü Eriyor'}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: durations.comfortable, ease: easings.easeOutExpo, delay: 0.06 }}
            className="flex items-baseline gap-3"
          >
            <p className="type-label-sm text-[var(--color-fg-disabled)]">Reel Getiri</p>
            <MetricCounter
              value={realReturn}
              formatter={(v) => fmtPercent(v, 1, true)}
              className={cn(
                'type-display-xl font-light tracking-tight',
                isWinning ? 'text-[var(--color-accent-400)]' : 'text-[var(--color-negative)]'
              )}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: durations.comfortable, delay: 0.14 }}
            className="type-body-sm text-[var(--color-fg-subtle)] max-w-md leading-relaxed"
          >
            Enflasyondan{' '}
            <span className={cn('font-medium', isWinning ? 'text-[var(--color-accent-300)]' : 'text-[var(--color-negative)]')}>
              {isWinning ? 'fazla kazandınız' : 'geride kaldınız'}
            </span>
            {' '}— nominal getiriniz{' '}
            <span className="text-[var(--color-fg)] tabular-nums font-medium">%{nominalReturn.toFixed(1)}</span>,
            {' '}TÜFE{' '}
            <span className="text-[var(--color-fg)] tabular-nums font-medium">%{cumulativeCpi.toFixed(1)}</span>{' '}
            oldu. {monthsBeatingInflation} /{' '}{monthCount - 1} ayda enflasyonu geçtiniz.
          </motion.p>
        </div>

        {/* Right — 3 compact stat pills */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: durations.comfortable, ease: easings.easeOutExpo, delay: 0.1 }}
          className="flex flex-col gap-3 lg:items-end"
        >
          {/* Wealth gained above inflation */}
          <div className="rounded-xl border border-white/[0.08] bg-[var(--color-surface-raised)] px-5 py-3.5 text-right">
            <p className="type-label-sm text-[var(--color-fg-disabled)] mb-1">Enflasyon Üstü Kazanç</p>
            <MetricCounter
              value={wealthGainedAboveInflation}
              formatter={(v) => fmtTRY(Math.round(v))}
              className="type-headline-md font-medium text-[var(--color-positive)] tabular-nums"
            />
          </div>

          {/* Beat rate */}
          <div className="rounded-xl border border-white/[0.08] bg-[var(--color-surface-raised)] px-5 py-3.5 text-right">
            <p className="type-label-sm text-[var(--color-fg-disabled)] mb-1">Aylık Enflasyon Üstü Oran</p>
            <span className="type-headline-md font-medium text-[var(--color-accent-400)] tabular-nums">
              %{beatRate}
            </span>
            <span className="type-label-sm text-[var(--color-fg-disabled)] ml-1.5">
              ({monthsBeatingInflation}/{monthCount - 1} ay)
            </span>
          </div>

          {/* Target vs actual */}
          <div className="rounded-xl border border-white/[0.08] bg-[var(--color-surface-raised)] px-5 py-3.5 text-right">
            <p className="type-label-sm text-[var(--color-fg-disabled)] mb-1">Portföy / Enflasyon Eşiği</p>
            <span className="type-body-sm text-[var(--color-fg)] tabular-nums font-medium">
              ₺{Math.round(finalValue / 1000)}K
            </span>
            <span className="type-label-sm text-[var(--color-fg-disabled)] mx-1.5">/</span>
            <span className="type-body-sm text-[var(--color-fg-subtle)] tabular-nums">
              ₺{Math.round(inflationAdjustedRequired / 1000)}K
            </span>
          </div>
        </motion.div>
      </div>
    </CinematicCard>
  )
}
