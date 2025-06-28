import React, { useState } from 'react'

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: 1,
    date: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form data submitted:', formData)
    alert('Your coffee trip has been booked!')
  }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='max-w-md w-full bg-white rounded-lg shadow-md p-8'>
        <h2 className='text-2xl font-bold text-center text-gray-800 mb-8'>
          Book Your Coffee Trip
        </h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label
              htmlFor='name'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Full Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Email Address
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='guests'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Number of Guests
            </label>
            <input
              type='number'
              id='guests'
              name='guests'
              min='1'
              value={formData.guests}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>
          <div className='mb-6'>
            <label
              htmlFor='date'
              className='block text-gray-700 text-sm font-bold mb-2'
            >
              Date
            </label>
            <input
              type='date'
              id='date'
              name='date'
              value={formData.date}
              onChange={handleChange}
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              required
            />
          </div>
          <div className='flex items-center justify-center'>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            >
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingForm
