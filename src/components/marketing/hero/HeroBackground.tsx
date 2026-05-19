'use client'

import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────
// HERO BACKGROUND
//
// Renders three layered atmospheric elements:
//  1. Dot grid — adds spatial texture without JS
//  2. Static top-center amber glow — consistent light source
//  3. Mouse-follow radial glow — ambient lighting via CSS custom
//     properties (NOT React state — zero re-renders on mousemove)
//
// All GPU-composited (opacity/transform only) — no layout impact.
// Completely disabled when prefers-reduced-motion is active.
// ─────────────────────────────────────────────

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Respect reduced-motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) return

    // Only activate on hover-capable devices
    const hoverQuery = window.matchMedia('(hover: hover)')
    if (!hoverQuery.matches) return

    const handleMouseMove = (e: MouseEvent) => {
      // Cancel pending frame — only process the latest position
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }

      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width)  * 100
        const y = ((e.clientY - rect.top)  / rect.height) * 100

        // CSS custom property update — no React state, no re-render
        el.style.setProperty('--glow-x', `${x.toFixed(1)}%`)
        el.style.setProperty('--glow-y', `${y.toFixed(1)}%`)
      })
    }

    el.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      // Default glow position — top-center, before any mouse interaction
      style={
        {
          '--glow-x': '50%',
          '--glow-y': '25%',
        } as React.CSSProperties
      }
    >
      {/* ── Layer 1: Dot grid — subtle spatial texture ── */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: [
            'radial-gradient(circle, rgba(255,255,255,0.018) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '36px 36px',
          backgroundPosition: '18px 18px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 80%)',
        }}
      />

      {/* ── Layer 2: Static top-center amber glow — canonical light source ── */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 70% 45% at 50% -5%,',
            '  rgba(212, 164, 46, 0.09) 0%,',
            '  rgba(212, 164, 46, 0.03) 50%,',
            '  transparent 70%',
            ')',
          ].join(''),
        }}
      />

      {/* ── Layer 3: Subtle top vignette — grounds the content ── */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 100% 60% at 50% -15%,',
            '  rgba(30, 20, 8, 0.35) 0%,',
            '  transparent 65%',
            ')',
          ].join(''),
        }}
      />

      {/* ── Layer 4: Mouse-follow glow — reads from CSS custom props ── */}
      <div
        className="absolute inset-0 transition-opacity duration-[700ms]"
        style={{
          background: [
            'radial-gradient(',
            '  700px circle at var(--glow-x, 50%) var(--glow-y, 25%),',
            '  rgba(212, 164, 46, 0.045),',
            '  transparent 65%',
            ')',
          ].join(''),
        }}
      />

      {/* ── Layer 5: Bottom fade — blends hero into next section ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--color-canvas))',
        }}
      />
    </div>
  )
}
