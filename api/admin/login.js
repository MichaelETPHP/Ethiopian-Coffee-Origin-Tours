// api/admin/login.js - Professional admin login API with smart database adapter
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {
  createApiHandler,
  successResponse,
  errorResponse,
  sanitizeDatabaseError,
} from '../../lib/api-utils.js'
import { validateLoginData, sanitizeInput } from '../../lib/validation.js'
import { db, initializeDatabase } from '../../lib/db-adapter.js'
import { config } from '../../lib/config.js'

export default createApiHandler({
  methods: ['POST'],
  requireAuth: false,
  validate: validateLoginData,

  async post(req, res) {
    try {
      // Sanitize input data
      const sanitizedData = sanitizeInput(req.body)
      const { username, password } = sanitizedData

      console.log(`🔐 Login attempt for user: ${username}`)

      // Initialize database if needed
      try {
        await initializeDatabase()
        console.log('✅ Database initialized successfully')
      } catch (dbInitError) {
        console.error('❌ Database initialization failed:', dbInitError)
        // Continue anyway - tables might already exist
      }

      // Check for account lockout
      const lockoutCheck = await db.get(
        'SELECT failed_login_attempts, locked_until FROM admin_users WHERE username = $1',
        [username]
      )

      if (
        lockoutCheck?.locked_until &&
        new Date(lockoutCheck.locked_until) > new Date()
      ) {
        const lockoutEnd = new Date(lockoutCheck.locked_until).toLocaleString()
        console.log(`❌ Account locked until: ${lockoutEnd}`)
        throw new Error(
          `Account is temporarily locked until ${lockoutEnd}. Please try again later.`
        )
      }

      // Find user by username
      const user = await db.get(
        'SELECT id, username, email, password_hash, role, failed_login_attempts FROM admin_users WHERE username = $1',
        [username]
      )

      if (!user) {
        console.log(`❌ Login failed: User ${username} not found`)
        await recordFailedAttempt(username)
        throw new Error('Invalid username or password')
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash)

      if (!isValidPassword) {
        console.log(`❌ Login failed: Invalid password for user ${username}`)
        await recordFailedAttempt(username, user.id)
        throw new Error('Invalid username or password')
      }

      // Reset failed attempts on successful login
      await db.run(
        'UPDATE admin_users SET failed_login_attempts = 0, locked_until = NULL, last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      )

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
          iat: Math.floor(Date.now() / 1000),
        },
        config.jwt.secret,
        {
          expiresIn: config.jwt.expiresIn,
          algorithm: config.jwt.algorithm,
        }
      )

      console.log(`✅ Login successful for user: ${username}`)

      return successResponse(
        res,
        {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            lastLogin: new Date().toISOString(),
          },
          expiresIn: config.jwt.expiresIn,
        },
        'Login successful',
        200
      )
    } catch (error) {
      console.error('❌ Login error:', error)

      // Sanitize database errors
      if (error.code) {
        error = sanitizeDatabaseError(error)
      }

      return errorResponse(res, error, 401)
    }
  },
})

/**
 * Record failed login attempt and implement account lockout
 */
async function recordFailedAttempt(username, userId = null) {
  try {
    if (userId) {
      // User exists, increment failed attempts
      const result = await db.run(
        'UPDATE admin_users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = $1',
        [userId]
      )

      // Check if we need to lock the account
      const user = await db.get(
        'SELECT failed_login_attempts FROM admin_users WHERE id = $1',
        [userId]
      )

      if (
        user &&
        user.failed_login_attempts >= config.security.maxLoginAttempts
      ) {
        const lockoutUntil = new Date(Date.now() + config.security.lockoutTime)
        await db.run('UPDATE admin_users SET locked_until = $1 WHERE id = $2', [
          lockoutUntil.toISOString(),
          userId,
        ])
        console.log(
          `🔒 Account ${username} locked until ${lockoutUntil.toLocaleString()}`
        )
      }
    }

    // Log failed attempt for security monitoring
    console.log(`🚨 Failed login attempt for username: ${username}`)
  } catch (error) {
    console.error('❌ Error recording failed attempt:', error)
  }
}
