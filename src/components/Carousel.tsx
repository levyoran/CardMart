import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

interface Slide {
  id: number
  titleKey: string
  subtitleKey: string
  emoji: string
  color: string
  bgColor: string
}

interface CarouselProps {
  slides?: Slide[]
}

export const Carousel: React.FC<CarouselProps> = ({
  slides = [
    {
      id: 1,
      titleKey: 'carousel.slide1Title',
      subtitleKey: 'carousel.slide1Subtitle',
      emoji: '🎴',
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-gradient-to-r from-red-100 to-orange-100'
    },
    {
      id: 2,
      titleKey: 'carousel.slide2Title',
      subtitleKey: 'carousel.slide2Subtitle',
      emoji: '⛵',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-r from-blue-100 to-cyan-100'
    },
    {
      id: 3,
      titleKey: 'carousel.slide3Title',
      subtitleKey: 'carousel.slide3Subtitle',
      emoji: '🏰',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-r from-purple-100 to-pink-100'
    },
    {
      id: 4,
      titleKey: 'carousel.slide4Title',
      subtitleKey: 'carousel.slide4Subtitle',
      emoji: '🔥',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-r from-orange-100 to-red-100'
    }
  ]
}) => {
  const { t } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  // Auto-play
  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000) // שנה כל 4 שניות

    return () => clearInterval(interval)
  }, [isAutoPlay, slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlay(false)
    setTimeout(() => setIsAutoPlay(true), 8000) // חזור ל-autoplay אחרי 8 שניות
  }

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length)
  }

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }

  const slide = slides[currentSlide]

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-xl">
      {/* Slides */}
      <div className="relative h-80 md:h-96">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background */}
            <div className={`${s.bgColor} w-full h-full flex items-center justify-between px-8 md:px-16`} dir="rtl">
              {/* Content */}
              <div className="flex flex-col justify-center z-10 flex-1">
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
                  {t(s.titleKey as any)}
                </h2>
                <p className="text-lg md:text-xl text-gray-700 mb-6">
                  {t(s.subtitleKey as any)}
                </p>
                <button className={`w-fit px-6 py-3 bg-gradient-to-r ${s.color} text-white rounded-lg font-bold hover:shadow-lg transition transform hover:scale-105`}>
                  {t('carousel.buyNow')}
                </button>
              </div>

              {/* Emoji */}
              <div className="text-9xl md:text-[200px] opacity-20 -mr-20 flex-shrink-0">
                {s.emoji}
              </div>
            </div>

            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${s.color} opacity-5`}></div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition shadow-md"
        aria-label="Previous slide"
      >
        <ChevronRight size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-900 p-2 rounded-full transition shadow-md"
        aria-label="Next slide"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentSlide
                ? 'bg-white'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4 z-20 bg-black/30 text-white px-3 py-1 rounded-full text-sm">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  )
}
