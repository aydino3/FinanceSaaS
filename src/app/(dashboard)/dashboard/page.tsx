import type { Metadata } from 'next'
import { CHART_DATA, ALLOCATIONS, TOP_POSITIONS, PORTFOLIO_SUMMARY } from '@/data/portfolio'
import { DashboardClient } from '@/components/features/dashboard/DashboardClient'

export const metadata: Metadata = {
  title: 'Portföy — FinansOS',
  description:
    'Portföyünüzün nominal ve enflasyon düzeltmeli reel getirisini izleyin.',
}

// ─────────────────────────────────────────────
// DASHBOARD PAGE
//
// Server Component: all data passed as props so
// DashboardClient renders without client waterfalls.
//
// Hydration safety: PORTFOLIO_SUMMARY.lastUpdated
// is an ISO string — never a Date object — so SSR
// and client produce identical markup.
// ─────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <DashboardClient
        summary={PORTFOLIO_SUMMARY}
        chartData={CHART_DATA}
        allocations={ALLOCATIONS}
        positions={TOP_POSITIONS}
      />
    </div>
  )
}
