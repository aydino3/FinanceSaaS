'use client'

import { motion } from 'framer-motion'
import { MetricCounter, fmtTRY, fmtPercent, fmtTRYDelta } from '@/components/ui/MetricCounter'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import type { PortfolioSummary } from '@/types/portfolio'

// ─────────────────────────────────────────────
// PORTFOLIO METRICS
//
// Two-tier layout:
//   1. Hero row — total value (large MetricCounter)
//      + day change badge
//   2. Stats strip — 4 KPI cards (MetricCounter each)
// ─────────────────────────────────────────────

interface StatCardProps {
  label: string
  sublabel?: string
  value: number
  formatter: (v: number) => string
  positive?: boolean   // undefined = neutral
  delay?: number
  emphasis?: boolean
}

function StatCard({ label, sublabel, value, formatter, positive, delay = 0, emphasis }: StatCardProps) {
  const colorClass =
    positive === undefined
      ? 'text-[var(--color-fg)]'
      : positive
      ? 'text-[var(--color-positive)]'
      : 'text-[var(--color-negative)]'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.comfortable, ease: easings.easeOutExpo, delay }}
      className={cn(
        'flex flex-col gap-1.5 rounded-xl p-4',
        'border border-white/[0.07] bg-[var(--color-surface)]',
        emphasis && 'border-[var(--color-accent-400)]/15 bg-[var(--color-accent-400)]/4'
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="type-label-sm text-[var(--color-fg-subtle)]">{label}</span>
        {sublabel && (
          <span className="type-label-sm text-[var(--color-fg-disabled)]">· {sublabel}</span>
        )}
      </div>

      <MetricCounter
        value={value}
        formatter={formatter}
        className={cn('type-headline-md font-medium', colorClass)}
      />
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// DAY CHANGE BADGE
// ─────────────────────────────────────────────

function DayChangeBadge({ value, percent }: { value: number; percent: number }) {
  const isPositive = value >= 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: durations.comfortable, ease: easings.easeOutExpo, delay: 0.2 }}
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1.5',
        'border',
        isPositive
          ? 'border-[var(--color-positive-border)] bg-[var(--color-positive-bg)]'
          : 'border-[var(--color-negative-border)] bg-[var(--color-negative-bg)]'
      )}
    >
      {/* Arrow icon */}
      <svg
        aria-hidden="true"
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isPositive ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'}
      >
        {isPositive ? (
          <path d="M5 8V2M2 4.5l3-3 3 3" />
        ) : (
          <path d="M5 2v6M2 5.5l3 3 3-3" />
        )}
      </svg>

      <span
        className={cn(
          'type-body-sm font-medium tabular-nums',
          isPositive ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'
        )}
        suppressHydrationWarning
      >
        <MetricCounter
          value={Math.abs(value)}
          formatter={(v) => fmtTRYDelta(isPositive ? v : -v)}
          className=""
        />
      </span>

      <span
        className={cn(
          'type-label-sm tabular-nums',
          isPositive ? 'text-[var(--color-positive-emphasis)]' : 'text-[var(--color-negative-emphasis)]'
        )}
        suppressHydrationWarning
      >
        ({isPositive ? '+' : ''}{percent.toFixed(2)}%)
      </span>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// PORTFOLIO METRICS
// ─────────────────────────────────────────────

interface PortfolioMetricsProps {
  summary: PortfolioSummary
}

export function PortfolioMetrics({ summary }: PortfolioMetricsProps) {
  const {
    totalValue,
    dayChange,
    dayChangePercent,
    nominalReturn,
    realReturn,
    bistDelta,
    positionCount,
  } = summary

  return (
    <div className="space-y-5">
      {/* ── Hero: total value ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.comfortable, ease: easings.easeOutExpo }}
        className="space-y-2"
      >
        <p className="type-label-sm text-[var(--color-fg-subtle)]">Toplam Portföy Değeri</p>

        <div className="flex items-end gap-4 flex-wrap">
          <MetricCounter
            value={totalValue}
            formatter={(v) => fmtTRY(Math.round(v))}
            className="type-display-xl font-light tracking-tight text-[var(--color-fg)]"
          />
          <div className="mb-1.5">
            <DayChangeBadge value={dayChange} percent={dayChangePercent} />
          </div>
        </div>

        <p className="type-label-sm text-[var(--color-fg-disabled)]">
          Bugün · Son güncelleme: {summary.lastUpdated.split('-').reverse().join('.')}
        </p>
      </motion.div>

      {/* ── Stats strip: 4 KPI cards ── */}
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        role="list"
        aria-label="Performans metrikleri"
      >
        <div role="listitem">
          <StatCard
            label="Nominal Getiri"
            sublabel="başlangıçtan"
            value={nominalReturn}
            formatter={(v) => fmtPercent(v, 1, true)}
            positive
            delay={0.10}
          />
        </div>

        <div role="listitem">
          <StatCard
            label="Reel Getiri"
            sublabel="enflasyon düzeltmeli"
            value={realReturn}
            formatter={(v) => fmtPercent(v, 1, true)}
            positive
            delay={0.17}
            emphasis
          />
        </div>

        <div role="listitem">
          <StatCard
            label="BIST 100 farkı"
            sublabel="aynı dönem"
            value={bistDelta}
            formatter={(v) => fmtPercent(v, 1, true) + ' fazla'}
            positive
            delay={0.24}
          />
        </div>

        <div role="listitem">
          <StatCard
            label="Aktif Pozisyon"
            value={positionCount}
            formatter={(v) => `${Math.round(v)} fon`}
            delay={0.31}
          />
        </div>
      </div>
    </div>
  )
}
