import React from 'react'
import { X } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

interface Filters {
  brand?: string
  series?: string
  inStock?: boolean
  badge?: string
  minPrice?: number
  maxPrice?: number
}

interface ActiveFilterChipsProps {
  filters: Filters
  onRemoveFilter: (filterName: string) => void
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onRemoveFilter,
}) => {
  const { t } = useTranslation()

  const badges: { [key: string]: string } = {
    new: t('admin.newProduct'),
    sale: t('admin.sale'),
    hot: t('admin.hot'),
  }

  const activeFilters = [
    ...(filters.brand ? [{ key: 'brand', label: `${t('filters.brand')}: ${filters.brand}` }] : []),
    ...(filters.series ? [{ key: 'series', label: `${t('filters.series')}: ${filters.series}` }] : []),
    ...(filters.badge ? [{ key: 'badge', label: `${t('admin.badge')}: ${badges[filters.badge] || filters.badge}` }] : []),
    ...(filters.inStock ? [{ key: 'inStock', label: t('filters.inStock') }] : []),
    ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
      ? [
          {
            key: 'price',
            label: `${t('admin.price')}: ₪${filters.minPrice || '0'}-₪${filters.maxPrice || '∞'}`,
          },
        ]
      : []),
  ]

  if (activeFilters.length === 0) return null

  return (
    <div className="flex gap-2 flex-wrap items-center">
      {activeFilters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onRemoveFilter(filter.key)}
          className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition"
        >
          <span>{filter.label}</span>
          <X size={14} />
        </button>
      ))}
    </div>
  )
}
