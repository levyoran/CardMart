import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { Carousel } from '../components/Carousel'
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

  const categories = [
    { key: 'All', label: t('categories.all') },
    { key: 'Pokemon', label: t('categories.pokemon') },
    { key: 'OnePiece', label: t('categories.onePiece') },
    { key: 'Lorcana', label: t('categories.lorcana') },
    { key: 'Other', label: t('categories.other') },
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        let data
        if (searchQuery) {
          data = await productsService.search(searchQuery)
        } else if (selectedCategory === 'All') {
          data = await productsService.getAll()
        } else {
          data = await productsService.getByCategory(selectedCategory)
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
  }, [selectedCategory, searchQuery])

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      {/* Carousel Banner */}
      <section className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <Carousel />
        </div>
      </section>

      {/* Search Results Heading or Category Filter */}
      {searchQuery ? (
        <section className="bg-white border-b sticky top-16 z-40" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              תוצאות חיפוש עבור: <span className="text-orange-500">"{searchQuery}"</span>
            </h2>
            <a href="/" className="text-orange-500 hover:text-orange-600 font-semibold">
              × בטל חיפוש
            </a>
          </div>
        </section>
      ) : (
        <section className="bg-white border-b sticky top-16 z-40" dir="rtl">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto py-4 flex-row-reverse">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
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
        </section>
      )}

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p>{error}</p>
            <p className="text-sm mt-2">
              {t('errors.setupDatabase')}
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">לא נמצאו מוצרים בקטגוריה זו.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="bg-orange-500 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
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
