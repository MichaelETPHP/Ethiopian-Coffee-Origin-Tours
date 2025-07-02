/**
 * Admin Login API Handler
 * Handles secure authentication with rate limiting, input validation,
 * JWT token generation, and comprehensive security logging.
 * 
 * @route POST /api/admin/login
 * @body {username: string, password: string, rememberMe?: boolean}
 * @returns {token: string, user: object, session: object}
 */

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { executeQuery } from '../../lib/db.js'
import { 
  setCorsHeaders, 
  handleOptions, 
  generateToken 
} from '../../lib/auth.js'
import { 
  loginValidation, 
  handleValidationErrors 
} from '../../lib/validation.js'
import { 
  MESSAGES, 
  USER_ROLES,
  JWT_CONFIG 
} from '../../lib/constants.js'

// In-memory rate limiting store (use Redis in production)
const loginAttempts = new Map()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes
const ATTEMPT_WINDOW = 5 * 60 * 1000 // 5 minutes

/**
 * Main handler function
 */
export default async function handler(req, res) {
  try {
    // Setup CORS headers
    setCorsHeaders(res)
    if (handleOptions(req, res)) return

    // Only allow POST requests
    if (req.method !== 'POST') {
      return sendErrorResponse(res, 'Method not allowed', 405)
    }

    // Get client IP for rate limiting
    const clientIP = getClientIP(req)
    
    // Check rate limiting
    const rateLimitResult = checkRateLimit(clientIP)
    if (!rateLimitResult.allowed) {
      return sendErrorResponse(res, 'Too many login attempts. Please try again later.', 429, {
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: rateLimitResult.retryAfter,
        attemptsRemaining: 0
      })
    }

    // Validate request body
    await Promise.all(loginValidation.map(validation => validation.run(req)))
    const validationErrors = handleValidationErrors(req, res)
    if (validationErrors) {
      recordFailedAttempt(clientIP)
      return
    }

    return await processLogin(req, res, clientIP)

  } catch (error) {
    console.error('Login handler error:', error)
    return sendErrorResponse(res, 'Authentication service temporarily unavailable', 503, {
      code: 'SERVICE_ERROR'
    })
  }
}

/**
 * Process login authentication
 */
async function processLogin(req, res, clientIP) {
  const { username, password, rememberMe = false } = req.body
  const loginTimestamp = new Date().toISOString()

  try {
    // Sanitize username input
    const sanitizedUsername = username.trim().toLowerCase()

    // Find user by username with security-focused query
    const userResult = await executeQuery(
      `SELECT id, username, email, password_hash, role, 
              created_at, last_login, 
              CASE WHEN last_login IS NULL THEN true ELSE false END as is_first_login
       FROM admin_users 
       WHERE LOWER(username) = $1 AND created_at IS NOT NULL`,
      [sanitizedUsername]
    )

    // User not found - use timing-safe comparison
    if (userResult.rows.length === 0) {
      // Simulate password hashing to prevent timing attacks
      await bcrypt.compare('dummy_password', '$2a$12$dummy.hash.to.prevent.timing.attacks')
      
      recordFailedAttempt(clientIP, sanitizedUsername)
      logSecurityEvent('LOGIN_FAILED', { 
        username: sanitizedUsername, 
        reason: 'USER_NOT_FOUND',
        clientIP,
        timestamp: loginTimestamp
      })

      return sendErrorResponse(res, MESSAGES.ERROR.INVALID_CREDENTIALS, 401, {
        code: 'INVALID_CREDENTIALS'
      })
    }

    const user = userResult.rows[0]

    // Verify password with timing-safe comparison
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      recordFailedAttempt(clientIP, sanitizedUsername)
      logSecurityEvent('LOGIN_FAILED', {
        username: sanitizedUsername,
        userId: user.id,
        reason: 'INVALID_PASSWORD',
        clientIP,
        timestamp: loginTimestamp
      })

      return sendErrorResponse(res, MESSAGES.ERROR.INVALID_CREDENTIALS, 401, {
        code: 'INVALID_CREDENTIALS'
      })
    }

    // Authentication successful - clear failed attempts
    clearFailedAttempts(clientIP)

    // Update last login timestamp
    await executeQuery(
      'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    )

    // Generate JWT tokens
    const tokenExpiry = rememberMe ? '7d' : '24h'
    const accessToken = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      type: 'access'
    }, tokenExpiry)

    // Generate refresh token for extended sessions
    const refreshToken = rememberMe ? generateToken({
      userId: user.id,
      type: 'refresh'
    }, '30d') : null

    // Log successful login
    logSecurityEvent('LOGIN_SUCCESS', {
      username: user.username,
      userId: user.id,
      role: user.role,
      clientIP,
      rememberMe,
      isFirstLogin: user.is_first_login,
      timestamp: loginTimestamp
    })

    // Prepare response data
    const responseData = {
      auth: {
        accessToken,
        ...(refreshToken && { refreshToken }),
        tokenType: 'Bearer',
        expiresIn: tokenExpiry
      },
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: getRolePermissions(user.role),
        isFirstLogin: user.is_first_login
      },
      session: {
        loginTime: loginTimestamp,
        lastLogin: user.last_login,
        rememberMe,
        clientIP: process.env.NODE_ENV === 'development' ? clientIP : undefined
      }
    }

    // Send welcome message for first-time login
    if (user.is_first_login) {
      responseData.welcome = {
        message: 'Welcome to Ethiopian Coffee Tours Admin Panel!',
        isFirstLogin: true,
        recommendations: [
          'Update your password for security',
          'Familiarize yourself with the dashboard',
          'Review pending bookings'
        ]
      }
    }

    return sendSuccessResponse(res, responseData, {
      message: MESSAGES.SUCCESS.LOGIN_SUCCESS
    })

  } catch (error) {
    console.error('Authentication error:', error)
    
    // Log system error
    logSecurityEvent('LOGIN_ERROR', {
      username: req.body.username,
      error: error.message,
      clientIP,
      timestamp: loginTimestamp
    })

    return sendErrorResponse(res, 'Authentication failed due to system error', 500, {
      code: 'AUTH_SYSTEM_ERROR'
    })
  }
}

