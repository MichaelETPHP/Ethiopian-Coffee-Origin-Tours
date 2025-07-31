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
    console.log('📝 Booking submission started')
    console.log('🔧 Environment check:', {
      hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      nodeEnv: process.env.NODE_ENV,
    })

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

    console.log('📋 Received booking data:', {
      fullName,
      email,
      phone,
      age,
      country,
      bookingType,
      numberOfPeople,
      selectedPackage,
    })

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
      console.log('❌ Validation failed: Missing required fields')
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'All fields are required',
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log('❌ Validation failed: Invalid email format')
      return res.status(400).json({
        error: 'Invalid email format',
      })
    }

    // Validate age
    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      console.log('❌ Validation failed: Invalid age')
      return res.status(400).json({
        error: 'Invalid age. Must be between 1 and 120',
      })
    }

    // Validate booking type
    if (!['individual', 'group'].includes(bookingType)) {
      console.log('❌ Validation failed: Invalid booking type')
      return res.status(400).json({
        error: 'Invalid booking type. Must be "individual" or "group"',
      })
    }

    // Validate group size for group bookings
    if (
      bookingType === 'group' &&
      (!numberOfPeople || numberOfPeople < 2 || numberOfPeople > 20)
    ) {
      console.log('❌ Validation failed: Invalid group size')
      return res.status(400).json({
        error: 'Group bookings must have 2-20 people',
      })
    }

    console.log('✅ Validation passed, checking for duplicates...')

    // Check for duplicate bookings
    try {
      const existingBooking = await checkDuplicateBooking(
        email,
        selectedPackage
      )
      if (existingBooking) {
        console.log('❌ Duplicate booking found')
        return res.status(409).json({
          error:
            'A booking with this email already exists for the selected package.',
        })
      }
    } catch (duplicateError) {
      console.error('❌ Error checking for duplicates:', duplicateError)
      // Continue with booking creation even if duplicate check fails
    }

    console.log('✅ No duplicates found, creating booking...')

    // Create booking in Google Sheets
    try {
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

      console.log('✅ Booking created successfully:', booking.id)

      // Return success response
      res.status(201).json({
        message: 'Booking submitted successfully',
        bookingId: booking.id,
      })
    } catch (sheetsError) {
      console.error('❌ Google Sheets error:', sheetsError)
      res.status(500).json({
        error: 'Failed to save booking to Google Sheets',
        message: sheetsError.message || 'Database error occurred',
        details:
          process.env.NODE_ENV === 'development'
            ? sheetsError.stack
            : undefined,
      })
    }
  } catch (error) {
    console.error('❌ Unexpected error in booking submission:', error)
    console.error('❌ Error stack:', error.stack)

    // Return a proper JSON error response
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process booking. Please try again later.',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}
