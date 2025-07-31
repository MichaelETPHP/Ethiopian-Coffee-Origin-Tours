// api/debug-env.js - Debug environment variables
export default function handler(req, res) {
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

  // Check environment variables
  const envCheck = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    hasGoogleClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
    hasGooglePrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
    googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL
      ? process.env.GOOGLE_CLIENT_EMAIL.substring(0, 20) + '...'
      : 'NOT_SET',
    privateKeyLength: process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.length
      : 0,
    privateKeyStartsWith: process.env.GOOGLE_PRIVATE_KEY
      ? process.env.GOOGLE_PRIVATE_KEY.substring(0, 30) + '...'
      : 'NOT_SET',
  }

  console.log('🔧 Environment Debug:', envCheck)

  res.status(200).json({
    status: 'OK',
    message: 'Environment variables debug',
    data: envCheck,
  })
}
