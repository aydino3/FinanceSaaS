import type { Metadata } from 'next'
import {
  USER_TRAJECTORY,
  USER_ALLOCATIONS,
  USER_POSITIONS,
  USER_SUMMARY,
} from '@/lib/data-engine'
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
        summary={USER_SUMMARY}
        chartData={USER_TRAJECTORY}
        allocations={USER_ALLOCATIONS}
        positions={USER_POSITIONS.slice(0, 4)}
      />
    </div>
  )
}
