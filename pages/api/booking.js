// pages/api/booking.js - Next.js API Route with Header Management
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

      // Define headers in the correct order
      const expectedHeaders = [
        'ID',
        'Name',
        'Email',
        'Phone',
        'Age',
        'Group Size',
        'Country',
        'Selected Tour Package',
        'Status',
        'Created At',
        'Updated At',
      ]

      // Step 1: Check if headers exist and create them if needed
      console.log('Checking for existing headers...')

      try {
        const headerResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: spreadsheetId,
          range: 'Sheet1!A1:K1', // Check first row for headers
        })

        const existingHeaders = headerResponse.data.values
          ? headerResponse.data.values[0]
          : []
        console.log('Existing headers:', existingHeaders)

        // Check if headers are missing or incomplete
        if (
          !existingHeaders ||
          existingHeaders.length === 0 ||
          existingHeaders.length < expectedHeaders.length
        ) {
          console.log(
            'Headers missing or incomplete, creating/updating headers...'
          )

          // Create/update headers
          await sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            range: 'Sheet1!A1:K1',
            valueInputOption: 'RAW',
            resource: {
              values: [expectedHeaders],
            },
          })

          // Format headers with bold styling and colors
          const headerFormatRequest = {
            spreadsheetId: spreadsheetId,
            resource: {
              requests: [
                {
                  repeatCell: {
                    range: {
                      sheetId: 0,
                      startRowIndex: 0, // First row (headers)
                      endRowIndex: 1,
                      startColumnIndex: 0, // All columns A to K
                      endColumnIndex: 11,
                    },
                    cell: {
                      userEnteredFormat: {
                        backgroundColor: {
                          red: 0.2,
                          green: 0.3,
                          blue: 0.6, // Dark blue background
                        },
                        textFormat: {
                          foregroundColor: {
                            red: 1.0,
                            green: 1.0,
                            blue: 1.0, // White text
                          },
                          bold: true,
                          fontSize: 12,
                        },
                        horizontalAlignment: 'CENTER',
                        verticalAlignment: 'MIDDLE',
                      },
                    },
                    fields:
                      'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)',
                  },
                },
                // Add borders to header
                {
                  updateBorders: {
                    range: {
                      sheetId: 0,
                      startRowIndex: 0,
                      endRowIndex: 1,
                      startColumnIndex: 0,
                      endColumnIndex: 11,
                    },
                    top: {
                      style: 'SOLID',
                      width: 2,
                      color: { red: 0.1, green: 0.2, blue: 0.5 },
                    },
                    bottom: {
                      style: 'SOLID',
                      width: 2,
                      color: { red: 0.1, green: 0.2, blue: 0.5 },
                    },
                    left: {
                      style: 'SOLID',
                      width: 1,
                      color: { red: 0.1, green: 0.2, blue: 0.5 },
                    },
                    right: {
                      style: 'SOLID',
                      width: 1,
                      color: { red: 0.1, green: 0.2, blue: 0.5 },
                    },
                  },
                },
              ],
            },
          }

          await sheets.spreadsheets.batchUpdate(headerFormatRequest)
          console.log('Headers created and formatted successfully')
        } else {
          console.log('Headers already exist, proceeding with data insertion')
        }
      } catch (headerError) {
        console.log(
          'Error checking headers, will create them:',
          headerError.message
        )

        // Create headers if there was an error reading them
        await sheets.spreadsheets.values.update({
          spreadsheetId: spreadsheetId,
          range: 'Sheet1!A1:K1',
          valueInputOption: 'RAW',
          resource: {
            values: [expectedHeaders],
          },
        })
        console.log('Headers created after error')
      }

      // Prepare data for Google Sheets in the correct order
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
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')

      // Data in the exact order of headers
      const rowData = [
        bookingId, // A: ID
        fullName, // B: Name
        email, // C: Email (will be clickable)
        phone, // D: Phone (will be clickable)
        req.body.age || 'Not specified', // E: Age
        numberOfPeople || '1', // F: Group Size
        country || 'Not specified', // G: Country (will be bold)
        selectedPackage || 'Not specified', // H: Selected Tour Package (will be bold)
        'Pending', // I: Status (will have dropdown)
        humanReadableDate, // J: Created At
        humanReadableDate, // K: Updated At
      ]

      console.log('Writing booking data to Google Sheets...')

      // Step 2: Append the data
      const appendResponse = await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: 'Sheet1!A:K',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [rowData],
        },
      })

      console.log('Data written successfully')

      // Step 3: Get the row number that was just added
      const updatedRange = appendResponse.data.updates.updatedRange
      const rowNumber = parseInt(updatedRange.match(/(\d+)$/)[0])
      console.log('Added to row number:', rowNumber)

      // Step 4: Apply formatting to the new row
      const formatRequest = {
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
                      foregroundColor: { red: 0.0, green: 0.0, blue: 0.8 },
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
                      foregroundColor: { red: 0.0, green: 0.6, blue: 0.0 },
                      underline: true,
                      bold: false,
                    },
                  },
                },
                fields: 'userEnteredValue,userEnteredFormat.textFormat',
              },
            },
            // Bold the Country column (G)
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 6, // Column G (Country)
                  endColumnIndex: 7,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true,
                      foregroundColor: { red: 0.6, green: 0.0, blue: 0.6 },
                    },
                    backgroundColor: { red: 0.98, green: 0.9, blue: 1.0 },
                    horizontalAlignment: 'CENTER',
                  },
                },
                fields:
                  'userEnteredFormat(textFormat,backgroundColor,horizontalAlignment)',
              },
            },
            // Bold the Selected Tour Package column (H)
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 7, // Column H (Selected Tour Package)
                  endColumnIndex: 8,
                },
                cell: {
                  userEnteredFormat: {
                    textFormat: {
                      bold: true,
                      foregroundColor: { red: 0.0, green: 0.4, blue: 0.8 },
                    },
                    backgroundColor: { red: 0.9, green: 0.95, blue: 1.0 },
                  },
                },
                fields: 'userEnteredFormat(textFormat,backgroundColor)',
              },
            },
            // Add dropdown validation for Status column (I)
            {
              setDataValidation: {
                range: {
                  sheetId: 0,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 8, // Column I (Status)
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
            // Format Status column (I)
            {
              repeatCell: {
                range: {
                  sheetId: 0,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 8, // Column I (Status)
                  endColumnIndex: 9,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 1.0, green: 0.8, blue: 0.8 },
                    textFormat: {
                      foregroundColor: { red: 0.8, green: 0.0, blue: 0.0 },
                      bold: true,
                    },
                    horizontalAlignment: 'CENTER',
                  },
                },
                fields:
                  'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
              },
            },
            // Add borders to the entire row
            {
              updateBorders: {
                range: {
                  sheetId: 0,
                  startRowIndex: rowNumber - 1,
                  endRowIndex: rowNumber,
                  startColumnIndex: 0,
                  endColumnIndex: 11,
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

      console.log('Applying formatting...')
      await sheets.spreadsheets.batchUpdate(formatRequest)
      console.log('Formatting applied successfully')

      // Step 5: Add conditional formatting for status (only if not already added)
      try {
        const conditionalFormatRequest = {
          spreadsheetId: spreadsheetId,
          resource: {
            requests: [
              // Pending - Red
              {
                addConditionalFormatRule: {
                  rule: {
                    ranges: [
                      { sheetId: 0, startColumnIndex: 8, endColumnIndex: 9 },
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
                      { sheetId: 0, startColumnIndex: 8, endColumnIndex: 9 },
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
                      { sheetId: 0, startColumnIndex: 8, endColumnIndex: 9 },
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
                      { sheetId: 0, startColumnIndex: 8, endColumnIndex: 9 },
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
                      { sheetId: 0, startColumnIndex: 8, endColumnIndex: 9 },
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

        await sheets.spreadsheets.batchUpdate(conditionalFormatRequest)
        console.log('Conditional formatting added')
      } catch (conditionalError) {
        console.log('Conditional formatting may already exist, skipping...')
      }

      sheetsResponse = {
        ...appendResponse.data,
        formatting: 'Headers checked/created, data added with full formatting',
        rowNumber: rowNumber,
        headers: expectedHeaders,
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
          country: country || 'Not specified',
          selectedPackage,
          numberOfPeople: numberOfPeople || '1',
        },
        timestamp: new Date().toISOString(),
        status: 'Pending',
        sheetsResponse: sheetsResponse
          ? 'Headers managed and data saved with complete formatting'
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
