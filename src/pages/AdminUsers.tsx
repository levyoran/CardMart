import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Users } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../hooks/useTranslation'

interface UserData {
  id: string
  email: string
  fullName: string
  role: 'customer' | 'admin'
  joinDate: string
  orders: number
  totalSpent: number
}

export const AdminUsers: React.FC = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()

  // Mock users data
  const [users] = useState<UserData[]>([
    {
      id: '1',
      email: 'customer1@example.com',
      fullName: 'דוד כהן',
      role: 'customer',
      joinDate: '2024-01-15',
      orders: 3,
      totalSpent: 892
    },
    {
      id: '2',
      email: 'customer2@example.com',
      fullName: 'שרה לוי',
      role: 'customer',
      joinDate: '2024-02-20',
      orders: 1,
      totalSpent: 299
    },
  ])

  if (!user || user.role !== 'admin') {
    navigate('/admin')
    return null
  }

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

        <h1 className="text-3xl font-bold text-gray-900 mb-8">👥 ניהול משתמשים</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">סך הכל משתמשים</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
              <Users size={40} className="text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">לקוחות פעילים</p>
                <p className="text-3xl font-bold text-gray-900">{users.filter(u => u.role === 'customer').length}</p>
              </div>
              <Shield size={40} className="text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">סה"כ הכנסות</p>
                <p className="text-3xl font-bold text-gray-900">₪{users.reduce((sum, u) => sum + u.totalSpent, 0).toLocaleString('he-IL')}</p>
              </div>
              <Users size={40} className="text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">שם</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">דוא"ל</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">תפקיד</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">הזמנות</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">סכום בהוצאה</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">חברות מ-</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userData) => (
                <tr key={userData.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{userData.fullName}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {userData.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      userData.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {userData.role === 'admin' ? '👨‍💼 מנהל' : '👤 לקוח'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {userData.orders}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ₪{userData.totalSpent.toLocaleString('he-IL')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(userData.joinDate).toLocaleDateString('he-IL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
