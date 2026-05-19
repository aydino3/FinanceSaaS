import type { Metadata } from 'next'
import { INSIGHTS, DAILY_BRIEF } from '@/data/insights'
import { InsightsClient } from '@/components/features/insights/InsightsClient'

export const metadata: Metadata = {
  title: 'AI Öngörüler — FinansOS',
  description:
    'Portföyünüze özel yapay zeka destekli yatırım öngörüleri, günlük piyasa özeti ve makroekonomik analiz.',
}

// ─────────────────────────────────────────────
// INSIGHTS PAGE — Server Component
//
// All data passed as props so InsightsClient
// renders without client-side waterfalls.
// The AI "generation" animation is purely cosmetic
// (local state in InsightsClient) — data is already
// available on first paint.
// ─────────────────────────────────────────────

export default function InsightsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <InsightsClient
        brief={DAILY_BRIEF}
        insights={INSIGHTS}
      />
    </div>
  )
}
