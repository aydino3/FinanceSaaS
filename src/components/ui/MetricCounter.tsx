'use client'

import { useState, useEffect, useRef } from 'react'
import { animate } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────
// METRIC COUNTER
//
// Kinetic number animation using Framer Motion's
// animate() imperative API (not a component).
//
// Hydration contract:
//   - useState(value) → SSR renders the real value.
//   - Client initial render matches SSR (no mismatch).
//   - useEffect (client-only) then starts the animation
//     from 85% of value upward — a subtle confirmation
//     pulse that avoids the jarring 0→N flash.
//   - suppressHydrationWarning on the <span> covers
//     any tiny floating-point formatting difference.
//
// For subsequent value changes (e.g. switching time
// periods), animates from the previous to the new value.
// ─────────────────────────────────────────────

export interface MetricCounterProps {
  value: number
  /** Called with the instantaneous animated number to produce display string */
  formatter: (v: number) => string
  className?: string
  /** Duration in seconds for the mount animation */
  mountDuration?: number
  /** Duration in seconds for subsequent value changes */
  changeDuration?: number
}

export function MetricCounter({
  value,
  formatter,
  className,
  mountDuration = 1.4,
  changeDuration = 0.75,
}: MetricCounterProps) {
  // Initial state matches server render — no hydration error
  const [displayValue, setDisplayValue] = useState(value)
  const isMountRef = useRef(true)
  const prevValueRef = useRef(value)
  const controlsRef = useRef<{ stop: () => void } | null>(null)

  useEffect(() => {
    const isMount = isMountRef.current
    const from = isMount
      ? value * 0.85       // Start near the real value — subtle confirmation pulse
      : prevValueRef.current

    isMountRef.current = false
    prevValueRef.current = value

    // Stop any in-progress animation before starting a new one
    controlsRef.current?.stop()

    const controls = animate(from, value, {
      duration: isMount ? mountDuration : changeDuration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplayValue(v),
    })

    controlsRef.current = controls

    return () => controls.stop()
  }, [value, mountDuration, changeDuration])

  return (
    <span
      suppressHydrationWarning
      className={cn('tabular-nums', className)}
      style={{ fontFeatureSettings: '"tnum"', fontVariantNumeric: 'tabular-nums' }}
    >
      {formatter(displayValue)}
    </span>
  )
}

// ─────────────────────────────────────────────
// CONVENIENCE FORMATTERS
// ─────────────────────────────────────────────

export function fmtTRY(value: number, compact = false): string {
  if (compact) {
    if (value >= 1_000_000) return `₺${(value / 1_000_000).toFixed(2)}M`
    if (value >= 1_000) return `₺${(value / 1_000).toFixed(0)}K`
  }
  // Full Turkish number format: ₺2.847.293
  return `₺${Math.round(value).toLocaleString('tr-TR')}`
}

export function fmtPercent(value: number, decimals = 1, forceSign = true): string {
  const sign = forceSign && value > 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

export function fmtTRYDelta(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}₺${Math.round(Math.abs(value)).toLocaleString('tr-TR')}`
}
