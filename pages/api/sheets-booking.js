// pages/api/sheets-booking.js - Next.js API Route with Google Sheets Integration
import { google } from 'googleapis'

export default async function handler(req, res) {
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
    console.log('=== Sheets Booking API Called ===')
    console.log('Body:', req.body)

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

    // Google Sheets Integration
    let sheetsResponse = null
    try {
      // Load credentials from environment variable
      const credentials = JSON.parse(
        process.env.GOOGLE_SHEETS_CREDENTIALS || '{}'
      )

      if (!credentials.client_email || !credentials.private_key) {
        console.log(
          'Google Sheets credentials not available, skipping sheets integration'
        )
        throw new Error('Google Sheets credentials not configured')
      }

      // Create JWT client
      const auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/spreadsheets']
      )

      // Authorize the client
      await auth.authorize()

      // Create Google Sheets API client
      const sheets = google.sheets({ version: 'v4', auth })

      // Prepare data for Google Sheets
      const rowData = [
        new Date().toISOString(), // Timestamp
        fullName,
        email,
        phone,
        selectedPackage || 'Not specified',
        numberOfPeople || '1',
        'New Booking',
      ]

      // Append to Google Sheet
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: '1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA',
        range: 'Sheet1!A:G',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [rowData],
        },
      })

      sheetsResponse = response.data
      console.log('Google Sheets response:', sheetsResponse)
    } catch (sheetsError) {
      console.error('Google Sheets error:', sheetsError.message)
      // Continue without sheets integration
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
        sheetsResponse: sheetsResponse
          ? 'Data saved to Google Sheets'
          : 'Local booking only',
      },
      meta: {
        apiVersion: '1.0.0',
        endpoint: '/api/sheets-booking',
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
