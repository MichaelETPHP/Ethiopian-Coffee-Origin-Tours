import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Coffee,
  User,
  Mail,
  Phone,
  Globe,
  Users,
  Calendar,
  Check,
  Star,
  MapPin,
  Clock,
  Camera,
  Utensils,
  Plane,
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

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

const packages = [
  {
    id: 'complete-ethiopia',
    name: 'Complete Ethiopian Coffee Origin Trip 2025',
    dates: 'November 26 – December 6, 2025',
    regions: [
      'Sidama',
      'Yirgacheffe',
      'Guji',
      'Jimma',
      'Kaffa',
      'Limu',
      'Addis Ababa',
    ],
    startEnd: 'Addis Ababa',
    duration: '11 Days',
    includes:
      'All local travel (including flights within Ethiopia), meals and drinks, lodging, marketing support: professional content creation to enhance your coffee storytelling',
    description:
      'Experience the complete Ethiopian coffee journey. This comprehensive 11-day trip covers all major coffee regions, from the legendary Yirgacheffe to the wild forests of Kaffa.',
  },
  {
    id: 'southern-ethiopia',
    name: 'Southern Ethiopian Coffee Origin Trip 2025',
    dates: 'November 26 – December 2, 2025',
    regions: ['Sidama', 'Yirgacheffe', 'Guji', 'Addis Ababa'],
    startEnd: 'Addis Ababa',
    duration: '7 Days',
    includes:
      'All local travel (including flights within Ethiopia), meals and drinks, lodging, marketing support: professional content creation to enhance your coffee storytelling',
    description:
      "Step into the birthplace of Arabica coffee. This 7-day immersive journey takes you deep into Ethiopia's iconic coffee-producing regions.",
  },
  {
    id: 'western-ethiopia',
    name: 'Western Ethiopian Coffee Origin Trip 2025',
    dates: 'December 1 – December 6, 2025',
    regions: ['Jimma', 'Kaffa', 'Limu', 'Addis Ababa'],
    startEnd: 'Addis Ababa',
    duration: '6 Days',
    includes:
      'All local travel (including flights within Ethiopia), meals and drinks, lodging, marketing support: professional content creation to enhance your coffee storytelling',
    description:
      'Journey to the birthplace of coffee in Western Ethiopia. Explore wild coffee forests, visit historical sites, and experience the origins of coffee culture.',
  },
]

const BookingPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedPackage = searchParams.get('package') || ''

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    country: '',
    bookingType: 'individual',
    numberOfPeople: '1',
    selectedPackage: preselectedPackage,
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [error, setError] = useState<string>('')
  const [filteredCountries, setFilteredCountries] = useState<string[]>([])
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [selectedPackageDetails, setSelectedPackageDetails] =
    useState<any>(null)

  // Update selected package details when package changes
  useEffect(() => {
    if (formData.selectedPackage) {
      const packageDetails = packages.find(
        (pkg) => pkg.id === formData.selectedPackage
      )
      setSelectedPackageDetails(packageDetails)
    }
  }, [formData.selectedPackage])

  // Filter countries based on input
  useEffect(() => {
    if (formData.country) {
      const filtered = countries.filter((country) =>
        country.toLowerCase().includes(formData.country.toLowerCase())
      )
      setFilteredCountries(filtered.slice(0, 10))
    } else {
      setFilteredCountries([])
    }
  }, [formData.country])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

      const data = await response.json()

      if (response.ok) {
        setIsSubmitting(false) // Stop spinning immediately on success
        setShowSuccessAnimation(true) // Show success animation

        // After success animation, show full success page
        setTimeout(() => {
          setIsSubmitted(true)
          setShowSuccessAnimation(false)
          // Auto-redirect after 5 seconds
          setTimeout(() => {
            navigate('/')
          }, 5000)
        }, 2000) // Show animation for 2 seconds
      } else {
        if (response.status === 409) {
          setError(
            'A booking with this email already exists for the selected package.'
          )
        } else if (data.errors && data.errors.length > 0) {
          setError(
            data.errors[0].msg || 'Please check your input and try again.'
          )
        } else {
          setError(data.error || 'Failed to submit booking. Please try again.')
        }
      }
    } catch (error) {
      console.error('Booking submission error:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  if (isSubmitted) {
    return (
      <>
        <Header />
        <div className='min-h-screen bg-gradient-to-br from-cream-50 to-coffee-50 flex items-center justify-center py-20'>
          <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <div className='bg-white rounded-3xl shadow-2xl p-8 sm:p-12 animate-fade-in'>
              {/* Professional Success Animation */}
              <div className='relative mb-8'>
                <div className='bg-gradient-to-r from-green-400 to-emerald-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg'>
                  <Check className='h-12 w-12 text-white' />
                </div>
                <div className='absolute inset-0 w-24 h-24 bg-green-400 rounded-full animate-ping opacity-75'></div>
                <div className='absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce'>
                  <span className='text-xs font-bold text-yellow-800'>✓</span>
                </div>
              </div>

              <h1 className='text-3xl sm:text-4xl font-playfair font-bold text-coffee-800 mb-6 animate-slide-up'>
                🎉 Booking Confirmed!
              </h1>
              <p className='text-lg text-coffee-600 font-inter mb-8 leading-relaxed animate-slide-up-delay'>
                Thank you for choosing our Ethiopian Coffee Origin Trip! Your
                booking request has been successfully submitted and is being
                processed.
              </p>

              <div className='bg-coffee-50 border border-coffee-200 rounded-2xl p-6 text-left mb-8'>
                <h3 className='font-playfair font-semibold text-coffee-800 mb-4 text-lg'>
                  Next Steps:
                </h3>
                <ul className='text-coffee-600 font-inter space-y-2'>
                  <li className='flex items-start space-x-2'>
                    <Check className='h-5 w-5 text-green-600 flex-shrink-0 mt-0.5' />
                    <span>Check your email for confirmation</span>
                  </li>
                  <li className='flex items-start space-x-2'>
                    <Check className='h-5 w-5 text-green-600 flex-shrink-0 mt-0.5' />
                    <span>We'll verify availability for your dates</span>
                  </li>
                  <li className='flex items-start space-x-2'>
                    <Check className='h-5 w-5 text-green-600 flex-shrink-0 mt-0.5' />
                    <span>Payment and travel details will follow</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleBackToHome}
                className='bg-coffee-600 text-white px-8 py-4 rounded-full font-inter font-medium hover:bg-coffee-700 transition-all duration-200 hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto'
              >
                <ArrowLeft className='h-5 w-5' />
                <span>Return to Homepage</span>
              </button>

              <p className='text-sm text-coffee-500 mt-6'>
                Redirecting automatically in 5 seconds...
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className='relative py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-coffee-800 via-coffee-700 to-earth-700 overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full'></div>
          <div className='absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-full'></div>
          <div className='absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white rounded-full'></div>
        </div>

        <div className='relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white'>
          {/* Back Button */}
          <div className='mb-8'>
            <button
              onClick={handleBackToHome}
              className='group inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-200 font-inter font-medium px-6 py-3 rounded-full border border-white/20'
            >
              <ArrowLeft className='h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200' />
              <span>Back to Homepage</span>
            </button>
          </div>

          <div className='inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md text-cream-200 px-4 py-2 rounded-full mb-6'>
            <Coffee className='h-5 w-5' />
            <span className='font-inter font-medium'>
              Ethiopian Coffee Origin Trip
            </span>
          </div>

          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold mb-6 leading-tight'>
            Book Your
            <span className='block text-cream-200'>Coffee Adventure</span>
          </h1>

          <p className='text-xl font-inter font-light mb-8 max-w-2xl mx-auto text-cream-100 leading-relaxed'>
            Join us for an unforgettable journey to the birthplace of coffee.
            Experience authentic culture, breathtaking landscapes, and
            exceptional coffees.
          </p>
        </div>
      </section>

      {/* Main Booking Section */}
      <section className='py-16 sm:py-20 lg:py-24 bg-cream-25'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16'>
            {/* Package Selection & Info */}
            <div className='space-y-8'>
              <div>
                <h2 className='text-2xl sm:text-3xl font-playfair font-bold text-coffee-800 mb-6'>
                  Choose Your Package
                </h2>

                <div className='space-y-6'>
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-xl ${
                        formData.selectedPackage === pkg.id
                          ? 'border-coffee-600 ring-4 ring-coffee-100'
                          : 'border-cream-200 hover:border-coffee-300'
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          selectedPackage: pkg.id,
                        }))
                      }
                    >
                      {/* Selected Indicator */}
                      {formData.selectedPackage === pkg.id && (
                        <div className='absolute -top-3 -right-3 bg-coffee-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg'>
                          <Check className='h-5 w-5' />
                        </div>
                      )}

                      <div className='flex flex-col sm:flex-row'>
                        {/* Image */}
                        {/* <div className='relative w-full sm:w-48 h-48 sm:h-auto'>
                          <img
                            src={`https://via.placeholder.com/200x150`} // Placeholder image
                            alt={pkg.name}
                            className='w-full h-full object-cover rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none'
                          />
                          <div className='absolute top-4 left-4 bg-coffee-600 text-white px-3 py-1 rounded-full text-sm font-inter font-medium'>
                            {pkg.duration}
                          </div>
                        </div> */}

                        {/* Content */}
                        <div className='p-4 sm:p-6 flex-grow'>
                          <h3 className='text-lg sm:text-xl font-playfair font-bold text-coffee-800 mb-3'>
                            {pkg.name} <br></br> ( {pkg.duration} )
                          </h3>

                          <div className='flex items-center space-x-2 mb-4'>
                            <Calendar className='h-4 w-4 text-coffee-500' />
                            <span className='text-coffee-600 font-inter text-sm'>
                              {pkg.dates}
                            </span>
                          </div>

                          <div className='flex flex-wrap gap-2 mb-4'>
                            {pkg.regions.map((region, index) => (
                              <span
                                key={index}
                                className='bg-cream-100 text-coffee-700 px-2 py-1 rounded-full text-xs font-inter'
                              >
                                {region}
                              </span>
                            ))}
                          </div>

                          <p className='text-coffee-600 font-inter text-sm leading-relaxed'>
                            {pkg.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              {selectedPackageDetails && (
                <div className='bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-cream-200'>
                  <h3 className='text-xl font-playfair font-bold text-coffee-800 mb-6'>
                    What's Included
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {[
                      {
                        icon: <Plane className='h-5 w-5' />,
                        title: 'All Local Travel',
                        desc: 'Including flights within Ethiopia',
                      },
                      {
                        icon: <Utensils className='h-5 w-5' />,
                        title: 'Meals & Drinks',
                        desc: 'Traditional Ethiopian cuisine',
                      },
                      {
                        icon: <MapPin className='h-5 w-5' />,
                        title: 'Accommodation',
                        desc: 'Eco-lodges and guesthouses',
                      },
                      {
                        icon: <Camera className='h-5 w-5' />,
                        title: 'Marketing Support',
                        desc: 'Professional content creation',
                      },
                    ].map((item, index) => (
                      <div key={index} className='flex items-start space-x-3'>
                        <div className='text-coffee-600 flex-shrink-0 mt-1'>
                          {item.icon}
                        </div>
                        <div>
                          <div className='font-inter font-semibold text-coffee-800 text-sm'>
                            {item.title}
                          </div>
                          <div className='text-xs text-coffee-600'>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking Form */}
            <div className='bg-white rounded-2xl shadow-2xl border border-cream-200 overflow-hidden'>
              <div className='bg-gradient-to-r from-coffee-600 to-earth-600 p-6 sm:p-8 text-white'>
                <div className='flex items-center space-x-3 mb-4'>
                  <div className='bg-white/20 p-2 rounded-full'>
                    <Coffee className='h-6 w-6' />
                  </div>
                  <div>
                    <h2 className='text-2xl font-playfair font-bold'>
                      Booking Form
                    </h2>
                    <p className='text-coffee-100 font-inter'>
                      Complete your reservation
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className='p-6 sm:p-8 space-y-6'>
                {/* Error Message */}
                {error && (
                  <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl'>
                    <p className='text-sm font-inter'>{error}</p>
                  </div>
                )}

                {/* Personal Information */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-playfair font-semibold text-coffee-800 flex items-center'>
                    <User className='h-5 w-5 mr-2' />
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
                        className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter'
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
                        className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter'
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
                        <Mail className='h-4 w-4 inline mr-1' />
                        Email Address *
                      </label>
                      <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter'
                        placeholder='your.email@example.com'
                      />
                    </div>

                    <div>
                      <label
                        htmlFor='phone'
                        className='block text-sm font-inter font-medium text-coffee-700 mb-2'
                      >
                        <Phone className='h-4 w-4 inline mr-1' />
                        Phone Number *
                      </label>
                      <input
                        type='tel'
                        id='phone'
                        name='phone'
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter'
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
                      className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter'
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
                  <h3 className='text-lg font-playfair font-semibold text-coffee-800 flex items-center'>
                    <Calendar className='h-5 w-5 mr-2' />
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
                        className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter'
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
                          <Users className='h-4 w-4 inline mr-1' />
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
                          className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter'
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
                      Selected Package *
                    </label>
                    <select
                      id='selectedPackage'
                      name='selectedPackage'
                      value={formData.selectedPackage}
                      onChange={handleInputChange}
                      required
                      className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter'
                    >
                      <option value=''>Choose a package...</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} - {pkg.dates}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Button with Success Animation */}
                <div className='pt-4'>
                  {showSuccessAnimation ? (
                    // Professional Success Animation
                    <div className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-inter font-medium shadow-lg flex items-center justify-center space-x-3 animate-success-pulse'>
                      <div className='relative'>
                        <div className='w-6 h-6 bg-white rounded-full flex items-center justify-center'>
                          <Check className='h-4 w-4 text-green-600 animate-bounce' />
                        </div>
                        <div className='absolute inset-0 w-6 h-6 bg-white rounded-full animate-ping opacity-75'></div>
                        <div className='absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping'></div>
                      </div>
                      <span className='font-semibold text-lg'>
                        ✓ Booking Submitted Successfully!
                      </span>
                      <div className='text-sm opacity-90 mt-1'>
                        Check your email for confirmation details
                      </div>
                    </div>
                  ) : (
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='w-full bg-gradient-to-r from-coffee-600 to-earth-600 text-white py-4 px-6 rounded-xl font-inter font-medium hover:from-coffee-700 hover:to-earth-700 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2'
                    >
                      {isSubmitting ? (
                        <>
                          <div className='relative'>
                            <div className='animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent'></div>
                            <div className='absolute inset-0 rounded-full h-5 w-5 border-2 border-white border-t-transparent animate-ping opacity-30'></div>
                          </div>
                          <span className='font-medium'>
                            Processing Your Booking...
                          </span>
                        </>
                      ) : (
                        <>
                          <Coffee className='h-5 w-5' />
                          <span>Submit Booking Request</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Disclaimer */}
                <div className='text-xs text-coffee-500 font-inter text-center bg-cream-50 p-4 rounded-xl'>
                  <p>
                    * Booking request received. You'll receive a confirmation
                    email shortly. We'll contact you within 8 hours to finalize
                    your booking.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default BookingPage
