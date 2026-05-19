'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { easings, durations } from '@/lib/motion'
import { useShellStore } from '@/stores/shell'
import { filterCommands, type CommandItem } from './data'

// ─────────────────────────────────────────────
// ICON
// ─────────────────────────────────────────────

const ICONS: Record<string, React.ReactNode> = {
  'chart-pie': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2a6 6 0 1 0 6 6H8V2z" /><path d="M10 2.5A6 6 0 0 1 13.5 6" />
    </svg>
  ),
  'magnify': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" />
    </svg>
  ),
  'chart-line': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12 6 7l3 3 5-6" />
    </svg>
  ),
  'globe': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" /><path d="M2 8h12M8 2a9 9 0 0 1 0 12M8 2a9 9 0 0 0 0 12" />
    </svg>
  ),
  'sparkle': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v1M8 13v1M2 8h1M13 8h1M4.2 4.2l.7.7M11.1 11.1l.7.7M4.2 11.8l.7-.7M11.1 4.9l.7-.7" />
      <circle cx="8" cy="8" r="2.5" />
    </svg>
  ),
  'bookmark': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2h8a1 1 0 0 1 1 1v11l-5-3-5 3V3a1 1 0 0 1 1-1z" />
    </svg>
  ),
  'pencil': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 2.5a2.12 2.12 0 0 1 3 3L5 15H2v-3L11.5 2.5z" />
    </svg>
  ),
  'cog': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" />
    </svg>
  ),
  'plus': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v10M3 8h10" />
    </svg>
  ),
  'scale': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3v10M5 13h6M3 5l5 2 5-2M3 5l2 4a2 2 0 0 0 4 0l2-4" />
    </svg>
  ),
  'download': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2v8M5 7l3 3 3-3M3 12h10" />
    </svg>
  ),
  'fund': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="12" height="9" rx="1" />
      <path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M2 7h12" />
    </svg>
  ),
}

// ─────────────────────────────────────────────
// SUBCOMPONENTS
// ─────────────────────────────────────────────

function ItemIcon({ name }: { name: string }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md
                     bg-white/[0.05] text-[var(--color-fg-subtle)]">
      {ICONS[name] ?? ICONS['magnify']}
    </span>
  )
}

function ShortcutBadge({ keys }: { keys: string[] }) {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {keys.map((k) => (
        <kbd
          key={k}
          className="flex h-5 min-w-[20px] items-center justify-center rounded
                     border border-white/[0.12] bg-white/[0.05]
                     px-1.5 type-label-sm text-[var(--color-fg-subtle)]"
        >
          {k}
        </kbd>
      ))}
    </div>
  )
}

interface ResultItemProps {
  item: CommandItem
  isSelected: boolean
  onSelect: () => void
  onHover: () => void
}

