'use client'

import { useEffect } from 'react'

// ─────────────────────────────────────────────
// AMBIENT CURSOR
//
// Tracks the pointer globally and writes
// --mouse-x / --mouse-y (raw px) and
// --mouse-xp / --mouse-yp (viewport %) to
// document.documentElement on every rAF tick.
//
// Any element on the page can consume these
// variables (radial-gradient at cursor, parallax,
// spotlight masks) without a single React render.
//
// Disabled on coarse pointers and when the user
// has requested reduced motion.
// ─────────────────────────────────────────────

export function AmbientCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const canHover = window.matchMedia('(hover: hover)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canHover || reduced) return

    const root = document.documentElement
    let raf = 0
    let pendingX = window.innerWidth / 2
    let pendingY = window.innerHeight / 2

    // Seed centered so first paint has sensible values
    root.style.setProperty('--mouse-x', `${pendingX}px`)
    root.style.setProperty('--mouse-y', `${pendingY}px`)
    root.style.setProperty('--mouse-xp', '50%')
    root.style.setProperty('--mouse-yp', '50%')

    const apply = () => {
      raf = 0
      root.style.setProperty('--mouse-x', `${pendingX.toFixed(1)}px`)
      root.style.setProperty('--mouse-y', `${pendingY.toFixed(1)}px`)
      root.style.setProperty(
        '--mouse-xp',
        `${((pendingX / window.innerWidth) * 100).toFixed(2)}%`,
      )
      root.style.setProperty(
        '--mouse-yp',
        `${((pendingY / window.innerHeight) * 100).toFixed(2)}%`,
      )
    }

    const handleMove = (e: PointerEvent) => {
      pendingX = e.clientX
      pendingY = e.clientY
      if (!raf) raf = requestAnimationFrame(apply)
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handleMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return null
}
