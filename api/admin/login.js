// api/admin/login.js
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Import database for Vercel deployment
import { db, initializeDatabase } from '../../lib/db-vercel.js'

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

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' })
    }

    console.log(`🔐 Login attempt for user: ${username}`)

    // Initialize database if needed
    try {
      await initializeDatabase()
      console.log('✅ Database initialized successfully')
    } catch (dbInitError) {
      console.error('❌ Database initialization failed:', dbInitError)
      // Continue anyway - tables might already exist
    }

    // Find user by username
    let user = null
    try {
      user = await db.get(
        'SELECT id, username, email, password_hash, role FROM admin_users WHERE username = $1',
        [username]
      )
    } catch (dbError) {
      console.error('❌ Database query failed:', dbError)

      // If admin_users table doesn't exist, create default admin
      if (dbError.message.includes('relation "admin_users" does not exist')) {
        console.log('🔄 Creating admin_users table and default admin...')

        try {
          // Create admin_users table
          await db.exec(`
            CREATE TABLE IF NOT EXISTS admin_users (
              id SERIAL PRIMARY KEY,
              username VARCHAR(100) UNIQUE NOT NULL,
              email VARCHAR(255) UNIQUE NOT NULL,
              password_hash VARCHAR(255) NOT NULL,
              role VARCHAR(20) CHECK (role IN ('admin', 'manager')) DEFAULT 'admin',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              last_login TIMESTAMP NULL
            )
          `)

          // Create default admin user
          const passwordHash = await bcrypt.hash('admin123', 12)
          await db.run(
            'INSERT INTO admin_users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
            ['admin', 'admin@ethiopiancoffee.com', passwordHash, 'admin']
          )

          console.log('✅ Default admin user created')
          console.log('   Username: admin')
          console.log('   Password: admin123')

          // Try to get the user again
          user = await db.get(
            'SELECT id, username, email, password_hash, role FROM admin_users WHERE username = $1',
            [username]
          )
        } catch (createError) {
          console.error('❌ Failed to create admin user:', createError)
          return res.status(500).json({
            error: 'Database setup failed',
            details:
              process.env.NODE_ENV === 'development'
                ? createError.message
                : undefined,
          })
        }
      } else {
        return res.status(500).json({
          error: 'Database connection failed',
          details:
            process.env.NODE_ENV === 'development'
              ? dbError.message
              : undefined,
        })
      }
    }

    if (!user) {
      console.log(`❌ Login failed: User ${username} not found`)
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    let isValidPassword = false
    try {
      isValidPassword = await bcrypt.compare(password, user.password_hash)
    } catch (bcryptError) {
      console.error('❌ Password verification failed:', bcryptError)
      return res.status(500).json({ error: 'Authentication failed' })
    }

    if (!isValidPassword) {
      console.log(`❌ Login failed: Invalid password for user ${username}`)
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Update last login
    try {
      await db.run(
        'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      )
    } catch (updateError) {
      console.error('❌ Failed to update last login:', updateError)
      // Don't fail the login for this error
    }

    // Generate JWT token
    let token = null
    try {
      token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      )
    } catch (jwtError) {
      console.error('❌ JWT token generation failed:', jwtError)
      return res.status(500).json({ error: 'Authentication failed' })
    }

    console.log(`✅ Login successful for user: ${username}`)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    res.status(500).json({
      error: 'Internal server error',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}
