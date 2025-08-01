// setup-vercel-env.js - Setup Vercel environment variable
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔧 Setting up Vercel environment variable...')

try {
  // Read the credentials file
  const credentialsPath = path.join(
    __dirname,
    'my-sheets-app-467604-764e3b37e3b1.json'
  )
  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))

  console.log('✅ Credentials file loaded')
  console.log('📧 Service account:', credentials.client_email)

  // Convert to JSON string for environment variable
  const credentialsJson = JSON.stringify(credentials)

  console.log('\n📋 To set up Vercel environment variable:')
  console.log('\n1. Go to your Vercel dashboard')
  console.log('2. Select your project')
  console.log('3. Go to "Settings" > "Environment Variables"')
  console.log('4. Add a new environment variable:')
  console.log('   - Name: GOOGLE_SHEETS_CREDENTIALS')
  console.log('   - Value: (copy the JSON below)')
  console.log('   - Environment: Production, Preview, Development')
  console.log('\n📄 Credentials JSON (copy this):')
  console.log('='.repeat(50))
  console.log(credentialsJson)
  console.log('='.repeat(50))

  console.log('\n💡 After setting the environment variable:')
  console.log('1. Redeploy your project on Vercel')
  console.log('2. Test the booking form')
  console.log('3. Check Vercel function logs for any errors')
} catch (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
}
