'use client'

import { useState, useMemo, useEffect } from 'react'
import { FilterBar } from './FilterBar'
import { FundGrid } from './FundGrid'
import type { Fund, FundCategory, SortField, SortDirection } from '@/types/fund'

// ─────────────────────────────────────────────
// SORTING LOGIC
// ─────────────────────────────────────────────

function sortFunds(funds: Fund[], field: SortField, direction: SortDirection): Fund[] {
  const sorted = [...funds].sort((a, b) => {
    let aVal: number
    let bVal: number

    switch (field) {
      case 'return-1y':   aVal = a.returns.oneYear;    bVal = b.returns.oneYear;    break
      case 'return-1m':   aVal = a.returns.oneMonth;   bVal = b.returns.oneMonth;   break
      case 'return-real': aVal = a.returns.realOneYear; bVal = b.returns.realOneYear; break
      case 'risk':        aVal = a.riskScore;           bVal = b.riskScore;           break
      case 'fee':         aVal = a.managementFee;       bVal = b.managementFee;       break
      case 'aum':         aVal = a.aum;                 bVal = b.aum;                 break
    }

    return direction === 'desc' ? bVal - aVal : aVal - bVal
  })

  return sorted
}

// ─────────────────────────────────────────────
// EXPLORER CLIENT
// ─────────────────────────────────────────────

interface ExplorerClientProps {
  funds: Fund[]
}

export function ExplorerClient({ funds }: ExplorerClientProps) {
  const [activeCategory, setActiveCategory] = useState<FundCategory | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('return-real')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [isLoading, setIsLoading] = useState(true)

  // Simulate initial data fetch latency to show skeleton → content transition
  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(id)
  }, [])

  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      // Toggle direction when same field re-clicked
      setSortDirection((d) => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortField(field)
      // High-value metrics default to desc; risk/fee default to asc
      setSortDirection(field === 'risk' || field === 'fee' ? 'asc' : 'desc')
    }
  }

  const filtered = useMemo(() => {
    const base =
      activeCategory === 'all'
        ? funds
        : funds.filter((f) => f.category === activeCategory)

    return sortFunds(base, sortField, sortDirection)
  }, [funds, activeCategory, sortField, sortDirection])

  return (
    <div className="space-y-6">
      {/* Filter + sort controls */}
      <FilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        resultCount={isLoading ? 0 : filtered.length}
      />

      {/* Animated fund grid */}
      <FundGrid funds={filtered} isLoading={isLoading} skeletonCount={9} />
    </div>
  )
}
