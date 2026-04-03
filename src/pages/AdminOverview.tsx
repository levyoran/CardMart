import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Package, Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { orders as ordersService, products as productsService } from '../services/supabase'
import { useTranslation } from '../hooks/useTranslation'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalCustomers: number
  pendingOrders: number
  completedOrders: number
}

export const AdminOverview: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || user.role !== 'admin') {
        navigate('/')
        return
      }

      try {
        setIsLoading(true)
        // Fetch products count
        const allProducts = await productsService.getAll()
        const totalProducts = allProducts?.length || 0

        // In real app, would fetch from backend
        // For now, using mock data
        setStats({
          totalOrders: 42,
          totalRevenue: 12500,
          totalProducts: totalProducts,
          totalCustomers: 87,
          pendingOrders: 8,
          completedOrders: 34,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [user, navigate])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">📊 לוח בקרה מנהל</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">הזמנות כוללות</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <ShoppingCart size={40} className="text-orange-500 opacity-20" />
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">הכנסה כוללת</p>
                <p className="text-3xl font-bold text-gray-900">₪{stats.totalRevenue.toLocaleString('he-IL')}</p>
              </div>
              <DollarSign size={40} className="text-green-500 opacity-20" />
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">מוצרים במלאי</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <Package size={40} className="text-blue-500 opacity-20" />
            </div>
          </div>

          {/* Total Customers */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">לקוחות</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
              <Users size={40} className="text-purple-500 opacity-20" />
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">הזמנות ממתינות</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
              </div>
              <TrendingUp size={40} className="text-yellow-500 opacity-20" />
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">הזמנות שהושלמו</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
              </div>
              <BarChart3 size={40} className="text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ פעולות מהירות</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/admin/products')}
                className="w-full text-right px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-semibold"
              >
                📦 ניהול מוצרים
              </button>
              <button
                onClick={() => navigate('/admin/orders')}
                className="w-full text-right px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-semibold"
              >
                📋 ניהול הזמנות
              </button>
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full text-right px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-semibold"
              >
                👥 ניהול משתמשים
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📈 מטריקות עיקריות</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">שיעור השלמה:</span>
                <span className="font-bold text-gray-900">81%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ממוצע הזמנה:</span>
                <span className="font-bold text-gray-900">₪297</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">מוצר פופולרי:</span>
                <span className="font-bold text-gray-900">Pokémon Scarlet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
