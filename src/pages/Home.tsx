import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { Carousel } from '../components/Carousel'
import { FilterSidebar } from '../components/FilterSidebar'
import { HorizontalFilterBar } from '../components/HorizontalFilterBar'
import { ActiveFilterChips } from '../components/ActiveFilterChips'
import { Product } from '../types'
import { products as productsService } from '../services/supabase'
import { useTranslation } from '../hooks/useTranslation'

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const [filters, setFilters] = useState({
    brand: undefined as string | undefined,
    series: undefined as string | undefined,
    inStock: undefined as boolean | undefined,
    badge: undefined as string | undefined,
    sortBy: undefined as string | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
  })

  const categories = [
    { key: 'All', label: t('categories.all') },
    { key: 'Pokemon', label: t('categories.pokemon') },
    { key: 'OnePiece', label: t('categories.onePiece') },
    { key: 'Lorcana', label: t('categories.lorcana') },
    { key: 'Other', label: t('categories.other') },
  ]

  const handleFilterChange = (filterName: string, value: any) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
  }

  const handleRemoveFilter = (filterName: string) => {
    if (filterName === 'price') {
      setFilters((prev) => ({ ...prev, minPrice: undefined, maxPrice: undefined }))
    } else {
      setFilters((prev) => ({ ...prev, [filterName]: undefined }))
    }
  }

  const handleClearFilters = () => {
    setFilters({
      brand: undefined,
      series: undefined,
      inStock: undefined,
      badge: undefined,
      sortBy: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    })
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        let data
        if (searchQuery) {
          data = await productsService.search(searchQuery)
        } else {
          data = await productsService.getWithFilters({
            category: selectedCategory,
            brand: filters.brand,
            series: filters.series,
            inStock: filters.inStock,
            badge: filters.badge,
            sortBy: filters.sortBy,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
          })
        }
        setProducts(data)
        setError(null)
      } catch (err: any) {
        setError(err.message || t('errors.failedToLoad'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, searchQuery, filters.brand, filters.series, filters.inStock, filters.badge, filters.sortBy, filters.minPrice, filters.maxPrice])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Carousel Banner */}
      <section className="px-4 py-6">
        <div className="max-w-screen-2xl mx-auto">
          <Carousel />
        </div>
      </section>

      {/* Filter Header Section */}
      {!searchQuery && (
        <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
          <div className="max-w-screen-2xl mx-auto px-4">
          {/* Category Filter */}
          <div>
            <div className="flex gap-2 overflow-x-auto py-2">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => {
                    setSelectedCategory(category.key)
                    handleClearFilters()
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition text-sm ${
                    selectedCategory === category.key
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter Bar */}
          {products.length > 0 && Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).length > 0 && (
            <HorizontalFilterBar
              label={t('filters.brand')}
              items={Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).map((b) => ({
                key: b || '',
                label: b || '',
              }))}
              selected={filters.brand}
              onSelect={(key) => handleFilterChange('brand', key)}
            />
          )}

          {/* Series Filter Bar */}
          {products.length > 0 && Array.from(new Set(products.map((p) => p.series).filter(Boolean))).length > 0 && (
            <HorizontalFilterBar
              label={t('filters.series')}
              items={Array.from(new Set(products.map((p) => p.series).filter(Boolean))).map((s) => ({
                key: s || '',
                label: s || '',
              }))}
              selected={filters.series}
              onSelect={(key) => handleFilterChange('series', key)}
            />
          )}

          {/* Active Filters + Sort + Count */}
          {products.length > 0 && (
            <div className="bg-gray-50 py-3 border-t border-gray-200">
              <div className="flex items-center gap-4 flex-wrap">
                <select
                  value={filters.sortBy || 'newest'}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value || undefined)}
                  className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="newest">{t('filters.newest')}</option>
                  <option value="oldest">{t('filters.oldest')}</option>
                  <option value="price_asc">{t('filters.price_asc')}</option>
                  <option value="price_desc">{t('filters.price_desc')}</option>
                  <option value="rating">{t('filters.rating')}</option>
                </select>
                <span className="text-sm text-gray-600 whitespace-nowrap">{products.length} {t('filters.results')}</span>
              </div>
              <div className="mt-2">
                <ActiveFilterChips filters={filters} onRemoveFilter={handleRemoveFilter} />
              </div>
            </div>
          )}
          </div>
        </div>
      )}

      {/* Search Results Heading */}
      {searchQuery && (
        <section className="bg-white border-b sticky top-16 z-40">
          <div className="max-w-full mx-auto px-2 py-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">
              {t('filters.searchResults')}: <span className="text-orange-500">"{searchQuery}"</span>
            </h2>
            <a href="/" className="text-orange-500 hover:text-orange-600 font-semibold text-sm">
              × {t('filters.cancel')}
            </a>
          </div>
        </section>
      )}

      {/* Products Section with Sidebar */}
      <section className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          {!searchQuery && (
            <FilterSidebar
              products={products}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          )}

          {/* Main Products Area */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <p>{error}</p>
                <p className="text-sm mt-2">{t('errors.setupDatabase')}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">{t('filters.noProducts')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-orange-500 text-white py-12 px-4">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-orange-100">{t('home.stats.products')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">50K+</p>
              <p className="text-orange-100">{t('home.stats.customers')}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">100%</p>
              <p className="text-orange-100">{t('home.stats.authentic')}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
