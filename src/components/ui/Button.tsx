import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'destructive'
  size?: 'large' | 'default' | 'small' | 'compact'
  /** Shows a spinner and disables the button while true */
  loading?: boolean
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={cn(
          // ── Base ──
          'relative inline-flex items-center justify-center gap-2',
          'font-sans font-medium select-none cursor-pointer',
          'transition-colors',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-[var(--color-accent-400)] focus-visible:ring-offset-2',
          'focus-visible:ring-offset-[var(--color-canvas)]',
          'disabled:pointer-events-none disabled:opacity-[0.38]',

          // ── Variant: primary ──
          variant === 'primary' && [
            'bg-[var(--color-accent-400)] text-[var(--color-fg-inverse)]',
            'hover:bg-[var(--color-accent-500)]',
            'active:bg-[var(--color-accent-600)]',
          ],

          // ── Variant: ghost ──
          variant === 'ghost' && [
            'bg-transparent text-[var(--color-fg-muted)]',
            'border border-white/[0.09]',
            'hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)]',
            'active:bg-[var(--color-surface-raised)]',
          ],

          // ── Variant: destructive ──
          variant === 'destructive' && [
            'bg-transparent text-[var(--color-negative)]',
            'border border-[var(--color-negative-border)]',
            'hover:bg-[var(--color-negative-bg)]',
          ],

          // ── Size: large ──
          size === 'large'   && 'h-12 px-6 rounded-md type-body-lg',
          // ── Size: default ──
          size === 'default' && 'h-10 px-5 rounded-md type-body-sm',
          // ── Size: small ──
          size === 'small'   && 'h-8  px-4 rounded-md type-caption',
          // ── Size: compact ──
          size === 'compact' && 'h-7  px-3 rounded-sm type-label-sm',

          className,
        )}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                d="M12 2a10 10 0 0 1 10 10"
                className="opacity-30"
              />
              <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          </span>
        )}

        {/* Label — hidden during loading to preserve button width */}
        <span className={loading ? 'opacity-0' : undefined}>
          {children}
        </span>
      </button>
    )
  },
)

Button.displayName = 'Button'
