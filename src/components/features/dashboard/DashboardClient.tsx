'use client'

import dynamic from 'next/dynamic'
import { PortfolioMetrics } from './PortfolioMetrics'
import { AllocationBreakdown } from './AllocationBreakdown'
import { TopPositions } from './TopPositions'
import { CinematicCard } from '@/components/ui/CinematicCard'
import type { ChartPoint, AllocationSlice, PortfolioPosition, PortfolioSummary } from '@/types/portfolio'

// ─────────────────────────────────────────────
// CHART — dynamically imported with ssr:false
//
// Recharts uses ResizeObserver + DOM measurements
// internally. Dynamic import prevents any SSR
// execution of Recharts code, eliminating the
// risk of server/client dimension mismatches.
// The card shows a shimmer skeleton until JS loads.
// ─────────────────────────────────────────────

const PortfolioChart = dynamic(
  () => import('./PortfolioChart').then(m => ({ default: m.PortfolioChart })),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-4 h-full" aria-busy="true" aria-label="Grafik yükleniyor">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="skeleton h-0.5 w-4 rounded" />
                <div className="skeleton h-2.5 w-20 rounded" />
              </div>
            ))}
          </div>
          <div className="skeleton h-7 w-40 rounded-lg" />
        </div>
        <div className="flex-1 skeleton rounded-xl" style={{ minHeight: 220 }} />
      </div>
    ),
  }
)

// ─────────────────────────────────────────────
// DASHBOARD CLIENT
// ─────────────────────────────────────────────

interface DashboardClientProps {
  summary: PortfolioSummary
  chartData: ChartPoint[]
  allocations: AllocationSlice[]
  positions: PortfolioPosition[]
}

export function DashboardClient({
  summary,
  chartData,
  allocations,
  positions,
}: DashboardClientProps) {
  return (
    <div className="space-y-8">
      {/* ── Portfolio header metrics ── */}
      <PortfolioMetrics summary={summary} />

      {/* ── Chart + Allocation row ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Portfolio growth chart — 2/3 width on large screens */}
        <CinematicCard className="lg:col-span-2 p-5 min-h-[340px] flex flex-col">
          <div className="flex-1">
            <PortfolioChart data={chartData} />
          </div>
        </CinematicCard>

        {/* Asset allocation — 1/3 width */}
        <CinematicCard
          className="p-5"
          glowColor="rgba(109, 191, 138, 0.08)"
        >
          <AllocationBreakdown
            allocations={allocations}
            totalValue={summary.totalValue}
          />
        </CinematicCard>
      </div>

      {/* ── Top positions ── */}
      <TopPositions
        positions={positions}
        totalValue={summary.totalValue}
      />
    </div>
  )
}
