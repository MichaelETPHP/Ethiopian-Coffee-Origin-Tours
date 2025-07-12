import React, { useState, useEffect } from 'react'
import { X, Cookie, Shield, Settings } from 'lucide-react'

interface CookiesPopupProps {
  onAccept: () => void
  onReject: () => void
}

const CookiesPopup: React.FC<CookiesPopupProps> = ({ onAccept, onReject }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieChoice')
    if (!cookieChoice) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieChoice', 'accepted')
    setIsVisible(false)
    onAccept()
  }

  const handleReject = () => {
    localStorage.setItem('cookieChoice', 'rejected')
    setIsVisible(false)
    onReject()
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className='fixed inset-0 z-50 flex items-end justify-center p-4 sm:p-6 lg:p-8'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300'
        onClick={handleClose}
      />

      {/* Popup */}
      <div className='relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-auto transform transition-all duration-300 ease-out'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-coffee-100'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-coffee-100 rounded-full'>
              <Cookie className='h-5 w-5 text-coffee-700' />
            </div>
            <h3 className='text-lg font-playfair font-semibold text-coffee-900'>
              Cookie Preferences
            </h3>
          </div>
          <button
            onClick={handleClose}
            className='p-1 hover:bg-coffee-100 rounded-full transition-colors duration-200'
            aria-label='Close cookie preferences'
          >
            <X className='h-5 w-5 text-coffee-600' />
          </button>
        </div>

        {/* Content */}
        <div className='p-4 space-y-4'>
          <p className='text-coffee-700 font-inter text-sm leading-relaxed'>
            We use cookies to enhance your browsing experience, analyze site
            traffic, and personalize content. By continuing to use our site, you
            consent to our use of cookies.
          </p>

          <div className='space-y-3'>
            <div className='flex items-start space-x-3'>
              <Shield className='h-4 w-4 text-coffee-600 mt-0.5 flex-shrink-0' />
              <div>
                <p className='text-coffee-800 font-inter text-sm font-medium'>
                  Essential Cookies
                </p>
                <p className='text-coffee-600 font-inter text-xs'>
                  Required for basic site functionality
                </p>
              </div>
            </div>

            <div className='flex items-start space-x-3'>
              <Settings className='h-4 w-4 text-coffee-600 mt-0.5 flex-shrink-0' />
              <div>
                <p className='text-coffee-800 font-inter text-sm font-medium'>
                  Analytics Cookies
                </p>
                <p className='text-coffee-600 font-inter text-xs'>
                  Help us improve our website
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className='flex flex-col sm:flex-row gap-3 p-4 border-t border-coffee-100'>
          <button
            onClick={handleReject}
            className='flex-1 px-4 py-2.5 text-coffee-700 font-inter font-medium border border-coffee-300 rounded-lg hover:bg-coffee-50 transition-all duration-200 hover:border-coffee-400'
          >
            Reject All
          </button>
          <button
            onClick={handleAccept}
            className='flex-1 px-4 py-2.5 bg-coffee-700 text-white font-inter font-medium rounded-lg hover:bg-coffee-800 transition-all duration-200 hover:scale-105 shadow-lg'
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookiesPopup
