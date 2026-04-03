import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Minus } from 'lucide-react'
import { Product } from '../types'
import { products as productsService } from '../services/supabase'
import { useCartStore } from '../store/cartStore'
import { useTranslation } from '../hooks/useTranslation'

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      try {
        setIsLoading(true)
        const data = await productsService.getById(id)
        setProduct(data)
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to load product')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2500)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6"
          >
            <ArrowLeft size={20} />
            {t('productDetail.backToShop')}
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error || t('errors.failedToLoad')}
          </div>
        </div>
      </main>
    )
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-8"
        >
          <ArrowLeft size={20} />
          {t('productDetail.backToShop')}
        </button>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg p-8 flex items-center justify-center">
            <div className="text-9xl">{product.emoji}</div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg p-8">
            {/* Badge */}
            {product.badge && (
              <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-bold mb-4 ${
                product.badge === 'new' ? 'bg-green-500' :
                product.badge === 'sale' ? 'bg-red-500' :
                'bg-orange-500'
              }`}>
                {product.badge === 'new' ? '✨ חדש' :
                 product.badge === 'sale' ? '🔥 מבצע' :
                 '⚡ חם'}
              </div>
            )}

            {/* Category */}
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              {product.description || 'מוצר איכותי לאספנים'}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="text-yellow-400">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({product.reviews_count} {t('productDetail.reviews')})
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              {product.original_price && (
                <p className="text-sm text-gray-400 line-through mb-1">
                  ₪{product.original_price}
                </p>
              )}
              <p className="text-4xl font-bold text-gray-900 mb-2">
                ₪{product.price}
              </p>
              {discount > 0 && (
                <p className="text-lg text-green-600 font-bold">
                  {t('productDetail.savings')} {discount}%
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className={`mb-6 px-4 py-2 rounded-lg inline-block ${
              product.in_stock
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {product.in_stock ? (
                <>{t('productDetail.inStock')} ({product.stock_quantity})</>
              ) : (
                <>{t('productDetail.outOfStock')}</>
              )}
            </div>

            {/* Quantity Selector */}
            {product.in_stock && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t('productDetail.quantity')}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:border-orange-500"
                  >
                    <Minus size={20} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock_quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center border border-gray-300 rounded-lg py-2"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:border-orange-500"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                product.in_stock
                  ? 'bg-navy text-white hover:bg-orange-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus size={20} />
              {t('productDetail.addToCart')}
            </button>

            {/* Toast */}
            {showToast && (
              <div className="mt-4 p-3 bg-green-500 text-white rounded-lg text-center animate-bounce">
                {t('productDetail.addedToCart')}
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-2xl mb-2">🛡️</p>
            <h3 className="font-bold text-gray-900 mb-2">{t('productDetail.authentic')}</h3>
            <p className="text-sm text-gray-600">{t('productDetail.authenticDesc')}</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-2xl mb-2">🚚</p>
            <h3 className="font-bold text-gray-900 mb-2">{t('productDetail.fastShipping')}</h3>
            <p className="text-sm text-gray-600">{t('productDetail.fastShippingDesc')}</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-2xl mb-2">💰</p>
            <h3 className="font-bold text-gray-900 mb-2">{t('productDetail.fairPrices')}</h3>
            <p className="text-sm text-gray-600">{t('productDetail.fairPricesDesc')}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
