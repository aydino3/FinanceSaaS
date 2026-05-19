// ─────────────────────────────────────────────
// DASHBOARD LOADING — shown during route transitions
// Server Component (no client JS shipped)
// ─────────────────────────────────────────────

export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8" aria-busy="true" aria-label="Yükleniyor">
      <div className="space-y-8">
        {/* Hero metric skeleton */}
        <div className="space-y-4">
          <div className="skeleton h-3 w-32 rounded" />
          <div className="skeleton h-12 w-72 rounded-lg" />
          <div className="skeleton h-3 w-48 rounded" />
        </div>

        {/* Stat strip skeleton */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-white/[0.07] bg-[var(--color-surface)] p-4 space-y-2">
              <div className="skeleton h-2.5 w-20 rounded" />
              <div className="skeleton h-7 w-28 rounded" />
            </div>
          ))}
        </div>

        {/* Main grid skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-white/[0.07] bg-[var(--color-surface)] p-5 min-h-[340px]">
            <div className="skeleton h-full w-full rounded-xl" />
          </div>
          <div className="rounded-2xl border border-white/[0.07] bg-[var(--color-surface)] p-5 min-h-[340px]">
            <div className="skeleton h-full w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