function ResultItem({ item, isSelected, onSelect, onHover }: ResultItemProps) {
  return (
    <div
      role="option"
      aria-selected={isSelected}
      className="relative flex cursor-pointer items-center gap-3 px-3 py-2.5
                 rounded-lg transition-none select-none"
      onMouseMove={onHover}
      onClick={onSelect}
    >
      {/* Selected background — shared layout animation */}
      {isSelected && (
        <motion.div
          layoutId="palette-selected"
          className="absolute inset-0 rounded-lg bg-white/[0.06]
                     border border-white/[0.08]"
          transition={{ duration: durations.fast, ease: easings.easeOutExpo }}
        />
      )}

      <div className="relative flex w-full items-center gap-3">
        <ItemIcon name={item.icon} />

        <div className="min-w-0 flex-1">
          <p className="type-body-sm text-[var(--color-fg)] truncate">
            {item.label}
          </p>
          {item.description && (
            <p className="type-label-sm text-[var(--color-fg-subtle)] truncate">
              {item.description}
            </p>
          )}
        </div>

        {item.shortcut && <ShortcutBadge keys={item.shortcut} />}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMMAND PALETTE
// ─────────────────────────────────────────────

export function CommandPalette() {
  const { commandPaletteOpen, closeCommandPalette } = useShellStore()
  const prefersReduced = useReducedMotion() ?? false
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const results = filterCommands(query)

  // Group results
  const grouped = results.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  // Flat index lookup for keyboard nav
  const flatResults = Object.values(grouped).flat()

  const handleSelect = useCallback(
    (item: CommandItem) => {
      closeCommandPalette()
      setQuery('')
      if (item.href) {
        window.location.href = item.href
      }
    },
    [closeCommandPalette]
  )

  // Keyboard navigation
  useEffect(() => {
    if (!commandPaletteOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((i) => Math.max(i - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (flatResults[selectedIndex]) handleSelect(flatResults[selectedIndex])
          break
        case 'Escape':
          e.preventDefault()
          closeCommandPalette()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commandPaletteOpen, flatResults, selectedIndex, handleSelect, closeCommandPalette])

  // Auto-focus input on open; reset transient state on close.
  // The setState calls here synchronise local UI state with an external
  // store value (Zustand), which the rule explicitly permits.
  useEffect(() => {
    if (!commandPaletteOpen) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setQuery('')
      setSelectedIndex(0)
      /* eslint-enable react-hooks/set-state-in-effect */
      return
    }
    // Defer to let AnimatePresence mount the element first
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [commandPaletteOpen])

  const panelVariants = {
    hidden: prefersReduced
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.96, y: -8 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: prefersReduced
      ? { opacity: 0 }
      : { opacity: 0, scale: 0.97, y: -4 },
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="palette-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.fast }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            aria-hidden="true"
            onClick={closeCommandPalette}
          />

          {/* Panel */}
          <motion.div
            key="palette-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Komut paleti"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            transition={{
              duration: prefersReduced ? 0 : durations.comfortable,
              ease: easings.easeOutExpo,
            }}
            className="fixed inset-x-4 top-[12vh] z-50 mx-auto max-w-xl
                       origin-top overflow-hidden rounded-2xl
                       border border-white/[0.10]
                       bg-[rgba(18,18,22,0.92)]
                       shadow-[0_32px_80px_rgba(0,0,0,0.80),0_8px_32px_rgba(0,0,0,0.60)]"
            style={{ backdropFilter: 'blur(24px) saturate(130%)' }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3.5">
              <svg
                aria-hidden="true"
                className="shrink-0 text-[var(--color-fg-subtle)]"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="7" cy="7" r="4.5" />
                <path d="M10.5 10.5 14 14" />
              </svg>

              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-autocomplete="list"
                aria-controls="palette-results"
                aria-activedescendant={
                  flatResults[selectedIndex]
                    ? `palette-item-${flatResults[selectedIndex].id}`
                    : undefined
                }
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0) }}
                placeholder="Sayfa, fon veya işlem ara…"
                className="min-w-0 flex-1 bg-transparent type-body-sm
                           text-[var(--color-fg)] placeholder:text-[var(--color-fg-disabled)]
                           outline-none"
              />

              <kbd
                className="shrink-0 flex items-center justify-center rounded
                           border border-white/[0.12] bg-white/[0.04]
                           px-1.5 py-0.5 type-label-sm text-[var(--color-fg-subtle)]"
                aria-label="Kapatmak için Escape"
              >
                esc
              </kbd>
            </div>

            {/* Results */}
            <div
              id="palette-results"
              ref={listRef}
              role="listbox"
              aria-label="Arama sonuçları"
              className="max-h-[min(420px,60vh)] overflow-y-auto overscroll-contain p-2"
            >
              {flatResults.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <span className="type-body-sm text-[var(--color-fg-subtle)]">
                    Sonuç bulunamadı
                  </span>
                  <span className="type-label-sm text-[var(--color-fg-disabled)]">
                    &ldquo;{query}&rdquo; için eşleşme yok
                  </span>
                </div>
              ) : (
                Object.entries(grouped).map(([group, items]) => (
                  <div key={group} className="mb-1 last:mb-0">
                    <p
                      className="px-3 pb-1.5 pt-2 type-label-sm
                                 text-[var(--color-fg-disabled)] uppercase tracking-wider"
                    >
                      {group}
                    </p>
                    {items.map((item) => {
                      const flatIdx = flatResults.indexOf(item)
                      return (
                        <ResultItem
                          key={item.id}
                          item={item}
                          isSelected={flatIdx === selectedIndex}
                          onSelect={() => handleSelect(item)}
                          onHover={() => setSelectedIndex(flatIdx)}
                        />
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div
              className="flex items-center gap-4 border-t border-white/[0.05]
                         px-4 py-2.5"
              aria-hidden="true"
            >
              {(
                [
                  { keys: ['↑', '↓'], label: 'Gezin' },
                  { keys: ['↵'], label: 'Aç' },
                  { keys: ['esc'], label: 'Kapat' },
                ] as const
              ).map(({ keys, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {keys.map((k) => (
                      <kbd
                        key={k}
                        className="flex h-4.5 min-w-[18px] items-center justify-center rounded
                                   border border-white/[0.10] bg-white/[0.04]
                                   px-1 type-label-sm text-[var(--color-fg-disabled)]"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                  <span className="type-label-sm text-[var(--color-fg-disabled)]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
