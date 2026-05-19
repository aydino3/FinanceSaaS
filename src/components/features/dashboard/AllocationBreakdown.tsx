'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { easings, durations } from '@/lib/motion'
import type { AllocationSlice } from '@/types/portfolio'

// ─────────────────────────────────────────────
// CUSTOM SVG DONUT CHART
//
// Built without Recharts — pure SVG with
// stroke-dasharray/stroke-dashoffset technique.
// Zero layout shift, compositor-friendly hover.
//
// Geometry:
//   viewBox  128×128, center 64 64
//   radius   52  strokeWidth 14
//   circumference ≈ 326.73
//   gap between segments ≈ 2.5 SVG units
// ─────────────────────────────────────────────

const RADIUS = 52
const STROKE_WIDTH = 14
const CX = 64
const CY = 64
const CIRCUMFERENCE = 2 * Math.PI * RADIUS // ≈ 326.73
const SEGMENT_GAP = 2.5 // SVG units of gap between segments

interface ComputedSegment extends AllocationSlice {
  dashLength: number
  dashOffset: number
}

function computeSegments(slices: AllocationSlice[]): ComputedSegment[] {
  let cumulativeLength = 0

  return slices.map((slice) => {
    const segmentLength = (slice.percent / 100) * CIRCUMFERENCE - SEGMENT_GAP
    const dashOffset = -(cumulativeLength)
    cumulativeLength += segmentLength + SEGMENT_GAP
    return { ...slice, dashLength: segmentLength, dashOffset }
  })
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function fmtValue(v: number): string {
  if (v >= 1_000_000) return `₺${(v / 1_000_000).toFixed(2)}M`
  return `₺${Math.round(v).toLocaleString('tr-TR')}`
}

// ─────────────────────────────────────────────
// DONUT SEGMENT
// ─────────────────────────────────────────────

interface DonutSegmentProps {
  seg: ComputedSegment
  isHovered: boolean
  isAnyHovered: boolean
  onHover: (id: string | null) => void
}

function DonutSegment({ seg, isHovered, isAnyHovered, onHover }: DonutSegmentProps) {
  return (
    <motion.circle
      cx={CX}
      cy={CY}
      r={RADIUS}
      fill="none"
      stroke={seg.color}
      strokeWidth={STROKE_WIDTH}
      strokeDasharray={`${seg.dashLength} ${CIRCUMFERENCE}`}
      strokeDashoffset={seg.dashOffset}
      strokeLinecap="butt"
      // SVG is drawn from 3 o'clock; rotate to start from 12 o'clock
      transform={`rotate(-90 ${CX} ${CY})`}
      style={{ transformOrigin: `${CX}px ${CY}px` }}
      animate={{
        opacity: isAnyHovered ? (isHovered ? 1 : 0.35) : 1,
        scale: isHovered ? 1.04 : 1,
      }}
      transition={{ duration: durations.fast, ease: easings.easeOutExpo }}
      onMouseEnter={() => onHover(seg.id)}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer"
      aria-label={`${seg.label}: ${seg.percent}%`}
    />
  )
}

// ─────────────────────────────────────────────
// ALLOCATION ROW
// ─────────────────────────────────────────────

interface AllocationRowProps {
  seg: AllocationSlice
  isHovered: boolean
  isAnyHovered: boolean
  onHover: (id: string | null) => void
  totalValue: number
}

function AllocationRow({ seg, isHovered, isAnyHovered, onHover, totalValue }: AllocationRowProps) {
  const barWidth = seg.percent

  return (
    <motion.div
      animate={{ opacity: isAnyHovered ? (isHovered ? 1 : 0.45) : 1 }}
      transition={{ duration: durations.fast }}
      className="flex cursor-default items-center gap-3"
      onMouseEnter={() => onHover(seg.id)}
      onMouseLeave={() => onHover(null)}
      role="row"
      aria-label={`${seg.label}: ${seg.percent}%, ${fmtValue(seg.value)}`}
    >
      {/* Color swatch */}
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: seg.color }}
        aria-hidden="true"
      />

      {/* Label */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="type-body-sm text-[var(--color-fg-muted)] truncate">
            {seg.label}
          </span>
          <span className="type-body-sm tabular-nums text-[var(--color-fg)] shrink-0">
            {seg.percent}%
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="h-0.5 w-full rounded-full bg-white/[0.06] overflow-hidden"
          aria-hidden="true"
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: seg.color }}
            initial={{ width: 0 }}
            animate={{ width: `${barWidth}%` }}
            transition={{
              duration: durations.deliberate,
              ease: easings.easeOutExpo,
              delay: 0.2,
            }}
          />
        </div>
      </div>

      {/* Value */}
      <span
        className="type-label-sm tabular-nums text-[var(--color-fg-subtle)] shrink-0 w-20 text-right"
        suppressHydrationWarning
      >
        {fmtValue(seg.value)}
      </span>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// ALLOCATION BREAKDOWN COMPONENT
