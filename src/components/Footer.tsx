import React from 'react'
import Link from 'next/link'
import ReactCountryFlag from 'react-country-flag'
import {
  Coffee,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react'

const Footer: React.FC = () => {
  // const [email, setEmail] = useState('')
  // const [, setIsSubscribed] = useState(false)

  // const _handleNewsletterSubmit = (e: React.FormEvent) => {
  //   e.preventDefault()
  //   if (email) {
  //     setIsSubscribed(true)
  //     setEmail('')
  //     setTimeout(() => setIsSubscribed(false), 3000)
  //   }
  // }

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
                    url: 'https://www.instagram.com/ethio_coffee_origin_trip?igsh=NjA2ZmYzZXd3c3dq',
                  },
                  {
                    icon: (
                      <svg
                        className='h-4 w-4 sm:h-5 sm:w-5'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                      >
                        <path d='M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' />
                      </svg>
                    ),
                    label: 'TikTok',
                    url: 'https://www.tiktok.com/@ethio_coffee_origin_trip?_t=ZM-8xiI9q1owFy&_r=1',
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='bg-coffee-700 text-coffee-200 p-2 sm:p-3 rounded-full hover:bg-coffee-600 hover:text-white transition-all duration-200 hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation'
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
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
                    +251 (976) 260-436
                  </span>
                </div>
                <div className='flex items-start space-x-3'>
                  <MapPin className='h-4 w-4 text-coffee-400 flex-shrink-0 mt-0.5' />
                  <span className='text-coffee-300 font-inter text-sm sm:text-base'>
                    Ethio China St
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
                    <ReactCountryFlag
                      countryCode='CH'
                      svg
                      style={{ width: '20px', height: '15px' }}
                    />
                    <span>UK & Switzerland</span>
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

                {/* China */}
                <div className='bg-coffee-700/30 rounded-lg p-4'>
                  <h5 className='text-sm sm:text-base font-playfair font-semibold text-cream-200 mb-3 flex items-center space-x-2'>
                    <ReactCountryFlag
                      countryCode='CN'
                      svg
                      style={{ width: '20px', height: '15px' }}
                    />
                    <span>China</span>
                  </h5>
                  <div className='space-y-2'>
                    <p className='text-coffee-300 font-inter text-sm'>
                      <strong>Mr. Henock (Leo)</strong>
                    </p>
                    <div className='flex items-start space-x-2'>
                      <Mail className='h-3 w-3 text-coffee-400 flex-shrink-0 mt-1' />
                      <span className='text-coffee-300 font-inter text-xs sm:text-sm'>
                        LIUQI_LEOO@ICLOUD.COM
                      </span>
                    </div>
                    <div className='flex items-start space-x-2'>
                      <Phone className='h-3 w-3 text-coffee-400 flex-shrink-0 mt-1' />
                      <span className='text-coffee-300 font-inter text-xs sm:text-sm'>
                        +86 175 7500 1415
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
                  href={link.path}
                  className='text-coffee-400 font-inter text-xs sm:text-sm hover:text-cream-200 transition-colors duration-200 min-h-[44px] flex items-center touch-manipulation'
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Chat Bot Button */}
      <div className='fixed bottom-6 right-6 z-50'>
        <a
          href='https://wa.me/251976260436'
          target='_blank'
          rel='noopener noreferrer'
          className='group relative flex items-center justify-center w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer'
          aria-label='Chat with us on WhatsApp'
        >
          {/* WhatsApp Icon */}
          <svg
            className='w-8 h-8 text-white'
            fill='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488' />
          </svg>

          {/* Pulse Animation */}
          <div className='absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75'></div>

          {/* Tooltip */}
          <div className='absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap'>
            Chat with us on WhatsApp
            <div className='absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'></div>
          </div>
        </a>
      </div>
    </footer>
  )
}

export default Footer
