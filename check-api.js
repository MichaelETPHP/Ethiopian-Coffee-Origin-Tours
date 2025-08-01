// check-api.js - Check Google Sheets API status
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 Checking Google Sheets API status...')

try {
  // Load credentials
  const credentialsPath = path.join(
    __dirname,
    'my-sheets-app-467604-764e3b37e3b1.json'
  )
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))

  console.log('✅ Credentials loaded')
  console.log('📧 Service account:', credentials.client_email)
  console.log('🏢 Project ID:', credentials.project_id)

  // Create auth client
  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  console.log('🔐 Auth client created')

  // Get client
  const client = await auth.getClient()
  console.log('✅ Auth client obtained')

  // Test API access
  const sheets = google.sheets({ version: 'v4', auth: client })

  // Try to list spreadsheets (this will fail if API is not enabled)
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: '1XOXl-joyCk5rBMtocTvGIbZMTcIqDRia914chGpleEA',
    })
    console.log('✅ Google Sheets API is enabled and accessible')
    console.log('📋 Spreadsheet title:', response.data.properties.title)
  } catch (apiError) {
    if (apiError.code === 403) {
      console.error('❌ Google Sheets API is not enabled')
      console.log('💡 To fix this:')
      console.log('   1. Go to Google Cloud Console')
      console.log('   2. Select project: my-sheets-app-467604')
      console.log('   3. Go to "APIs & Services" > "Library"')
      console.log('   4. Search for "Google Sheets API"')
      console.log('   5. Click "Enable"')
    } else {
      console.error('❌ API error:', apiError.message)
    }
  }
} catch (error) {
  console.error('❌ Error:', error.message)
  console.error('📝 Full error:', error)
}
