import { CinematicCard } from '@/components/ui/CinematicCard'

// ─────────────────────────────────────────────
// FUND CARD SKELETON
//
// Pure CSS shimmer — no JS, no Framer Motion.
// Matches the exact layout geometry of FundCard
// so the transition from skeleton → real card
// causes zero layout shift.
// ─────────────────────────────────────────────

function Bone({ w, h = 3 }: { w: string; h?: number }) {
  return (
    <div
      className={`skeleton rounded-md ${w} h-${h}`}
      aria-hidden="true"
    />
  )
}

export function FundCardSkeleton() {
  return (
    <CinematicCard noGlow role="article" className="flex flex-col p-0 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          {/* Code box */}
          <div className="skeleton h-9 w-9 rounded-lg shrink-0" />
          <div className="space-y-1.5">
            <Bone w="w-36" h={3} />
            <Bone w="w-24" h={2} />
          </div>
        </div>
        <Bone w="w-20" h={5} />
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/[0.04]" />

      {/* Returns row */}
      <div className="flex items-start justify-between gap-1 px-4 py-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            <Bone w="w-5" h={2} />
            <Bone w="w-10" h={3} />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/[0.04]" />

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="skeleton h-1.5 w-1.5 rounded-full" />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Bone w="w-12" h={2} />
          <Bone w="w-14" h={2} />
        </div>
      </div>
    </CinematicCard>
  )
}
