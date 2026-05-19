'use client'

import { useState, useMemo } from 'react'
import {
  ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import type { AnalyticsPoint, AnalyticsPeriod } from '@/types/analytics'
import { ANALYTICS_PERIODS, ANALYTICS_PERIOD_POINTS } from '@/types/analytics'

// ─────────────────────────────────────────────
// DATE FORMATTING
// ─────────────────────────────────────────────

const TR_SHORT = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara']

function fmtTick(dateStr: string): string {
  const [, m] = dateStr.split('-')
  return TR_SHORT[parseInt(m, 10) - 1] ?? ''
}

function fmtTickFull(dateStr: string): string {
  const [y, m] = dateStr.split('-')
  return `${TR_SHORT[parseInt(m, 10) - 1] ?? ''} '${y.slice(2)}`
}

function fmtYTick(v: number): string {
  return `${(v - 100).toFixed(0)}%`
}

// ─────────────────────────────────────────────
// TOOLTIP
// ─────────────────────────────────────────────

interface TooltipPayload {
  dataKey?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: number | string | [number, number] | [string, string] | null | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length || !label) return null

  const get = (key: string): number => {
    const raw = payload.find(p => p.dataKey === key)?.value
    return typeof raw === 'number' ? raw : 0
  }

  const portfolio = get('portfolioIndexed')
  const cpi       = get('cpiIndexed')
  const usd       = get('usdTryIndexed')
  const bist      = get('bistIndexed')

  const pct = (v: number) => {
    const d = v - 100
    return `${d >= 0 ? '+' : ''}${d.toFixed(1)}%`
  }

  const [y, m] = label.split('-')
  const monthLabel = `${TR_SHORT[parseInt(m, 10) - 1] ?? ''} ${y}`

  const rows: { color: string; label: string; dashed?: boolean; indexed: number }[] = [
    { color: '#D4A42E', label: 'Portföy',  indexed: portfolio },
    { color: '#BF6D7A', label: 'TÜFE',     indexed: cpi, dashed: true },
    { color: '#5C6B8A', label: 'USD/TRY',  indexed: usd, dashed: true },
    { color: '#3A3936', label: 'BIST 100', indexed: bist, dashed: true },
  ]

  return (
    <div
      className="min-w-[210px] rounded-xl border border-white/[0.10] p-3.5
                 shadow-[0_16px_48px_rgba(0,0,0,0.70)]"
      style={{ background: 'rgba(18,18,22,0.94)', backdropFilter: 'blur(20px)' }}
    >
      <p className="type-label-sm text-[var(--color-fg-subtle)] mb-2.5">{monthLabel}</p>
      <div className="space-y-1.5">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <svg width="14" height="2" aria-hidden="true">
                <line x1="0" y1="1" x2="14" y2="1"
                  stroke={row.color} strokeWidth="2"
                  strokeDasharray={row.dashed ? '3 2' : undefined}
                />
              </svg>
              <span className="type-label-sm text-[var(--color-fg-subtle)]">{row.label}</span>
            </div>
            <span className={cn(
              'type-body-sm font-medium tabular-nums',
              row.label === 'Portföy' && row.indexed > cpi
                ? 'text-[var(--color-accent-400)]'
                : 'text-[var(--color-fg-muted)]'
            )}>
              {pct(row.indexed)}
            </span>
          </div>
        ))}
        {/* Real outperformance vs CPI */}
        <div className="mt-2 border-t border-white/[0.06] pt-2">
          <div className="flex items-center justify-between">
            <span className="type-label-sm text-[var(--color-fg-disabled)]">vs. TÜFE</span>
            <span className={cn(
              'type-label-sm font-medium tabular-nums',
              portfolio >= cpi ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'
            )}>
              {portfolio >= cpi ? '+' : ''}{(portfolio - cpi).toFixed(1)}pp
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// PERIOD BUTTON
// ─────────────────────────────────────────────

function PeriodButton({ period, isActive, onClick }: {
  period: AnalyticsPeriod; isActive: boolean; onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'relative rounded-md px-2.5 py-1 type-label-sm',
        'transition-colors duration-[var(--duration-micro)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)]',
        isActive
          ? 'text-[var(--color-accent-400)]'
          : 'text-[var(--color-fg-disabled)] hover:text-[var(--color-fg-subtle)]'
      )}
    >
      {isActive && (
        <motion.span
          layoutId="analytics-period-active"
          className="absolute inset-0 rounded-md bg-[var(--color-accent-400)]/10
                     border border-[var(--color-accent-400)]/20"
          transition={{ duration: durations.fast, ease: easings.easeOutExpo }}
        />
      )}
      <span className="relative">{period}</span>
    </button>
  )
}

