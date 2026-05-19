'use client'

import Link from 'next/link'
import { CinematicCard } from '@/components/ui/CinematicCard'
import { cn } from '@/lib/utils'
import type { Fund, FundCategory } from '@/types/fund'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/fund'

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function fmt(n: number, decimals = 1): string {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(decimals)}%`
}

function fmtAum(aumMillions: number): string {
  if (aumMillions >= 1_000) return `₺${(aumMillions / 1_000).toFixed(1)}Mr`
  return `₺${aumMillions.toFixed(0)}M`
}

function returnColor(value: number): string {
  if (value >= 5) return 'text-[var(--color-positive)]'
  if (value >= 0) return 'text-[var(--color-positive-emphasis)]'
  if (value >= -5) return 'text-[var(--color-negative)]'
  return 'text-[var(--color-negative-emphasis)]'
}

// ─────────────────────────────────────────────
// RISK DOT STRIP
// ─────────────────────────────────────────────

function RiskDots({ score }: { score: number }) {
  return (
    <div
      className="flex items-center gap-[3px]"
      aria-label={`Risk seviyesi: ${score}/7`}
      title={`Risk ${score}/7 (SPKA)`}
    >
      {Array.from({ length: 7 }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 rounded-full transition-colors',
            i < score
              ? score <= 2
                ? 'w-1.5 bg-[var(--color-fg-subtle)]'
                : score <= 4
                ? 'w-1.5 bg-[var(--color-warning)]'
                : 'w-1.5 bg-[var(--color-negative)]'
              : 'w-1.5 bg-white/[0.10]'
          )}
        />
      ))}
      <span className="ml-1 type-label-sm text-[var(--color-fg-disabled)]">
        {score}/7
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────
// RETURN METRIC CELL
// ─────────────────────────────────────────────

function ReturnCell({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div className={cn('flex flex-col gap-0.5', accent && 'relative')}>
      {accent && (
        <span
          className="absolute -inset-1.5 rounded-md bg-[var(--color-accent-400)]/[0.06]
                     border border-[var(--color-accent-400)]/[0.12]"
          aria-hidden="true"
        />
      )}
      <span
        className={cn(
          'relative type-label-sm',
          accent ? 'text-[var(--color-accent-300)]' : 'text-[var(--color-fg-disabled)]'
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          'relative tabular-nums font-medium',
          accent ? 'type-body-sm text-[var(--color-accent-400)]' : 'type-label-sm',
          !accent && returnColor(value)
        )}
      >
        {fmt(value)}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────
// FUND CARD
// ─────────────────────────────────────────────

interface FundCardProps {
  fund: Fund
}

export function FundCard({ fund }: FundCardProps) {
  const { code, name, company, category, returns, riskScore, managementFee, aum, investorCount, trending, isNew } = fund

  return (
    <CinematicCard
      role="article"
      className="flex h-full flex-col p-0"
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Fund code */}
          <span
            className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg
                       bg-[var(--color-surface-raised)] border border-white/[0.07]
                       font-mono text-[11px] font-bold tracking-wider
                       text-[var(--color-fg-muted)]"
          >
            {code}
          </span>

          <div className="min-w-0">
            <p
              className="type-body-sm font-medium text-[var(--color-fg)] leading-snug
                         line-clamp-2"
            >
              {name}
            </p>
            <p className="type-label-sm text-[var(--color-fg-subtle)] truncate mt-0.5">
              {company}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-2 py-0.5',
              'type-label-sm whitespace-nowrap',
              CATEGORY_COLORS[category as FundCategory]
            )}
          >
            {CATEGORY_LABELS[category as FundCategory]}
          </span>
          {trending && (
            <span
              className="inline-flex items-center gap-1 rounded-full border
                         border-[var(--color-accent-400)]/20
                         bg-[var(--color-accent-400)]/8
                         px-2 py-0.5 type-label-sm text-[var(--color-accent-300)]"
            >
              <span className="h-1 w-1 rounded-full bg-[var(--color-accent-400)] animate-pulse" />
              Trend
            </span>
          )}
          {isNew && (
            <span
              className="inline-flex items-center rounded-full border
                         border-purple-600/20 bg-purple-900/20
                         px-2 py-0.5 type-label-sm text-purple-400"
            >
              Yeni
            </span>
          )}
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 h-px bg-white/[0.05]" />

      {/* ── Return metrics ── */}
      <div className="flex items-start justify-between gap-1 px-4 py-3">
        <ReturnCell label="1A" value={returns.oneMonth} />
        <div className="h-7 w-px bg-white/[0.05]" aria-hidden="true" />
        <ReturnCell label="6A" value={returns.sixMonth} />
        <div className="h-7 w-px bg-white/[0.05]" aria-hidden="true" />
        <ReturnCell label="1Y" value={returns.oneYear} />
        <div className="h-7 w-px bg-white/[0.05]" aria-hidden="true" />
        {/* Real return — our key differentiator, always accented */}
        <ReturnCell label="Reel" value={returns.realOneYear} accent />
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 h-px bg-white/[0.05]" />

      {/* ── Footer: risk + fee + AUM ── */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 mt-auto">
        <RiskDots score={riskScore} />

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-end gap-0.5">
            <span className="type-label-sm text-[var(--color-fg-disabled)]">YGO</span>
            <span className="type-label-sm font-medium text-[var(--color-fg-subtle)] tabular-nums">
              %{managementFee.toFixed(2)}
            </span>
          </div>
          <div className="h-6 w-px bg-white/[0.05]" aria-hidden="true" />
          <div className="flex flex-col items-end gap-0.5">
            <span className="type-label-sm text-[var(--color-fg-disabled)]">Büyüklük</span>
            <span className="type-label-sm font-medium text-[var(--color-fg-subtle)] tabular-nums">
              {fmtAum(aum)}
            </span>
          </div>
          <div className="h-6 w-px bg-white/[0.05]" aria-hidden="true" />
          <div className="flex flex-col items-end gap-0.5">
            <span className="type-label-sm text-[var(--color-fg-disabled)]">Yatırımcı</span>
            <span
              className="type-label-sm font-medium text-[var(--color-fg-subtle)] tabular-nums"
              suppressHydrationWarning
            >
              {new Intl.NumberFormat('tr-TR', { notation: 'compact', maximumFractionDigits: 1 }).format(investorCount)}
            </span>
          </div>
        </div>
      </div>

      {/* ── View CTA overlay ── */}
      <Link
        href={`/dashboard/explorer/${code}`}
        className="absolute inset-0 z-20 rounded-xl
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-[var(--color-accent-400)]
                   focus-visible:ring-inset"
        aria-label={`${name} detaylarını gör`}
        tabIndex={0}
      />
    </CinematicCard>
  )
}
