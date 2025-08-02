// pages/api/booking.js - Next.js API Route with Google Sheets Integration and Colors
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
    console.log('=== Booking API Called ===')
    console.log('Body:', req.body)
    console.log('Environment:', process.env.NODE_ENV)

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
      console.log('=== Loading Google Sheets Credentials ===')

      let credentials

      // Load credentials based on environment
      if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
        // Environment variable exists (production or local with env)
        console.log('Loading credentials from environment variable')
        credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS)

        // FIX: Convert \\n to actual newlines for production
        if (
          credentials.private_key &&
          credentials.private_key.includes('\\n')
        ) {
          console.log('Converting escaped newlines to actual newlines')
          credentials.private_key = credentials.private_key.replace(
            /\\n/g,
            '\n'
          )
        }
      } else {
        // Fallback to local file (development only)
        console.log('Loading credentials from file (development)')
        const fs = require('fs')
        const path = require('path')
        credentials = JSON.parse(
          fs.readFileSync(
            path.join(process.cwd(), 'my-sheets-app-467604-764e3b37e3b1.json'),
            'utf8'
          )
        )
      }

      console.log('Credentials loaded successfully')
      console.log('Client email:', credentials.client_email)
      console.log('Private key length:', credentials.private_key.length)
      console.log(
        'Private key starts with:',
        credentials.private_key.substring(0, 30)
      )
      console.log(
        'Private key has proper newlines:',
        credentials.private_key.includes('\n')
      )

      if (!credentials.client_email || !credentials.private_key) {
        throw new Error('Google Sheets credentials not configured properly')
      }

      // Create JWT client with proper private key formatting
      console.log('Creating JWT client...')
      const auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key, // Should now have proper \n characters
        ['https://www.googleapis.com/auth/spreadsheets']
      )

      // Authorize the client
      console.log('Authorizing JWT client...')
      await auth.authorize()
      console.log('JWT authorization successful')

      // Create Google Sheets API client
      const sheets = google.sheets({ version: 'v4', auth })

      // Prepare data for Google Sheets
      const now = new Date()
      const humanReadableDate = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })

      const bookingId = `T-2025-${Math.floor(Math.random() * 900) + 100}` // 3 digit random number

      const rowData = [
        bookingId, // ID
        fullName, // Name
        email, // Email
        phone, // Phone
        req.body.age || 'Not specified', // Age
        numberOfPeople || '1', // Group size
        selectedPackage || 'Not specified', // Selected Tours
        'Pending', // Status (Column H - this will be colored red)
        humanReadableDate, // Created at
        humanReadableDate, // Updated at (same as created for new booking)
      ]

      console.log('Writing to Google Sheets...')

      // Step 1: Append the data to get the row number
      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: '1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA',
        range: 'Sheet1!A:J',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [rowData],
        },
      })

      console.log('Data written successfully:', appendResponse.data.updates)

      // Step 2: Get the row number that was just added
      const updatedRange = appendResponse.data.updates.updatedRange
      const rowNumber = parseInt(updatedRange.match(/(\d+)$/)[0]) // Extract row number from range like "Sheet1!A2:J2"

      console.log('Added to row number:', rowNumber)

      // Step 3: Apply red background color to the Status column (Column H)
      const colorRequest = {
        spreadsheetId: '1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA',
        resource: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: 0, // First sheet (Sheet1)
                  startRowIndex: rowNumber - 1, // 0-indexed, so subtract 1
                  endRowIndex: rowNumber, // End at the same row
                  startColumnIndex: 7, // Column H (0-indexed, so H = 7)
                  endColumnIndex: 8, // End at column H
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 1.0, // Full red
                      green: 0.8, // Light red background
                      blue: 0.8, // Light red background
                    },
                    textFormat: {
                      foregroundColor: {
                        red: 0.8, // Dark red text
                        green: 0.0,
                        blue: 0.0,
                      },
                      bold: true,
                    },
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)',
              },
            },
          ],
        },
      }

      console.log('Applying red color to Status column...')
      const colorResponse = await sheets.spreadsheets.batchUpdate(colorRequest)
      console.log('Color applied successfully')

      sheetsResponse = {
        ...appendResponse.data,
        colorUpdate: 'Red color applied to Pending status',
      }
    } catch (sheetsError) {
      console.error('Google Sheets error:', sheetsError.message)
      console.error('Error details:', sheetsError)

      // Additional debugging for JWT errors
      if (
        sheetsError.message.includes('invalid_grant') ||
        sheetsError.message.includes('JWT')
      ) {
        console.error('JWT Signature Error - Check private key format!')
        console.error(
          'Environment variable exists:',
          !!process.env.GOOGLE_SHEETS_CREDENTIALS
        )
        if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
          const testCreds = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS)
          console.error(
            'Private key preview:',
            testCreds.private_key
              ? testCreds.private_key.substring(0, 50)
              : 'MISSING'
          )
        }
      }

      // Continue without sheets integration
    }

    // Success response - Use the same ID format as Google Sheets
    const responseBookingId = `T-2025-${Math.floor(Math.random() * 900) + 100}`

    const response = {
      success: true,
      message: 'Booking received successfully!',
      data: {
        bookingId: responseBookingId,
        customerInfo: {
          fullName,
          email,
          phone,
          age: req.body.age || 'Not specified',
          selectedPackage,
          numberOfPeople: numberOfPeople || '1',
        },
        timestamp: new Date().toISOString(),
        status: 'Pending',
        sheetsResponse: sheetsResponse
          ? 'Data saved to Google Sheets with red status color'
          : 'Local booking only',
      },
      meta: {
        apiVersion: '1.0.0',
        endpoint: '/api/booking',
        environment: process.env.NODE_ENV,
        sheetsEnabled: !!sheetsResponse,
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
