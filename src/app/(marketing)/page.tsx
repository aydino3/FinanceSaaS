import type { Metadata } from 'next'
import { HeroSection } from '@/components/marketing/hero'

// ─────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'FinansOS — Intelligent Investment Platform for Turkey',
  description:
    'Portföyünüzün gerçek getirisini görün. ' +
    'TEFAS fonları, enflasyon düzeltmeli analiz ve AI destekli içgörüler.',
  openGraph: {
    title: 'FinansOS — Your wealth. In real terms.',
    description:
      'Turkey\'s first investment platform that measures your returns ' +
      'against inflation. Real returns, not nominal illusions.',
  },
}

// ─────────────────────────────────────────────
// LANDING PAGE
//
// Server Component. Composes hero and (future)
// sections. Zero client-side JavaScript above the fold.
// ─────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      {/* Phase 1: Hero section */}
      <HeroSection />

      {/*
        Phase 1 scope ends here.
        Subsequent sections (Problem, Features, Trust, CTA)
        are scaffolded in Phase 1F per MASTERPLAN.md.
      */}
      <div
        id="how-it-works"
        className="flex min-h-[40vh] items-center justify-center
                   border-t border-white/[0.04]"
        aria-label="Nasıl çalışır bölümü — yakında"
      >
        <p className="type-caption text-[var(--color-fg-disabled)]">
          Diğer bölümler yakında —
          <a
            href="/signup"
            className="ml-1 text-[var(--color-accent-400)] underline-offset-2
                       hover:underline transition-all"
          >
            şimdi başla
          </a>
        </p>
      </div>
    </>
  )
}
