import React, { useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { useLanguageStore } from '../store/languageStore'

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguageStore()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'he', label: 'עברית' },
    { code: 'en', label: 'English' },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
      >
        <Globe size={18} />
        <span className="text-sm font-medium">{language === 'he' ? 'עברית' : 'EN'}</span>
        <ChevronDown size={16} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50" dir="ltr">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as 'he' | 'en')
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2 text-sm text-left transition ${
                language === lang.code
                  ? 'bg-orange-100 text-orange-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
