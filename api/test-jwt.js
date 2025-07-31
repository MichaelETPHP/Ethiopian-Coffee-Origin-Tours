// api/test-jwt.js - Test JWT creation for Google Sheets
import { JWT } from 'google-auth-library'

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
    console.log('🧪 Testing JWT creation for Google Sheets...')
    
    // Check environment variables
    const hasClientEmail = !!process.env.GOOGLE_CLIENT_EMAIL
    const hasPrivateKey = !!process.env.GOOGLE_PRIVATE_KEY
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
    const privateKeyLength = process.env.GOOGLE_PRIVATE_KEY?.length || 0
    
    console.log('🔧 Environment check:', {
      hasClientEmail,
      hasPrivateKey,
      clientEmail,
      privateKeyLength
    })

    if (!hasClientEmail || !hasPrivateKey) {
      return res.status(500).json({
        error: 'Missing environment variables',
        details: { hasClientEmail, hasPrivateKey }
      })
    }

    // Process private key
    let privateKey = process.env.GOOGLE_PRIVATE_KEY
    privateKey = privateKey.replace(/\\n/g, '\n')
    
    console.log('🔧 Private key processing:')
    console.log('   - Original length:', process.env.GOOGLE_PRIVATE_KEY.length)
    console.log('   - Processed length:', privateKey.length)
    console.log('   - Has newlines:', privateKey.includes('\n'))
    console.log('   - Starts correctly:', privateKey.startsWith('-----BEGIN PRIVATE KEY-----'))
    console.log('   - Ends correctly:', privateKey.includes('-----END PRIVATE KEY-----'))
    console.log('   - First 60 chars:', privateKey.substring(0, 60))

    // Create JWT
    console.log('🔧 Creating JWT...')
    const auth = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    console.log('✅ JWT created successfully')

    // Test authentication
    console.log('🔧 Testing authentication...')
    const accessToken = await auth.getAccessToken()
    
    console.log('✅ Access token obtained:', accessToken.token ? 'YES' : 'NO')

    res.status(200).json({
      status: 'SUCCESS',
      message: 'JWT authentication working correctly',
      data: {
        environment: {
          hasClientEmail,
          hasPrivateKey,
          clientEmail,
          privateKeyLength
        },
        privateKey: {
          originalLength: process.env.GOOGLE_PRIVATE_KEY.length,
          processedLength: privateKey.length,
          hasNewlines: privateKey.includes('\n'),
          startsCorrectly: privateKey.startsWith('-----BEGIN PRIVATE KEY-----'),
          endsCorrectly: privateKey.includes('-----END PRIVATE KEY-----'),
          first60: privateKey.substring(0, 60)
        },
        authentication: {
          jwtCreated: true,
          accessTokenObtained: !!accessToken.token
        }
      }
    })

  } catch (error) {
    console.error('❌ JWT test failed:', error)
    
    res.status(500).json({
      status: 'ERROR',
      message: 'JWT authentication failed',
      error: error.message,
      stack: error.stack,
      details: {
        hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
        privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length || 0
      }
    })
  }
}