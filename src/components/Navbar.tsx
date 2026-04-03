import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

export const Navbar: React.FC = () => {
  const { t } = useTranslation()

  return (
    <nav className="bg-gray-100 border-b border-gray-200 sticky top-16 z-30">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex gap-6 h-12 items-center">
          <Link
            to="/"
            className="text-gray-700 hover:text-orange-500 font-medium transition text-sm"
          >
            {t('navbar.home')}
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-orange-500 font-medium transition text-sm"
          >
            {t('navbar.contact')}
          </Link>
          <a
            href="#about"
            className="text-gray-700 hover:text-orange-500 font-medium transition text-sm"
          >
            {t('navbar.about')}
          </a>
          <a
            href="#faq"
            className="text-gray-700 hover:text-orange-500 font-medium transition text-sm"
          >
            {t('navbar.faq')}
          </a>
        </div>
      </div>
    </nav>
  )
}
