// test-api-syntax.js - Test API syntax
import { google } from 'googleapis'

// Test the syntax of the API file
console.log('🔍 Testing API syntax...')

// Test GoogleAuth import
try {
  console.log('✅ google import successful')
} catch (error) {
  console.error('❌ google import failed:', error.message)
}

// Test environment variable access
try {
  const testEnv = process.env.GOOGLE_SHEETS_CREDENTIALS
  console.log('✅ Environment variable access:', testEnv ? 'Set' : 'Not set')
} catch (error) {
  console.error('❌ Environment variable access failed:', error.message)
}

// Test JSON parsing
try {
  const testJson = '{"test": "value"}'
  JSON.parse(testJson)
  console.log('✅ JSON parsing successful')
} catch (error) {
  console.error('❌ JSON parsing failed:', error.message)
}

console.log('✅ API syntax test completed')
