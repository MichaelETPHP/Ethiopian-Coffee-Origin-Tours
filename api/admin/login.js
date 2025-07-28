// api/admin/login.js - Simple working version
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Import database from server
import { db } from '../../server/index.js'

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

    try {
      // Find user by username
      const user = await db.get(
        'SELECT id, username, email, password_hash, role FROM admin_users WHERE username = ?',
        [username]
      )

      console.log(
        'Database query result:',
        user ? 'user found' : 'no user found'
      )

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      console.log('Found user:', user.username, 'role:', user.role)

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      console.log('Password valid:', isValidPassword)

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Update last login
      await db.run(
        'UPDATE admin_users SET last_login = datetime("now") WHERE id = ?',
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
    } catch (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }
  } catch (error) {
    console.error('Login error:', error)

    // Return detailed error for debugging
    res.status(500).json({
      error: 'Internal server error',
      details:
        process.env.NODE_ENV === 'development' ? error.message : 'Login failed',
      debug: {
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
        errorType: error.constructor.name,
      },
    })
  }
}
