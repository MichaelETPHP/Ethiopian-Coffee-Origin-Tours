// setup-google-sheets-env.js - Script to set up Google Sheets environment variable
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read the Google service account credentials
const credentialsPath = path.join(
  __dirname,
  'my-sheets-app-467604-764e3b37e3b1.json'
)
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))

// Create .env.local file content
const envContent = `GOOGLE_SHEETS_CREDENTIALS=${JSON.stringify(credentials)}`

// Write to .env.local file
const envPath = path.join(__dirname, '.env.local')
fs.writeFileSync(envPath, envContent)

console.log('✅ Google Sheets environment variable set up successfully!')
console.log('📁 Created .env.local file with credentials')
console.log(
  '🔄 Please restart your development server to load the new environment variable'
)
console.log('')
console.log('To restart the server:')
console.log('1. Stop the current server (Ctrl+C)')
console.log('2. Run: npm run dev')
