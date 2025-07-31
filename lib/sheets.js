// lib/sheets.js - Google Sheets integration for storing bookings
import { google } from 'googleapis'
import { JWT } from 'google-auth-library'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const SPREADSHEET_ID = '1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA'
const SHEET_NAME = 'Sheet1' // Using the default sheet name

// Initialize Google Sheets API
let sheets = null
let auth = null

/**
 * Initialize Google Sheets authentication using environment variables or JSON file
 */
function initializeAuth() {
  if (!auth) {
    try {
      let credentials

      // Try to use environment variables first (for Vercel)
      if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        console.log(
          '🔧 Using environment variables for Google Sheets authentication'
        )

        // Fix private key formatting for Vercel
        let privateKey = process.env.GOOGLE_PRIVATE_KEY

        // Convert escaped newlines to actual newlines
        privateKey = privateKey.replace(/\\n/g, '\n')
        
        console.log('🔧 Private key length:', privateKey.length)
        console.log('🔧 Private key format check:')
        console.log('   - Has newlines:', privateKey.includes('\n'))
        console.log('   - Starts with BEGIN:', privateKey.startsWith('-----BEGIN PRIVATE KEY-----'))
        console.log('   - Ends with END:', privateKey.endsWith('-----END PRIVATE KEY-----\n'))
        console.log('🔧 First 60 chars:', privateKey.substring(0, 60) + '...')

        credentials = {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: privateKey,
        }
      } else {
        // Fallback to JSON file (for local development)
        console.log('🔧 Using JSON file for Google Sheets authentication')
        const credentialsPath = path.join(
          __dirname,
          '..',
          'config',
          'my-sheets-app-467604-93cad7db97fd.json'
        )
        credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
      }

      console.log('🔧 Creating JWT with email:', credentials.client_email)

      auth = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: SCOPES,
      })

      console.log('✅ Google Sheets authentication initialized')
    } catch (error) {
      console.error(
        '❌ Failed to initialize Google Sheets authentication:',
        error
      )
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
        privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0,
      })
      throw new Error(
        'Google Sheets authentication failed. Please check your credentials.'
      )
    }
  }
  return auth
}

/**
 * Get Google Sheets instance
 */
function getSheets() {
  if (!sheets) {
    const auth = initializeAuth()
    sheets = google.sheets({ version: 'v4', auth })
  }
  return sheets
}

/**
 * Initialize the spreadsheet with headers if it doesn't exist
 */
export async function initializeSpreadsheet() {
  try {
    const sheets = getSheets()

    // Check if headers exist
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:Z1`,
    })

    const headers = response.data.values?.[0] || []

    // If no headers exist, create them
    if (headers.length === 0) {
      const headerRow = [
        'ID',
        'Name',
        'Email',
        'Phone',
        'Age',
        'Group Size',
        'Selected Tour Package',
        'Status',
        'Created At',
        'Updated At',
      ]

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1`,
        valueInputOption: 'RAW',
        resource: {
          values: [headerRow],
        },
      })

      console.log('✅ Spreadsheet headers initialized')
    }
  } catch (error) {
    console.error('❌ Failed to initialize spreadsheet:', error)
    throw error
  }
}

/**
 * Create a new booking in the spreadsheet
 */
export async function createBooking(bookingData) {
  try {
    const sheets = getSheets()

    // Generate unique ID (timestamp + random number)
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()

    const row = [
      id,
      bookingData.fullName,
      bookingData.email,
      bookingData.phone,
      bookingData.age,
      bookingData.bookingType === 'group' ? bookingData.numberOfPeople : '',
      bookingData.selectedPackage,
      'pending',
      now, // Created At
      now, // Updated At
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:A`,
      valueInputOption: 'RAW',
      resource: {
        values: [row],
      },
    })

    // Return the created booking with ID
    return {
      id,
      ...bookingData,
      status: 'pending',
      notes: '',
      created_at: now,
      updated_at: now,
    }
  } catch (error) {
    console.error('❌ Failed to create booking:', error)
    throw error
  }
}

/**
 * Get all bookings with optional filtering
 */
export async function getBookings(options = {}) {
  try {
    const sheets = getSheets()
    const {
      page = 1,
      limit = 50,
      search = '',
      status = '',
      package: packageFilter = '',
    } = options

    // Get all data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:J`,
    })

    const rows = response.data.values || []

    if (rows.length === 0) {
      return {
        bookings: [],
        total: 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: 0,
      }
    }

    // Skip header row and convert to booking objects
    const bookings = rows.slice(1).map((row) => ({
      id: row[0],
      full_name: row[1],
      email: row[2],
      phone: row[3],
      age: row[4],
      group_size: row[5] || '',
      selected_package: row[6],
      status: row[7],
      created_at: row[8],
      updated_at: row[9],
    }))

    // Apply filters
    let filteredBookings = bookings

    if (search) {
      const searchLower = search.toLowerCase()
      filteredBookings = filteredBookings.filter(
        (booking) =>
          booking.full_name?.toLowerCase().includes(searchLower) ||
          booking.email?.toLowerCase().includes(searchLower) ||
          booking.phone?.toLowerCase().includes(searchLower)
      )
    }

    if (status) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.status === status
      )
    }

    if (packageFilter) {
      const packageLower = packageFilter.toLowerCase()
      filteredBookings = filteredBookings.filter((booking) =>
        booking.selected_package?.toLowerCase().includes(packageLower)
      )
    }

    // Sort by created_at (newest first)
    filteredBookings.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )

    const total = filteredBookings.length
    const offset = (page - 1) * limit
    const paginatedBookings = filteredBookings.slice(offset, offset + limit)

    return {
      bookings: paginatedBookings,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error('❌ Failed to get bookings:', error)
    throw error
  }
}

