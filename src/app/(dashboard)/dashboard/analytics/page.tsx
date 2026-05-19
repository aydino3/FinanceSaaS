import type { Metadata } from 'next'
import { ANALYTICS_POINTS, MONTHLY_ROWS, ANALYTICS_SUMMARY } from '@/data/analytics'
import { AnalyticsClient } from '@/components/features/analytics/AnalyticsClient'

export const metadata: Metadata = {
  title: 'Reel Getiri Analizi — FinansOS',
  description:
    'Portföyünüzün enflasyon, döviz ve piyasa endekslerine karşı gerçek satın alma gücü performansını inceleyin.',
}

// ─────────────────────────────────────────────
// ANALYTICS PAGE — Server Component
//
// All data pre-computed server-side and passed as
// props so the client renders without waterfalls.
//
// Mathematical flow:
//   R_real  = ((1 + R_nominal) / (1 + R_cpi)) − 1
//   Indexed = (value / base_value) × 100   (per series, per period)
//   USD adj = (portfolio_factor / usdtry_factor) − 1
// ─────────────────────────────────────────────

export default function AnalyticsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

      {/* Page heading */}
      <div className="mb-8 space-y-1">
        <h1 className="type-headline-lg font-medium text-[var(--color-fg)]">
          Reel Getiri Analizi
        </h1>
        <p className="type-body-sm text-[var(--color-fg-subtle)] max-w-xl">
          Portföyünüzün nominal getirisini TÜFE enflasyonu, USD/TRY döviz kuru ve BIST 100
          ile karşılaştırın. Gerçek satın alma gücünüzün ne kadar değiştiğini görün.
        </p>
      </div>

      <AnalyticsClient
        summary={ANALYTICS_SUMMARY}
        points={ANALYTICS_POINTS}
        monthlyRows={MONTHLY_ROWS}
      />
    </div>
  )
}