// ─────────────────────────────────────────────
// LEGEND
// ─────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4" aria-label="Grafik açıklaması">
      {([
        { color: '#D4A42E', label: 'Portföy',  dashed: false },
        { color: '#BF6D7A', label: 'TÜFE (CPI)', dashed: true },
        { color: '#5C6B8A', label: 'USD/TRY',  dashed: true },
        { color: '#3A3936', label: 'BIST 100', dashed: true },
      ] as const).map(({ color, label, dashed }) => (
        <div key={label} className="flex items-center gap-1.5">
          <svg width="16" height="2" aria-hidden="true">
            <line x1="0" y1="1" x2="16" y2="1"
              stroke={color} strokeWidth="2"
              strokeDasharray={dashed ? '3 2' : undefined}
            />
          </svg>
          <span className="type-label-sm text-[var(--color-fg-disabled)]">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN CHART
// ─────────────────────────────────────────────

interface RealReturnChartProps {
  data: AnalyticsPoint[]
}

export function RealReturnChart({ data }: RealReturnChartProps) {
  const [activePeriod, setActivePeriod] = useState<AnalyticsPeriod>('Tümü')

  // Slice + re-index to 100 at start of selected period
  const chartData = useMemo(() => {
    const n = ANALYTICS_PERIOD_POINTS[activePeriod]
    const sliced = n === 0 ? data : data.slice(-n)
    const base = sliced[0]
    if (!base) return sliced
    return sliced.map(d => ({
      ...d,
      portfolioIndexed: (d.portfolioIndexed / base.portfolioIndexed) * 100,
      cpiIndexed:       (d.cpiIndexed       / base.cpiIndexed)       * 100,
      usdTryIndexed:    (d.usdTryIndexed    / base.usdTryIndexed)    * 100,
      bistIndexed:      (d.bistIndexed      / base.bistIndexed)      * 100,
    }))
  }, [data, activePeriod])

  const allVals = chartData.flatMap(d => [d.portfolioIndexed, d.cpiIndexed, d.usdTryIndexed, d.bistIndexed])
  const minVal  = Math.min(...allVals)
  const maxVal  = Math.max(...allVals)
  const pad     = (maxVal - minVal) * 0.10
  const yDomain: [number, number] = [Math.max(80, minVal - pad), maxVal + pad]

  return (
    <div className="flex flex-col gap-4 h-full" role="figure" aria-label="Enflasyona karşı getiri karşılaştırması">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Legend />
        <div
          className="flex items-center gap-0.5 rounded-lg border border-white/[0.06]
                     bg-[var(--color-surface-inset)] p-0.5"
          role="group"
          aria-label="Zaman aralığı seçimi"
        >
          {ANALYTICS_PERIODS.map(p => (
            <PeriodButton
              key={p}
              period={p}
              isActive={activePeriod === p}
              onClick={() => setActivePeriod(p)}
            />
          ))}
        </div>
      </div>

      {/* Y-axis label */}
      <p className="type-label-sm text-[var(--color-fg-disabled)]">
        Endekslenmiş getiri (seçili dönem başı = 0%)
      </p>

      {/* Chart */}
      <div className="flex-1 min-h-0" style={{ minHeight: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="grad-portfolio-a" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#D4A42E" stopOpacity={0.28} />
                <stop offset="70%"  stopColor="#D4A42E" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#D4A42E" stopOpacity={0.00} />
              </linearGradient>
              <linearGradient id="grad-cpi-a" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#BF6D7A" stopOpacity={0.10} />
                <stop offset="100%" stopColor="#BF6D7A" stopOpacity={0.00} />
              </linearGradient>
            </defs>

            <CartesianGrid
              horizontal vertical={false}
              stroke="rgba(255,255,255,0.04)"
              strokeDasharray="2 6"
            />

            <XAxis
              dataKey="date"
              tickFormatter={chartData.length <= 5 ? fmtTickFull : fmtTick}
              tick={{ fill: '#3A3936', fontSize: 11, fontFamily: 'inherit' }}
              axisLine={false} tickLine={false} dy={8}
              interval="preserveStartEnd"
            />

            <YAxis
              tickFormatter={fmtYTick}
              tick={{ fill: '#3A3936', fontSize: 11, fontFamily: 'inherit' }}
              axisLine={false} tickLine={false} dx={-4}
              domain={yDomain} width={54}
            />

            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: 'rgba(255,255,255,0.07)', strokeWidth: 1, strokeDasharray: '3 3' }}
            />

            {/* BIST 100 — dim, background */}
            <Line
              type="monotone" dataKey="bistIndexed"
              stroke="#2E2C29" strokeWidth={1.5} strokeDasharray="4 3"
              dot={false} activeDot={false} isAnimationActive={false}
            />

            {/* USD/TRY */}
            <Line
              type="monotone" dataKey="usdTryIndexed"
              stroke="#5C6B8A" strokeWidth={1.5} strokeDasharray="4 3"
              dot={false} activeDot={false} isAnimationActive={false}
            />

            {/* CPI / TÜFE — inflation floor */}
            <Area
              type="monotone" dataKey="cpiIndexed"
              stroke="#BF6D7A" strokeWidth={1.5} strokeDasharray="4 3"
              fill="url(#grad-cpi-a)"
              dot={false} activeDot={false} isAnimationActive={false}
            />

            {/* Portfolio — primary, amber */}
            <Area
              type="monotone" dataKey="portfolioIndexed"
              stroke="#D4A42E" strokeWidth={2}
              fill="url(#grad-portfolio-a)"
              dot={false}
              activeDot={{ r: 4, fill: '#D4A42E', stroke: '#0C0C0E', strokeWidth: 2.5 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
