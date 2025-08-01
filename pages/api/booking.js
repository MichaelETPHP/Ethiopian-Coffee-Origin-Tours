// pages/api/booking.js - Next.js API Route
export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      allowed: ['POST', 'OPTIONS'],
    })
  }

  try {
    console.log('=== Booking API Called ===')
    console.log('Body:', req.body)
    console.log('Headers:', req.headers)

    const { fullName, email, phone, selectedPackage, numberOfPeople } = req.body

    // Basic validation
    if (!fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        required: ['fullName', 'email', 'phone'],
        received: Object.keys(req.body),
      })
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      })
    }

    // Success response
    const bookingId = `TOUR-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`

    const response = {
      success: true,
      message: 'Booking received successfully!',
      data: {
        bookingId,
        customerInfo: {
          fullName,
          email,
          phone,
          selectedPackage,
          numberOfPeople: numberOfPeople || '1',
        },
        timestamp: new Date().toISOString(),
        status: 'confirmed',
      },
      meta: {
        apiVersion: '1.0.0',
        endpoint: '/api/booking',
      },
    }

    console.log('=== Sending Response ===')
    console.log(response)

    return res.status(200).json(response)
  } catch (error) {
    console.error('=== API Error ===')
    console.error('Error:', error.message)
    console.error('Stack:', error.stack)

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Something went wrong processing your booking',
      timestamp: new Date().toISOString(),
    })
  }
}