// ─────────────────────────────────────────────

interface AllocationBreakdownProps {
  allocations: AllocationSlice[]
  totalValue: number
}

export function AllocationBreakdown({ allocations, totalValue }: AllocationBreakdownProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const segments = computeSegments(allocations)
  const isAnyHovered = hoveredId !== null
  const hoveredSlice = allocations.find(a => a.id === hoveredId)

  return (
    <div
      className="flex flex-col gap-5 h-full"
      role="figure"
      aria-label="Varlık dağılımı"
    >
      <div className="flex items-center justify-between">
        <h3 className="type-body-sm font-medium text-[var(--color-fg-muted)]">
          Varlık Dağılımı
        </h3>
        <span className="type-label-sm text-[var(--color-fg-disabled)]">
          {allocations.length} kategori
        </span>
      </div>

      {/* Donut */}
      <div className="flex justify-center">
        <div className="relative" style={{ width: 128, height: 128 }}>
          <svg
            viewBox="0 0 128 128"
            width="128"
            height="128"
            aria-hidden="true"
            role="presentation"
            style={{ overflow: 'visible' }}
          >
            {/* Track ring */}
            <circle
              cx={CX}
              cy={CY}
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={STROKE_WIDTH}
            />

            {/* Segments */}
            {segments.map((seg) => (
              <DonutSegment
                key={seg.id}
                seg={seg}
                isHovered={hoveredId === seg.id}
                isAnyHovered={isAnyHovered}
                onHover={setHoveredId}
              />
            ))}
          </svg>

          {/* Center value display */}
          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
            aria-live="polite"
            aria-atomic="true"
          >
            {hoveredSlice ? (
              <>
                <span
                  className="type-label-sm font-medium leading-none"
                  style={{ color: hoveredSlice.color }}
                >
                  {hoveredSlice.percent}%
                </span>
                <span className="type-label-sm text-[var(--color-fg-disabled)] mt-0.5 text-center leading-tight max-w-[56px]">
                  {hoveredSlice.label}
                </span>
              </>
            ) : (
              <>
                <span
                  className="type-label-sm font-medium text-[var(--color-fg-muted)]"
                  suppressHydrationWarning
                >
                  {fmtValue(totalValue)}
                </span>
                <span className="type-label-sm text-[var(--color-fg-disabled)]">
                  toplam
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Allocation rows */}
      <div
        className="flex flex-col gap-3"
        role="table"
        aria-label="Varlık dağılımı tablosu"
      >
        {allocations.map((slice) => (
          <AllocationRow
            key={slice.id}
            seg={slice}
            isHovered={hoveredId === slice.id}
            isAnyHovered={isAnyHovered}
            onHover={setHoveredId}
            totalValue={totalValue}
          />
        ))}
      </div>

      {/* YTD return note */}
      <p className="type-label-sm text-[var(--color-fg-disabled)] mt-auto">
        En iyi: {allocations.reduce((best, a) => a.returnYtd > best.returnYtd ? a : best).label}{' '}
        <span className="text-[var(--color-positive)]">
          +{allocations.reduce((best, a) => a.returnYtd > best.returnYtd ? a : best).returnYtd.toFixed(1)}% YTD
        </span>
      </p>
    </div>
  )
}
