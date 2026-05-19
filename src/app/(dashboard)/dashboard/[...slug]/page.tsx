import Link from 'next/link'
import { CinematicCard } from '@/components/ui/CinematicCard'

// ─────────────────────────────────────────────
// DASHBOARD CATCH-ALL
//
// Showcase build: navigation surfaces a few
// routes that are not yet implemented (macro,
// watchlist, journal, settings, brief, fund
// detail …). Rather than throwing a hard 404
// inside the dashboard shell, render a graceful
// "soon" placeholder so the experience stays
// uninterrupted for visitors exploring the demo.
// ─────────────────────────────────────────────

const ROUTE_TITLES: Record<string, { title: string; description: string }> = {
  macro: {
    title: 'Makro Panel',
    description:
      'TÜFE, USD/TRY, BIST 100 ve faiz ortamına dair gerçek zamanlı sinyaller — burası, makro koşulların portföyünüze nasıl bastığını ölçen tek yüzeyiniz olacak.',
  },
  watchlist: {
    title: 'Takip Listesi',
    description:
      'İzlediğiniz fonları, fiyat-uyarı kurallarını ve karşılaştırma setlerini barındıran kişisel atölyeniz.',
  },
  journal: {
    title: 'Yatırım Günlüğü',
    description:
      'Her kararın arkasındaki tezi yazın. AI sonradan tez ile sonucu kıyaslayarak öğrenmenizi hızlandıracak.',
  },
  settings: {
    title: 'Ayarlar',
    description:
      'Para birimi tercihi, bildirim eşikleri, AI Brief sıklığı ve veri kaynakları — hepsi tek panelde.',
  },
  brief: {
    title: 'AI Brief',
    description:
      'Her sabah portföyünüze özel, üretilmiş 90 saniyelik makro & strateji özeti. /dashboard/insights üzerinde uzun-form versiyonu mevcut.',
  },
  explorer: {
    title: 'Fon Detayı',
    description:
      'Seçilen TEFAS fonunun NAV grafiği, dağılımı, ücret yapısı ve reel getiri analizi — yakında.',
  },
}

export default async function DashboardPlaceholderPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const key = slug[0] ?? ''
  const meta = ROUTE_TITLES[key] ?? {
    title: 'Bu sayfa hazırlanıyor',
    description:
      'Bu rota showcase sürümünde henüz aktif değil. Sol menüden hazır bölümleri keşfedebilirsiniz.',
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center px-2 py-12">
      <span
        className="mb-6 inline-flex items-center gap-2 rounded-full
                   border border-[var(--color-accent-400)]/20
                   bg-[var(--color-accent-400)]/8 px-3 py-1
                   type-label-sm text-[var(--color-accent-300)]"
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-400)]"
        />
        Yakında
      </span>

      <h1 className="type-display-md mb-4 text-[var(--color-fg)] tracking-[-0.02em]">
        {meta.title}
      </h1>

      <p className="type-body-lg mb-10 max-w-xl text-[var(--color-fg-muted)] leading-relaxed">
        {meta.description}
      </p>

      <CinematicCard className="w-full p-6">
        <p className="type-body-sm mb-5 text-[var(--color-fg-subtle)]">
          Demo sırasında çalışan bölümler:
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            { href: '/dashboard', label: 'Portföy' },
            { href: '/dashboard/explorer', label: 'Fon Keşfi' },
            { href: '/dashboard/analytics', label: 'Reel Getiri Analizi' },
            { href: '/dashboard/insights', label: 'AI İçgörüler' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between rounded-md
                         border border-white/[0.06] bg-white/[0.02]
                         px-4 py-3 transition-all
                         duration-[var(--duration-micro)]
                         hover:border-[var(--color-accent-400)]/30
                         hover:bg-[var(--color-accent-400)]/5
                         focus-visible:outline-none
                         focus-visible:ring-2
                         focus-visible:ring-[var(--color-accent-400)]"
            >
              <span className="type-body-sm font-medium text-[var(--color-fg)]">
                {link.label}
              </span>
              <span
                className="type-label-sm text-[var(--color-fg-subtle)]
                           transition-transform duration-[var(--duration-micro)]
                           group-hover:translate-x-0.5
                           group-hover:text-[var(--color-accent-400)]"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </CinematicCard>
    </div>
  )
}
