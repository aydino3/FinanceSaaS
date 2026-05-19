'use client'

import { motion } from 'framer-motion'
import { MetricCounter, fmtPercent } from '@/components/ui/MetricCounter'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import type { AnalyticsSummary } from '@/types/analytics'

// ─────────────────────────────────────────────
// BENCHMARK GRID
// Four KPI cards: portfolio vs CPI, USD, BIST, purchasing power
// ─────────────────────────────────────────────

interface BenchmarkCardProps {
  label: string
  sublabel: string
  portfolioValue: number    // portfolio's relevant metric
  benchmarkValue: number    // what it's being compared against
  portfolioLabel: string
  benchmarkLabel: string
  delta: number             // positive = portfolio won
  deltaLabel?: string
  index: number
  accentColor?: string
}

function BenchmarkCard({
  label,
  sublabel,
  portfolioValue,
  benchmarkValue,
  portfolioLabel,
  benchmarkLabel,
  delta,
  deltaLabel,
  index,
  accentColor = '#D4A42E',
}: BenchmarkCardProps) {
  const isAhead = delta >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: durations.comfortable,
        ease: easings.easeOutExpo,
        delay: 0.08 + index * 0.07,
      }}
      className={cn(
        'flex flex-col gap-4 rounded-xl p-5',
        'border border-white/[0.07] bg-[var(--color-surface)]',
      )}
    >
      {/* Header */}
      <div className="space-y-0.5">
        <p className="type-body-sm font-medium text-[var(--color-fg-muted)]">{label}</p>
        <p className="type-label-sm text-[var(--color-fg-disabled)]">{sublabel}</p>
      </div>

      {/* Two values */}
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-0.5">
          <p className="type-label-sm text-[var(--color-fg-disabled)]">{portfolioLabel}</p>
          <span style={{ color: accentColor }}>
            <MetricCounter
              value={portfolioValue}
              formatter={(v) => fmtPercent(v, 1, true)}
              className="type-headline-md font-medium tabular-nums"
            />
          </span>
        </div>
        <div className="space-y-0.5 text-right">
          <p className="type-label-sm text-[var(--color-fg-disabled)]">{benchmarkLabel}</p>
          <span className="type-headline-md font-medium text-[var(--color-fg-subtle)] tabular-nums">
            {fmtPercent(benchmarkValue, 1, true)}
          </span>
        </div>
      </div>

      {/* Divider + delta */}
      <div className="border-t border-white/[0.05] pt-3">
        <div className="flex items-center justify-between">
          <span className="type-label-sm text-[var(--color-fg-disabled)]">
            {deltaLabel ?? 'Fark'}
          </span>
          <span
            className={cn(
              'type-label-sm font-medium tabular-nums',
              isAhead ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'
            )}
          >
            {isAhead ? '+' : ''}{delta.toFixed(1)}pp
          </span>
        </div>

        {/* Progress bar showing relative spread */}
        <div className="mt-2 h-0.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: isAhead ? '#6DB87A' : '#BF6D7A' }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.abs(delta) / (Math.abs(portfolioValue) + 1) * 100)}%` }}
            transition={{ duration: durations.deliberate, ease: easings.easeOutExpo, delay: 0.2 + index * 0.07 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// EXPORTED GRID
// ─────────────────────────────────────────────

interface BenchmarkGridProps {
  summary: AnalyticsSummary
}

export function BenchmarkGrid({ summary }: BenchmarkGridProps) {
  const {
    nominalReturn,
    realReturn,
    cumulativeCpi,
    bistReturn,
    bistRealReturn,
    usdTryChange,
    portfolioUsdReturn,
  } = summary

  // Purchasing power ratio: how many TRY of purchasing power did each ₺100 invested become?
  // CPI-deflated portfolio value = finalValue / (1 + cumulativeCpi/100) as indexed
  const purchasingPowerGain = realReturn
  const purchasingPowerBaseline = 0  // flat line — keeping pace with inflation = 0% real

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      role="list"
      aria-label="Karşılaştırmalı performans metrikleri"
    >
      <div role="listitem">
        <BenchmarkCard
          index={0}
          label="Portföy vs. TÜFE"
          sublabel="Reel satın alma gücü değişimi"
          portfolioValue={nominalReturn}
          benchmarkValue={cumulativeCpi}
          portfolioLabel="Portföy (nominal)"
          benchmarkLabel="TÜFE (kümülatif)"
          delta={nominalReturn - cumulativeCpi}
          deltaLabel="Enflasyon üstü"
          accentColor="#D4A42E"
        />
      </div>

      <div role="listitem">
        <BenchmarkCard
          index={1}
          label="Portföy vs. BIST 100"
          sublabel="Piyasa endeksine karşı alfa"
          portfolioValue={nominalReturn}
          benchmarkValue={bistReturn}
          portfolioLabel="Portföy (nominal)"
          benchmarkLabel="BIST 100"
          delta={nominalReturn - bistReturn}
          deltaLabel="Alfa"
          accentColor="#D4A42E"
        />
      </div>

      <div role="listitem">
        <BenchmarkCard
          index={2}
          label="Portföy vs. USD/TRY"
          sublabel="Dövize karşı reel değer"
          portfolioValue={portfolioUsdReturn}
          benchmarkValue={usdTryChange}
          portfolioLabel="Portföy (USD bazlı)"
          benchmarkLabel="USD/TRY artışı"
          delta={portfolioUsdReturn - usdTryChange}
          deltaLabel="USD üstü kazanç"
          accentColor="#5C6B8A"
        />
      </div>

      <div role="listitem">
        <BenchmarkCard
          index={3}
          label="Reel Getiri"
          sublabel="Enflasyon düzeltmeli net kazanç"
          portfolioValue={realReturn}
          benchmarkValue={bistRealReturn}
          portfolioLabel="Portföy (reel)"
          benchmarkLabel="BIST 100 (reel)"
          delta={realReturn - bistRealReturn}
          deltaLabel="Reel alfa"
          accentColor={realReturn >= 0 ? '#D4A42E' : '#BF6D7A'}
        />
      </div>
    </div>
  )
}
