// setup-sheets.js - Setup script for Google Sheets integration
import { initializeSpreadsheet } from './lib/sheets.js'
import fs from 'fs'
import path from 'path'

async function setupGoogleSheets() {
  try {
    console.log('🚀 Setting up Google Sheets for booking system...')

    // Check if credentials file exists
    const credentialsPath = path.join(process.cwd(), 'config', 'my-sheets-app-467604-93cad7db97fd.json')
    
    if (!fs.existsSync(credentialsPath)) {
      console.error('❌ Credentials file not found:')
      console.error(`   - ${credentialsPath}`)
      console.error('\nPlease make sure the JSON credentials file is in the config folder.')
      process.exit(1)
    }

    console.log('✅ Credentials file found')

    // Initialize the spreadsheet
    await initializeSpreadsheet()

    console.log('✅ Google Sheets setup completed successfully!')
    console.log('\n📋 Next steps:')
    console.log(
      '1. Make sure your Google Sheets API credentials are properly configured'
    )
    console.log(
      '2. The spreadsheet should now have a "Bookings" sheet with headers'
    )
    console.log('3. Test the booking system by creating a new booking')
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupGoogleSheets()
}

export default setupGoogleSheets
