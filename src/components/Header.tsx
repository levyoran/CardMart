import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, LogOut, Settings, User } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useTranslation } from '../hooks/useTranslation'
import { SearchBar } from './SearchBar'
import { LanguageSwitcher } from './LanguageSwitcher'

export const Header: React.FC = () => {
  const { user, signOut } = useAuthStore()
  const cartCount = useCartStore((state) => state.getItemCount())
  const { t } = useTranslation()

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/images/cardmart-logo.png"
              alt="CardMart"
              className="h-12 object-contain flex-shrink-0"
            />
          </Link>

          <SearchBar />

          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6">
            {user?.role === 'admin' && (
              <div className="flex items-center gap-4">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
                  title="Admin Overview"
                >
                  <Settings size={20} />
                  {t('header.admin')}
                </Link>
              </div>
            )}

            <Link
              to="/cart"
              className="relative flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              {t('header.cart')}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                 
                >
                  <LogOut size={18} />
                  {t('header.logout')}
                </button>
                <Link
                  to="/account"
                  className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"

                >
                  <User size={20} />
                  {t('account.myAccount')}
                </Link>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  {t('header.signup')}
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:border-orange-500 transition"
                >
                  {t('header.login')}
                </Link>
              </div>
            )}
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
