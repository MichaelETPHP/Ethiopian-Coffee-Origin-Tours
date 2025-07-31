// test-booking-api.js - Test the booking API
import fetch from 'node-fetch'

async function testBookingAPI() {
  try {
    console.log('🧪 Testing booking API...')

    // Test health endpoint
    console.log('📋 Testing health endpoint...')
    const healthResponse = await fetch('http://localhost:3002/api/health')
    const healthData = await healthResponse.json()
    console.log('✅ Health check:', healthData)

    // Test booking submission
    console.log('📝 Testing booking submission...')
    const bookingData = {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      age: '25',
      country: 'United States',
      bookingType: 'individual',
      numberOfPeople: 1,
      selectedPackage: 'Yirgacheffe Coffee Tour',
    }

    const bookingResponse = await fetch('http://localhost:3002/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })

    const bookingResult = await bookingResponse.json()

    if (bookingResponse.ok) {
      console.log('✅ Booking submitted successfully!')
      console.log('📋 Booking ID:', bookingResult.bookingId)
      console.log('📧 Message:', bookingResult.message)
    } else {
      console.log('❌ Booking submission failed:')
      console.log('📋 Status:', bookingResponse.status)
      console.log('📋 Error:', bookingResult.error)
    }

    console.log('\n🎉 API test completed!')
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run test
testBookingAPI()
