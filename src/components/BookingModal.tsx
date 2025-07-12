import React, { useState, useEffect } from 'react'
import {
  X,
  Coffee,
  User,
  Mail,
  Phone,
  Users,
  Calendar,
  Check,
  Globe,
} from 'lucide-react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPackage?: string
  packages: Array<{ id: string; name: string; dates: string; price: string }>
}

interface FormData {
  fullName: string
  email: string
  phone: string
  age: string
  country: string
  bookingType: 'individual' | 'group'
  numberOfPeople: string
  selectedPackage: string
}

// Comprehensive list of countries
const countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
]

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  packages,
}) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    country: '',
    bookingType: 'individual',
    numberOfPeople: '1',
    selectedPackage: selectedPackage || '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')
  const [filteredCountries, setFilteredCountries] = useState<string[]>([])
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

  // Update selected package when prop changes
  useEffect(() => {
    if (selectedPackage) {
      setFormData((prev) => ({ ...prev, selectedPackage }))
    }
  }, [selectedPackage])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsSubmitted(false)
        setError('')
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          age: '',
          country: '',
          bookingType: 'individual',
          numberOfPeople: '1',
          selectedPackage: selectedPackage || '',
        })
      }, 300)
    }
  }, [isOpen, selectedPackage])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Filter countries based on input
  useEffect(() => {
    if (formData.country) {
      const filtered = countries.filter((country) =>
        country.toLowerCase().includes(formData.country.toLowerCase())
      )
      setFilteredCountries(filtered.slice(0, 10)) // Limit to 10 results
    } else {
      setFilteredCountries([])
    }
  }, [formData.country])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleCountrySelect = (country: string) => {
    setFormData((prev) => ({ ...prev, country }))
    setShowCountryDropdown(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      let data = null
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError)
        setError('Server returned an invalid response. Please try again.')
        setIsSubmitting(false)
        return
      }

      if (response.ok) {
        setIsSubmitted(true)
        setIsSubmitting(false) // Stop spinning immediately on success
        // Auto-close modal after 4 seconds
        setTimeout(() => {
          onClose()
        }, 4000)
      } else {
        if (response.status === 409) {
          setError(
            'A booking with this email already exists for the selected package.'
          )
        } else if (data?.errors && data.errors.length > 0) {
          setError(
            data.errors[0].msg || 'Please check your input and try again.'
          )
        } else {
          setError(
            data?.error ||
              `Server error (${response.status}). Please try again.`
          )
        }
      }
    } catch (error) {
      console.error('Booking submission error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError(
          'Cannot connect to server. Please check if the backend is running.'
        )
      } else {
        setError('Network error. Please check your connection and try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedPackageDetails = packages.find(
    (pkg) => pkg.id === formData.selectedPackage
  )

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300'
        onClick={onClose}
      />

      {/* Modal - Mobile Optimized */}
      <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100'>
        {/* Header - Sticky on mobile */}
        <div className='sticky top-0 bg-white border-b border-cream-200 p-4 sm:p-6 rounded-t-2xl z-10'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='bg-coffee-600 text-white p-2 rounded-full flex-shrink-0'>
                <Coffee className='h-4 w-4 sm:h-5 sm:w-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <h2 className='text-lg sm:text-2xl font-playfair font-bold text-coffee-800 leading-tight'>
                  Book Your Ethiopian Adventure
                </h2>
                <p className='text-coffee-600 font-inter text-xs sm:text-sm'>
                  Join us for an unforgettable journey
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className='text-coffee-400 hover:text-coffee-600 transition-colors duration-200 p-2 hover:bg-coffee-50 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation flex-shrink-0'
              aria-label='Close modal'
            >
              <X className='h-5 w-5 sm:h-6 sm:w-6' />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-4 sm:p-6'>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Error Message */}
              {error && (
                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl'>
                  <p className='text-sm font-inter'>{error}</p>
                </div>
              )}

              {/* Selected Package Info */}
              {selectedPackageDetails && (
                <div className='bg-coffee-50 border border-coffee-200 rounded-xl p-4 mb-6'>
                  <h3 className='font-playfair font-semibold text-coffee-800 mb-2 text-sm sm:text-base'>
                    Selected Package
                  </h3>
                  <div className='text-coffee-700 font-inter'>
                    <p className='font-medium text-sm sm:text-base'>
                      {selectedPackageDetails.name}
                    </p>
                    <p className='text-xs sm:text-sm text-coffee-600'>
                      {selectedPackageDetails.dates}
                    </p>
                    <p className='text-base sm:text-lg font-bold text-coffee-800 mt-1'>
                      {selectedPackageDetails.price}
                    </p>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className='space-y-4'>
                <h3 className='text-base sm:text-lg font-playfair font-semibold text-coffee-800 flex items-center'>
                  <User className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
                  Personal Information
                </h3>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='fullName'
                      className='block text-sm font-inter font-medium text-coffee-700 mb-2'
                    >
                      Full Name *
                    </label>
                    <input
                      type='text'
                      id='fullName'
                      name='fullName'
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter text-sm sm:text-base min-h-[48px]'
                      placeholder='Enter your full name'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='age'
                      className='block text-sm font-inter font-medium text-coffee-700 mb-2'
                    >
                      Age *
                    </label>
                    <input
                      type='number'
                      id='age'
                      name='age'
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min='18'
                      max='100'
                      className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter text-sm sm:text-base min-h-[48px]'
                      placeholder='Your age'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm font-inter font-medium text-coffee-700 mb-2'
                    >
                      Email Address *
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter text-sm sm:text-base min-h-[48px]'
                      placeholder='your.email@example.com'
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='phone'
                      className='block text-sm font-inter font-medium text-coffee-700 mb-2'
                    >
                      Phone Number *
                    </label>
                    <input
                      type='tel'
                      id='phone'
                      name='phone'
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter text-sm sm:text-base min-h-[48px]'
                      placeholder='+1 (555) 123-4567'
                    />
                  </div>
                </div>

                {/* Country Field with Autocomplete */}
                <div className='relative'>
                  <label
                    htmlFor='country'
                    className='block text-sm font-inter font-medium text-coffee-700 mb-2'
                  >
                    <Globe className='h-4 w-4 inline mr-1' />
                    Country *
                  </label>
                  <input
                    type='text'
                    id='country'
                    name='country'
                    value={formData.country}
                    onChange={handleInputChange}
                    onFocus={() => setShowCountryDropdown(true)}
                    onBlur={() =>
                      setTimeout(() => setShowCountryDropdown(false), 200)
                    }
                    required
                    className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter text-sm sm:text-base min-h-[48px]'
                    placeholder='Start typing your country...'
                    autoComplete='country'
                  />

                  {/* Country Dropdown */}
                  {showCountryDropdown && filteredCountries.length > 0 && (
                    <div className='absolute z-50 w-full mt-1 bg-white border border-cream-300 rounded-xl shadow-lg max-h-48 overflow-y-auto'>
                      {filteredCountries.map((country, index) => (
                        <button
                          key={index}
                          type='button'
                          onClick={() => handleCountrySelect(country)}
                          className='w-full text-left px-4 py-2 hover:bg-coffee-50 transition-colors duration-200 font-inter text-sm border-b border-cream-100 last:border-b-0'
                        >
                          {country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Details */}
              <div className='space-y-4'>
                <h3 className='text-base sm:text-lg font-playfair font-semibold text-coffee-800 flex items-center'>
                  <Calendar className='h-4 w-4 sm:h-5 sm:w-5 mr-2' />
                  Booking Details
                </h3>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='bookingType'
                      className='block text-sm font-inter font-medium text-coffee-700 mb-2'
                    >
                      Booking Type *
                    </label>
                    <select
                      id='bookingType'
                      name='bookingType'
                      value={formData.bookingType}
                      onChange={handleInputChange}
                      required
                      className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter text-sm sm:text-base min-h-[48px]'
                    >
                      <option value='individual'>Individual</option>
                      <option value='group'>Group</option>
                    </select>
                  </div>

                  {formData.bookingType === 'group' && (
                    <div>
                      <label
                        htmlFor='numberOfPeople'
                        className='block text-sm font-inter font-medium text-coffee-700 mb-2'
                      >
                        Number of People *
                      </label>
                      <input
                        type='number'
                        id='numberOfPeople'
                        name='numberOfPeople'
                        value={formData.numberOfPeople}
                        onChange={handleInputChange}
                        required
                        min='2'
                        max='18'
                        className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter text-sm sm:text-base min-h-[48px]'
                        placeholder='Number of travelers'
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='selectedPackage'
                    className='block text-sm font-inter font-medium text-coffee-700 mb-2'
                  >
                    Select Package *
                  </label>
                  <select
                    id='selectedPackage'
                    name='selectedPackage'
                    value={formData.selectedPackage}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter text-sm sm:text-base min-h-[48px]'
                  >
                    <option value=''>Choose a package...</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - {pkg.dates} ({pkg.price})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className='pt-4'>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full bg-coffee-600 text-white py-4 px-6 rounded-xl font-inter font-medium hover:bg-coffee-700 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 min-h-[48px] touch-manipulation'
                >
                  {isSubmitting ? (
                    <>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Coffee className='h-5 w-5' />
                      <span>Submit Booking Request</span>
                    </>
                  )}
                </button>
              </div>

              {/* Disclaimer */}
              <div className='text-xs text-coffee-500 font-inter text-center bg-cream-50 p-4 rounded-xl'>
                <p>
                  * Booking request received. We'll contact you within 8 hours
                  to finalize your booking.
                </p>
              </div>
            </form>
          ) : (
            /* Success Message */
            <div className='text-center py-8'>
              <div className='bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Check className='h-8 w-8' />
              </div>
              <h3 className='text-xl sm:text-2xl font-playfair font-bold text-coffee-800 mb-4'>
                Booking Request Received!
              </h3>
              <p className='text-coffee-600 font-inter mb-6 max-w-md mx-auto text-sm sm:text-base px-4'>
                Thank you for your interest in our Ethiopian Coffee Origin Trip.
                We'll contact you within 8 hours to finalize your booking.
              </p>
              <div className='bg-coffee-50 border border-coffee-200 rounded-xl p-4 text-left max-w-md mx-auto'>
                <h4 className='font-playfair font-semibold text-coffee-800 mb-2 text-sm sm:text-base'>
                  Next Steps:
                </h4>
                <ul className='text-xs sm:text-sm text-coffee-600 font-inter space-y-1'>
                  <li>• Check your email for confirmation</li>
                  <li>• We'll verify availability for your dates</li>
                  <li>• Payment and travel details will follow</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingModal
