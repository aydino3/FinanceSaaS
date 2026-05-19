import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sayfa bulunamadı',
  description: 'Aradığınız sayfa mevcut değil veya taşınmış olabilir.',
}

// ─────────────────────────────────────────────
// 404 — NOT FOUND
// Caught by Next.js when no route matches.
// ─────────────────────────────────────────────

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Eyebrow */}
        <p className="type-label-sm tracking-widest uppercase text-[var(--color-fg-disabled)]">
          404 — Sayfa Bulunamadı
        </p>

        {/* Headline */}
        <h1
          className="text-[var(--color-fg)] font-light"
          style={{ fontSize: '40px', letterSpacing: '-0.02em', lineHeight: '1.1' }}
        >
          Yolunuzu kaybetmişsiniz.
        </h1>

        {/* Body */}
        <p className="type-body-sm text-[var(--color-fg-subtle)] leading-relaxed">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          Portföyünüze geri dönmek için aşağıdaki bağlantıyı kullanın.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2
                       border border-[var(--color-accent-400)]/30
                       bg-[var(--color-accent-400)]/10
                       text-[var(--color-accent-400)] type-body-sm font-medium
                       hover:bg-[var(--color-accent-400)]/20 transition-colors duration-150
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-[var(--color-accent-400)]"
          >
            Portföye dön
          </Link>
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
