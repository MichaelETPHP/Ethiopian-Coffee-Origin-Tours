// api/admin/login.js - Simple working version
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pg from 'pg'

const { Pool } = pg

// Create database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  max: 10,
})

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, password } = req.body

    console.log('Login attempt for username:', username)

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' })
    }

    // Connect to database
    const client = await pool.connect()

    try {
      // Find user by username
      const userResult = await client.query(
        'SELECT id, username, email, password_hash, role FROM admin_users WHERE username = $1',
        [username]
      )

      console.log(
        'Database query result:',
        userResult.rows.length,
        'users found'
      )

      if (userResult.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const user = userResult.rows[0]
      console.log('Found user:', user.username, 'role:', user.role)

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      console.log('Password valid:', isValidPassword)

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Update last login
      await client.query(
        'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      )

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      )

      console.log('Login successful for:', user.username)

      // Return success response
      res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Login error:', error)

    // Return detailed error for debugging
    res.status(500).json({
      error: 'Internal server error',
      details:
        process.env.NODE_ENV === 'development' ? error.message : 'Login failed',
      debug: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
        errorType: error.constructor.name,
      },
    })
  }
}
