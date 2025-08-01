// dev-server.js - Development server with Google Sheets integration
import express from 'express'
import cors from 'cors'
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 4040

// Middleware
app.use(cors())
app.use(express.json())

// Google Sheets setup
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const SPREADSHEET_ID = '1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA' // Replace with your actual spreadsheet ID from Google Sheets URL
const RANGE = 'Sheet1!A:Z' // Adjust based on your sheet name

// Load credentials
let credentials
try {
  const credentialsPath = path.join(
    __dirname,
    'my-sheets-app-467604-764e3b37e3b1.json'
  )
  console.log('📁 Loading credentials from:', credentialsPath)

  if (!fs.existsSync(credentialsPath)) {
    throw new Error(`Credentials file not found: ${credentialsPath}`)
  }

  const credentialsData = fs.readFileSync(credentialsPath, 'utf8')
  credentials = JSON.parse(credentialsData)

  console.log('✅ Credentials loaded successfully')
  console.log('📧 Service account email:', credentials.client_email)
} catch (error) {
  console.error('❌ Failed to load credentials:', error.message)
  process.exit(1)
}

// Create JWT client
let auth
try {
  // Use GoogleAuth with service account credentials
  auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, 'my-sheets-app-467604-764e3b37e3b1.json'),
    scopes: SCOPES,
  })
  console.log('🔐 GoogleAuth client created successfully')
  console.log('📧 Using service account:', credentials.client_email)
} catch (error) {
  console.error('❌ Failed to create GoogleAuth client:', error.message)
  console.error('📝 Error details:', error)
  process.exit(1)
}

// Initialize Google Sheets API
let sheets
try {
  sheets = google.sheets({ version: 'v4', auth })
  console.log('📊 Google Sheets API initialized successfully')
} catch (error) {
  console.error('❌ Failed to initialize Google Sheets API:', error.message)
  process.exit(1)
}

// Test authentication on startup
async function testAuth() {
  try {
    console.log('🔐 Testing Google Sheets authentication...')

    // Get the client
    const client = await auth.getClient()
    console.log('✅ GoogleAuth client obtained successfully')

    // Test access to the spreadsheet
    const testResponse = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    })
    console.log(
      '✅ Spreadsheet access confirmed:',
      testResponse.data.spreadsheetId
    )
    return true
  } catch (error) {
    console.error('❌ Google Sheets authentication failed:', error.message)
    console.log('💡 Make sure:')
    console.log('   1. The service account has access to the spreadsheet')
    console.log('   2. The spreadsheet ID is correct')
    console.log('   3. The credentials file is valid')
    console.log(
      '   4. The Google Sheets API is enabled in Google Cloud Console'
    )
    return false
  }
}

// API routes
app.post('/api/sheets-booking', async (req, res) => {
  try {
    console.log('📝 Received booking request:', req.body)

    // Basic validation
    if (!req.body.fullName || !req.body.email || !req.body.phone) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Full name, email, and phone are required',
      })
    }

    // Prepare data for Google Sheets
    const bookingData = [
      new Date().toISOString(), // Timestamp
      req.body.fullName,
      req.body.email,
      req.body.phone,
      req.body.age || '',
      req.body.country || '',
      req.body.bookingType || '',
      req.body.numberOfPeople || '',
      req.body.selectedPackage || '',
      'Submitted via API',
    ]

    // Log the booking data
    console.log('📊 Booking Data Received:')
    console.log('⏰ Timestamp:', bookingData[0])
    console.log('👤 Name:', bookingData[1])
    console.log('📧 Email:', bookingData[2])
    console.log('📞 Phone:', bookingData[3])
    console.log('🎂 Age:', bookingData[4])
    console.log('🌍 Country:', bookingData[5])
    console.log('📋 Booking Type:', bookingData[6])
    console.log('👥 Number of People:', bookingData[7])
    console.log('📦 Selected Package:', bookingData[8])

    // Write to Google Sheets (with fallback to local logging)
    console.log('📊 Writing to Google Sheets...')
    let sheetsSuccess = false
    let sheetsResponse = null

    try {
      // Ensure authentication
      const client = await auth.getClient()

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [bookingData],
        },
      })

      console.log('✅ Booking submitted to Google Sheets successfully')
      console.log('📊 Sheets Response:', response.data)
      sheetsSuccess = true
      sheetsResponse = response.data
    } catch (sheetsError) {
      console.log('⚠️ Google Sheets access failed, logging locally instead')
      console.log('📝 Error details:', sheetsError.message)
      console.log('📝 To fix Google Sheets access:')
      console.log(
        '   1. Share your spreadsheet with: sheet-access@my-sheets-app-467604.iam.gserviceaccount.com'
      )
      console.log('   2. Give it "Editor" permissions')
      console.log('   3. Restart the server')

      // Log to local file as backup
      const logEntry = {
        timestamp: new Date().toISOString(),
        bookingData: req.body,
        sheetsError: sheetsError.message,
        sheetsErrorCode: sheetsError.code || 'UNKNOWN',
      }

      // Append to local log file
      fs.appendFileSync(
        path.join(__dirname, 'bookings.log'),
        JSON.stringify(logEntry) + '\n'
      )

      console.log('📄 Booking logged to bookings.log file')
    }

    res.status(200).json({
      success: true,
      message: sheetsSuccess
        ? 'Booking submitted successfully to Google Sheets'
        : 'Booking submitted successfully (logged locally)',
      data: {
        bookingId: Date.now(),
        timestamp: new Date().toISOString(),
        bookingData: req.body,
        sheetsSuccess: sheetsSuccess,
        sheetsResponse: sheetsResponse,
      },
    })
  } catch (error) {
    console.error('❌ Error in sheets-booking handler:', error)

    // Log the error to local file
    const errorLogEntry = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      requestBody: req.body,
    }

    fs.appendFileSync(
      path.join(__dirname, 'errors.log'),
      JSON.stringify(errorLogEntry) + '\n'
    )

    res.status(500).json({
      error: 'Internal server error',
      message:
        'An error occurred while processing your booking. Please try again.',
    })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Development server is running with Google Sheets integration',
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Development server running on http://localhost:${PORT}`)
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/sheets-booking`)
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`)
  console.log(`📊 Google Sheets integration: ${SPREADSHEET_ID}`)

  // Test Google Sheets authentication
  testAuth().then((authSuccess) => {
    if (authSuccess) {
      console.log('🎉 Google Sheets integration is ready!')
    } else {
      console.log(
        '⚠️ Google Sheets integration failed - bookings will be logged locally'
      )
    }
  })
})
