import React, { useState } from 'react'
import { submitBooking } from '../lib/api-utils'

interface BookingFormData {
  fullName: string
  email: string
  phone: string
  age: string
  country: string
  bookingType: 'individual' | 'group'
  numberOfPeople: number
  selectedPackage: string
}

const BookingForm = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    country: '',
    bookingType: 'individual',
    numberOfPeople: 1,
    selectedPackage: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const tourPackages = [
    'Yirgacheffe Coffee Tour',
    'Sidamo Coffee Experience',
    'Harar Coffee Adventure',
    'Complete Ethiopian Coffee Journey',
    'Custom Coffee Tour',
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const result = await submitBooking(formData)

      setSubmitStatus('success')
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        country: '',
        bookingType: 'individual',
        numberOfPeople: 1,
        selectedPackage: '',
      })
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Network error. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center py-12 px-4'>
      <div className='max-w-2xl w-full bg-white rounded-xl shadow-2xl p-8'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-gray-800 mb-2'>
            Book Your Ethiopian Coffee Tour
          </h2>
          <p className='text-gray-600'>
            Experience the world's finest coffee from its birthplace
          </p>
        </div>

        {submitStatus === 'success' && (
          <div className='mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg'>
            <h3 className='font-bold'>Booking Submitted Successfully!</h3>
            <p>
              We've sent a confirmation email to your address. We'll contact you
              soon to confirm your tour details.
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className='mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg'>
            <h3 className='font-bold'>Booking Submission Failed</h3>
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Personal Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label
                htmlFor='fullName'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Full Name *
              </label>
              <input
                type='text'
                id='fullName'
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                required
              />
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Email Address *
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                required
              />
            </div>

            <div>
              <label
                htmlFor='phone'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Phone Number *
              </label>
              <input
                type='tel'
                id='phone'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                required
              />
            </div>

            <div>
              <label
                htmlFor='age'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Age *
              </label>
              <input
                type='number'
                id='age'
                name='age'
                min='1'
                max='120'
                value={formData.age}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                required
              />
            </div>

            <div>
              <label
                htmlFor='country'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Country *
              </label>
              <input
                type='text'
                id='country'
                name='country'
                value={formData.country}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                required
              />
            </div>

            <div>
              <label
                htmlFor='selectedPackage'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Tour Package *
              </label>
              <select
                id='selectedPackage'
                name='selectedPackage'
                value={formData.selectedPackage}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                required
              >
                <option value=''>Select a tour package</option>
                {tourPackages.map((package_) => (
                  <option key={package_} value={package_}>
                    {package_}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Booking Type */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Booking Type *
            </label>
            <div className='flex space-x-4'>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='bookingType'
                  value='individual'
                  checked={formData.bookingType === 'individual'}
                  onChange={handleChange}
                  className='mr-2'
                />
                Individual
              </label>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='bookingType'
                  value='group'
                  checked={formData.bookingType === 'group'}
                  onChange={handleChange}
                  className='mr-2'
                />
                Group
              </label>
            </div>
          </div>

          {/* Number of People (only show for group bookings) */}
          {formData.bookingType === 'group' && (
            <div>
              <label
                htmlFor='numberOfPeople'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Number of People *
              </label>
              <input
                type='number'
                id='numberOfPeople'
                name='numberOfPeople'
                min='2'
                max='20'
                value={formData.numberOfPeople}
                onChange={handleChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <div className='pt-4'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-green-600 text-white py-3 px-6 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isSubmitting ? 'Submitting...' : 'Book Your Coffee Tour'}
            </button>
          </div>

          <p className='text-sm text-gray-500 text-center'>
            By submitting this form, you agree to our terms and conditions.
          </p>
        </form>
      </div>
    </div>
  )
}

export default BookingForm
