// api/sheets-booking-commonjs.js - CommonJS version
const { google } = require('googleapis')

// Google Sheets setup
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const SPREADSHEET_ID = '1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA'
const RANGE = 'Sheet1!A:Z'

// Get credentials from environment variables
const getCredentials = () => {
  try {
    const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS
    if (!credentialsJson) {
      throw new Error('GOOGLE_SHEETS_CREDENTIALS environment variable not set')
    }

    const credentials = JSON.parse(credentialsJson)

    // Validate required fields
    const requiredFields = [
      'type',
      'project_id',
      'private_key_id',
      'private_key',
      'client_email',
      'client_id',
    ]
    const missingFields = requiredFields.filter((field) => !credentials[field])

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }

    return credentials
  } catch (error) {
    console.error('❌ Failed to parse credentials:', error.message)
    throw error
  }
}

module.exports = async function handler(req, res) {
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
    console.log('📝 Booking submission started')

    const bookingData = req.body
    console.log('📋 Received booking data:', bookingData)

    // Basic validation
    if (!bookingData.fullName || !bookingData.email || !bookingData.phone) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Full name, email, and phone are required',
      })
    }

    // Prepare data for Google Sheets
    const sheetsData = [
      new Date().toISOString(), // Timestamp
      bookingData.fullName,
      bookingData.email,
      bookingData.phone,
      bookingData.age || '',
      bookingData.country || '',
      bookingData.bookingType || '',
      bookingData.numberOfPeople || '',
      bookingData.selectedPackage || '',
      'Submitted via Vercel API',
    ]

    console.log('📊 Booking Data Prepared:', sheetsData)

    // Initialize Google Sheets integration
    let sheetsSuccess = false
    let sheetsResponse = null

    try {
      // Get credentials from environment
      const credentials = getCredentials()
      console.log('✅ Credentials loaded from environment')

      // Create JWT client
      const auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        SCOPES
      )

      console.log('🔐 JWT client created')

      // Authorize the client
      await auth.authorize()
      console.log('✅ JWT client authorized')

      // Initialize Google Sheets API
      const sheets = google.sheets({ version: 'v4', auth: auth })
      console.log('📊 Google Sheets API initialized')

      // Write to Google Sheets
      console.log('📊 Writing to Google Sheets...')
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [sheetsData],
        },
      })

      console.log('✅ Booking submitted to Google Sheets successfully')
      console.log('📊 Sheets Response:', response.data)
      sheetsSuccess = true
      sheetsResponse = response.data
    } catch (sheetsError) {
      console.log('⚠️ Google Sheets access failed, logging locally instead')
      console.log('📝 Error details:', sheetsError.message)

      if (sheetsError.message.includes('GOOGLE_SHEETS_CREDENTIALS')) {
        console.log('📝 Environment variable not set. To fix:')
        console.log(
          '   1. Go to Vercel dashboard > Settings > Environment Variables'
        )
        console.log(
          '   2. Add GOOGLE_SHEETS_CREDENTIALS with your service account JSON'
        )
        console.log('   3. Redeploy the project')
      } else {
        console.log('📝 To fix Google Sheets access:')
        console.log(
          '   1. Share your spreadsheet with: sheet-access@my-sheets-app-467604.iam.gserviceaccount.com'
        )
        console.log('   2. Give it "Editor" permissions')
        console.log(
          '   3. Ensure Google Sheets API is enabled in Google Cloud Console'
        )
      }

      // Log to local file as backup (not available on Vercel)
      console.log('📄 Booking logged to console (Vercel environment)')
    }

    res.status(200).json({
      success: true,
      message: sheetsSuccess
        ? 'Booking submitted successfully to Google Sheets'
        : 'Booking submitted successfully (logged locally)',
      data: {
        bookingId: Date.now(),
        timestamp: new Date().toISOString(),
        bookingData: bookingData,
        sheetsSuccess: sheetsSuccess,
        sheetsResponse: sheetsResponse,
      },
    })
  } catch (error) {
    console.error('❌ Error in sheets-booking handler:', error)

    res.status(500).json({
      error: 'Internal server error',
      message:
        'An error occurred while processing your booking. Please try again.',
    })
  }
}
