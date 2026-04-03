import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Edit2, Save, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useTranslation } from '../hooks/useTranslation'

export const Account: React.FC = () => {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  })

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 py-12" dir="rtl">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">עליך להתחבר כדי לראות את החשבון שלך</p>
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

  const handleSave = () => {
    setIsEditing(false)
    // כאן יכול להוסיף עדכון לסרבר
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">חשבוני</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">פרטי אישיים</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                <Edit2 size={18} />
                עריכה
              </button>
            ) : null}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  שם מלא
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  דוא"ל
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">לא ניתן לשנות דוא"ל</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  <Save size={18} />
                  שמור
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                >
                  <X size={18} />
                  בטל
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">שם מלא</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.full_name || 'לא הוגדר'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">דוא"ל</p>
                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">תפקיד</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.role === 'admin' ? '👨‍💼 מנהל' : '👤 לקוח'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">חברות מ-</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('he-IL')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {user.role === 'admin' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">🔧 ניהול</h3>
              <p className="text-gray-600 mb-4">נהל מוצרים ומלאי</p>
              <button
                onClick={() => navigate('/admin')}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                לוח הבקרה
              </button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">📦 ההזמנות שלי</h3>
            <p className="text-gray-600 mb-4">ראה את היסטוריית ההזמנות</p>
            <button
              onClick={() => navigate('/orders')}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              להזמנות שלי
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">🔒 אבטחה</h3>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={20} />
            התנתקות
          </button>
        </div>
      </div>
    </main>
  )
}
