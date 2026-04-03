import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Product } from '../types'
import { useCartStore } from '../store/cartStore'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showToast, setShowToast] = useState(false)
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
        <div className={`absolute top-3 right-3 z-10 px-2 py-1 rounded text-white text-xs font-bold ${
          product.badge === 'new' ? 'bg-green-500' :
          product.badge === 'sale' ? 'bg-red-500' :
          'bg-orange-500'
        }`}>
          {product.badge === 'new' ? '✨ New' :
           product.badge === 'sale' ? '🔥 Sale' :
           '⚡ Hot'}
        </div>
      )}

      {/* Image */}
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-5xl overflow-hidden">
        {product.emoji || product.image_url}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          {product.category}
        </p>
        <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 h-9">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="text-yellow-400 text-xs">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="text-xs text-gray-500">
            {product.rating} ({product.reviews_count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            {product.original_price && (
              <p className="text-xs text-gray-400 line-through">
                ₪{product.original_price}
              </p>
            )}
            <p className="text-lg font-bold text-gray-900">
              ₪{product.price}
            </p>
            {discount > 0 && (
              <p className="text-xs text-green-600 font-semibold">
                Save {discount}%
              </p>
            )}
          </div>

          {/* Stock Badge */}
          <div className={`text-xs font-bold px-2 py-1 rounded ${
            product.in_stock
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {product.in_stock ? 'In Stock' : 'Out of Stock'}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.in_stock}
          className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
            product.in_stock
              ? 'bg-navy text-white hover:bg-orange-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus size={18} />
          Add to Cart
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="absolute bottom-4 left-4 right-4 bg-green-500 text-white p-2 rounded text-sm text-center animate-bounce">
          Added to cart!
        </div>
      )}
      </div>
    </Link>
  )
}
