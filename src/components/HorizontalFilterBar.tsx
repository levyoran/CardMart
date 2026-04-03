import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface FilterItem {
  key: string
  label: string
}

interface HorizontalFilterBarProps {
  label: string
  items: FilterItem[]
  selected?: string
  onSelect: (key: string | undefined) => void
}

export const HorizontalFilterBar: React.FC<HorizontalFilterBarProps> = ({
  label,
  items,
  selected,
  onSelect,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      if (direction === 'left') {
        scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 py-2 px-2">
      <div className="max-w-full flex items-center gap-2" style={{ flexDirection: 'row-reverse' }}>
        <span className="text-sm font-semibold text-gray-700 flex-shrink-0 whitespace-nowrap">
          {label}
        </span>

        {/* Scroll buttons */}
        <button
          onClick={() => scroll('right')}
          className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
        >
          <ChevronRight size={16} />
        </button>

        {/* Scrollable items */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
          style={{ flexDirection: 'row-reverse' }}
        >
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => onSelect(selected === item.key ? undefined : item.key)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${
                selected === item.key
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Scroll buttons */}
        <button
          onClick={() => scroll('left')}
          className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
        >
          <ChevronLeft size={16} />
        </button>
      </div>
    </div>
  )
}
