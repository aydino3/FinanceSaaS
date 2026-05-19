// ─────────────────────────────────────────────
// MARKETING LAYOUT
//
// Shell for all public-facing pages.
// No sidebar or app chrome — just a sticky nav
// and a minimal footer. Server Component.
// ─────────────────────────────────────────────

import { MarketingNav } from '@/components/layouts/MarketingNav'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Sticky navigation — Client Component (scroll state) */}
      <MarketingNav />

      {/* Page content — no max-width constraint at layout level;
          individual sections define their own widths */}
      <main>{children}</main>

      {/* Minimal footer */}
      <footer
        className="flex h-20 items-center justify-between px-6 sm:px-8
                   border-t border-white/[0.06]"
        role="contentinfo"
      >
        <span className="type-caption text-[var(--color-fg-subtle)]">
          © 2026 FinansOS. Tüm hakları saklıdır.
        </span>

        <nav
          aria-label="Alt navigasyon"
          className="flex items-center gap-5"
        >
          {(['Gizlilik', 'Koşullar', 'İletişim'] as const).map((label) => (
            <a
              key={label}
              href="#"
              className="type-caption text-[var(--color-fg-subtle)]
                         transition-colors duration-[var(--duration-micro)]
                         hover:text-[var(--color-fg-muted)]
                         focus-visible:outline-none
                         focus-visible:ring-2
                         focus-visible:ring-[var(--color-accent-400)]
                         rounded-sm"
            >
              {label}
            </a>
          ))}
        </nav>
      </footer>
    </>
  )
}
