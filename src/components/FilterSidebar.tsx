import React, { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { Product } from '../types'
import { useTranslation } from '../hooks/useTranslation'

interface FilterSidebarProps {
  products: Product[]
  filters: {
    brand?: string
    series?: string
    inStock?: boolean
    badge?: string
    minPrice?: number
    maxPrice?: number
  }
  onFilterChange: (filterName: string, value: any) => void
  onClearFilters: () => void
}

interface ExpandedSections {
  [key: string]: boolean
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  products,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState<ExpandedSections>({
    price: true,
    brand: true,
    series: true,
    badge: true,
    stock: true,
  })

  // Get unique values and their counts
  const uniqueBrands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)))
  const uniqueSeries = Array.from(new Set(products.map((p) => p.series).filter(Boolean)))
  const badges = ['new', 'sale', 'hot']

  const toggleSection = (section: string) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const activeFilterCount = Object.values(filters).filter((v) => v !== undefined).length

  // Price range from products
  const prices = products.map((p) => p.price).filter((p) => p > 0)
  const minAvailable = prices.length > 0 ? Math.min(...prices) : 0
  const maxAvailable = prices.length > 0 ? Math.max(...prices) : 1000

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : undefined
    onFilterChange(type === 'min' ? 'minPrice' : 'maxPrice', numValue)
  }

  const handleBrandToggle = (brand: string) => {
    onFilterChange('brand', filters.brand === brand ? undefined : brand)
  }

  const handleSeriesToggle = (series: string) => {
    onFilterChange('series', filters.series === series ? undefined : series)
  }

  const handleBadgeToggle = (badge: string) => {
    onFilterChange('badge', filters.badge === badge ? undefined : badge)
  }

  const badgeLabels = {
    new: t('admin.newProduct'),
    sale: t('admin.sale'),
    hot: t('admin.hot'),
  }

  return (
    <aside className="w-96 bg-white border-r border-gray-200 p-4 sticky top-48 flex-shrink-0 overflow-visible">
      {/* Clear Filters Button */}
      {activeFilterCount > 0 && (
        <button
          onClick={onClearFilters}
          className="w-full mb-2 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold hover:bg-red-200 transition flex items-center justify-center gap-1"
        >
          <X size={14} />
          {t('sidebar.clear')} ({activeFilterCount})
        </button>
      )}

      {/* Price Range Section */}
      {products.length > 0 && (
        <div className="mb-3 pb-3 border-b border-gray-200 overflow-hidden">
          <div className="text-right text-sm font-bold text-gray-900 mb-2">{t('sidebar.price')}</div>
          <div className="flex gap-1 mb-2 flex-row-reverse">
            <input
              type="number"
              placeholder={t('sidebar.to')}
              value={filters.maxPrice || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="flex-1 px-1 py-1 border border-gray-300 rounded text-xs text-center"
            />
            <input
              type="number"
              placeholder={t('sidebar.from')}
              value={filters.minPrice || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="flex-1 px-1 py-1 border border-gray-300 rounded text-xs text-center"
            />
          </div>
          <div className="space-y-1">
            <input
              type="range"
              min={minAvailable}
              max={maxAvailable}
              value={filters.minPrice || minAvailable}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full h-1"
              style={{ accentColor: '#f5a623' }}
            />
            <input
              type="range"
              min={minAvailable}
              max={maxAvailable}
              value={filters.maxPrice || maxAvailable}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full h-1"
              style={{ accentColor: '#f5a623' }}
            />
          </div>
        </div>
      )}


      {/* Badge Section */}
      <div className="mb-3 pb-3 border-b border-gray-200">
        <h3 className="text-right text-sm font-bold text-gray-900 mb-2">
          {t('sidebar.badges')} ({badges.length})
        </h3>
        <div className="space-y-1">
          {badges.map((badge) => (
            <label key={badge} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.badge === badge}
                onChange={() => handleBadgeToggle(badge)}
                className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
              />
              <span className="text-xs text-gray-700">
                {badgeLabels[badge as keyof typeof badgeLabels]}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock Status Section */}
      <div>
        <h3 className="text-right text-sm font-bold text-gray-900 mb-2">{t('sidebar.status')}</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock === true}
            onChange={() => onFilterChange('inStock', filters.inStock ? undefined : true)}
            className="w-3.5 h-3.5 accent-orange-500 cursor-pointer"
          />
          <span className="text-xs text-gray-700">✓ {t('sidebar.inStockOnly')}</span>
        </label>
      </div>
    </aside>
  )
}
