import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portföy — FinansOS',
  description: 'Portföyünüzün gerçek getirisini görün.',
}

// ─────────────────────────────────────────────
// DASHBOARD HOME — Skeleton placeholder
//
// Phase 2 will replace this with live portfolio
// data: positions table, real-return graph,
// AI insight cards, and metric strip.
// ─────────────────────────────────────────────

function SkeletonLine({ w = 'full', h = 4 }: { w?: string; h?: number }) {
  return (
    <div
      className={`skeleton rounded-md w-${w} h-${h}`}
      aria-hidden="true"
    />
  )
}

function SkeletonCard({ children }: { children?: React.ReactNode }) {
  return (
    <div
      className="rounded-xl border border-white/[0.07]
                 bg-[var(--color-surface)] p-6
                 space-y-3"
      aria-hidden="true"
    >
      {children ?? (
        <>
          <SkeletonLine w="1/3" h={3} />
          <SkeletonLine w="1/2" h={8} />
          <SkeletonLine w="2/3" h={3} />
        </>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="type-headline text-[var(--color-fg)]">
          Portföy Genel Bakış
        </h1>
        <p className="type-body-sm text-[var(--color-fg-subtle)]">
          Portföy verileri Phase 2&apos;de yüklenecek —{' '}
          <span className="text-[var(--color-accent-400)]">
            şimdilik iskelet görünüm aktif
          </span>
        </p>
      </div>

      {/* Metric strip */}
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        aria-label="Özet metrikler"
      >
        {[
          { label: 'Toplam Değer', value: '₺—', sub: 'yükleniyor' },
          { label: 'Nominal Getiri', value: '—%', sub: 'son 12 ay' },
          { label: 'Reel Getiri', value: '—%', sub: 'enflasyon düzeltmeli' },
          { label: 'Fon Sayısı', value: '—', sub: 'aktif pozisyon' },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-white/[0.07]
                       bg-[var(--color-surface)] p-4 space-y-1"
          >
            <p className="type-label-sm text-[var(--color-fg-subtle)]">{m.label}</p>
            <p className="type-headline text-[var(--color-fg-muted)] tabular-nums">
              {m.value}
            </p>
            <p className="type-label-sm text-[var(--color-fg-disabled)]">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Portfolio graph placeholder — spans 2 cols */}
        <div
          className="lg:col-span-2 rounded-xl border border-white/[0.07]
                     bg-[var(--color-surface)] p-6 space-y-4 min-h-[280px]"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between">
            <SkeletonLine w="1/4" h={3} />
            <SkeletonLine w="1/6" h={3} />
          </div>
          {/* Graph area */}
          <div className="flex h-44 items-end gap-1 pt-2">
            {[40, 55, 45, 65, 58, 72, 68, 80, 74, 90, 85, 100].map(
              (height, i) => (
                <div
                  key={i}
                  className="skeleton flex-1 rounded-sm"
                  style={{ height: `${height}%` }}
                />
              )
            )}
          </div>
        </div>

        {/* AI Brief stub */}
        <SkeletonCard>
          <SkeletonLine w="1/2" h={3} />
          <SkeletonLine w="full" h={3} />
          <SkeletonLine w="full" h={3} />
          <SkeletonLine w="3/4" h={3} />
          <div className="pt-2">
            <SkeletonLine w="1/3" h={3} />
          </div>
        </SkeletonCard>
      </div>

      {/* Positions table placeholder */}
      <div
        className="rounded-xl border border-white/[0.07]
                   bg-[var(--color-surface)] overflow-hidden"
        aria-hidden="true"
      >
        <div className="p-4 border-b border-white/[0.05] flex items-center justify-between">
          <SkeletonLine w="1/6" h={3} />
          <SkeletonLine w="1/8" h={3} />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3.5 border-b border-white/[0.04] last:border-0"
          >
            <div className="skeleton h-8 w-8 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1.5">
              <SkeletonLine w="1/4" h={3} />
              <SkeletonLine w="1/6" h={2} />
            </div>
            <div className="space-y-1.5 text-right">
              <SkeletonLine w="20" h={3} />
              <SkeletonLine w="16" h={2} />
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
