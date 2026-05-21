'use client'

import { useMemo } from 'react'
import {
  ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { motion } from 'framer-motion'
import { MetricCounter } from '@/components/ui/MetricCounter'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import { MONTHLY_CPI_PCT, cpiFactor, cumulativeCpiPct } from '@/lib/data-engine'

// ─────────────────────────────────────────────
// CASH EROSION CHART
//
// Counterfactual visualization — "what if you kept it as cash?"
//
// Two series indexed at month 0:
//   • Nominal Cash    — flat baseline (no investment, no interest)
//   • Real Purchasing — initialCash / cpiFactor(0, i)
//                       (what that cash can buy in month-0 prices)
//
// The gap between them is the "erosion zone" — pure inflation tax,
// filled with a rose gradient to communicate loss without alarm.
// ─────────────────────────────────────────────

const TR_SHORT = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara']

function fmtMonth(dateStr: string): string {
  const [, m] = dateStr.split('-')
  return TR_SHORT[parseInt(m, 10) - 1] ?? ''
}

function fmtMonthFull(dateStr: string): string {
  const [y, m] = dateStr.split('-')
  return `${TR_SHORT[parseInt(m, 10) - 1] ?? ''} ${y}`
}

function fmtTry(v: number): string {
  return `₺${Math.round(v).toLocaleString('tr-TR')}`
}

function fmtTryCompact(v: number): string {
  if (v >= 1_000_000) return `₺${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000)     return `₺${(v / 1_000).toFixed(0)}K`
  return `₺${Math.round(v)}`
}

// ─────────────────────────────────────────────
// TOOLTIP
// ─────────────────────────────────────────────

interface TooltipRow { dataKey?: string; value?: number; [k: string]: unknown }
interface TooltipProps { active?: boolean; payload?: TooltipRow[]; label?: string }

function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length || !label) return null

  const get = (key: string) => {
    const raw = payload.find(p => p.dataKey === key)?.value
    return typeof raw === 'number' ? raw : 0
  }

  const nominal = get('nominal')
  const real    = get('real')
  const erosion = nominal - real
  const pctLost = nominal > 0 ? (erosion / nominal) * 100 : 0

  return (
    <div
      className="min-w-[220px] rounded-xl border border-white/[0.10] p-3.5
                 shadow-[0_16px_48px_rgba(0,0,0,0.70)]"
      style={{ background: 'rgba(18,18,22,0.94)', backdropFilter: 'blur(20px)' }}
    >
      <p className="type-label-sm text-[var(--color-fg-subtle)] mb-2.5">{fmtMonthFull(label)}</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="2" aria-hidden="true">
              <line x1="0" y1="1" x2="14" y2="1" stroke="#D4A42E" strokeWidth="2" strokeDasharray="3 2" />
            </svg>
            <span className="type-label-sm text-[var(--color-fg-subtle)]">Nakit (nominal)</span>
          </div>
          <span className="type-body-sm font-medium tabular-nums text-[var(--color-fg)]">
            {fmtTry(nominal)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="2" aria-hidden="true">
              <line x1="0" y1="1" x2="14" y2="1" stroke="#BF6D7A" strokeWidth="2" />
            </svg>
            <span className="type-label-sm text-[var(--color-fg-subtle)]">Satın alma gücü</span>
          </div>
          <span className="type-body-sm font-medium tabular-nums text-[var(--color-negative)]">
            {fmtTry(real)}
          </span>
        </div>
        <div className="mt-2 border-t border-white/[0.06] pt-2 flex items-center justify-between">
          <span className="type-label-sm text-[var(--color-fg-disabled)]">Eriyen değer</span>
          <span className="type-label-sm font-medium tabular-nums text-[var(--color-negative)]">
            −{fmtTry(erosion)} ({pctLost.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

interface CashErosionChartProps {
  /** Hypothetical cash amount sitting under a mattress at t0. */
  initialCash: number
}

export function CashErosionChart({ initialCash }: CashErosionChartProps) {
  const data = useMemo(() => {
    return MONTHLY_CPI_PCT.map((m, i) => {
      const factor = cpiFactor(0, i)
      const real = initialCash / factor
      return {
        date: m.date,
        nominal: initialCash,
        real: Math.round(real),
        // Range tuple [low, high] — Recharts renders Area between these
        gap: [Math.round(real), initialCash] as [number, number],
      }
    })
  }, [initialCash])

  const finalReal     = data[data.length - 1].real
  const totalErosion  = initialCash - finalReal
  const erosionPct    = (totalErosion / initialCash) * 100
  const cumulativeCpi = cumulativeCpiPct(0, MONTHLY_CPI_PCT.length - 1)

  // Y domain — leave headroom above nominal and below real
  const minVal = Math.min(...data.map(d => d.real))
  const maxVal = initialCash
  const pad    = (maxVal - minVal) * 0.12
  const yDomain: [number, number] = [Math.max(0, minVal - pad), maxVal + pad]

  return (
    <div className="flex flex-col gap-5" role="figure" aria-label="Nakit satın alma gücü erozyon grafiği">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="type-label-sm text-[var(--color-accent-300)] uppercase tracking-widest">
            Karşı-Olgusal Senaryo
          </p>
          <h3 className="type-headline-md font-medium text-[var(--color-fg)] tracking-tight">
            Yastık altında bekleyen <span className="tabular-nums">{fmtTryCompact(initialCash)}</span> ne olurdu?
          </h3>
          <p className="type-body-sm text-[var(--color-fg-subtle)] max-w-xl leading-relaxed">
            Son 18 ayda TÜFE %{cumulativeCpi.toFixed(1)} arttı. Nakit olarak tutulan paranın
            nominal değeri sabit kalsa da satın alma gücü her ay eridi.
          </p>
        </div>

        {/* Erosion callout — kinetic counter */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.comfortable, ease: easings.easeOutExpo, delay: 0.1 }}
          className="rounded-xl border border-[var(--color-negative-border)]
                     bg-[var(--color-negative-bg)] px-5 py-3 text-right shrink-0"
        >
          <p className="type-label-sm text-[var(--color-fg-disabled)] mb-1">
            Eriyen satın alma gücü
          </p>
          <MetricCounter
            value={totalErosion}
            formatter={(v) => `−${fmtTry(v)}`}
            className="type-headline-md font-medium text-[var(--color-negative-emphasis)] tabular-nums"
            mountDuration={1.6}
          />
          <p className="type-label-sm text-[var(--color-negative)] tabular-nums mt-0.5">
            −{erosionPct.toFixed(1)}% reel
          </p>
        </motion.div>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-center gap-5" aria-label="Grafik açıklaması">
        <div className="flex items-center gap-1.5">
          <svg width="16" height="2" aria-hidden="true">
            <line x1="0" y1="1" x2="16" y2="1" stroke="#D4A42E" strokeWidth="2" strokeDasharray="3 2" />
          </svg>
          <span className="type-label-sm text-[var(--color-fg-disabled)]">
            Nakit (nominal sabit)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="2" aria-hidden="true">
            <line x1="0" y1="1" x2="16" y2="1" stroke="#BF6D7A" strokeWidth="2" />
          </svg>
          <span className="type-label-sm text-[var(--color-fg-disabled)]">
            Reel satın alma gücü
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-3 rounded-sm"
            style={{ background: 'linear-gradient(180deg, rgba(191,109,122,0.25), rgba(191,109,122,0.05))' }}
          />
          <span className="type-label-sm text-[var(--color-fg-disabled)]">Erozyon</span>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="flex-1 min-h-0" style={{ minHeight: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="grad-erosion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#BF6D7A" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#BF6D7A" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="grad-real-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#D4909A" />
                <stop offset="100%" stopColor="#BF6D7A" />
              </linearGradient>
            </defs>

            <CartesianGrid
              horizontal vertical={false}
              stroke="rgba(255,255,255,0.04)"
              strokeDasharray="2 6"
            />

            <XAxis
              dataKey="date"
              tickFormatter={fmtMonth}
              tick={{ fill: '#3A3936', fontSize: 11 }}
              axisLine={false} tickLine={false} dy={8}
              interval="preserveStartEnd"
            />

            <YAxis
              tickFormatter={fmtTryCompact}
              tick={{ fill: '#3A3936', fontSize: 11 }}
              axisLine={false} tickLine={false} dx={-4}
              domain={yDomain} width={64}
            />

            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: 'rgba(255,255,255,0.07)', strokeWidth: 1, strokeDasharray: '3 3' }}
            />

            {/* Reference baseline at nominal — emphasizes "nothing happens" with cash */}
            <ReferenceLine
              y={initialCash}
              stroke="rgba(212,164,46,0.15)"
              strokeWidth={1}
            />

            {/* Erosion band — fills between real (low) and nominal (high) */}
            <Area
              type="monotone"
              dataKey="gap"
              stroke="none"
              fill="url(#grad-erosion)"
              activeDot={false}
              isAnimationActive
              animationBegin={200}
              animationDuration={1200}
              animationEasing="ease-out"
            />

            {/* Nominal cash line — flat, dashed amber */}
            <Line
              type="monotone"
              dataKey="nominal"
              stroke="#D4A42E"
              strokeWidth={1.75}
              strokeDasharray="4 3"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />

            {/* Real purchasing power — fluid descending line with gradient stroke */}
            <Line
              type="monotone"
              dataKey="real"
              stroke="url(#grad-real-stroke)"
              strokeWidth={2.25}
              dot={false}
              activeDot={{ r: 4, fill: '#BF6D7A', stroke: '#0C0C0E', strokeWidth: 2.5 }}
              isAnimationActive
              animationBegin={150}
              animationDuration={1400}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* ── Bottom narrative ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-1">
        <div className="rounded-lg border border-white/[0.05] bg-[var(--color-surface-inset)] px-4 py-3">
          <p className="type-label-sm text-[var(--color-fg-disabled)] mb-1">Bugünkü değer</p>
          <MetricCounter
            value={finalReal}
            formatter={fmtTry}
            className="type-body-lg font-medium text-[var(--color-fg)] tabular-nums"
            mountDuration={1.5}
          />
        </div>
        <div className="rounded-lg border border-white/[0.05] bg-[var(--color-surface-inset)] px-4 py-3">
          <p className="type-label-sm text-[var(--color-fg-disabled)] mb-1">Kümülatif TÜFE</p>
          <MetricCounter
            value={cumulativeCpi}
            formatter={(v) => `+${v.toFixed(1)}%`}
            className="type-body-lg font-medium text-[var(--color-negative)] tabular-nums"
            mountDuration={1.5}
          />
        </div>
        <div className="rounded-lg border border-white/[0.05] bg-[var(--color-surface-inset)] px-4 py-3">
          <p className="type-label-sm text-[var(--color-fg-disabled)] mb-1">Yıllıklandırılmış erozyon</p>
          <MetricCounter
            value={(Math.pow(1 + erosionPct / 100, 12 / MONTHLY_CPI_PCT.length) - 1) * 100}
            formatter={(v) => `${v.toFixed(1)}% / yıl`}
            className={cn('type-body-lg font-medium text-[var(--color-negative)] tabular-nums')}
            mountDuration={1.5}
          />
        </div>
      </div>
    </div>
  )
}
