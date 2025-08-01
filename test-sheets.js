// test-sheets.js - Test Google Sheets integration
import express from 'express'
import cors from 'cors'
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Google Sheets setup
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const SPREADSHEET_ID = '1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA'
const RANGE = 'Sheet1!A:Z'

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

async function testGoogleSheets() {
  try {
    console.log('🔐 Testing Google Sheets authentication...')

    // Get the client
    const client = await auth.getClient()
    console.log('✅ GoogleAuth client obtained successfully')

    // Test spreadsheet access
    const spreadsheetResponse = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    })
    console.log(
      '✅ Spreadsheet access confirmed:',
      spreadsheetResponse.data.spreadsheetId
    )

    // Test writing data
    const testData = [
      new Date().toISOString(),
      'Test User',
      'test@example.com',
      '1234567890',
      '25',
      'US',
      'individual',
      '1',
      'southern-ethiopia',
      'Test Entry',
    ]

    const writeResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [testData],
      },
    })

    console.log('✅ Data written successfully to Google Sheets')
    console.log('📊 Response:', writeResponse.data)

    return true
  } catch (error) {
    console.error('❌ Google Sheets test failed:', error.message)
    console.error('📝 Error details:', error)
    return false
  }
}

// Run the test
testGoogleSheets().then((success) => {
  if (success) {
    console.log('🎉 Google Sheets integration is working!')
  } else {
    console.log('⚠️ Google Sheets integration failed')
  }
  process.exit(success ? 0 : 1)
})
