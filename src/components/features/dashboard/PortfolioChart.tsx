'use client'

import { useState, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import type { ChartPoint, TimePeriod } from '@/types/portfolio'
import { TIME_PERIODS, TIME_PERIOD_POINTS } from '@/types/portfolio'

// ─────────────────────────────────────────────
// FORMATTERS (client-only — no SSR date risk)
// ─────────────────────────────────────────────

const TR_MONTHS_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

function formatXTick(dateStr: string): string {
  const [, monthStr] = dateStr.split('-')
  const month = parseInt(monthStr, 10) - 1
  return TR_MONTHS_SHORT[month] ?? ''
}

function formatXTickFull(dateStr: string): string {
  const [yearStr, monthStr] = dateStr.split('-')
  const month = parseInt(monthStr, 10) - 1
  return `${TR_MONTHS_SHORT[month] ?? ''} '${yearStr.slice(2)}`
}

function formatYTick(value: number): string {
  if (value >= 1_000_000) return `₺${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000)     return `₺${(value / 1_000).toFixed(0)}K`
  return `₺${value}`
}

function formatValueFull(value: number): string {
  return `₺${Math.round(value).toLocaleString('tr-TR')}`
}

// ─────────────────────────────────────────────
// CUSTOM TOOLTIP
// ─────────────────────────────────────────────

// Recharts tooltip props — use a loose shape to stay compatible across v2/v3
interface ChartTooltipProps {
  active?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: Array<{ dataKey?: string; value?: number | string; [key: string]: any }>
  label?: string
}

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length || !label) return null

  const portfolio  = (payload.find(p => p.dataKey === 'value')?.value ?? 0) as number
  const inflation  = (payload.find(p => p.dataKey === 'inflationBaseline')?.value ?? 0) as number
  const bist       = (payload.find(p => p.dataKey === 'bistBaseline')?.value ?? 0) as number
  const delta      = portfolio - inflation
  const isPositive = delta >= 0

  const [yearStr, monthStr] = label.split('-')
  const month = parseInt(monthStr, 10) - 1
  const monthLabel = `${TR_MONTHS_SHORT[month] ?? ''} ${yearStr}`

  return (
    <div
      className="min-w-[200px] rounded-xl border border-white/[0.10] p-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.70)]"
      style={{ background: 'rgba(18,18,22,0.94)', backdropFilter: 'blur(20px)' }}
    >
      <p className="type-label-sm text-[var(--color-fg-subtle)] mb-2">{monthLabel}</p>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-400)]" aria-hidden="true" />
            <span className="type-label-sm text-[var(--color-fg-subtle)]">Portföy</span>
          </div>
          <span className="type-body-sm font-medium text-[var(--color-fg)] tabular-nums">
            {formatValueFull(portfolio)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-negative)]" aria-hidden="true" />
            <span className="type-label-sm text-[var(--color-fg-subtle)]">Enflasyon</span>
          </div>
          <span className="type-body-sm text-[var(--color-fg-muted)] tabular-nums">
            {formatValueFull(inflation)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-fg-disabled)]" aria-hidden="true" />
            <span className="type-label-sm text-[var(--color-fg-subtle)]">BIST 100</span>
          </div>
          <span className="type-body-sm text-[var(--color-fg-muted)] tabular-nums">
            {formatValueFull(bist)}
          </span>
        </div>

        <div className="mt-2 border-t border-white/[0.06] pt-2">
          <div className="flex items-center justify-between">
            <span className="type-label-sm text-[var(--color-fg-subtle)]">vs. enflasyon</span>
            <span
              className={cn(
                'type-label-sm font-medium tabular-nums',
                isPositive ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'
              )}
            >
              {isPositive ? '+' : ''}{formatValueFull(delta)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// PERIOD SELECTOR
// ─────────────────────────────────────────────

interface PeriodButtonProps {
  period: TimePeriod
  isActive: boolean
  onClick: () => void
}

function PeriodButton({ period, isActive, onClick }: PeriodButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        'relative rounded-md px-2.5 py-1 type-label-sm',
        'transition-colors duration-[var(--duration-micro)]',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-[var(--color-accent-400)]',
        isActive
          ? 'text-[var(--color-accent-400)]'
          : 'text-[var(--color-fg-disabled)] hover:text-[var(--color-fg-subtle)]'
      )}
    >
      {isActive && (
        <motion.span
          layoutId="period-active"
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
// CHART LEGEND
// ─────────────────────────────────────────────

function ChartLegend() {
  const items = [
    { color: '#D4A42E', label: 'Portföy değeri' },
    { color: '#BF6D7A', label: 'Enflasyon eşiği', dashed: true },
    { color: '#3A3936', label: 'BIST 100', dashed: true },
  ]
  return (
    <div className="flex items-center gap-4" aria-label="Grafik açıklaması">
      {items.map(({ color, label, dashed }) => (
        <div key={label} className="flex items-center gap-1.5">
          <svg width="16" height="2" aria-hidden="true">
            <line
              x1="0" y1="1" x2="16" y2="1"
              stroke={color}
              strokeWidth="2"
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
// MAIN CHART COMPONENT
// ─────────────────────────────────────────────

interface PortfolioChartProps {
  data: ChartPoint[]
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  const [activePeriod, setActivePeriod] = useState<TimePeriod>('Tümü')

  const chartData = useMemo(() => {
    const n = TIME_PERIOD_POINTS[activePeriod]
    return n === 0 ? data : data.slice(-n)
  }, [data, activePeriod])

  // Compute dynamic Y domain with padding
  const minVal = Math.min(...chartData.map(d => Math.min(d.value, d.inflationBaseline, d.bistBaseline)))
  const maxVal = Math.max(...chartData.map(d => d.value))
  const yPadding = (maxVal - minVal) * 0.08
  const yDomain: [number, number] = [
    Math.max(0, minVal - yPadding),
    maxVal + yPadding,
  ]

  return (
    <div className="flex flex-col gap-4 h-full" role="figure" aria-label="Portföy büyüme grafiği">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <ChartLegend />

        {/* Period selector */}
        <div
          className="flex items-center gap-0.5 rounded-lg border border-white/[0.06]
                     bg-[var(--color-surface-inset)] p-0.5"
          role="group"
          aria-label="Zaman aralığı seçimi"
        >
          {TIME_PERIODS.map((p) => (
            <PeriodButton
              key={p}
              period={p}
              isActive={activePeriod === p}
              onClick={() => setActivePeriod(p)}
            />
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0" style={{ minHeight: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          >
            <defs>
              {/* Portfolio gradient — amber */}
              <linearGradient id="grad-portfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#D4A42E" stopOpacity={0.30} />
                <stop offset="60%"  stopColor="#D4A42E" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#D4A42E" stopOpacity={0.01} />
              </linearGradient>
              {/* Inflation gradient — rose */}
              <linearGradient id="grad-inflation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#BF6D7A" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#BF6D7A" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            {/* Very subtle horizontal grid lines only */}
            <CartesianGrid
              horizontal
              vertical={false}
              stroke="rgba(255,255,255,0.04)"
              strokeDasharray="2 6"
            />

            <XAxis
              dataKey="date"
              tickFormatter={chartData.length <= 5 ? formatXTickFull : formatXTick}
              tick={{ fill: '#3A3936', fontSize: 11, fontFamily: 'inherit' }}
              axisLine={false}
              tickLine={false}
              dy={8}
              interval="preserveStartEnd"
            />

            <YAxis
              tickFormatter={formatYTick}
              tick={{ fill: '#3A3936', fontSize: 11, fontFamily: 'inherit' }}
              axisLine={false}
              tickLine={false}
              dx={-4}
              domain={yDomain}
              width={64}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: 'rgba(255,255,255,0.08)',
                strokeWidth: 1,
                strokeDasharray: '3 3',
              }}
            />

            {/* BIST 100 benchmark — dim, no fill */}
            <Area
              type="monotone"
              dataKey="bistBaseline"
              stroke="#3A3936"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              fill="none"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />

            {/* Inflation break-even line */}
            <Area
              type="monotone"
              dataKey="inflationBaseline"
              stroke="#BF6D7A"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              fill="url(#grad-inflation)"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />

            {/* Portfolio value — primary, amber */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#D4A42E"
              strokeWidth={2}
              fill="url(#grad-portfolio)"
              dot={false}
              activeDot={{
                r: 4,
                fill: '#D4A42E',
                stroke: '#0C0C0E',
                strokeWidth: 2.5,
              }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
