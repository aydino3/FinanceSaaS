export type InsightType     = 'portfolio' | 'macro' | 'opportunity' | 'risk' | 'alert'
export type InsightPriority = 'critical' | 'high' | 'normal' | 'low'

export interface InsightMetric {
  value: string
  label: string
  delta?: string
  positive?: boolean
}

export interface InsightAction {
  label: string
  href: string
}

export interface AIInsight {
  id: string
  type: InsightType
  priority: InsightPriority
  source: string
  title: string
  lead: string    // 1–2 sentences — typewriter target for featured card
  body: string    // rest of analysis — paragraph breaks via '\n\n'
  metric?: InsightMetric
  tags: string[]
  action?: InsightAction
  timestamp: string   // ISO date string
  readTime: number    // minutes
}

export interface MarketTicker {
  id: string
  label: string
  value: string
  change: number      // percent; negative = down
  unit?: string
}

export interface DailyBriefSummary {
  date: string               // ISO
  greeting: string
  portfolioDayChange: number
  portfolioDayChangePct: number
  insightCount: number
  tickers: MarketTicker[]
}
