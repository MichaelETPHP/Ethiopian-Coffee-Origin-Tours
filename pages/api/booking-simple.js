// api/booking-simple.js - Minimal booking API (no Google Sheets)
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
      message: 'Only POST requests are allowed',
    })
  }

  try {
    console.log('📝 Simple booking submission started')

    const bookingData = req.body
    console.log('📋 Received booking data:', bookingData)

    // Basic validation
    if (!bookingData.fullName || !bookingData.email || !bookingData.phone) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Full name, email, and phone are required',
      })
    }

    // Simulate success response
    res.status(200).json({
      success: true,
      message: 'Booking submitted successfully (simple version)',
      data: {
        bookingId: Date.now(),
        timestamp: new Date().toISOString(),
        bookingData: bookingData,
        sheetsSuccess: false,
        sheetsResponse: null,
      },
    })
  } catch (error) {
    console.error('❌ Error in simple booking handler:', error)

    res.status(500).json({
      error: 'Internal server error',
      message:
        'An error occurred while processing your booking. Please try again.',
    })
  }
}
