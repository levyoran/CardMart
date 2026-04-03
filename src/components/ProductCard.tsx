import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Heart } from 'lucide-react'
import { Product } from '../types'
import { useCartStore } from '../store/cartStore'
import { useTranslation } from '../hooks/useTranslation'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation()
  const [showToast, setShowToast] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product, 1)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden group relative">
      {/* Badge */}
      {product.badge && (
        <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded text-white text-xs font-bold ${
          product.badge === 'new' ? 'bg-green-500' :
          product.badge === 'sale' ? 'bg-red-500' :
          'bg-orange-500'
        }`}>
          {product.badge === 'new' ? t('admin.newProduct') :
           product.badge === 'sale' ? t('admin.sale') :
           t('admin.hot')}
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          setIsFavorite(!isFavorite)
        }}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition"
      >
        <Heart
          size={18}
          className={`transition ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
        />
      </button>

      {/* Image */}
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-6xl overflow-hidden">
        {product.emoji || product.image_url}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-right">
          {product.category}
        </p>
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 h-10 text-right">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3 flex-row-reverse justify-end">
          <span className="text-xs text-gray-500">
            ({product.reviews_count}) {product.rating}
          </span>
          <div className="text-yellow-400 text-xs">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3 flex-row-reverse">
          {/* Stock Badge */}
          <div className={`text-xs font-bold px-2 py-1 rounded ${
            product.in_stock
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {product.in_stock ? '✓ במלאי' : '✗ אזל המלאי'}
          </div>

          <div>
            {product.original_price && (
              <p className="text-xs text-gray-400 line-through">
                ₪{product.original_price}
              </p>
            )}
            <p className="text-xl font-bold text-gray-900">
              ₪{product.price}
            </p>
            {discount > 0 && (
              <p className="text-xs text-green-600 font-semibold">
                חסכון {discount}%
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition flex-row-reverse ${
            product.in_stock
              ? 'bg-navy text-white hover:bg-orange-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus size={18} />
          הוסף לעגלה
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white p-2 rounded text-sm text-center animate-bounce">
          ✓ נוסף לעגלה!
        </div>
      )}
      </div>
    </Link>
  )
}
