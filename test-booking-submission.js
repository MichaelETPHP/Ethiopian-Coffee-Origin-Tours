// test-booking-submission.js - Test booking submissions with sample data
import { testBookings, testScenarios, getRandomBooking } from './test-data.js'

// Test API endpoints
const API_ENDPOINTS = {
  local: 'http://localhost:4040/api/sheets-booking',
  simple: 'http://localhost:4040/api/booking-simple',
  health: 'http://localhost:4040/api/health',
}

// Function to test booking submission
async function testBookingSubmission(endpoint, bookingData, testName) {
  try {
    console.log(`\n🧪 Testing: ${testName}`)
    console.log(`📋 Data:`, bookingData)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })

    const result = await response.json()

    console.log(`📊 Status: ${response.status}`)
    console.log(`✅ Response:`, result)

    return { success: response.ok, status: response.status, data: result }
  } catch (error) {
    console.error(`❌ Error testing ${testName}:`, error.message)
    return { success: false, error: error.message }
  }
}

// Function to test health endpoint
async function testHealthEndpoint() {
  try {
    console.log('\n🏥 Testing Health Endpoint...')
    const response = await fetch(API_ENDPOINTS.health)
    const result = await response.json()

    console.log(`📊 Status: ${response.status}`)
    console.log(`✅ Health Check:`, result)

    return { success: response.ok, status: response.status, data: result }
  } catch (error) {
    console.error(`❌ Health check failed:`, error.message)
    return { success: false, error: error.message }
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Booking Submission Tests...\n')

  // Test 1: Health check
  await testHealthEndpoint()

  // Test 2: Basic booking
  await testBookingSubmission(
    API_ENDPOINTS.local,
    testBookings.basic,
    'Basic Individual Booking'
  )

  // Test 3: Group booking
  await testBookingSubmission(
    API_ENDPOINTS.local,
    testBookings.group,
    'Group Booking (6 people)'
  )

  // Test 4: Family booking
  await testBookingSubmission(
    API_ENDPOINTS.local,
    testBookings.family,
    'Family Booking (4 people)'
  )

  // Test 5: International booking
  await testBookingSubmission(
    API_ENDPOINTS.local,
    testBookings.international,
    'International Booking (Japan)'
  )

  // Test 6: Ethiopian local booking
  await testBookingSubmission(
    API_ENDPOINTS.local,
    testBookings.ethiopian,
    'Ethiopian Local Booking'
  )

  // Test 7: Senior booking
  await testBookingSubmission(
    API_ENDPOINTS.local,
    testBookings.senior,
    'Senior Booking (68 years)'
  )

  // Test 8: Large group booking
  await testBookingSubmission(
    API_ENDPOINTS.local,
    testBookings.largeGroup,
    'Large Group Booking (12 people)'
  )

  // Test 9: Random booking
  const randomBooking = getRandomBooking()
  await testBookingSubmission(
    API_ENDPOINTS.local,
    randomBooking,
    'Random Booking'
  )

  // Test 10: Simple API (no Google Sheets)
  await testBookingSubmission(
    API_ENDPOINTS.simple,
    testBookings.basic,
    'Simple API (No Google Sheets)'
  )

  console.log('\n✅ All tests completed!')
}

// Run tests
runTests().catch(console.error)
