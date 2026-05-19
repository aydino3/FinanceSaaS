'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CinematicCard } from '@/components/ui/CinematicCard'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import type { MarketTicker } from '@/types/insights'

// ─────────────────────────────────────────────
// MARKET TICKER ROW
// ─────────────────────────────────────────────

function TickerRow({ ticker, index }: { ticker: MarketTicker; index: number }) {
  const isUp   = ticker.change > 0
  const isDown = ticker.change < 0
  const isFlat = ticker.change === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: durations.comfortable, ease: easings.easeOutExpo, delay: 0.15 + index * 0.06 }}
      className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0"
    >
      <span className="type-label-sm text-[var(--color-fg-disabled)]">{ticker.label}</span>
      <div className="flex items-center gap-2">
        <span className="type-body-sm font-medium tabular-nums text-[var(--color-fg)]">
          {ticker.value}
        </span>
        {!isFlat && (
          <span
            className={cn(
              'type-label-sm tabular-nums font-medium min-w-[48px] text-right',
              isUp ? 'text-[var(--color-positive)]' : isDown ? 'text-[var(--color-negative)]' : 'text-[var(--color-fg-disabled)]'
            )}
          >
            {isUp ? '+' : ''}{ticker.change.toFixed(2)}%
          </span>
        )}
        {isFlat && (
          <span className="type-label-sm text-[var(--color-fg-disabled)] min-w-[48px] text-right">
            —
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// ASK AI PANEL
// ─────────────────────────────────────────────

const QUICK_QUESTIONS = [
  'Enflasyona karşı en güçlü fonum hangisi?',
  'Bu ay neden para piyasası fonu düştü?',
  'Altın ağırlığımı artırmalı mıyım?',
]

function AskAIPanel() {
  const [query, setQuery]     = useState('')
  const [focused, setFocused] = useState(false)

  return (
    <CinematicCard className="p-4" glowColor="rgba(212,164,46,0.06)" glowRadius={160} noGlow={!focused}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          {/* AI icon */}
          <div
            className="flex h-5 w-5 items-center justify-center rounded-md"
            style={{ background: 'rgba(212,164,46,0.15)', border: '1px solid rgba(212,164,46,0.25)' }}
            aria-hidden="true"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1.5C5 1.5 7.5 3 7.5 5C7.5 7 5 8.5 5 8.5C5 8.5 2.5 7 2.5 5C2.5 3 5 1.5 5 1.5Z"
                stroke="rgba(212,164,46,0.9)" strokeWidth="1" />
              <circle cx="5" cy="5" r="1" fill="rgba(212,164,46,0.9)" />
            </svg>
          </div>
          <p className="type-body-sm font-medium text-[var(--color-fg-muted)]">AI&#39;ye Sor</p>
        </div>

        {/* Input */}
        <div
          className={cn(
            'relative rounded-lg border transition-colors duration-200',
            focused
              ? 'border-[var(--color-accent-400)]/40 bg-[var(--color-surface-raised)]'
              : 'border-white/[0.07] bg-[var(--color-surface-inset)]'
          )}
        >
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Portföyün hakkında bir şey sor…"
            rows={2}
            className="w-full resize-none bg-transparent px-3 py-2.5 type-label-sm
                       text-[var(--color-fg)] placeholder:text-[var(--color-fg-disabled)]
                       focus:outline-none"
            aria-label="AI soru alanı"
          />
          {query.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-2 bottom-2 flex h-6 w-6 items-center justify-center
                         rounded-md bg-[var(--color-accent-400)]/20 border border-[var(--color-accent-400)]/30
                         text-[var(--color-accent-400)] hover:bg-[var(--color-accent-400)]/30
                         transition-colors duration-150 focus-visible:outline-none
                         focus-visible:ring-1 focus-visible:ring-[var(--color-accent-400)]"
              aria-label="Soruyu gönder"
              type="button"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 8V2M2 4.5l3-3 3 3" />
              </svg>
            </motion.button>
          )}
        </div>

        {/* Quick question chips */}
        <div className="space-y-1.5">
          <p className="type-label-sm text-[var(--color-fg-disabled)]">Önerilen sorular</p>
          {QUICK_QUESTIONS.map((q, i) => (
            <motion.button
              key={q}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: easings.easeOutExpo, delay: 0.3 + i * 0.07 }}
              type="button"
              onClick={() => setQuery(q)}
              className="block w-full text-left type-label-sm text-[var(--color-fg-disabled)]
                         hover:text-[var(--color-fg-subtle)] transition-colors duration-150
                         px-2.5 py-1.5 rounded-md hover:bg-white/[0.04]
                         focus-visible:outline-none focus-visible:ring-1
                         focus-visible:ring-[var(--color-accent-400)]"
            >
              {q}
            </motion.button>
          ))}
        </div>
      </div>
    </CinematicCard>
  )
}

// ─────────────────────────────────────────────
// MARKET SIDEBAR
// ─────────────────────────────────────────────

interface MarketSidebarProps {
  tickers: MarketTicker[]
}

export function MarketSidebar({ tickers }: MarketSidebarProps) {
  return (
    <div className="space-y-4 lg:sticky lg:top-6">
      {/* Market snapshot */}
      <CinematicCard className="p-4" noGlow>
        <div className="space-y-0.5">
          <div className="flex items-center justify-between mb-3">
            <p className="type-body-sm font-medium text-[var(--color-fg-muted)]">
              Piyasa Anlık
            </p>
            {/* Live indicator */}
            <div className="flex items-center gap-1.5">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-[var(--color-positive)]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                aria-hidden="true"
              />
              <span className="type-label-sm text-[var(--color-fg-disabled)]">Canlı</span>
            </div>
          </div>

          {tickers.map((t, i) => (
            <TickerRow key={t.id} ticker={t} index={i} />
          ))}
        </div>
      </CinematicCard>

      {/* Ask AI */}
      <AskAIPanel />

      {/* Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: durations.comfortable }}
        className="type-label-sm text-[var(--color-fg-disabled)] leading-relaxed px-1"
      >
        Bu öngörüler yapay zeka tarafından üretilmiş olup yatırım tavsiyesi niteliği taşımaz. Karar vermeden önce bir finansal danışmana başvurun.
      </motion.p>
    </div>
  )
}
