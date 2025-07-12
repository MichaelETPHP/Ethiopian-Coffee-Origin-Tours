import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ReactCountryFlag from 'react-country-flag'
import {
  Coffee,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react'

const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer id='contact' className='bg-coffee-800 text-white'>
      {/* Newsletter Section - Mobile Optimized */}

      {/* Main Footer - Mobile Optimized */}
      <div className='py-12 sm:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Brand Section */}
            <div className='lg:col-span-1 sm:col-span-2 lg:col-span-1'>
              <div className='flex items-center space-x-2 mb-4'>
                <Coffee className='h-6 w-6 sm:h-8 sm:w-8 text-cream-200' />
                <span className='text-base sm:text-xl font-playfair font-bold text-cream-100 leading-tight'>
                  Ethiopian Coffee Origin Trip
                </span>
              </div>
              <p className='text-coffee-300 font-inter leading-relaxed mb-6 text-sm sm:text-base'>
                Connecting travelers with authentic coffee experiences and the
                stories behind every cup in Ethiopia's legendary coffee regions.
              </p>

              {/* Social Media */}
              <div className='flex space-x-4'>
                {[
                  {
                    icon: <Instagram className='h-4 w-4 sm:h-5 sm:w-5' />,
                    label: 'Instagram',
                  },
                  {
                    icon: <Facebook className='h-4 w-4 sm:h-5 sm:w-5' />,
                    label: 'Facebook',
                  },
                  {
                    icon: <Twitter className='h-4 w-4 sm:h-5 sm:w-5' />,
                    label: 'Twitter',
                  },
                ].map((social, index) => (
                  <button
                    key={index}
                    className='bg-coffee-700 text-coffee-200 p-2 sm:p-3 rounded-full hover:bg-coffee-600 hover:text-white transition-all duration-200 hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation'
                    aria-label={social.label}
                  >
                    {social.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className='text-base sm:text-lg font-playfair font-semibold text-cream-100 mb-4'>
                Contact Information
              </h4>
              <div className='space-y-3'>
                <div className='flex items-start space-x-3'>
                  <Mail className='h-4 w-4 text-coffee-400 flex-shrink-0 mt-0.5' />
                  <span className='text-coffee-300 font-inter text-sm sm:text-base'>
                    info@ethiopiancoffeetrip.com
                  </span>
                </div>
                <div className='flex items-start space-x-3'>
                  <Phone className='h-4 w-4 text-coffee-400 flex-shrink-0 mt-0.5' />
                  <span className='text-coffee-300 font-inter text-sm sm:text-base'>
                    +251 (911) 123-456
                  </span>
                </div>
                <div className='flex items-start space-x-3'>
                  <MapPin className='h-4 w-4 text-coffee-400 flex-shrink-0 mt-0.5' />
                  <span className='text-coffee-300 font-inter text-sm sm:text-base'>
                    Addis Ababa, Ethiopia
                    <br />
                    Coffee Capital of the World
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => scrollToSection('tour-packages')}
                className='mt-6 bg-earth-600 text-white px-4 sm:px-6 py-3 rounded-full font-inter font-medium hover:bg-earth-700 transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2 text-sm sm:text-base min-h-[48px] touch-manipulation'
              >
                <span>Book a Tour</span>
                <ArrowRight className='h-4 w-4' />
              </button>
            </div>

            {/* International Representatives */}
            <div>
              <h4 className='text-base sm:text-lg font-playfair font-semibold text-cream-100 mb-4'>
                Our International Representatives
              </h4>
              <div className='space-y-6'>
                {/* United Kingdom */}
                <div className='bg-coffee-700/30 rounded-lg p-4'>
                  <h5 className='text-sm sm:text-base font-playfair font-semibold text-cream-200 mb-3 flex items-center space-x-2'>
                    <ReactCountryFlag
                      countryCode='GB'
                      svg
                      style={{ width: '20px', height: '15px' }}
                    />
                    <span>Great Britain</span>
                  </h5>
                  <div className='space-y-2'>
                    <p className='text-coffee-300 font-inter text-sm'>
                      <strong>Mr. Abreham Hagos</strong>
                    </p>
                    <div className='flex items-start space-x-2'>
                      <Mail className='h-3 w-3 text-coffee-400 flex-shrink-0 mt-1' />
                      <span className='text-coffee-300 font-inter text-xs sm:text-sm'>
                        ecoteff@gmail.com
                      </span>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <Phone className='h-3 w-3 text-coffee-400 flex-shrink-0 mt-1' />
                      <span className='text-coffee-300 font-inter text-xs sm:text-sm'>
                        +41 76 537 81 87 (WhatsApp)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Netherlands */}
                <div className='bg-coffee-700/30 rounded-lg p-4'>
                  <h5 className='text-sm sm:text-base font-playfair font-semibold text-cream-200 mb-3 flex items-center space-x-2'>
                    <ReactCountryFlag
                      countryCode='NL'
                      svg
                      style={{ width: '20px', height: '15px' }}
                    />
                    <span>Netherlands</span>
                  </h5>
                  <div className='space-y-2'>
                    <p className='text-coffee-300 font-inter text-sm'>
                      <strong>Mr. Samuel Tesfaye</strong>
                    </p>
                    <div className='flex items-start space-x-2'>
                      <Mail className='h-3 w-3 text-coffee-400 flex-shrink-0 mt-1' />
                      <span className='text-coffee-300 font-inter text-xs sm:text-sm'>
                        samueltesfay01@gmail.com
                      </span>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <Phone className='h-3 w-3 text-coffee-400 flex-shrink-0 mt-1' />
                      <span className='text-coffee-300 font-inter text-xs sm:text-sm'>
                        +31 6 30 32 25 91 (WhatsApp)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Mobile Optimized */}
      <div className='border-t border-coffee-700 py-6'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0'>
            <p className='text-coffee-400 font-inter text-xs sm:text-sm text-center sm:text-left'>
              © 2025 Ethiopian Coffee Origin Trip. All rights reserved.
            </p>
            <div className='flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6'>
              {[{ label: 'Terms of Service', path: '/terms' }].map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className='text-coffee-400 font-inter text-xs sm:text-sm hover:text-cream-200 transition-colors duration-200 min-h-[44px] flex items-center touch-manipulation'
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
