'use client'

import { useRef, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────
// CINEMATIC CARD
//
// Generic card shell with mouse-follow ambient glow.
// Implementation contract from COMPONENT_INVENTORY.md:
//
//   - Glow position: CSS custom properties (--glow-x, --glow-y)
//     updated in requestAnimationFrame — ZERO React re-renders.
//   - Glow opacity (--glow-opacity): CSS transition on the overlay
//     div, toggled by mouseenter/leave via direct DOM mutation.
//   - Disabled on (hover: none) devices (touch screens).
//   - Disabled when prefers-reduced-motion: reduce is set.
//   - clientX/Y captured before RAF to avoid stale event values.
// ─────────────────────────────────────────────

export interface CinematicCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  /** Glow color as an rgba string. Default: accent-400 amber. */
  glowColor?: string
  /** Glow radius in px. Default: 220 */
  glowRadius?: number
  /** Disable the glow (e.g. for skeleton / loading states). */
  noGlow?: boolean
  role?: string
  'aria-label'?: string
}

export function CinematicCard({
  children,
  className,
  onClick,
  glowColor = 'rgba(212, 164, 46, 0.10)',
  glowRadius = 220,
  noGlow = false,
  role,
  'aria-label': ariaLabel,
}: CinematicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const canHoverRef = useRef(false)
  const reducedRef = useRef(false)

  useEffect(() => {
    canHoverRef.current = window.matchMedia('(hover: hover)').matches
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const el = cardRef.current
    if (!el) return
    el.style.setProperty('--glow-x', '50%')
    el.style.setProperty('--glow-y', '50%')
    el.style.setProperty('--glow-opacity', '0')

    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (noGlow || !canHoverRef.current || reducedRef.current) return

      cancelAnimationFrame(rafRef.current)
      const clientX = e.clientX
      const clientY = e.clientY
      rafRef.current = requestAnimationFrame(() => {
        const el = cardRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const x = ((clientX - rect.left) / rect.width) * 100
        const y = ((clientY - rect.top) / rect.height) * 100
        el.style.setProperty('--glow-x', `${x.toFixed(1)}%`)
        el.style.setProperty('--glow-y', `${y.toFixed(1)}%`)
      })
    },
    [noGlow]
  )

  const handleMouseEnter = useCallback(() => {
    if (noGlow || !canHoverRef.current || reducedRef.current) return
    cardRef.current?.style.setProperty('--glow-opacity', '1')
  }, [noGlow])

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    cardRef.current?.style.setProperty('--glow-opacity', '0')
  }, [])

  return (
    <div
      ref={cardRef}
      role={role}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group/cinematic relative overflow-hidden rounded-xl',
        'border border-white/[0.06]',
        'bg-[rgba(17,17,20,0.62)] backdrop-blur-md backdrop-saturate-[1.4]',
        'transition-[border-color,box-shadow,transform] duration-500',
        '[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
        'hover:border-white/[0.10]',
        'hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.65),0_8px_24px_-8px_rgba(0,0,0,0.45)]',
        onClick && 'cursor-pointer',
        className
      )}
      style={
        noGlow
          ? undefined
          : ({
              '--glow-radius': `${glowRadius}px`,
              '--glow-color': glowColor,
            } as React.CSSProperties)
      }
    >
      {/* Ambient glow overlay — CSS opacity transition keeps this on compositor */}
      {!noGlow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-xl"
          style={{
            background:
              'radial-gradient(circle var(--glow-radius, 220px) at var(--glow-x, 50%) var(--glow-y, 50%), var(--glow-color, rgba(212,164,46,0.10)), transparent 70%)',
            opacity: 'var(--glow-opacity, 0)',
            transition: 'opacity 350ms ease',
          }}
        />
      )}

      {/* Global cursor halo — extremely subtle, follows page cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-40
                   transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(circle 320px at var(--mouse-xp, 50%) var(--mouse-yp, 50%), rgba(255,255,255,0.035), transparent 65%)',
        }}
      />

      {/* Top-edge specular line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-px
                   bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
      />

      {/* Inner top highlight — gives glass perceived thickness */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24
                   bg-gradient-to-b from-white/[0.025] to-transparent"
      />

      {/* Content sits above all glow layers */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
