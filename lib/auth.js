// lib/auth.js - Authentication utilities
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { db } from './db.js'

/**
 * Set CORS headers for API responses
 * @param {Object} res - Response object
 */
export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', 
    process.env.NODE_ENV === 'production' 
      ? (process.env.FRONTEND_URL || '*')
      : '*'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )
}

/**
 * Handle CORS preflight requests
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {boolean} - True if handled, false otherwise
 */
export function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res)
    res.status(200).end()
    return true
  }
  return false
}

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {string} expiresIn - Token expiration
 * @returns {string} - JWT token
 */
export function generateToken(payload, expiresIn = '24h') {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn }
  )
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
  } catch (error) {
    throw new Error('Invalid token')
  }
}

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Salt rounds (default: 12)
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password, saltRounds = 12) {
  return bcrypt.hash(password, saltRounds)
}

/**
 * Compare password with hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - Comparison result
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

/**
 * Extract token from Authorization header
 * @param {Object} req - Request object
 * @returns {string|null} - Extracted token or null
 */
export function extractToken(req) {
  const authHeader = req.headers.authorization
  if (!authHeader) return null
  
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7) // Remove 'Bearer ' prefix
  }
  
  return authHeader
}

/**
 * Authenticate admin user middleware
 * @param {Object} req - Request object
 * @returns {Promise<Object>} - Authentication result
 */
export async function authenticateAdmin(req) {
  try {
    const token = extractToken(req)
    
    if (!token) {
      return { 
        success: false, 
        error: 'Access denied. No token provided.',
        status: 401 
      }
    }

    // Verify token
    const decoded = verifyToken(token)
    
    // Get user from database
    const result = await db.admin.findByUsername(decoded.username)
    
    if (result.rows.length === 0) {
      return { 
        success: false, 
        error: 'Invalid token. User not found.',
        status: 401 
      }
    }

    const user = result.rows[0]
    
    return { 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Authentication failed',
      status: 401 
    }
  }
}

/**
 * Login admin user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} - Login result
 */
export async function loginAdmin(username, password) {
  try {
    // Find user by username
    const result = await db.admin.findByUsername(username)
    
    if (result.rows.length === 0) {
      return {
        success: false,
        error: 'Invalid credentials',
        status: 401
      }
    }

    const user = result.rows[0]
    
    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash)
    
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid credentials',
        status: 401
      }
    }

    // Update last login
    await db.admin.updateLastLogin(user.id)

    // Generate token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    })

    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Login failed: ' + error.message,
      status: 500
    }
  }
}

/**
 * Create admin user (for initial setup)
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Creation result
 */
export async function createAdmin(userData) {
  try {
    const { username, email, password, role = 'admin' } = userData
    
    // Hash password
    const passwordHash = await hashPassword(password)
    
    // Create user
    const result = await db.admin.create({
      username,
      email,
      passwordHash,
      role
    })

    return {
      success: true,
      userId: result.rows[0].id
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create admin: ' + error.message
    }
  }
}

/**
 * Check if user has required role
 * @param {Object} user - User object
 * @param {string|Array} requiredRole - Required role(s)
 * @returns {boolean} - Authorization result
 */
export function authorizeRole(user, requiredRole) {
  if (!user || !user.role) return false
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role)
  }
  
  return user.role === requiredRole
}

/**
 * Middleware wrapper for API routes with authentication
 * @param {Function} handler - Route handler function
 * @param {Object} options - Middleware options
 * @returns {Function} - Wrapped handler
 */
export function withAuth(handler, options = {}) {
  return async (req, res) => {
    // Handle CORS
    setCorsHeaders(res)
    if (handleOptions(req, res)) return

    // Authenticate user
    const authResult = await authenticateAdmin(req)
    
    if (!authResult.success) {
      return res.status(authResult.status).json({ error: authResult.error })
    }

    // Check role if specified
    if (options.role && !authorizeRole(authResult.user, options.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    // Add user to request
    req.user = authResult.user

    // Call original handler
    return handler(req, res)
  }
}

/**
 * API response helpers
 */
export const apiResponse = {
  success: (res, data, status = 200) => {
    res.status(status).json({
      success: true,
      data
    })
  },

  error: (res, message, status = 500, details = null) => {
    res.status(status).json({
      success: false,
      error: message,
      ...(details && { details })
    })
  },

  unauthorized: (res, message = 'Unauthorized') => {
    res.status(401).json({
      success: false,
      error: message
    })
  },

  forbidden: (res, message = 'Forbidden') => {
    res.status(403).json({
      success: false,
      error: message
    })
  },

  notFound: (res, message = 'Not found') => {
    res.status(404).json({
      success: false,
      error: message
    })
  }
}