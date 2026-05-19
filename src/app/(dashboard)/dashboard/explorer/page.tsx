import type { Metadata } from 'next'
import { FUNDS } from '@/data/funds'
import { ExplorerClient } from '@/components/features/explorer/ExplorerClient'

export const metadata: Metadata = {
  title: 'Fon Keşfi — FinansOS',
  description:
    '847+ TEFAS fonu tek ekranda. Enflasyon düzeltmeli reel getiri, ' +
    'risk skoru ve yönetim giderleriyle karşılaştırın.',
}

// ─────────────────────────────────────────────
// FUND EXPLORER PAGE
//
// Server Component: passes static mock data to
// ExplorerClient which owns all filter/sort state.
// In Phase 2 this will be replaced with a proper
// async fetch from the fund data API.
// ─────────────────────────────────────────────

export default function ExplorerPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Page header ── */}
      <div className="mb-8 space-y-1.5">
        <div className="flex items-center gap-3">
          <h1 className="type-headline text-[var(--color-fg)]">
            Fon Keşfi
          </h1>
          <span
            className="inline-flex items-center rounded-full border
                       border-white/[0.08] bg-white/[0.04]
                       px-2.5 py-0.5 type-label-sm text-[var(--color-fg-subtle)]"
          >
            {FUNDS.length} fon
          </span>
        </div>

        <p className="type-body-sm text-[var(--color-fg-subtle)] max-w-xl">
          Tüm TEFAS fonlarını{' '}
          <span className="text-[var(--color-accent-400)]">reel getiri</span>
          {' '}odaklı sıralayın. Nominal rakamların arkasındaki gerçek performansı görün.
        </p>

        {/* Inflation disclaimer */}
        <div
          className="inline-flex items-center gap-2 rounded-lg
                     border border-[var(--color-warning-border)]
                     bg-[var(--color-warning-bg)]
                     px-3 py-1.5 mt-2"
        >
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 text-[var(--color-warning)]"
          >
            <circle cx="6" cy="6" r="5" />
            <path d="M6 4v2.5M6 8h.01" />
          </svg>
          <p className="type-label-sm text-[var(--color-warning-emphasis)]">
            Reel getiri hesaplamasında TÜFE &apos;25 yıllık ort. %65 kullanılmıştır.
            Geçmiş performans geleceği garanti etmez.
          </p>
        </div>
      </div>

      {/* ── Explorer (filter + sort + grid) — Client Component ── */}
      <ExplorerClient funds={FUNDS} />
    </div>
  )
}
