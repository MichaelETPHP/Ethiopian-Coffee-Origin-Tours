// lib/api-utils.js - Professional API utilities
import jwt from 'jsonwebtoken'
import { config } from './config.js'
import { formatValidationErrors } from './validation.js'
import { db } from './db-production.js'

/**
 * Set CORS headers for API responses
 */
export function setCorsHeaders(res) {
  const { cors } = config.server

  res.setHeader('Access-Control-Allow-Credentials', cors.credentials)
  res.setHeader(
    'Access-Control-Allow-Origin',
    Array.isArray(cors.origin) ? cors.origin.join(',') : cors.origin
  )
  res.setHeader('Access-Control-Allow-Methods', cors.methods.join(','))
  res.setHeader('Access-Control-Allow-Headers', cors.allowedHeaders.join(','))

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  if (config.app.environment === 'production') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    )
  }
}

/**
 * Handle preflight OPTIONS requests
 */
export function handleOptions(req, res) {
  setCorsHeaders(res)
  res.status(200).end()
}

/**
 * Standardized success response
 */
export function successResponse(
  res,
  data,
  message = 'Success',
  statusCode = 200
) {
  setCorsHeaders(res)
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Standardized error response
 */
export function errorResponse(res, error, statusCode = 500) {
  setCorsHeaders(res)

  const response = {
    success: false,
    error: error.message || 'An error occurred',
    timestamp: new Date().toISOString(),
  }

  // Add validation errors if present
  if (error.name === 'ValidationError' && error.errors) {
    response.validationErrors = formatValidationErrors(error.errors)
  }

  // Add details in development
  if (config.app.environment === 'development') {
    response.details = {
      stack: error.stack,
      name: error.name,
      code: error.code,
    }
  }

  console.error('❌ API Error:', {
    error: error.message,
    stack: error.stack,
    statusCode,
  })

  res.status(statusCode).json(response)
}

/**
 * Verify JWT token and get user info
 */
export async function verifyToken(token) {
  try {
    if (!token) {
      throw new Error('No token provided')
    }

    const decoded = jwt.verify(token, config.jwt.secret)

    // Get user from database to ensure they still exist
    const user = await db.get(
      'SELECT id, username, email, role, locked_until FROM admin_users WHERE id = $1',
      [decoded.userId]
    )

    if (!user) {
      throw new Error('User not found')
    }

    // Check if user is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      throw new Error('Account is temporarily locked')
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token')
    } else if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired')
    } else {
      throw error
    }
  }
}

/**
 * Authentication middleware for admin routes
 */
export async function authenticateAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.header('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return errorResponse(
        res,
        new Error('Access denied. No token provided.'),
        401
      )
    }

    const user = await verifyToken(token)
    req.user = user

    if (next) next()
    return user
  } catch (error) {
    return errorResponse(res, new Error('Invalid or expired token'), 401)
  }
}

/**
 * Method validation middleware
 */
export function validateMethod(req, res, allowedMethods) {
  if (!allowedMethods.includes(req.method)) {
    return errorResponse(
      res,
      new Error(`Method ${req.method} not allowed`),
      405
    )
  }
  return true
}

/**
 * Rate limiting check (simple implementation)
 */
const requestCounts = new Map()

export function checkRateLimit(req, res) {
  if (config.app.environment !== 'production') {
    return true // Skip in development
  }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const now = Date.now()
  const windowStart = now - config.rateLimit.windowMs

  // Clean old entries
  for (const [key, value] of requestCounts.entries()) {
    if (value.timestamp < windowStart) {
      requestCounts.delete(key)
    }
  }

  // Check current IP
  const current = requestCounts.get(ip) || { count: 0, timestamp: now }

  if (current.timestamp < windowStart) {
    current.count = 1
    current.timestamp = now
  } else {
    current.count++
  }

  requestCounts.set(ip, current)

  if (current.count > config.rateLimit.max) {
    return errorResponse(res, new Error(config.rateLimit.message), 429)
  }

  return true
}

/**
 * Log API request
 */
export function logRequest(req) {
  const timestamp = new Date().toISOString()
  const method = req.method
  const url = req.url
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const userAgent = req.headers['user-agent']

  console.log(
    `📝 ${timestamp} - ${method} ${url} - IP: ${ip} - UA: ${userAgent?.substring(
      0,
      50
    )}`
  )
}

/**
 * Validate request body exists
 */
export function validateRequestBody(req, res) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return errorResponse(res, new Error('Request body is required'), 400)
  }
  return true
}

/**
 * Handle async API route with error catching
 */
export function asyncHandler(handler) {
  return async (req, res) => {
    try {
      // Log request
      logRequest(req)

      // Handle CORS preflight
      if (req.method === 'OPTIONS') {
        return handleOptions(req, res)
      }

      // Check rate limiting
      const rateLimitResult = checkRateLimit(req, res)
      if (rateLimitResult !== true) {
        return rateLimitResult
      }

      // Execute handler
      await handler(req, res)
    } catch (error) {
      console.error('❌ Unhandled API error:', error)
      return errorResponse(res, error, 500)
    }
  }
}

/**
 * Create standardized API handler
 */
export function createApiHandler(config) {
  const { methods = ['GET'], requireAuth = false, validate } = config

  return asyncHandler(async (req, res) => {
    // Validate method
    if (!validateMethod(req, res, [...methods, 'OPTIONS'])) {
      return
    }

    // Handle authentication
    let user = null
    if (requireAuth) {
      user = await authenticateAdmin(req, res)
      if (!user) return // Error already sent by authenticateAdmin
    }

    // Validate request body for non-GET requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      if (!validateRequestBody(req, res)) {
        return
      }
    }

    // Custom validation
    if (validate) {
      try {
        validate(req.body || {})
      } catch (error) {
        return errorResponse(res, error, 400)
      }
    }

    // Execute method-specific handler
    const methodHandler = config[req.method.toLowerCase()]
    if (!methodHandler) {
      return errorResponse(
        res,
        new Error(`Handler for ${req.method} not implemented`),
        501
      )
    }

    try {
      const result = await methodHandler(req, res, user)

      // If handler didn't send response, send success
      if (!res.headersSent && result !== undefined) {
        return successResponse(res, result)
      }
    } catch (error) {
      return errorResponse(res, error)
    }
  })
}

/**
 * Paginate database results
 */
export function getPaginationParams(query) {
  const page = Math.max(1, parseInt(query.page) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 50))
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

/**
 * Create paginated response
 */
export function createPaginatedResponse(data, total, page, limit) {
  const totalPages = Math.ceil(total / limit)

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

/**
 * Sanitize database error messages
 */
export function sanitizeDatabaseError(error) {
  if (error.code === '23505') {
    // Unique constraint violation
    return new Error('Record already exists')
  } else if (error.code === '23503') {
    // Foreign key constraint violation
    return new Error('Referenced record does not exist')
  } else if (error.code === '23514') {
    // Check constraint violation
    return new Error('Invalid data provided')
  } else if (error.code === '42P01') {
    // Undefined table
    return new Error('Database not properly initialized')
  } else {
    return new Error('Database operation failed')
  }
}

export default {
  setCorsHeaders,
  handleOptions,
  successResponse,
  errorResponse,
  verifyToken,
  authenticateAdmin,
  validateMethod,
  checkRateLimit,
  logRequest,
  validateRequestBody,
  asyncHandler,
  createApiHandler,
  getPaginationParams,
  createPaginatedResponse,
  sanitizeDatabaseError,
}
