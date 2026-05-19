'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import { CATEGORY_LABELS } from '@/types/fund'
import type { FundCategory, SortField, SortDirection } from '@/types/fund'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface FilterBarProps {
  activeCategory: FundCategory | 'all'
  onCategoryChange: (c: FundCategory | 'all') => void
  sortField: SortField
  sortDirection: SortDirection
  onSortChange: (field: SortField) => void
  resultCount: number
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const CATEGORIES: Array<{ id: FundCategory | 'all'; label: string }> = [
  { id: 'all', label: 'Tümü' },
  { id: 'hisse', label: CATEGORY_LABELS.hisse },
  { id: 'altin', label: CATEGORY_LABELS.altin },
  { id: 'borclanma', label: CATEGORY_LABELS.borclanma },
  { id: 'eurobond', label: CATEGORY_LABELS.eurobond },
  { id: 'para-piyasasi', label: CATEGORY_LABELS['para-piyasasi'] },
  { id: 'karma', label: CATEGORY_LABELS.karma },
]

const SORT_OPTIONS: Array<{ id: SortField; label: string; shortLabel: string }> = [
  { id: 'return-1y', label: '1 Yıllık Getiri', shortLabel: '1Y Getiri' },
  { id: 'return-real', label: 'Reel Getiri', shortLabel: 'Reel' },
  { id: 'return-1m', label: '1 Aylık Getiri', shortLabel: '1A Getiri' },
  { id: 'risk', label: 'Risk Seviyesi', shortLabel: 'Risk' },
  { id: 'fee', label: 'Yönetim Gideri', shortLabel: 'YGO' },
  { id: 'aum', label: 'Fon Büyüklüğü', shortLabel: 'Büyüklük' },
]

// ─────────────────────────────────────────────
// SORT DIRECTION ICON
// ─────────────────────────────────────────────

function SortArrow({ direction }: { direction: SortDirection }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === 'desc' ? (
        <path d="M5 2v6M2 5.5l3 3 3-3" />
      ) : (
        <path d="M5 8V2M2 4.5l3-3 3 3" />
      )}
    </svg>
  )
}

// ─────────────────────────────────────────────
// FILTER BAR
// ─────────────────────────────────────────────

export function FilterBar({
  activeCategory,
  onCategoryChange,
  sortField,
  sortDirection,
  onSortChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      {/* ── Row 1: Category pills + result count ── */}
      <div className="flex items-center gap-3">
        {/* Horizontally scrollable pill strip */}
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-0.5
                     scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]
                     [&::-webkit-scrollbar]:hidden"
          role="radiogroup"
          aria-label="Fon kategorisi filtresi"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => onCategoryChange(cat.id)}
                className={cn(
                  'relative shrink-0 rounded-full px-3.5 py-1.5',
                  'type-body-sm whitespace-nowrap',
                  'transition-colors duration-[var(--duration-micro)]',
                  'focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-[var(--color-accent-400)]',
                  isActive
                    ? 'text-[var(--color-fg)]'
                    : 'text-[var(--color-fg-subtle)] hover:text-[var(--color-fg-muted)]'
                )}
              >
                {/* Sliding active background */}
                {isActive && (
                  <motion.span
                    layoutId="filter-active-pill"
                    className="absolute inset-0 rounded-full
                               bg-[var(--color-surface-raised)]
                               border border-white/[0.10]"
                    transition={{
                      duration: durations.comfortable,
                      ease: easings.easeOutExpo,
                    }}
                  />
                )}
                <span className="relative">{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Result count badge */}
        <span
          className="ml-auto shrink-0 type-label-sm text-[var(--color-fg-disabled)]
                     tabular-nums whitespace-nowrap"
          aria-live="polite"
          aria-atomic="true"
        >
          {resultCount} fon
        </span>
      </div>

      {/* ── Row 2: Sort options ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5
                      scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]
                      [&::-webkit-scrollbar]:hidden">
        <span className="shrink-0 type-label-sm text-[var(--color-fg-disabled)] mr-1">
          Sırala:
        </span>

        {SORT_OPTIONS.map((opt) => {
          const isActive = sortField === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSortChange(opt.id)}
              title={opt.label}
              aria-pressed={isActive}
              className={cn(
                'relative inline-flex shrink-0 items-center gap-1.5',
                'rounded-md px-2.5 py-1',
                'type-label-sm whitespace-nowrap',
                'border transition-[color,background-color,border-color]',
                'duration-[var(--duration-micro)]',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-[var(--color-accent-400)]',
                isActive
                  ? 'text-[var(--color-accent-400)] border-[var(--color-accent-400)]/30 bg-[var(--color-accent-400)]/8'
                  : 'text-[var(--color-fg-subtle)] border-white/[0.07] bg-transparent hover:border-white/[0.10] hover:text-[var(--color-fg-muted)]'
              )}
            >
              {opt.shortLabel}
              {isActive && <SortArrow direction={sortDirection} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
