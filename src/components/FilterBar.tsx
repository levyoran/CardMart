import React from 'react'
import { X } from 'lucide-react'
import { Product } from '../types'

interface FilterBarProps {
  products: Product[]
  filters: {
    brand?: string
    series?: string
    inStock?: boolean
    badge?: string
    sortBy?: string
  }
  onFilterChange: (filterName: string, value: any) => void
  onClearFilters: () => void
}

export const FilterBar: React.FC<FilterBarProps> = ({
  products,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  // Get unique brands and series from products
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)))
  const uniqueSeries = Array.from(new Set(products.map((p) => p.series).filter(Boolean)))
  const uniqueBadges = ['new', 'sale', 'hot']

  // Count active filters
  const activeFilterCount = Object.values(filters).filter((v) => v).length

  return (
    <div className="bg-white border-b p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 overflow-x-auto flex-row-reverse pb-3">
          {/* Sort */}
          <div className="flex-shrink-0">
            <label className="text-sm font-semibold text-gray-700 block mb-1">מיון</label>
            <select
              value={filters.sortBy || 'newest'}
              onChange={(e) => onFilterChange('sortBy', e.target.value || undefined)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="newest">חדש לישן</option>
              <option value="oldest">ישן לחדש</option>
              <option value="price_asc">מחיר: זול ליקר</option>
              <option value="price_desc">מחיר: יקר לזול</option>
              <option value="rating">דירוג גבוה</option>
            </select>
          </div>

          {/* Brand */}
          {uniqueBrands.length > 0 && (
            <div className="flex-shrink-0">
              <label className="text-sm font-semibold text-gray-700 block mb-1">מותג</label>
              <select
                value={filters.brand || ''}
                onChange={(e) => onFilterChange('brand', e.target.value || undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">כל המותגים</option>
                {uniqueBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Series */}
          {uniqueSeries.length > 0 && (
            <div className="flex-shrink-0">
              <label className="text-sm font-semibold text-gray-700 block mb-1">סדרה</label>
              <select
                value={filters.series || ''}
                onChange={(e) => onFilterChange('series', e.target.value || undefined)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">כל הסדרות</option>
                {uniqueSeries.map((series) => (
                  <option key={series} value={series}>
                    {series}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Badge */}
          <div className="flex-shrink-0">
            <label className="text-sm font-semibold text-gray-700 block mb-1">תגית</label>
            <select
              value={filters.badge || ''}
              onChange={(e) => onFilterChange('badge', e.target.value || undefined)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">כל התגיות</option>
              <option value="new">✨ חדש</option>
              <option value="sale">🔥 מבצע</option>
              <option value="hot">⚡ חם</option>
            </select>
          </div>

          {/* Stock Status */}
          <div className="flex-shrink-0">
            <label className="text-sm font-semibold text-gray-700 block mb-1">סטטוס</label>
            <select
              value={filters.inStock ? 'in_stock' : ''}
              onChange={(e) => onFilterChange('inStock', e.target.value === 'in_stock' || undefined)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">הכל</option>
              <option value="in_stock">✓ במלאי</option>
            </select>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="flex-shrink-0 flex items-end">
              <button
                onClick={onClearFilters}
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition flex items-center gap-1"
              >
                <X size={16} />
                נקה ({activeFilterCount})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
