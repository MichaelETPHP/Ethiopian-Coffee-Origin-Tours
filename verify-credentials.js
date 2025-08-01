// verify-credentials.js - Verify Google Sheets credentials
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const credentialsPath = path.join(
  __dirname,
  'my-sheets-app-467604-764e3b37e3b1.json'
)

console.log('🔍 Verifying Google Sheets credentials...')
console.log('📁 Checking file path:', credentialsPath)

try {
  // Check if file exists
  if (!fs.existsSync(credentialsPath)) {
    console.error('❌ Credentials file not found!')
    console.log('💡 Make sure the file exists in the project root directory')
    process.exit(1)
  }

  console.log('✅ Credentials file found')

  // Read and parse the file
  const credentialsData = fs.readFileSync(credentialsPath, 'utf8')
  const credentials = JSON.parse(credentialsData)

  // Verify required fields
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
    console.error(
      '❌ Credentials file is missing required fields:',
      missingFields
    )
    process.exit(1)
  }

  console.log('✅ Credentials file is valid')
  console.log('📧 Service account email:', credentials.client_email)
  console.log('🏢 Project ID:', credentials.project_id)
  console.log('🔑 Private key ID:', credentials.private_key_id)
  console.log('📝 Type:', credentials.type)

  // Check if private key looks valid
  if (
    credentials.private_key &&
    credentials.private_key.includes('-----BEGIN PRIVATE KEY-----')
  ) {
    console.log('✅ Private key format looks correct')
  } else {
    console.error('❌ Private key format is invalid')
    process.exit(1)
  }

  console.log('🎉 Credentials verification completed successfully!')
  console.log('💡 The credentials file is ready to use with Google Sheets API')
} catch (error) {
  console.error('❌ Error verifying credentials:', error.message)
  process.exit(1)
}
