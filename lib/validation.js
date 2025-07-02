// lib/validation.js - Input validation utilities
import { body, validationResult } from 'express-validator'

/**
 * Booking validation rules
 */
export const bookingValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Full name must be between 2 and 255 characters')
    .escape(),
  
  body('age')
    .isInt({ min: 18, max: 100 })
    .withMessage('Age must be between 18 and 100'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('phone')
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Phone number must be between 5 and 50 characters')
    .escape(),
  
  body('country')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters')
    .escape(),
  
  body('bookingType')
    .isIn(['individual', 'group'])
    .withMessage('Booking type must be either individual or group'),
  
  body('numberOfPeople')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Number of people must be between 1 and 20'),
  
  body('selectedPackage')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Please select a valid package')
    .isIn([
      'southern-ethiopia',
      'northern-ethiopia', 
      'western-ethiopia',
      'complete-ethiopia'
    ])
    .withMessage('Invalid package selection')
    .escape()
]

/**
 * Admin login validation rules
 */
export const loginValidation = [
  body('username')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Username is required')
    .escape(),
  
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
]

/**
 * Admin creation validation rules
 */
export const adminValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Username must be between 3 and 100 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .escape(),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['admin', 'manager'])
    .withMessage('Role must be either admin or manager')
]

/**
 * Booking status update validation
 */
export const statusUpdateValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'cancelled'])
    .withMessage('Status must be pending, confirmed, or cancelled'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters')
    .escape()
]

/**
 * Email validation rules
 */
export const emailValidation = [
  body('to')
    .isEmail()
    .withMessage('Please provide a valid recipient email'),
  
  body('subject')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject is required and must not exceed 200 characters'),
  
  body('message')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Message is required and must not exceed 5000 characters')
]

/**
 * Query parameter validation
 */
export const queryValidation = {
  page: (value) => {
    const page = parseInt(value)
    return !isNaN(page) && page > 0 ? page : 1
  },
  
  limit: (value) => {
    const limit = parseInt(value)
    return !isNaN(limit) && limit > 0 && limit <= 100 ? limit : 50
  },
  
  search: (value) => {
    return typeof value === 'string' ? value.trim().substring(0, 100) : ''
  },
  
  status: (value) => {
    return ['pending', 'confirmed', 'cancelled'].includes(value) ? value : ''
  },
  
  package: (value) => {
    const validPackages = ['southern-ethiopia', 'northern-ethiopia', 'western-ethiopia', 'complete-ethiopia']
    return validPackages.includes(value) ? value : ''
  }
}

/**
 * Handle validation errors
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object|null} - Validation errors or null if valid
 */
export function handleValidationErrors(req, res) {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }))
    
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: formattedErrors
    })
    
    return formattedErrors
  }
  
  return null
}

/**
 * Sanitize query parameters
 * @param {Object} query - Request query object
 * @returns {Object} - Sanitized query parameters
 */
export function sanitizeQuery(query) {
  return {
    page: queryValidation.page(query.page),
    limit: queryValidation.limit(query.limit),
    search: queryValidation.search(query.search),
    status: queryValidation.status(query.status),
    package: queryValidation.package(query.package)
  }
}

/**
 * Custom validation functions
 */
export const customValidators = {
  /**
   * Validate phone number format
   * @param {string} phone - Phone number
   * @returns {boolean} - Validation result
   */
  isValidPhone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
  },
  
  /**
   * Validate age for booking
   * @param {number} age - Age value
   * @returns {boolean} - Validation result
   */
  isValidAge: (age) => {
    return Number.isInteger(age) && age >= 18 && age <= 100
  },
  
  /**
   * Validate group size
   * @param {string} bookingType - Booking type
   * @param {number} numberOfPeople - Number of people
   * @returns {boolean} - Validation result
   */
  isValidGroupSize: (bookingType, numberOfPeople) => {
    if (bookingType === 'individual') {
      return numberOfPeople === 1 || numberOfPeople === undefined
    }
    return Number.isInteger(numberOfPeople) && numberOfPeople >= 2 && numberOfPeople <= 20
  },
  
  /**
   * Validate email domain
   * @param {string} email - Email address
   * @returns {boolean} - Validation result
   */
  isValidEmailDomain: (email) => {
    const blockedDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com']
    const domain = email.split('@')[1]?.toLowerCase()
    return domain && !blockedDomains.includes(domain)
  },
  
  /**
   * Validate package availability
   * @param {string} packageName - Package name
   * @param {Date} requestDate - Requested date
   * @returns {boolean} - Availability result
   */
  isPackageAvailable: (packageName, requestDate = new Date()) => {
    // Add your package availability logic here
    const validPackages = ['southern-ethiopia', 'northern-ethiopia', 'western-ethiopia', 'complete-ethiopia']
    return validPackages.includes(packageName)
  }
}

/**
 * Validation middleware wrapper
 * @param {Array} validationRules - Validation rules array
 * @returns {Function} - Middleware function
 */
export function validateRequest(validationRules) {
  return async (req, res, next) => {
    // Run all validation rules
    await Promise.all(validationRules.map(validation => validation.run(req)))
    
    // Check for validation errors
    const errors = handleValidationErrors(req, res)
    
    if (!errors) {
      next() // No errors, proceed to next middleware
    }
    // If there are errors, response is already sent by handleValidationErrors
  }
}

/**
 * Rate limiting validation
 */
export const rateLimitConfig = {
  booking: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 booking attempts per hour
    message: {
      success: false,
      error: 'Too many booking attempts. Please try again later.',
      retryAfter: '1 hour'
    }
  },
  
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per 15 minutes
    message: {
      success: false,
      error: 'Too many login attempts. Please try again later.',
      retryAfter: '15 minutes'
    }
  },
  
  email: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 emails per hour
    message: {
      success: false,
      error: 'Email rate limit exceeded. Please try again later.',
      retryAfter: '1 hour'
    }
  }
}