/**
 * Update a booking
 */
export async function updateBooking(id, updateData) {
  try {
    const sheets = getSheets()

    // Get all data to find the row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:J`,
    })

    const rows = response.data.values || []
    const rowIndex = rows.findIndex((row) => row[0] === id)

    if (rowIndex === -1) {
      throw new Error('Booking not found')
    }

    // Update the specific row
    const updatedRow = [
      id,
      updateData.full_name || rows[rowIndex][1],
      updateData.email || rows[rowIndex][2],
      updateData.phone || rows[rowIndex][3],
      updateData.age || rows[rowIndex][4],
      updateData.group_size || rows[rowIndex][5] || '',
      updateData.selected_package || rows[rowIndex][6],
      updateData.status || rows[rowIndex][7],
      rows[rowIndex][8], // Keep original created_at
      new Date().toISOString(), // Update updated_at
    ]

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex + 1}:J${rowIndex + 1}`,
      valueInputOption: 'RAW',
      resource: {
        values: [updatedRow],
      },
    })

    return {
      id,
      full_name: updatedRow[1],
      email: updatedRow[2],
      phone: updatedRow[3],
      age: updatedRow[4],
      group_size: updatedRow[5],
      selected_package: updatedRow[6],
      status: updatedRow[7],
      created_at: updatedRow[8],
      updated_at: updatedRow[9],
    }
  } catch (error) {
    console.error('❌ Failed to update booking:', error)
    throw error
  }
}

/**
 * Delete a booking
 */
export async function deleteBooking(id) {
  try {
    const sheets = getSheets()

    // Get all data to find the row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:J`,
    })

    const rows = response.data.values || []
    const rowIndex = rows.findIndex((row) => row[0] === id)

    if (rowIndex === -1) {
      throw new Error('Booking not found')
    }

    // Delete the row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming the sheet ID is 0
                dimension: 'ROWS',
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    })

    return { success: true, deletedId: id }
  } catch (error) {
    console.error('❌ Failed to delete booking:', error)
    throw error
  }
}

/**
 * Get a single booking by ID
 */
export async function getBooking(id) {
  try {
    const sheets = getSheets()

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:J`,
    })

    const rows = response.data.values || []
    const row = rows.find((row) => row[0] === id)

    if (!row) {
      return null
    }

    return {
      id: row[0],
      full_name: row[1],
      email: row[2],
      phone: row[3],
      age: row[4],
      group_size: row[5] || '',
      selected_package: row[6],
      status: row[7],
      created_at: row[8],
      updated_at: row[9],
    }
  } catch (error) {
    console.error('❌ Failed to get booking:', error)
    throw error
  }
}

/**
 * Check for duplicate bookings
 */
export async function checkDuplicateBooking(email, selectedPackage) {
  try {
    const sheets = getSheets()

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:J`,
    })

    const rows = response.data.values || []

    // Skip header row and check for duplicates
    const duplicate = rows.slice(1).find(
      (row) =>
        row[2] === email && // email column
        row[6] === selectedPackage && // selected_package column
        row[7] !== 'cancelled' // status column
    )

    return duplicate
      ? {
          id: duplicate[0],
          full_name: duplicate[1],
          email: duplicate[2],
          phone: duplicate[3],
          age: duplicate[4],
          group_size: duplicate[5] || '',
          selected_package: duplicate[6],
          status: duplicate[7],
          created_at: duplicate[8],
          updated_at: duplicate[9],
        }
      : null
  } catch (error) {
    console.error('❌ Failed to check duplicate booking:', error)
    throw error
  }
}
