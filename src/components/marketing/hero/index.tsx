// ─────────────────────────────────────────────
// HERO SECTION — Server Component Orchestrator
//
// This is intentionally a Server Component. It
// composes Client Component leaves (HeroBackground,
// HeroContent) without requiring 'use client' itself.
//
// Layout contract (from INFORMATION_ARCHITECTURE.md):
//   - Full viewport height: 100dvh
//   - Content: centered X+Y, max-w-3xl
//   - Background: ambient radial gradient
//   - Below fold: scroll indicator
// ─────────────────────────────────────────────

import { HeroBackground }     from './HeroBackground'
import { HeroContent }        from './HeroContent'
import { HeroScrollIndicator } from './HeroScrollIndicator'

export function HeroSection() {
  return (
    <section
      aria-label="Hero bölümü"
      className="relative flex min-h-[100dvh] w-full items-center justify-center
                 overflow-hidden bg-[var(--color-canvas)]"
    >
      {/* Atmospheric background layers — Client Component */}
      <HeroBackground />

      {/* Main content — centered, max-w-3xl */}
      <div
        id="main-content"
        className="relative z-10 w-full max-w-3xl px-5 sm:px-8
                   pt-24 pb-20"
        tabIndex={-1}
      >
        {/* Client Component: all Framer Motion animations live here */}
        <HeroContent />
      </div>

      {/* CSS-only scroll indicator — Server Component */}
      <HeroScrollIndicator />
    </section>
  )
}
