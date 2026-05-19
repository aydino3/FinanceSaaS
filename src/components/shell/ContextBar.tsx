'use client'

import { useShellStore, TAB_LABELS } from '@/stores/shell'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────
// AMBIENT TOP BAR
//
// 40px compact bar: breadcrumb left, quick
// metrics center, ⌘K trigger right.
// Rendered only on desktop (lg+).
// ─────────────────────────────────────────────

interface MetricPillProps {
  label: string
  value: string
  positive?: boolean
}

function MetricPill({ label, value, positive }: MetricPillProps) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full
                 border border-white/[0.07] bg-white/[0.03]
                 px-3 py-1"
    >
      <span className="type-label-sm text-[var(--color-fg-subtle)]">{label}</span>
      <span
        className={cn(
          'type-label-sm font-medium tabular-nums',
          positive === undefined
            ? 'text-[var(--color-fg-muted)]'
            : positive
            ? 'text-[var(--color-positive)]'
            : 'text-[var(--color-negative)]'
        )}
      >
        {value}
      </span>
    </div>
  )
}

export function ContextBar() {
  const { openCommandPalette, activeTab } = useShellStore()
  const breadcrumb = TAB_LABELS[activeTab]

  return (
    <header
      aria-label="Bağlam çubuğu"
      className="hidden lg:flex h-10 shrink-0 items-center justify-between
                 gap-4 border-b border-white/[0.05]
                 bg-[rgba(12,12,14,0.55)] backdrop-blur-xl backdrop-saturate-150
                 px-4"
    >
      {/* Left: live breadcrumb */}
      <nav aria-label="Sayfa yolu" className="flex items-center gap-1.5">
        <span className="type-label-sm text-[var(--color-fg-subtle)]">FinansOS</span>
        <svg
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--color-fg-disabled)]"
        >
          <path d="M4 2l4 4-4 4" />
        </svg>
        <span className="type-label-sm text-[var(--color-fg-muted)]">{breadcrumb.long}</span>
      </nav>

      {/* Center: ambient market metrics */}
      <div
        className="flex items-center gap-2"
        aria-label="Anlık piyasa göstergeleri"
      >
        <MetricPill label="BIST 100" value="9,842.3" positive />
        <MetricPill label="USD/TRY" value="38.24" />
        <MetricPill label="TÜFE" value="+67.8%" positive={false} />
      </div>

      {/* Right: ⌘K button */}
      <button
        type="button"
        onClick={openCommandPalette}
        aria-label="Komut paletini aç (⌘K)"
        className={cn(
          'flex items-center gap-1.5 rounded-md',
          'border border-white/[0.07] bg-white/[0.03]',
          'px-2.5 py-1',
          'type-label-sm text-[var(--color-fg-subtle)]',
          'transition-colors duration-[var(--duration-micro)]',
          'hover:border-white/[0.10] hover:bg-white/[0.05] hover:text-[var(--color-fg-muted)]',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-[var(--color-accent-400)]',
        )}
      >
        <svg
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="5.5" cy="5.5" r="3.5" />
          <path d="M8.5 8.5 11 11" />
        </svg>
        <span>Ara</span>
        <kbd
          className="flex items-center rounded border border-white/[0.10]
                     bg-white/[0.05] px-1 type-label-sm"
          aria-hidden="true"
        >
          ⌘K
        </kbd>
      </button>
    </header>
  )
}
