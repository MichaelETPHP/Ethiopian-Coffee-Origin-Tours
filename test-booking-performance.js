// Comprehensive Booking Performance Test
import http from 'http'

console.log('🚀 Ethiopian Coffee Origin Tours - Booking Performance Test')
console.log('='.repeat(60))

// Test data with unique email for each test
const createTestData = (testNumber) => ({
  fullName: `Performance Test User ${testNumber}`,
  age: 25 + testNumber,
  email: `test${Date.now()}_${testNumber}@example.com`,
  phone: `123456789${testNumber}`,
  country: 'United States',
  bookingType: 'individual',
  numberOfPeople: '1',
  selectedPackage: 'southern-ethiopia',
})

const testBooking = (testNumber) => {
  return new Promise((resolve, reject) => {
    const testData = createTestData(testNumber)
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

    const startTime = Date.now()

    const req = http.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        const endTime = Date.now()
        const duration = endTime - startTime

        try {
          const responseData = JSON.parse(data)
          resolve({
            testNumber,
            statusCode: res.statusCode,
            duration,
            success: res.statusCode === 201,
            bookingId: responseData.bookingId,
            message: responseData.message,
          })
        } catch (error) {
          resolve({
            testNumber,
            statusCode: res.statusCode,
            duration,
            success: false,
            error: 'Invalid JSON response',
          })
        }
      })
    })

    req.on('error', (error) => {
      const endTime = Date.now()
      const duration = endTime - startTime
      reject({
        testNumber,
        duration,
        success: false,
        error: error.message,
      })
    })

    req.write(postData)
    req.end()
  })
}

// Run multiple tests
const runPerformanceTests = async () => {
  const testCount = 3
  const results = []

  console.log(`📊 Running ${testCount} booking submission tests...\n`)

  for (let i = 1; i <= testCount; i++) {
    try {
      console.log(`🔄 Test ${i}/${testCount} - Submitting booking...`)
      const result = await testBooking(i)
      results.push(result)

      if (result.success) {
        console.log(
          `✅ Test ${i} - SUCCESS (${result.duration}ms) - Booking ID: ${result.bookingId}`
        )
      } else {
        console.log(
          `❌ Test ${i} - FAILED (${result.duration}ms) - Status: ${result.statusCode}`
        )
      }

      // Wait 1 second between tests
      if (i < testCount) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.log(`❌ Test ${i} - ERROR (${error.duration}ms) - ${error.error}`)
      results.push(error)
    }
  }

  // Calculate performance metrics
  const successfulTests = results.filter((r) => r.success)
  const failedTests = results.filter((r) => !r.success)

  if (successfulTests.length > 0) {
    const avgDuration =
      successfulTests.reduce((sum, r) => sum + r.duration, 0) /
      successfulTests.length
    const minDuration = Math.min(...successfulTests.map((r) => r.duration))
    const maxDuration = Math.max(...successfulTests.map((r) => r.duration))

    console.log('\n📈 PERFORMANCE RESULTS:')
    console.log('='.repeat(40))
    console.log(
      `✅ Successful submissions: ${successfulTests.length}/${testCount}`
    )
    console.log(`❌ Failed submissions: ${failedTests.length}/${testCount}`)
    console.log(`⏱️  Average response time: ${avgDuration.toFixed(0)}ms`)
    console.log(`⚡ Fastest response: ${minDuration}ms`)
    console.log(`🐌 Slowest response: ${maxDuration}ms`)

    // Performance rating
    if (avgDuration < 1000) {
      console.log('🎉 EXCELLENT! Booking system is very fast (< 1 second)')
    } else if (avgDuration < 3000) {
      console.log('👍 GOOD! Booking system is acceptable (< 3 seconds)')
    } else {
      console.log('⚠️  SLOW! Booking system needs optimization (> 3 seconds)')
    }
  }

  console.log('\n🔧 OPTIMIZATIONS APPLIED:')
  console.log('='.repeat(40))
  console.log('• Database connection pool: 20 connections')
  console.log('• Transaction-based submissions')
  console.log('• Asynchronous email sending')
  console.log('• Compression middleware')
  console.log('• Optimized CORS configuration')
  console.log('• Request logging for monitoring')

  console.log('\n🎯 SPINNING BUTTON FIXES:')
  console.log('='.repeat(40))
  console.log('• Fixed setIsSubmitting(false) in all code paths')
  console.log('• Immediate success response handling')
  console.log('• Proper error handling with state cleanup')

  if (failedTests.length > 0) {
    console.log('\n❌ FAILED TESTS DETAILS:')
    console.log('='.repeat(40))
    failedTests.forEach((test) => {
      console.log(
        `Test ${test.testNumber}: ${test.error || `Status ${test.statusCode}`}`
      )
    })
  }

  console.log(
    '\n✨ Test completed! Check http://localhost:5173/booking to test the UI'
  )
}

// Check if servers are running first
const checkServers = () => {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3001,
        path: '/api/health',
        method: 'GET',
      },
      (res) => {
        if (res.statusCode === 200) {
          console.log('✅ Backend server is running on port 3001')
          resolve(true)
        } else {
          console.log('❌ Backend server is not responding properly')
          resolve(false)
        }
      }
    )

    req.on('error', () => {
      console.log('❌ Backend server is not running on port 3001')
      console.log('💡 Please start the backend server: node server/index.js')
      resolve(false)
    })

    req.end()
  })
}

// Run the test
checkServers().then((serverRunning) => {
  if (serverRunning) {
    runPerformanceTests()
  } else {
    console.log('\n🚀 Please start the servers and run this test again:')
    console.log('1. Backend: node server/index.js')
    console.log('2. Frontend: npm run dev')
    console.log('3. Test: node test-booking-performance.js')
  }
})
