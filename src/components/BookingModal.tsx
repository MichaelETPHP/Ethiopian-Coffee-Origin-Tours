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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitted(true)
    setIsSubmitting(false)

    // Auto-close modal after 3 seconds
    setTimeout(() => {
      onClose()
    }, 3000)
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
                  Join Yoya Coffee ☕ for an unforgettable journey
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

                <div>
                  <label
                    htmlFor='country'
                    className='block text-sm font-inter font-medium text-coffee-700 mb-2'
                  >
                    Country *
                  </label>
                  <select
                    id='country'
                    name='country'
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-colors duration-200 font-inter text-sm sm:text-base min-h-[48px]'
                  >
                    <option value=''>Select your country</option>
                    <option value='Afghanistan'>Afghanistan</option>
                    <option value='Albania'>Albania</option>
                    <option value='Algeria'>Algeria</option>
                    <option value='Andorra'>Andorra</option>
                    <option value='Angola'>Angola</option>
                    <option value='Antigua and Barbuda'>
                      Antigua and Barbuda
                    </option>
                    <option value='Argentina'>Argentina</option>
                    <option value='Armenia'>Armenia</option>
                    <option value='Australia'>Australia</option>
                    <option value='Austria'>Austria</option>
                    <option value='Azerbaijan'>Azerbaijan</option>
                    <option value='Bahamas'>Bahamas</option>
                    <option value='Bahrain'>Bahrain</option>
                    <option value='Bangladesh'>Bangladesh</option>
                    <option value='Barbados'>Barbados</option>
                    <option value='Belarus'>Belarus</option>
                    <option value='Belgium'>Belgium</option>
                    <option value='Belize'>Belize</option>
                    <option value='Benin'>Benin</option>
                    <option value='Bhutan'>Bhutan</option>
                    <option value='Bolivia'>Bolivia</option>
                    <option value='Bosnia and Herzegovina'>
                      Bosnia and Herzegovina
                    </option>
                    <option value='Botswana'>Botswana</option>
                    <option value='Brazil'>Brazil</option>
                    <option value='Brunei'>Brunei</option>
                    <option value='Bulgaria'>Bulgaria</option>
                    <option value='Burkina Faso'>Burkina Faso</option>
                    <option value='Burundi'>Burundi</option>
                    <option value='Cambodia'>Cambodia</option>
                    <option value='Cameroon'>Cameroon</option>
                    <option value='Canada'>Canada</option>
                    <option value='Cape Verde'>Cape Verde</option>
                    <option value='Central African Republic'>
                      Central African Republic
                    </option>
                    <option value='Chad'>Chad</option>
                    <option value='Chile'>Chile</option>
                    <option value='China'>China</option>
                    <option value='Colombia'>Colombia</option>
                    <option value='Comoros'>Comoros</option>
                    <option value='Congo (Brazzaville)'>
                      Congo (Brazzaville)
                    </option>
                    <option value='Congo (Kinshasa)'>Congo (Kinshasa)</option>
                    <option value='Costa Rica'>Costa Rica</option>
                    <option value='Croatia'>Croatia</option>
                    <option value='Cuba'>Cuba</option>
                    <option value='Cyprus'>Cyprus</option>
                    <option value='Czech Republic'>Czech Republic</option>
                    <option value='Denmark'>Denmark</option>
                    <option value='Djibouti'>Djibouti</option>
                    <option value='Dominica'>Dominica</option>
                    <option value='Dominican Republic'>
                      Dominican Republic
                    </option>
                    <option value='Ecuador'>Ecuador</option>
                    <option value='Egypt'>Egypt</option>
                    <option value='El Salvador'>El Salvador</option>
                    <option value='Equatorial Guinea'>Equatorial Guinea</option>
                    <option value='Eritrea'>Eritrea</option>
                    <option value='Estonia'>Estonia</option>
                    <option value='Eswatini'>Eswatini</option>
                    <option value='Ethiopia'>Ethiopia</option>
                    <option value='Fiji'>Fiji</option>
                    <option value='Finland'>Finland</option>
                    <option value='France'>France</option>
                    <option value='Gabon'>Gabon</option>
                    <option value='Gambia'>Gambia</option>
                    <option value='Georgia'>Georgia</option>
                    <option value='Germany'>Germany</option>
                    <option value='Ghana'>Ghana</option>
                    <option value='Greece'>Greece</option>
                    <option value='Grenada'>Grenada</option>
                    <option value='Guatemala'>Guatemala</option>
                    <option value='Guinea'>Guinea</option>
                    <option value='Guinea-Bissau'>Guinea-Bissau</option>
                    <option value='Guyana'>Guyana</option>
                    <option value='Haiti'>Haiti</option>
                    <option value='Honduras'>Honduras</option>
                    <option value='Hungary'>Hungary</option>
                    <option value='Iceland'>Iceland</option>
                    <option value='India'>India</option>
                    <option value='Indonesia'>Indonesia</option>
                    <option value='Iran'>Iran</option>
                    <option value='Iraq'>Iraq</option>
                    <option value='Ireland'>Ireland</option>
                    <option value='Israel'>Israel</option>
                    <option value='Italy'>Italy</option>
                    <option value='Jamaica'>Jamaica</option>
                    <option value='Japan'>Japan</option>
                    <option value='Jordan'>Jordan</option>
                    <option value='Kazakhstan'>Kazakhstan</option>
                    <option value='Kenya'>Kenya</option>
                    <option value='Kiribati'>Kiribati</option>
                    <option value='Kuwait'>Kuwait</option>
                    <option value='Kyrgyzstan'>Kyrgyzstan</option>
                    <option value='Laos'>Laos</option>
                    <option value='Latvia'>Latvia</option>
                    <option value='Lebanon'>Lebanon</option>
                    <option value='Lesotho'>Lesotho</option>
                    <option value='Liberia'>Liberia</option>
                    <option value='Libya'>Libya</option>
                    <option value='Liechtenstein'>Liechtenstein</option>
                    <option value='Lithuania'>Lithuania</option>
                    <option value='Luxembourg'>Luxembourg</option>
                    <option value='Madagascar'>Madagascar</option>
                    <option value='Malawi'>Malawi</option>
                    <option value='Malaysia'>Malaysia</option>
                    <option value='Maldives'>Maldives</option>
                    <option value='Mali'>Mali</option>
                    <option value='Malta'>Malta</option>
                    <option value='Marshall Islands'>Marshall Islands</option>
                    <option value='Mauritania'>Mauritania</option>
                    <option value='Mauritius'>Mauritius</option>
                    <option value='Mexico'>Mexico</option>
                    <option value='Micronesia'>Micronesia</option>
                    <option value='Moldova'>Moldova</option>
                    <option value='Monaco'>Monaco</option>
                    <option value='Mongolia'>Mongolia</option>
                    <option value='Montenegro'>Montenegro</option>
                    <option value='Morocco'>Morocco</option>
                    <option value='Mozambique'>Mozambique</option>
                    <option value='Myanmar'>Myanmar</option>
                    <option value='Namibia'>Namibia</option>
                    <option value='Nauru'>Nauru</option>
                    <option value='Nepal'>Nepal</option>
                    <option value='Netherlands'>Netherlands</option>
                    <option value='New Zealand'>New Zealand</option>
                    <option value='Nicaragua'>Nicaragua</option>
                    <option value='Niger'>Niger</option>
                    <option value='Nigeria'>Nigeria</option>
                    <option value='North Korea'>North Korea</option>
                    <option value='North Macedonia'>North Macedonia</option>
                    <option value='Norway'>Norway</option>
                    <option value='Oman'>Oman</option>
                    <option value='Pakistan'>Pakistan</option>
                    <option value='Palau'>Palau</option>
                    <option value='Panama'>Panama</option>
                    <option value='Papua New Guinea'>Papua New Guinea</option>
                    <option value='Paraguay'>Paraguay</option>
                    <option value='Peru'>Peru</option>
                    <option value='Philippines'>Philippines</option>
                    <option value='Poland'>Poland</option>
                    <option value='Portugal'>Portugal</option>
                    <option value='Qatar'>Qatar</option>
                    <option value='Romania'>Romania</option>
                    <option value='Russia'>Russia</option>
                    <option value='Rwanda'>Rwanda</option>
                    <option value='Saint Kitts and Nevis'>
                      Saint Kitts and Nevis
                    </option>
                    <option value='Saint Lucia'>Saint Lucia</option>
                    <option value='Saint Vincent and the Grenadines'>
                      Saint Vincent and the Grenadines
                    </option>
                    <option value='Samoa'>Samoa</option>
                    <option value='San Marino'>San Marino</option>
                    <option value='Sao Tome and Principe'>
                      Sao Tome and Principe
                    </option>
                    <option value='Saudi Arabia'>Saudi Arabia</option>
                    <option value='Senegal'>Senegal</option>
                    <option value='Serbia'>Serbia</option>
                    <option value='Seychelles'>Seychelles</option>
                    <option value='Sierra Leone'>Sierra Leone</option>
                    <option value='Singapore'>Singapore</option>
                    <option value='Slovakia'>Slovakia</option>
                    <option value='Slovenia'>Slovenia</option>
                    <option value='Solomon Islands'>Solomon Islands</option>
                    <option value='Somalia'>Somalia</option>
                    <option value='South Africa'>South Africa</option>
                    <option value='South Korea'>South Korea</option>
                    <option value='South Sudan'>South Sudan</option>
                    <option value='Spain'>Spain</option>
                    <option value='Sri Lanka'>Sri Lanka</option>
                    <option value='Sudan'>Sudan</option>
                    <option value='Suriname'>Suriname</option>
                    <option value='Sweden'>Sweden</option>
                    <option value='Switzerland'>Switzerland</option>
                    <option value='Syria'>Syria</option>
                    <option value='Taiwan'>Taiwan</option>
                    <option value='Tajikistan'>Tajikistan</option>
                    <option value='Tanzania'>Tanzania</option>
                    <option value='Thailand'>Thailand</option>
                    <option value='Timor-Leste'>Timor-Leste</option>
                    <option value='Togo'>Togo</option>
                    <option value='Tonga'>Tonga</option>
                    <option value='Trinidad and Tobago'>
                      Trinidad and Tobago
                    </option>
                    <option value='Tunisia'>Tunisia</option>
                    <option value='Turkey'>Turkey</option>
                    <option value='Turkmenistan'>Turkmenistan</option>
                    <option value='Tuvalu'>Tuvalu</option>
                    <option value='Uganda'>Uganda</option>
                    <option value='Ukraine'>Ukraine</option>
                    <option value='United Arab Emirates'>
                      United Arab Emirates
                    </option>
                    <option value='United Kingdom'>United Kingdom</option>
                    <option value='United States'>United States</option>
                    <option value='Uruguay'>Uruguay</option>
                    <option value='Uzbekistan'>Uzbekistan</option>
                    <option value='Vanuatu'>Vanuatu</option>
                    <option value='Vatican City'>Vatican City</option>
                    <option value='Venezuela'>Venezuela</option>
                    <option value='Vietnam'>Vietnam</option>
                    <option value='Yemen'>Yemen</option>
                    <option value='Zambia'>Zambia</option>
                    <option value='Zimbabwe'>Zimbabwe</option>
                    {/* Add more countries as needed */}
                  </select>
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
                  * This is a booking request. Yoya Coffee ☕ will contact you
                  within 24 hours to confirm availability and finalize your
                  reservation.
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
                Yoya Coffee ☕ will contact you within 24 hours to confirm your
                booking details.
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