/**
 * Rate limiting functions
 */
function checkRateLimit(clientIP) {
  const now = Date.now()
  const attempts = loginAttempts.get(clientIP) || []
  
  // Clean old attempts
  const recentAttempts = attempts.filter(attempt => 
    now - attempt.timestamp < ATTEMPT_WINDOW
  )

  // Check if locked out
  const failedAttempts = recentAttempts.filter(attempt => !attempt.success)
  if (failedAttempts.length >= MAX_ATTEMPTS) {
    const oldestFailure = failedAttempts[0].timestamp
    const retryAfter = Math.ceil((oldestFailure + LOCKOUT_DURATION - now) / 1000)
    
    if (retryAfter > 0) {
      return { allowed: false, retryAfter }
    }
  }

  return { allowed: true, attemptsRemaining: MAX_ATTEMPTS - failedAttempts.length }
}

function recordFailedAttempt(clientIP, username = null) {
  const attempts = loginAttempts.get(clientIP) || []
  attempts.push({
    timestamp: Date.now(),
    success: false,
    username
  })
  
  // Keep only recent attempts
  const recentAttempts = attempts.filter(attempt => 
    Date.now() - attempt.timestamp < ATTEMPT_WINDOW
  )
  
  loginAttempts.set(clientIP, recentAttempts)
}

function clearFailedAttempts(clientIP) {
  const attempts = loginAttempts.get(clientIP) || []
  attempts.push({
    timestamp: Date.now(),
    success: true
  })
  loginAttempts.set(clientIP, attempts)
}

/**
 * Get client IP address
 */
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         'unknown'
}

/**
 * Get role-based permissions
 */
function getRolePermissions(role) {
  const permissions = {
    [USER_ROLES.ADMIN]: [
      'bookings:read',
      'bookings:write',
      'bookings:delete',
      'users:read',
      'users:write',
      'analytics:read',
      'settings:write'
    ],
    [USER_ROLES.MANAGER]: [
      'bookings:read',
      'bookings:write',
      'analytics:read'
    ]
  }

  return permissions[role] || []
}

/**
 * Security event logging
 */
function logSecurityEvent(event, data) {
  const logEntry = {
    event,
    timestamp: new Date().toISOString(),
    service: 'admin-auth',
    ...data
  }

  // In production, send to security monitoring service
  console.log('SECURITY_EVENT:', JSON.stringify(logEntry))
  
  // TODO: Integrate with security monitoring (e.g., Sentry, DataDog)
  // securityMonitor.log(logEntry)
}

/**
 * Send standardized success response
 */
function sendSuccessResponse(res, data, meta = {}) {
  return res.status(200).json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      service: 'admin-auth',
      ...meta
    }
  })
}

/**
 * Send standardized error response
 */
function sendErrorResponse(res, message, status = 500, meta = {}) {
  return res.status(status).json({
    success: false,
    error: {
      message,
      status,
      timestamp: new Date().toISOString(),
      service: 'admin-auth',
      ...meta
    }
  })
}