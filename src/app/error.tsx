'use client'

import { useEffect } from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────
// ROOT ERROR BOUNDARY
// Catches uncaught errors in any route segment
// and renders a calm, on-brand fallback.
// ─────────────────────────────────────────────

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[GlobalError]', error)
    }
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Status indicator */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-negative-border)] bg-[var(--color-negative-bg)] px-3 py-1">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--color-negative)]"
            aria-hidden="true"
          />
          <span className="type-label-sm tracking-widest uppercase text-[var(--color-negative)]">
            Beklenmedik Hata
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-[var(--color-fg)] font-light"
          style={{ fontSize: '32px', letterSpacing: '-0.02em', lineHeight: '1.15' }}
        >
          Bir şeyler ters gitti.
        </h1>

        {/* Body */}
        <p className="type-body-sm text-[var(--color-fg-subtle)] leading-relaxed">
          İsteğinizi işlerken beklenmedik bir sorunla karşılaştık. Sorun devam ederse lütfen
          birkaç dakika sonra tekrar deneyin.
          {error.digest && (
            <span className="block mt-3 type-label-sm text-[var(--color-fg-disabled)] font-mono">
              Referans: {error.digest}
            </span>
          )}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2
                       border border-[var(--color-accent-400)]/30
                       bg-[var(--color-accent-400)]/10
                       text-[var(--color-accent-400)] type-body-sm font-medium
                       hover:bg-[var(--color-accent-400)]/20 transition-colors duration-150
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-[var(--color-accent-400)]"
          >
            Tekrar dene
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2
                       border border-white/[0.08] bg-[var(--color-surface)]
                       text-[var(--color-fg-muted)] type-body-sm
                       hover:bg-[var(--color-surface-raised)] transition-colors duration-150
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-[var(--color-accent-400)]"
          >
            Ana sayfa
          </Link>
        </div>
      </div>
    </div>
  )
}
