// pages/api/booking.js - Next.js API Route with Clickable Email & Phone Links + Country Column
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

    const { fullName, email, phone, selectedPackage, numberOfPeople, country } =
      req.body

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
        console.log('Loading credentials from environment variable')
        credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS)

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

      if (!credentials.client_email || !credentials.private_key) {
        throw new Error('Google Sheets credentials not configured properly')
      }

      // Create JWT client
      console.log('Creating JWT client...')
      const auth = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ['https://www.googleapis.com/auth/spreadsheets']
      )

      console.log('Authorizing JWT client...')
      await auth.authorize()
      console.log('JWT authorization successful')

      const sheets = google.sheets({ version: 'v4', auth })
      const spreadsheetId = '1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA'

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

      const bookingId = `T-2025-${Math.floor(Math.random() * 900) + 100}`

      // Format phone number for better calling (remove spaces and special chars for tel: link)
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')

      const rowData = [
        bookingId, // A: ID
        fullName, // B: Name
        email, // C: Email (will be clickable)
        phone, // D: Phone (will be clickable)
        req.body.age || 'Not specified', // E: Age
        country || 'Not specified', // F: Country (NEW - will be bold)
        numberOfPeople || '1', // G: Group size
        selectedPackage || 'Not specified', // H: Selected Tours (will be bold)
        'Pending', // I: Status (will have dropdown)
        humanReadableDate, // J: Created at
        humanReadableDate, // K: Updated at
      ]

      console.log('Writing to Google Sheets...')

      // Step 1: Append the data
      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: 'Sheet1!A:K', // Updated range to include K column
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [rowData],
        },
      })

      console.log('Data written successfully')

      // Step 2: Get the row number that was just added
      const updatedRange = appendResponse.data.updates.updatedRange
      const rowNumber = parseInt(updatedRange.match(/(\d+)$/)[0])
      console.log('Added to row number:', rowNumber)

      // Step 3: Add clickable links for email and phone + formatting
      const linkRequest = {
        spreadsheetId: spreadsheetId,
        resource: {
          requests: [
            // Make email clickable (Column C)
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 2, // Column C (Email)
                  endColumnIndex: 3,
                },
                cell: {
                  userEnteredValue: {
                    formulaValue: `=HYPERLINK("mailto:${email}?subject=Ethiopian Coffee Tour Booking - ${bookingId}&body=Dear ${fullName},%0A%0AThank you for your booking inquiry.%0A%0ABest regards,%0AEthiopian Coffee Tours Team", "${email}")`,
                  },
                  userEnteredFormat: {
                    textFormat: {
                      foregroundColor: {
                        red: 0.0,
                        green: 0.0,
                        blue: 0.8, // Blue color for email link
                      },
                      underline: true,
                      bold: false,
                    },
                  },
                },
                fields: 'userEnteredValue,userEnteredFormat.textFormat',
              },
            },
            // Make phone clickable (Column D)
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 3, // Column D (Phone)
                  endColumnIndex: 4,
                },
                cell: {
                  userEnteredValue: {
                    formulaValue: `=HYPERLINK("tel:${cleanPhone}", "${phone}")`,
                  },
                  userEnteredFormat: {
                    textFormat: {
                      foregroundColor: {
                        red: 0.0,
                        green: 0.6,
                        blue: 0.0, // Green color for phone link
                      },
                      underline: true,
                      bold: false,
                    },
                  },
                },
                fields: 'userEnteredValue,userEnteredFormat.textFormat',
              },
            },
            // Bold the Country column (F) - NEW
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 5, // Column F (Country)
                  endColumnIndex: 6,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true,
                      foregroundColor: {
                        red: 0.6,
                        green: 0.0,
                        blue: 0.6, // Purple color for country
                      },
                    },
                    backgroundColor: {
                      red: 0.98,
                      green: 0.9,
                      blue: 1.0, // Light purple background
                    },
                    horizontalAlignment: 'CENTER',
                  },
                },
                fields:
                  'userEnteredFormat(textFormat,backgroundColor,horizontalAlignment)',
              },
            },
            // Bold the Selected Tours column (H) - Updated column index
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 7, // Column H (Selected Tours) - Updated from 6 to 7
                  endColumnIndex: 8,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true,
                      foregroundColor: {
                        red: 0.0,
                        green: 0.4,
                        blue: 0.8, // Blue color for tour package
                      },
                    },
                    backgroundColor: {
                      red: 0.9,
                      green: 0.95,
                      blue: 1.0, // Light blue background
                    },
                  },
                },
                fields: 'userEnteredFormat(textFormat,backgroundColor)',
              },
            },
            // Add dropdown validation for Status column (I) - Updated column index
            {
              setDataValidation: {
                range: {
                  sheetId: 0,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 8, // Column I (Status) - Updated from 7 to 8
                  endColumnIndex: 9,
                },
                rule: {
                  condition: {
                    type: 'ONE_OF_LIST',
                    values: [
                      { userEnteredValue: 'Pending' },
                      { userEnteredValue: 'Under Review' },
                      { userEnteredValue: 'Confirmed' },
                      { userEnteredValue: 'Completed' },
                      { userEnteredValue: 'Cancelled' },
                    ],
                  },
                  showCustomUi: true,
                  strict: true,
                },
              },
            },
            // Format Status column with conditional colors (I) - Updated column index
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 8, // Column I (Status) - Updated from 7 to 8
                  endColumnIndex: 9,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 1.0, // Red background for Pending
                      green: 0.8,
                      blue: 0.8,
                    },
                    textFormat: {
                      foregroundColor: {
                        red: 0.8,
                        green: 0.0,
                        blue: 0.0,
                      },
                      bold: true,
                    },
                    horizontalAlignment: 'CENTER',
                  },
                },
                fields:
                  'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
              },
            },
            // Format the entire row with borders - Updated range
            {
              updateBorders: {
                range: {
                  sheetId: 0,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 0,
                  endColumnIndex: 11, // Updated from 10 to 11 for new column
                },
                top: {
                  style: 'SOLID',
                  width: 1,
                  color: { red: 0.8, green: 0.8, blue: 0.8 },
                },
                bottom: {
                  style: 'SOLID',
                  width: 1,
                  color: { red: 0.8, green: 0.8, blue: 0.8 },
                },
                left: {
                  style: 'SOLID',
                  width: 1,
                  color: { red: 0.8, green: 0.8, blue: 0.8 },
                },
                right: {
                  style: 'SOLID',
                  width: 1,
                  color: { red: 0.8, green: 0.8, blue: 0.8 },
                },
              },
            },
          ],
        },
      }

      console.log('Applying formatting, links, and dropdown validation...')
      await sheets.spreadsheets.batchUpdate(linkRequest)
      console.log('Links and formatting applied successfully')

      // Step 4: Add conditional formatting rules for different statuses - Updated column indices
      const conditionalFormatRequest = {
        spreadsheetId: spreadsheetId,
        resource: {
          requests: [
            // Pending - Red
            {
              addConditionalFormatRule: {
                rule: {
                  ranges: [
                    { sheetId: 0, startColumnIndex: 8, endColumnIndex: 9 }, // Updated from 7,8 to 8,9
                  ],
                  booleanRule: {
                    condition: {
                      type: 'TEXT_EQ',
                      values: [{ userEnteredValue: 'Pending' }],
                    },
                    format: {
                      backgroundColor: { red: 1.0, green: 0.8, blue: 0.8 },
                      textFormat: {
                        bold: true,
                        foregroundColor: { red: 0.8, green: 0.0, blue: 0.0 },
                      },
                    },
                  },
                },
                index: 0,
              },
            },
            // Under Review - Orange
            {
              addConditionalFormatRule: {
                rule: {
                  ranges: [
                    { sheetId: 0, startColumnIndex: 8, endColumnIndex: 9 }, // Updated from 7,8 to 8,9
                  ],
                  booleanRule: {
                    condition: {
                      type: 'TEXT_EQ',
                      values: [{ userEnteredValue: 'Under Review' }],
                    },
                    format: {
                      backgroundColor: { red: 1.0, green: 0.9, blue: 0.7 },
                      textFormat: {
                        bold: true,
                        foregroundColor: { red: 0.8, green: 0.4, blue: 0.0 },
                      },
                    },
                  },
                },
                index: 1,
              },
            },
            // Confirmed - Light Green
            {
              addConditionalFormatRule: {
                rule: {
                  ranges: [
                    { sheetId: 0, startColumnIndex: 8, endColumnIndex: 9 }, // Updated from 7,8 to 8,9
                  ],
                  booleanRule: {
                    condition: {
                      type: 'TEXT_EQ',
                      values: [{ userEnteredValue: 'Confirmed' }],
                    },
                    format: {
                      backgroundColor: { red: 0.8, green: 1.0, blue: 0.8 },
                      textFormat: {
                        bold: true,
                        foregroundColor: { red: 0.0, green: 0.6, blue: 0.0 },
                      },
                    },
                  },
                },
                index: 2,
              },
            },
            // Completed - Green
            {
              addConditionalFormatRule: {
                rule: {
                  ranges: [
                    { sheetId: 0, startColumnIndex: 8, endColumnIndex: 9 }, // Updated from 7,8 to 8,9
                  ],
                  booleanRule: {
                    condition: {
                      type: 'TEXT_EQ',
                      values: [{ userEnteredValue: 'Completed' }],
                    },
                    format: {
                      backgroundColor: { red: 0.7, green: 0.9, blue: 0.7 },
                      textFormat: {
                        bold: true,
                        foregroundColor: { red: 0.0, green: 0.4, blue: 0.0 },
                      },
                    },
                  },
                },
                index: 3,
              },
            },
            // Cancelled - Gray
            {
              addConditionalFormatRule: {
                rule: {
                  ranges: [
                    { sheetId: 0, startColumnIndex: 8, endColumnIndex: 9 }, // Updated from 7,8 to 8,9
                  ],
                  booleanRule: {
                    condition: {
                      type: 'TEXT_EQ',
                      values: [{ userEnteredValue: 'Cancelled' }],
                    },
                    format: {
                      backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                      textFormat: {
                        bold: true,
                        foregroundColor: { red: 0.4, green: 0.4, blue: 0.4 },
                      },
                    },
                  },
                },
                index: 4,
              },
            },
          ],
        },
      }

      try {
        console.log('Adding conditional formatting rules...')
        await sheets.spreadsheets.batchUpdate(conditionalFormatRequest)
        console.log('Conditional formatting added')
      } catch (conditionalError) {
        console.log('Conditional formatting may already exist, skipping...')
      }

      sheetsResponse = {
        ...appendResponse.data,
        formatting:
          'Applied clickable links, dropdown, colors, country column, and bold formatting',
        rowNumber: rowNumber,
        emailLink: `mailto:${email}`,
        phoneLink: `tel:${cleanPhone}`,
      }
    } catch (sheetsError) {
      console.error('Google Sheets error:', sheetsError.message)
      console.error('Error details:', sheetsError)
    }

    // Success response
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
          country: country || 'Not specified', // Added country to response
          selectedPackage,
          numberOfPeople: numberOfPeople || '1',
        },
        timestamp: new Date().toISOString(),
        status: 'Pending',
        sheetsResponse: sheetsResponse
          ? 'Data saved with clickable email/phone links, country column, and formatting'
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
