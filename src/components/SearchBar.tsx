import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { products as productsService } from '../services/supabase'
import { Product } from '../types'

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true)
        const results = await productsService.search(query)
        setSuggestions(results)
        setShowDropdown(true)
      } catch (error) {
        console.error('Search error:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSuggestionClick = (productId: string) => {
    setQuery('')
    setSuggestions([])
    setShowDropdown(false)
    navigate(`/product/${productId}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      setQuery('')
      setSuggestions([])
      setShowDropdown(false)
      navigate(`/?search=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleClear = () => {
    setQuery('')
    setSuggestions([])
    setShowDropdown(false)
  }

  return (
    <div className="flex-1 max-w-md mx-auto relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="חיפוש קלפים..."
          className="w-full px-4 py-2 pr-10 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}

        {!query && (
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSuggestionClick(product.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-right transition"
            >
              {product.emoji && <span className="text-2xl flex-shrink-0">{product.emoji}</span>}
              {product.image_url && !product.emoji && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0 text-right">
                <div className="font-medium text-gray-900 truncate">{product.name}</div>
                <div className="text-sm text-gray-500">{product.category}</div>
              </div>
              <div className="text-orange-500 font-semibold flex-shrink-0">₪{product.price}</div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && query.length >= 2 && isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-600">
          חיפוש...
        </div>
      )}
    </div>
  )
}
