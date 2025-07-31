// api/bookings.js - Vercel serverless function for booking submissions
import { createBooking, checkDuplicateBooking } from '../lib/sheets.js'

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      fullName,
      email,
      phone,
      age,
      country,
      bookingType,
      numberOfPeople,
      selectedPackage,
    } = req.body

    // Basic validation
    if (
      !fullName ||
      !email ||
      !phone ||
      !age ||
      !country ||
      !bookingType ||
      !selectedPackage
    ) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'All fields are required',
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
      })
    }

    // Validate age
    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      return res.status(400).json({
        error: 'Invalid age. Must be between 1 and 120',
      })
    }

    // Validate booking type
    if (!['individual', 'group'].includes(bookingType)) {
      return res.status(400).json({
        error: 'Invalid booking type. Must be "individual" or "group"',
      })
    }

    // Validate group size for group bookings
    if (
      bookingType === 'group' &&
      (!numberOfPeople || numberOfPeople < 2 || numberOfPeople > 20)
    ) {
      return res.status(400).json({
        error: 'Group bookings must have 2-20 people',
      })
    }

    // Check for duplicate bookings
    const existingBooking = await checkDuplicateBooking(email, selectedPackage)
    if (existingBooking) {
      return res.status(409).json({
        error:
          'A booking with this email already exists for the selected package.',
      })
    }

    // Create booking in Google Sheets
    const booking = await createBooking({
      fullName,
      age: ageNum,
      email,
      phone,
      country,
      bookingType,
      numberOfPeople: bookingType === 'group' ? numberOfPeople : 1,
      selectedPackage,
    })

    // Return success response
    res.status(201).json({
      message: 'Booking submitted successfully',
      bookingId: booking.id,
    })
  } catch (error) {
    console.error('Booking submission error:', error)

    // Return a proper JSON error response
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process booking. Please try again later.',
    })
  }
}
