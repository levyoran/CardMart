import React from 'react'
import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../hooks/useTranslation'

export const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore()
  const { user } = useAuthStore()
  const { t } = useTranslation()

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg p-12">
            <p className="text-3xl mb-4">🛒</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('cart.empty')}</h1>
            <p className="text-gray-500 mb-6">
              {t('cart.discoverCards')}
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
            >
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('cart.shoppingCart')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex gap-4 p-6 border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    {item.product.emoji}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {item.product.category}
                    </p>
                    <p className="text-lg font-bold text-orange-500">
                      ₪{item.product.price}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="p-1 hover:bg-gray-200 rounded transition"
                    >
                      <Minus size={18} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.product_id, parseInt(e.target.value) || 1)
                      }
                      className="w-12 text-center border rounded py-1"
                    />
                    <button
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity + 1)
                      }
                      className="p-1 hover:bg-gray-200 rounded transition"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right w-24">
                    <p className="text-lg font-bold text-gray-900">
                      ₪{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 pb-4 border-b mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>{t('cart.subtotal')}</span>
                  <span>₪{getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{t('cart.shipping')}</span>
                  <span className="text-green-600 font-semibold">{t('cart.free')}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{t('cart.tax')}</span>
                  <span>₪{(getTotal() * 0.17).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>{t('cart.total')}</span>
                <span className="text-orange-500">
                  ₪{(getTotal() * 1.17).toFixed(2)}
                </span>
              </div>

              {user ? (
                <Link
                  to="/checkout"
                  className="w-full block text-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-bold"
                >
                  {t('cart.proceedCheckout')}
                </Link>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-center mb-3">
                    {t('cart.pleaseLogin')}
                  </p>
                  <Link
                    to="/login"
                    className="w-full block text-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-bold"
                  >
                    {t('header.login')}
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full block text-center px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-bold"
                  >
                    {t('cart.createAccount')}
                  </Link>
                </div>
              )}

              <Link
                to="/"
                className="w-full block text-center mt-4 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-orange-500 transition font-semibold"
              >
                {t('cart.continueShopping')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
