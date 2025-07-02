// Performance test script for booking submissions
const http = require('http')

const testData = {
  fullName: 'Performance Test User',
  age: 25,
  email: `test${Date.now()}@example.com`,
  phone: '1234567890',
  country: 'Test Country',
  bookingType: 'individual',
  selectedPackage: 'southern-ethiopia',
}

const postData = JSON.stringify(testData)

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/bookings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
}

console.log('🚀 Testing booking submission performance...')
console.log('📊 Starting performance test...\n')

const startTime = Date.now()

const req = http.request(options, (res) => {
  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  })

  res.on('end', () => {
    const endTime = Date.now()
    const duration = endTime - startTime

    console.log(`✅ Response Status: ${res.statusCode}`)
    console.log(`⏱️  Response Time: ${duration}ms`)
    console.log(`📨 Response: ${data}`)

    if (duration < 1000) {
      console.log('🎉 Excellent! Booking submission is fast (< 1 second)')
    } else if (duration < 3000) {
      console.log('👍 Good! Booking submission is acceptable (< 3 seconds)')
    } else {
      console.log('⚠️  Slow! Booking submission took longer than expected')
    }

    console.log('\n🔧 Performance optimizations applied:')
    console.log('   • Database connection pool increased to 20 connections')
    console.log('   • Transaction-based booking submissions')
    console.log('   • Asynchronous email sending (non-blocking)')
    console.log('   • Compression middleware enabled')
    console.log('   • Optimized CORS configuration')
    console.log('   • Request logging for monitoring')
  })
})

req.on('error', (e) => {
  console.error(`❌ Error: ${e.message}`)
})

req.write(postData)
req.end()
