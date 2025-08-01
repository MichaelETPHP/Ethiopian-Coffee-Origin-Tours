// test-auth.js - Test Google Sheets authentication
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Google Sheets setup
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const SPREADSHEET_ID = '1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA'

// Load credentials
const credentials = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, 'api', 'my-sheets-app-467604-ff9b02f22d95.json'),
    'utf8'
  )
)

// Create JWT client
const auth = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  SCOPES
)

// Initialize Google Sheets API
const sheets = google.sheets({ version: 'v4', auth })

async function testAuth() {
  try {
    console.log('🔐 Testing Google Sheets authentication...')
    console.log('📧 Service Account Email:', credentials.client_email)
    console.log('📊 Spreadsheet ID:', SPREADSHEET_ID)

    // Test reading the spreadsheet
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    })

    console.log('✅ Authentication successful!')
    console.log('📋 Spreadsheet Title:', response.data.properties.title)
    console.log(
      '📄 Sheets:',
      response.data.sheets.map((sheet) => sheet.properties.title)
    )
  } catch (error) {
    console.error('❌ Authentication failed:', error.message)
    console.log('🔧 Please make sure:')
    console.log('1. The spreadsheet ID is correct')
    console.log('2. The spreadsheet is shared with:', credentials.client_email)
    console.log('3. The service account has Editor permissions')
  }
}

testAuth()
