// api/debug.js - Debug endpoint for troubleshooting
import pg from 'pg'

const { Pool } = pg

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check environment variables
    const envCheck = {
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
      FRONTEND_URL: process.env.FRONTEND_URL ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'Not set',
    }

    // Try database connection
    let dbStatus = 'Not tested'
    let dbError = null

    if (process.env.DATABASE_URL) {
      try {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl:
            process.env.NODE_ENV === 'production'
              ? { rejectUnauthorized: false }
              : false,
          max: 1,
          connectionTimeoutMillis: 5000,
        })

        const client = await pool.connect()

        // Test a simple query
        const result = await client.query(
          'SELECT COUNT(*) as count FROM admin_users'
        )
        dbStatus = `Connected - ${result.rows[0].count} admin users found`

        client.release()
        await pool.end()
      } catch (error) {
        dbStatus = 'Connection failed'
        dbError = error.message
      }
    } else {
      dbStatus = 'No DATABASE_URL provided'
    }

    res.status(200).json({
      status: 'Debug info',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      database: {
        status: dbStatus,
        error: dbError,
      },
      headers: {
        host: req.headers.host,
        userAgent: req.headers['user-agent'],
      },
    })
  } catch (error) {
    console.error('Debug endpoint error:', error)
    res.status(500).json({
      error: 'Debug endpoint failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    })
  }
}
