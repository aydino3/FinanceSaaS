'use client'

import dynamic from 'next/dynamic'
import { WealthStatus } from './WealthStatus'
import { BenchmarkGrid } from './BenchmarkGrid'
import { PurchasingPowerBars } from './PurchasingPowerBars'
import { MonthlyHeatmap } from './MonthlyHeatmap'
import { CinematicCard } from '@/components/ui/CinematicCard'
import type { AnalyticsPoint, MonthlyRow, AnalyticsSummary } from '@/types/analytics'

// Recharts must run client-only — dynamically import to avoid SSR
const RealReturnChart = dynamic(
  () => import('./RealReturnChart').then(m => ({ default: m.RealReturnChart })),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-4 h-full" aria-busy="true" aria-label="Grafik yükleniyor">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="skeleton h-0.5 w-4 rounded" />
                <div className="skeleton h-2.5 w-16 rounded" />
              </div>
            ))}
          </div>
          <div className="skeleton h-7 w-40 rounded-lg" />
        </div>
        <div className="skeleton h-2.5 w-48 rounded" />
        <div className="flex-1 skeleton rounded-xl" style={{ minHeight: 240 }} />
      </div>
    ),
  }
)

// ─────────────────────────────────────────────
// ANALYTICS CLIENT
// ─────────────────────────────────────────────

interface AnalyticsClientProps {
  summary:     AnalyticsSummary
  points:      AnalyticsPoint[]
  monthlyRows: MonthlyRow[]
}

export function AnalyticsClient({ summary, points, monthlyRows }: AnalyticsClientProps) {
  return (
    <div className="space-y-6">

      {/* ── 1. Wealth status hero ── */}
      <WealthStatus summary={summary} />

      {/* ── 2. Multi-series indexed return chart ── */}
      <CinematicCard className="p-5 min-h-[360px] flex flex-col">
        <div className="flex-1">
          <RealReturnChart data={points} />
        </div>
      </CinematicCard>

      {/* ── 3. Benchmark comparison grid ── */}
      <BenchmarkGrid summary={summary} />

      {/* ── 4. Purchasing power bars ── */}
      <PurchasingPowerBars summary={summary} />

      {/* ── 5. Monthly heatmap ── */}
      <MonthlyHeatmap rows={monthlyRows} />

    </div>
  )
}
