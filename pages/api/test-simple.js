// api/test-simple.js - Simple test API
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    console.log('✅ Test API is working')

    res.status(200).json({
      success: true,
      message: 'Test API is working correctly',
      timestamp: new Date().toISOString(),
      method: req.method,
      body: req.body,
    })
  } catch (error) {
    console.error('❌ Test API error:', error)

    res.status(500).json({
      error: 'Test API error',
      message: error.message,
    })
  }
}
