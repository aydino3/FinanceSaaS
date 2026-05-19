'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import type { DailyBriefSummary } from '@/types/insights'

// ─────────────────────────────────────────────
// DATE HELPERS — client-only, no SSR risk
// ─────────────────────────────────────────────

const TR_DAYS  = ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi']
const TR_MONTHS_LONG = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']

function fmtDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const dow = new Date(y, m - 1, d).getDay()
  return `${TR_DAYS[dow]}, ${d} ${TR_MONTHS_LONG[m - 1]} ${y}`
}

// ─────────────────────────────────────────────
// TICKER CHIP — individual market ticker
// ─────────────────────────────────────────────

interface TickerChipProps {
  label: string
  value: string
  change: number
  index: number
}

function TickerChip({ label, value, change, index }: TickerChipProps) {
  const isUp   = change > 0
  const isDown = change < 0
  const isFlatOrCpi = change === 0 || label.startsWith('TÜFE') || label.startsWith('TCMB')

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: durations.comfortable, ease: easings.easeOutExpo, delay: 0.1 + index * 0.06 }}
      className="flex items-center gap-2.5 shrink-0 rounded-lg border border-white/[0.07]
                 bg-[var(--color-surface-raised)] px-3 py-2"
    >
      <span className="type-label-sm text-[var(--color-fg-disabled)]">{label}</span>
      <span className="type-body-sm font-medium tabular-nums text-[var(--color-fg)]">{value}</span>
      {!isFlatOrCpi && (
        <span
          className={cn(
            'type-label-sm font-medium tabular-nums',
            isUp ? 'text-[var(--color-positive)]' : isDown ? 'text-[var(--color-negative)]' : 'text-[var(--color-fg-disabled)]'
          )}
        >
          {isUp ? '+' : ''}{change.toFixed(2)}%
        </span>
      )}
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// DAILY BRIEF HEADER
// ─────────────────────────────────────────────

interface DailyBriefHeaderProps {
  brief: DailyBriefSummary
}

export function DailyBriefHeader({ brief }: DailyBriefHeaderProps) {
  const { date, greeting, portfolioDayChange, portfolioDayChangePct, insightCount, tickers } = brief
  const isPnlPositive = portfolioDayChange >= 0
  const formattedDate = fmtDate(date)

  return (
    <div className="space-y-4">
      {/* ── Greeting + date row ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: durations.comfortable, ease: easings.easeOutExpo }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2"
      >
        <div className="space-y-0.5">
          {/* Eyebrow */}
          <p className="type-label-sm text-[var(--color-fg-disabled)] tracking-widest uppercase">
            Günlük Yapay Zeka Özeti
          </p>
          {/* Headline */}
          <h1
            className="text-[var(--color-fg)] font-light"
            style={{ fontSize: '28px', letterSpacing: '-0.02em', lineHeight: '1.2' }}
          >
            {greeting} —{' '}
            <span className="text-[var(--color-fg-muted)]">{formattedDate}</span>
          </h1>
        </div>

        {/* Day P&L badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: durations.comfortable, ease: easings.easeOutExpo, delay: 0.12 }}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 border self-start sm:self-auto',
            isPnlPositive
              ? 'bg-[var(--color-positive-bg)] border-[var(--color-positive-border)]'
              : 'bg-[var(--color-negative-bg)] border-[var(--color-negative-border)]'
          )}
        >
          {/* Arrow */}
          <svg
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className={isPnlPositive ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'}
            aria-hidden="true"
          >
            {isPnlPositive
              ? <path d="M5 8V2M2 4.5l3-3 3 3" />
              : <path d="M5 2v6M2 5.5l3 3 3-3" />}
          </svg>
          <span
            className={cn(
              'type-body-sm font-medium tabular-nums',
              isPnlPositive ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'
            )}
            suppressHydrationWarning
          >
            {isPnlPositive ? '+' : ''}₺{Math.round(portfolioDayChange).toLocaleString('tr-TR')}
          </span>
          <span
            className={cn(
              'type-label-sm tabular-nums',
              isPnlPositive ? 'text-[var(--color-positive-emphasis)]' : 'text-[var(--color-negative-emphasis)]'
            )}
            suppressHydrationWarning
          >
            ({isPnlPositive ? '+' : ''}{portfolioDayChangePct.toFixed(2)}%)
          </span>
          <span className="type-label-sm text-[var(--color-fg-disabled)] ml-0.5">bugün</span>
        </motion.div>
      </motion.div>

      {/* ── Insight count + market tickers strip ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Count chip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.18, duration: durations.comfortable }}
          className="flex items-center gap-1.5 rounded-full px-3 py-1 border border-white/[0.07]
                     bg-[var(--color-accent-400)]/8"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-400)]"
            style={{ boxShadow: '0 0 6px rgba(212,164,46,0.5)' }}
            aria-hidden="true"
          />
          <span className="type-label-sm text-[var(--color-accent-400)]">
            {insightCount} yeni öngörü
          </span>
        </motion.div>

        {/* Divider */}
        <div className="h-4 w-px bg-white/[0.08]" aria-hidden="true" />

        {/* Tickers horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          {tickers.map((ticker, i) => (
            <TickerChip
              key={ticker.id}
              label={ticker.label}
              value={ticker.value}
              change={ticker.change}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* ── Hairline ── */}
      <motion.div
        className="h-px bg-white/[0.05]"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: easings.easeOutExpo, delay: 0.2 }}
        aria-hidden="true"
      />
    </div>
  )
}
