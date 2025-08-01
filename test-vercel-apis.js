// test-vercel-apis.js - Test Vercel API endpoints
import fetch from 'node-fetch'

const BASE_URL = 'https://your-vercel-app.vercel.app' // Replace with your Vercel URL

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    console.log(`🔍 Testing ${method} ${endpoint}...`)
    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const data = await response.text()

    console.log(`📊 Status: ${response.status}`)
    console.log(`📄 Response: ${data.substring(0, 200)}...`)

    return { success: response.ok, status: response.status, data }
  } catch (error) {
    console.error(`❌ Error testing ${endpoint}:`, error.message)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log('🧪 Testing Vercel API endpoints...\n')

  // Test 1: Health check
  await testAPI('/api/health')
  console.log('')

  // Test 2: Simple booking
  const testBooking = {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    age: '25',
    country: 'US',
    bookingType: 'individual',
    numberOfPeople: '1',
    selectedPackage: 'southern-ethiopia',
  }

  await testAPI('/api/booking-simple', 'POST', testBooking)
  console.log('')

  // Test 3: Full booking (if environment variable is set)
  await testAPI('/api/sheets-booking', 'POST', testBooking)
  console.log('')

  console.log('✅ API testing completed')
}

runTests().catch(console.error)
