'use client'

import { useEffect } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[DashboardError]', error)
    }
  }, [error])

  return (
    <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-2xl border border-[var(--color-negative-border)] bg-[var(--color-negative-bg)] p-8 space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--color-negative)]"
            aria-hidden="true"
          />
          <span className="type-label-sm tracking-widest uppercase text-[var(--color-negative)]">
            Panel Hatası
          </span>
        </div>

        <h2
          className="text-[var(--color-fg)] font-light"
          style={{ fontSize: '22px', letterSpacing: '-0.01em', lineHeight: '1.3' }}
        >
          Bu görünüm yüklenemedi.
        </h2>

        <p className="type-body-sm text-[var(--color-fg-subtle)] leading-relaxed">
          Portföy verileriniz güvende. Aşağıdaki butonla görünümü yeniden yüklemeyi deneyebilirsiniz.
          {error.digest && (
            <span className="block mt-2 type-label-sm text-[var(--color-fg-disabled)] font-mono">
              Referans: {error.digest}
            </span>
          )}
        </p>

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
          Yeniden yükle
        </button>
      </div>
    </div>
  )
}
