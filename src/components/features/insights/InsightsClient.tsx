'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DailyBriefHeader } from './DailyBriefHeader'
import { GeneratingLoader } from './GeneratingLoader'
import { AIInsightPanel } from './AIInsightPanel'
import { MarketSidebar } from './MarketSidebar'
import type { AIInsight, DailyBriefSummary } from '@/types/insights'

// ─────────────────────────────────────────────
// INSIGHTS CLIENT
//
// State machine:
//   'generating' → GeneratingLoader plays (≈2.6s)
//   'revealing'  → cards stagger in, typewriter fires
//
// Card stagger: revealDelay = index × 0.32s
// Featured card (index 0): typewriter on lead text
// Others: blur-reveal of all content together
// ─────────────────────────────────────────────

type Phase = 'generating' | 'revealing'

interface InsightsClientProps {
  brief:    DailyBriefSummary
  insights: AIInsight[]
}

export function InsightsClient({ brief, insights }: InsightsClientProps) {
  const [phase, setPhase] = useState<Phase>('generating')

  return (
    <div className="space-y-6">
      {/* ── Daily brief header (always visible) ── */}
      <DailyBriefHeader brief={brief} />

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Feed column — 2/3 width on lg+ */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {phase === 'generating' ? (
              <motion.div
                key="loader"
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <GeneratingLoader onComplete={() => setPhase('revealing')} />
              </motion.div>
            ) : (
              <motion.div
                key="feed"
                initial={{ opacity: 1 }}
                className="space-y-4"
              >
                {insights.map((insight, i) => (
                  <AIInsightPanel
                    key={insight.id}
                    insight={insight}
                    isFeatured={i === 0}
                    revealDelay={i * 0.32}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar column — 1/3 width on lg+ */}
        <div>
          <MarketSidebar tickers={brief.tickers} />
        </div>
      </div>
    </div>
  )
}
