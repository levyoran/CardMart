import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { orders as ordersService } from '../services/supabase'
import { Order } from '../types'
import { useTranslation } from '../hooks/useTranslation'

export const AdminOrders: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin')
      return
    }

    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        // In real app, would fetch all orders from database
        // For now, using empty array
        setOrders([])
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user, navigate])

  const filteredOrders = orders.filter((order) => {
    if (filter === 'pending') return order.status === 'pending'
    if (filter === 'completed') return order.status === 'delivered'
    return true
  })

  return (
    <main className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6"
        >
          <ArrowLeft size={20} />
          חזור לדשבורד
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">📋 ניהול הזמנות</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === filterType
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterType === 'all' ? 'הכל' : filterType === 'pending' ? 'ממתינות' : 'הושלמו'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">אין הזמנות</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">מספר הזמנה</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">לקוח</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">סכום</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">סטטוס</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">תשלום</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">תאריך</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">משתמש</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ₪{order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status === 'delivered'
                          ? '✓ הופץ'
                          : order.status === 'shipped'
                          ? '📦 נשלח'
                          : '⏳ בתהליך'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.payment_status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.payment_status === 'completed' ? '✓ בוצע' : '⏳ ממתין'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('he-IL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
