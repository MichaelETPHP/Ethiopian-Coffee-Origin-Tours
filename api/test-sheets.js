// api/test-sheets.js - Test Google Sheets connection
import { initializeSpreadsheet, createBooking } from '../lib/sheets.js'

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🧪 Testing Google Sheets connection...')
    
    // Test environment variables
    const envCheck = {
      hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
      privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0
    }
    
    console.log('🔧 Environment check:', envCheck)

    // Test spreadsheet initialization
    console.log('📋 Testing spreadsheet initialization...')
    await initializeSpreadsheet()
    console.log('✅ Spreadsheet initialization successful')

    // Test booking creation
    console.log('📝 Testing booking creation...')
    const testBooking = await createBooking({
      fullName: 'Test User API',
      age: 30,
      email: 'test-api@example.com',
      phone: '+1234567890',
      country: 'Test Country',
      bookingType: 'individual',
      numberOfPeople: 1,
      selectedPackage: 'Test Package'
    })

    console.log('✅ Test booking created:', testBooking.id)

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Google Sheets integration is working correctly',
      data: {
        environment: envCheck,
        testBooking: {
          id: testBooking.id,
          name: testBooking.fullName,
          email: testBooking.email
        }
      }
    })

  } catch (error) {
    console.error('❌ Google Sheets test failed:', error)
    
    res.status(500).json({
      status: 'ERROR',
      message: 'Google Sheets test failed',
      error: error.message,
      details: {
        hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
        privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0
      }
    })
  }
}