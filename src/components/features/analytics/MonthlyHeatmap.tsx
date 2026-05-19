'use client'

import { motion } from 'framer-motion'
import { CinematicCard } from '@/components/ui/CinematicCard'
import { cn } from '@/lib/utils'
import type { MonthlyRow } from '@/types/analytics'

// ─────────────────────────────────────────────
// MONTHLY HEATMAP
// Each row: month label | portfolio MoM % | CPI MoM % | verdict
// Color: amber cell = beating inflation, rose = losing, zinc = neutral
// ─────────────────────────────────────────────

const TR_MONTHS: Record<string, string> = {
  '01': 'Ocak', '02': 'Şubat', '03': 'Mart', '04': 'Nisan',
  '05': 'Mayıs', '06': 'Haziran', '07': 'Temmuz', '08': 'Ağustos',
  '09': 'Eylül', '10': 'Ekim', '11': 'Kasım', '12': 'Aralık',
}

function fmtMonth(dateStr: string): string {
  const [y, m] = dateStr.split('-')
  return `${TR_MONTHS[m] ?? m} '${y.slice(2)}`
}

function pctCell(v: number): string {
  return `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`
}

// Colour intensity for portfolio cell based on spread over CPI
function portfolioColor(portfolioMonthly: number, cpiMonthly: number): {
  bg: string; text: string; border: string
} {
  const spread = portfolioMonthly - cpiMonthly
  if (spread >= 2)   return { bg: 'rgba(212,164,46,0.18)', text: '#D4A42E',  border: 'rgba(212,164,46,0.30)' }
  if (spread >= 0)   return { bg: 'rgba(212,164,46,0.08)', text: '#C4A060',  border: 'rgba(212,164,46,0.14)' }
  if (spread >= -1)  return { bg: 'rgba(191,109,122,0.08)', text: '#BF8090', border: 'rgba(191,109,122,0.16)' }
  return              { bg: 'rgba(191,109,122,0.18)', text: '#BF6D7A',  border: 'rgba(191,109,122,0.30)' }
}

interface HeatmapRowProps {
  row: MonthlyRow
  index: number
}

function HeatmapRow({ row, index }: HeatmapRowProps) {
  const { bg, text, border } = portfolioColor(row.portfolioMonthly, row.cpiMonthly)
  const spread = row.portfolioMonthly - row.cpiMonthly

  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1], delay: 0.04 + index * 0.03 }}
      className="group"
    >
      {/* Month */}
      <td className="py-2.5 pr-4 type-label-sm text-[var(--color-fg-disabled)] whitespace-nowrap w-28">
        {fmtMonth(row.date)}
      </td>

      {/* Portfolio cell */}
      <td className="py-2.5 px-2">
        <span
          className="inline-flex items-center justify-center rounded-md px-2.5 py-1
                     type-body-sm font-medium tabular-nums min-w-[72px]"
          style={{ background: bg, color: text, border: `1px solid ${border}` }}
        >
          {pctCell(row.portfolioMonthly)}
        </span>
      </td>

      {/* CPI cell */}
      <td className="py-2.5 px-2">
        <span
          className="inline-flex items-center justify-center rounded-md px-2.5 py-1
                     type-label-sm tabular-nums min-w-[64px]
                     bg-white/[0.04] border border-white/[0.08] text-[var(--color-fg-disabled)]"
        >
          {pctCell(row.cpiMonthly)}
        </span>
      </td>

      {/* Spread */}
      <td className="py-2.5 pl-2 type-label-sm tabular-nums text-right">
        <span className={cn(
          'font-medium',
          spread >= 0 ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'
        )}>
          {spread >= 0 ? '+' : ''}{spread.toFixed(2)}pp
        </span>
      </td>

      {/* Verdict icon */}
      <td className="py-2.5 pl-3 text-right">
        {row.isBeating
          ? <span className="text-[var(--color-positive)] text-xs" aria-label="Enflasyonu geçti">✓</span>
          : <span className="text-[var(--color-negative)] text-xs" aria-label="Enflasyonun altında">✗</span>
        }
      </td>
    </motion.tr>
  )
}

// ─────────────────────────────────────────────
// EXPORTED COMPONENT
// ─────────────────────────────────────────────

interface MonthlyHeatmapProps {
  rows: MonthlyRow[]
}

export function MonthlyHeatmap({ rows }: MonthlyHeatmapProps) {
  const beating = rows.filter(r => r.isBeating).length
  const total   = rows.length

  return (
    <CinematicCard className="p-5 sm:p-6" noGlow>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="type-body-sm font-medium text-[var(--color-fg-muted)]">
              Aylık Enflasyon Karşılaştırması
            </h3>
            <p className="type-label-sm text-[var(--color-fg-disabled)] mt-0.5">
              Her ay portföy getirisi vs. TÜFE aylık değişimi
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.07]
                          bg-[var(--color-surface-inset)] px-3 py-1.5">
            <span className="type-label-sm text-[var(--color-fg-disabled)]">Enflasyonu geçen ay:</span>
            <span className="type-body-sm font-medium text-[var(--color-accent-400)] tabular-nums">
              {beating}/{total}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-1">
          <table className="w-full min-w-[400px]" role="table" aria-label="Aylık performans karşılaştırması">
            <thead>
              <tr>
                <th className="pb-2 pr-4 text-left type-label-sm text-[var(--color-fg-disabled)] font-normal w-28">
                  Dönem
                </th>
                <th className="pb-2 px-2 text-left type-label-sm text-[var(--color-fg-disabled)] font-normal">
                  Portföy
                </th>
                <th className="pb-2 px-2 text-left type-label-sm text-[var(--color-fg-disabled)] font-normal">
                  TÜFE
                </th>
                <th className="pb-2 pl-2 text-right type-label-sm text-[var(--color-fg-disabled)] font-normal">
                  Fark
                </th>
                <th className="pb-2 pl-3 text-right type-label-sm text-[var(--color-fg-disabled)] font-normal sr-only">
                  Sonuç
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {rows.map((row, i) => (
                <HeatmapRow key={row.date} row={row} index={i} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-white/[0.05]">
          {[
            { bg: 'rgba(212,164,46,0.18)', border: 'rgba(212,164,46,0.30)', text: '#D4A42E', label: '+2pp veya fazla üstün' },
            { bg: 'rgba(212,164,46,0.08)', border: 'rgba(212,164,46,0.14)', text: '#C4A060', label: 'Hafif üstün' },
            { bg: 'rgba(191,109,122,0.08)', border: 'rgba(191,109,122,0.16)', text: '#BF8090', label: 'Hafif geride' },
            { bg: 'rgba(191,109,122,0.18)', border: 'rgba(191,109,122,0.30)', text: '#BF6D7A', label: '−1pp veya daha geride' },
          ].map(({ bg, border, text, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-5 rounded-sm border"
                style={{ background: bg, borderColor: border }}
                aria-hidden="true"
              />
              <span className="type-label-sm text-[var(--color-fg-disabled)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </CinematicCard>
  )
}
