import React, { useState, useEffect } from 'react'
import { ArrowRight, Calendar } from 'lucide-react'

const Hero: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Hero background images that will alternate
  const heroImages = [
    'https://www.aregashlodge.com/index_files/image9111.jpg',
    'https://lucyethiopiatours.com/wp-content/uploads/2024/04/coffeee-edited.jpg',
  ]

  // Calculate countdown to November 26, 2025
  useEffect(() => {
    const targetDate = new Date('2025-11-26T00:00:00').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        )
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  // Image rotation effect
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 6000) // Change image every 6 seconds

    return () => clearInterval(imageInterval)
  }, [heroImages.length])

  const viewFullItinerary = () => {
    window.location.href = '/itinerary/complete-ethiopia'
  }

  const scrollToTours = () => {
    const element = document.getElementById('tour-packages')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id='hero'
      className='relative min-h-screen flex items-center justify-center overflow-hidden'
    >
      {/* Background Images with Crossfade Effect */}
      <div className='absolute inset-0 z-0'>
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Ethiopian coffee landscape ${index + 1}`}
              className='w-full h-full object-cover object-center'
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Gradient Overlay for Text Readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30'></div>

        {/* Additional Bottom Fade for Better Text Readability */}
        <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
        {/* Organizer Badge */}
        {/* <div className="mb-4 sm:mb-6 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md text-cream-200 px-4 py-2 rounded-full border border-white/20">
            <Coffee className="h-4 w-4" />
            <span className="text-sm font-inter font-medium">by Yoya Coffee ☕</span>
          </div>
        </div> */}

        {/* Main Headline */}
        <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-playfair font-bold mb-6 sm:mb-8 leading-tight animate-fade-in'>
          Ethiopian Coffee
          <span className='block text-cream-200'>Origin Adventure</span>
        </h1>

        {/* Trip Dates */}

        {/* Description */}
        <p className='text-base sm:text-lg font-inter font-light mb-8 sm:mb-12 max-w-2xl mx-auto text-cream-100 leading-relaxed px-4 animate-fade-in'>
          Journey to the birthplace of coffee. Experience authentic culture,
          breathtaking landscapes, and unforgettable moments in Ethiopia.
        </p>

        {/* Call to Action Buttons - Mobile Optimized */}
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4 animate-fade-in'>
          <button
            onClick={viewFullItinerary}
            className='group w-full sm:w-auto bg-earth-600 text-white px-6 sm:px-8 py-4 rounded-full font-inter font-medium hover:bg-earth-700 transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 shadow-lg min-h-[48px] touch-manipulation'
          >
            <span>View Full Itinerary</span>
            <ArrowRight className='h-5 w-5 group-hover:translate-x-1 transition-transform duration-200' />
          </button>

          <button
            onClick={scrollToTours}
            className='group w-full sm:w-auto border-2 border-white/60 text-white px-6 sm:px-8 py-4 rounded-full font-inter font-medium hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center justify-center space-x-3 min-h-[48px] touch-manipulation'
          >
            <span>Explore Tours</span>
            <ArrowRight className='h-5 w-5 group-hover:translate-x-1 transition-transform duration-200' />
          </button>
        </div>
      </div>

      {/* Image Indicators */}
      <div className='absolute bottom-20 sm:bottom-24 left-1/2 transform -translate-x-1/2 z-10'>
        <div className='flex space-x-2'>
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator - Hidden on small screens */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow hidden sm:block z-10'>
        <div className='w-6 h-10 border-2 border-white/50 rounded-full flex justify-center'>
          <div className='w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse'></div>
        </div>
      </div>
    </section>
  )
}

export default Hero
