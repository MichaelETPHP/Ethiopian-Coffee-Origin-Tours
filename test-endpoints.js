#!/usr/bin/env node

import fetch from 'node-fetch'

const BASE_URL = 'https://ehiopiancoffeeorgintrip.com'
const TEST_TOKEN = 'your-test-token-here' // Replace with actual token

console.log('🧪 Testing API Endpoints...\n')

async function testEndpoint(name, url, options = {}) {
  try {
    console.log(`Testing ${name}...`)
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (response.ok) {
      console.log(`✅ ${name}: ${response.status}`)
      const data = await response.json()
      console.log(`   Response:`, JSON.stringify(data, null, 2))
    } else {
      console.log(`❌ ${name}: ${response.status} - ${response.statusText}`)
      const error = await response.text()
      console.log(`   Error:`, error)
    }
  } catch (error) {
    console.log(`❌ ${name}: Error - ${error.message}`)
  }
  console.log('')
}

async function runTests() {
  // Test debug endpoint (no auth required)
  await testEndpoint('Debug Endpoint', `${BASE_URL}/api/debug`, {
    headers: { Authorization: '' },
  })

  // Test individual booking endpoints
  await testEndpoint('Get Booking 6', `${BASE_URL}/api/admin/bookings/6`)

  await testEndpoint('Update Booking 6', `${BASE_URL}/api/admin/bookings/6`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'confirmed' }),
  })

  // Test email endpoint
  await testEndpoint(
    'Send Email',
    `${BASE_URL}/api/admin/bookings/6/send-email`,
    {
      method: 'POST',
      body: JSON.stringify({ emailType: 'payment-confirmation' }),
    }
  )

  console.log('🎉 Endpoint testing completed!')
  console.log('\n📝 Next steps:')
  console.log('1. Replace TEST_TOKEN with actual admin token')
  console.log('2. Run tests again to verify functionality')
  console.log('3. Check Vercel function logs if any tests fail')
}

runTests().catch(console.error)
