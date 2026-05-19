'use client'

import { motion } from 'framer-motion'
import { CinematicCard } from '@/components/ui/CinematicCard'
import { easings, durations } from '@/lib/motion'
import type { AnalyticsSummary } from '@/types/analytics'

// ─────────────────────────────────────────────
// PURCHASING POWER BAR COMPARISON
//
// Three horizontal bars anchored to the same scale:
//   1. Başlangıç değeri      — ₺1,200,000 (reference)
//   2. Enflasyon eşiği       — ₺1,980,000 (needed just to keep up)
//   3. Gerçek portföy        — ₺2,847,293 (where you actually are)
//
// The gap between bar 2 and bar 3 is real wealth created.
// ─────────────────────────────────────────────

function fmtTRY(v: number): string {
  if (v >= 1_000_000) return `₺${(v / 1_000_000).toFixed(3).replace('.', ',')}M`
  if (v >= 1_000)     return `₺${Math.round(v / 1_000)}K`
  return `₺${v}`
}

interface BarRowProps {
  label: string
  sublabel: string
  value: number
  maxValue: number
  color: string
  index: number
  badge?: string
  badgeColor?: string
}

function BarRow({ label, sublabel, value, maxValue, color, index, badge, badgeColor }: BarRowProps) {
  const pct = (value / maxValue) * 100

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: durations.comfortable,
        ease: easings.easeOutExpo,
        delay: 0.1 + index * 0.1,
      }}
      className="space-y-2"
    >
      {/* Labels row */}
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} aria-hidden="true" />
          <div className="min-w-0">
            <span className="type-body-sm font-medium text-[var(--color-fg-muted)]">{label}</span>
            <span className="type-label-sm text-[var(--color-fg-disabled)] ml-1.5">{sublabel}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {badge && (
            <span
              className="type-label-sm font-medium px-2 py-0.5 rounded-full border"
              style={{ color: badgeColor ?? color, borderColor: `${badgeColor ?? color}30`, background: `${badgeColor ?? color}10` }}
            >
              {badge}
            </span>
          )}
          <span className="type-body-sm font-medium tabular-nums text-[var(--color-fg)]">
            {fmtTRY(value)}
          </span>
        </div>
      </div>

      {/* Bar track */}
      <div className="relative h-2 w-full rounded-full bg-white/[0.05] overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: durations.deliberate, ease: easings.easeOutExpo, delay: 0.2 + index * 0.1 }}
        />
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// EXPORTED COMPONENT
// ─────────────────────────────────────────────

interface PurchasingPowerBarsProps {
  summary: AnalyticsSummary
}

export function PurchasingPowerBars({ summary }: PurchasingPowerBarsProps) {
  const { initialInvestment, inflationAdjustedRequired, finalValue, wealthGainedAboveInflation } = summary

  // Scale all bars relative to the final (largest) value
  const maxValue = finalValue * 1.08

  const gainPct = ((finalValue - inflationAdjustedRequired) / initialInvestment * 100).toFixed(1)

  return (
    <CinematicCard className="p-5 sm:p-6" noGlow>
      <div className="space-y-5">
        {/* Section header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="type-body-sm font-medium text-[var(--color-fg-muted)]">
              Satın Alma Gücü Karşılaştırması
            </h3>
            <p className="type-label-sm text-[var(--color-fg-disabled)] mt-0.5">
              Aynı başlangıç yatırımı için üç senaryo
            </p>
          </div>

          {/* Real surplus chip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: durations.comfortable, ease: easings.easeOutExpo, delay: 0.25 }}
            className="shrink-0 rounded-xl border border-[var(--color-positive-border)]
                       bg-[var(--color-positive-bg)] px-3.5 py-2 text-right"
          >
            <p className="type-label-sm text-[var(--color-fg-disabled)]">Reel servet artışı</p>
            <p className="type-body-sm font-medium text-[var(--color-positive)] tabular-nums">
              +{fmtTRY(wealthGainedAboveInflation)}
            </p>
            <p className="type-label-sm text-[var(--color-positive-emphasis)] tabular-nums">
              +%{gainPct} reel
            </p>
          </motion.div>
        </div>

        {/* Bars */}
        <div className="space-y-4">
          <BarRow
            index={0}
            label="Başlangıç değeri"
            sublabel="Oca 2024 yatırım"
            value={initialInvestment}
            maxValue={maxValue}
            color="#3A3936"
          />
          <BarRow
            index={1}
            label="Enflasyon eşiği"
            sublabel="Satın alma gücünü korumak için gereken"
            value={inflationAdjustedRequired}
            maxValue={maxValue}
            color="#BF6D7A"
            badge="+%65 TÜFE"
            badgeColor="#BF6D7A"
          />
          <BarRow
            index={2}
            label="Gerçek portföy"
            sublabel="Bugünkü değer"
            value={finalValue}
            maxValue={maxValue}
            color="#D4A42E"
            badge={`+%${gainPct} reel`}
            badgeColor="#6DB87A"
          />
        </div>

        {/* Explanatory footnote */}
        <p className="type-label-sm text-[var(--color-fg-disabled)] border-t border-white/[0.05] pt-3">
          Enflasyon eşiği, başlangıç yatırımının TÜFE ile büyütülmesiyle hesaplanır:
          {' '}₺{(initialInvestment / 1_000_000).toFixed(1)}M × 1,65 = ₺{(inflationAdjustedRequired / 1_000_000).toFixed(3).replace('.', ',')}M.
          Portföy bu eşiğin{' '}
          <span className="text-[var(--color-positive)] font-medium">
            ₺{Math.round(wealthGainedAboveInflation / 1000)}K üzerinde
          </span>{' '}
          kapandı.
        </p>
      </div>
    </CinematicCard>
  )
}
