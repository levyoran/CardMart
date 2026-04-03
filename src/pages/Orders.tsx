import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, MapPin, Calendar } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { orders as ordersService } from '../services/supabase'
import { Order } from '../types'
import { useTranslation } from '../hooks/useTranslation'

export const Orders: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const data = await ordersService.getUserOrders(user.id)
        setOrders(data || [])
        setError(null)
      } catch (err: any) {
        setError(err.message || 'Failed to load orders')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 py-12" dir="rtl">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6"
          >
            <ArrowLeft size={20} />
            חזור לעמוד הבית
          </button>
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">עליך להתחבר כדי לראות את ההזמנות שלך</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              {t('header.login')}
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate('/account')}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6"
        >
          <ArrowLeft size={20} />
          חזור לחשבון
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">ההזמנות שלי</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-3xl mb-4">📭</p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">אין לך הזמנות עדיין</h3>
            <p className="text-gray-600 mb-6">התחל לקנות קלפים נדירים!</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              המשך בקנייה
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-navy-900 to-orange-500 text-white p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm opacity-80">מספר הזמנה</p>
                      <p className="font-bold text-lg">{order.id.slice(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">תאריך</p>
                      <p className="font-bold">
                        {new Date(order.created_at).toLocaleDateString('he-IL')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">סכום</p>
                      <p className="font-bold text-lg">₪{order.total_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">סטטוס</p>
                      <p className={`font-bold ${
                        order.status === 'delivered'
                          ? 'text-green-300'
                          : order.status === 'shipped'
                          ? 'text-blue-300'
                          : 'text-yellow-300'
                      }`}>
                        {order.status === 'delivered'
                          ? '✓ הופץ'
                          : order.status === 'shipped'
                          ? '📦 נשלח'
                          : '⏳ בתהליך'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="font-bold text-gray-900 mb-4">פריטים:</h4>
                  <div className="space-y-3">
                    {(order.items || []).map((item: any) => (
                      <div
                        key={item.product_id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.product?.emoji || '🎴'}</span>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {item.product?.name || 'מוצר'}
                            </p>
                            <p className="text-sm text-gray-500">
                              ₪{item.product?.price || 0} x {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-gray-900">
                          ₪{((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Status */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">סטטוס תשלום:</p>
                      <p className={`font-bold ${
                        order.payment_status === 'completed'
                          ? 'text-green-600'
                          : order.payment_status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {order.payment_status === 'completed'
                          ? '✓ בוצע'
                          : order.payment_status === 'pending'
                          ? '⏳ ממתין'
                          : '❌ נכשל'}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                      צפה בפרטים
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
