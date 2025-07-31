// lib/validation.js - Professional validation utilities
import { config } from './config.js'

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Phone validation regex (international format)
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/

// Name validation regex (letters, spaces, hyphens, apostrophes)
const NAME_REGEX = /^[a-zA-Z\s\-']{2,100}$/

// Country validation regex
const COUNTRY_REGEX = /^[a-zA-Z\s\-']{2,100}$/

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(field, message, code = 'VALIDATION_ERROR') {
    super(message)
    this.name = 'ValidationError'
    this.field = field
    this.code = code
  }
}

/**
 * Validate booking data
 */
export function validateBookingData(data) {
  const errors = []
  const { validation } = config

  // Validate full name
  if (!data.fullName) {
    errors.push(new ValidationError('fullName', 'Full name is required'))
  } else if (typeof data.fullName !== 'string') {
    errors.push(new ValidationError('fullName', 'Full name must be a string'))
  } else if (data.fullName.trim().length < validation.booking.nameMinLength) {
    errors.push(
      new ValidationError(
        'fullName',
        `Full name must be at least ${validation.booking.nameMinLength} characters`
      )
    )
  } else if (data.fullName.trim().length > validation.booking.nameMaxLength) {
    errors.push(
      new ValidationError(
        'fullName',
        `Full name must be less than ${validation.booking.nameMaxLength} characters`
      )
    )
  } else if (!NAME_REGEX.test(data.fullName.trim())) {
    errors.push(
      new ValidationError('fullName', 'Full name contains invalid characters')
    )
  }

  // Validate age
  if (!data.age) {
    errors.push(new ValidationError('age', 'Age is required'))
  } else if (!Number.isInteger(Number(data.age))) {
    errors.push(new ValidationError('age', 'Age must be a valid number'))
  } else if (Number(data.age) < validation.booking.ageMin) {
    errors.push(
      new ValidationError(
        'age',
        `Age must be at least ${validation.booking.ageMin}`
      )
    )
  } else if (Number(data.age) > validation.booking.ageMax) {
    errors.push(
      new ValidationError(
        'age',
        `Age must be less than ${validation.booking.ageMax}`
      )
    )
  }

  // Validate email
  if (!data.email) {
    errors.push(new ValidationError('email', 'Email is required'))
  } else if (typeof data.email !== 'string') {
    errors.push(new ValidationError('email', 'Email must be a string'))
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.push(new ValidationError('email', 'Email format is invalid'))
  } else if (data.email.trim().length > 255) {
    errors.push(new ValidationError('email', 'Email is too long'))
  }

  // Validate phone
  if (!data.phone) {
    errors.push(new ValidationError('phone', 'Phone number is required'))
  } else if (typeof data.phone !== 'string') {
    errors.push(new ValidationError('phone', 'Phone number must be a string'))
  } else {
    const cleanPhone = data.phone.replace(/[\s\-\(\)\.]/g, '')
    if (cleanPhone.length < validation.booking.phoneMinLength) {
      errors.push(
        new ValidationError(
          'phone',
          `Phone number must be at least ${validation.booking.phoneMinLength} digits`
        )
      )
    } else if (cleanPhone.length > validation.booking.phoneMaxLength) {
      errors.push(
        new ValidationError(
          'phone',
          `Phone number must be less than ${validation.booking.phoneMaxLength} digits`
        )
      )
    } else if (!PHONE_REGEX.test(cleanPhone)) {
      errors.push(
        new ValidationError('phone', 'Phone number format is invalid')
      )
    }
  }

  // Validate country
  if (!data.country) {
    errors.push(new ValidationError('country', 'Country is required'))
  } else if (typeof data.country !== 'string') {
    errors.push(new ValidationError('country', 'Country must be a string'))
  } else if (data.country.trim().length < validation.booking.countryMinLength) {
    errors.push(
      new ValidationError(
        'country',
        `Country must be at least ${validation.booking.countryMinLength} characters`
      )
    )
  } else if (data.country.trim().length > validation.booking.countryMaxLength) {
    errors.push(
      new ValidationError(
        'country',
        `Country must be less than ${validation.booking.countryMaxLength} characters`
      )
    )
  } else if (!COUNTRY_REGEX.test(data.country.trim())) {
    errors.push(
      new ValidationError('country', 'Country contains invalid characters')
    )
  }

  // Validate booking type
  if (!data.bookingType) {
    errors.push(new ValidationError('bookingType', 'Booking type is required'))
  } else if (!['individual', 'group'].includes(data.bookingType)) {
    errors.push(
      new ValidationError(
        'bookingType',
        'Booking type must be either "individual" or "group"'
      )
    )
  }

  // Validate number of people (for group bookings)
  if (data.bookingType === 'group') {
    if (!data.numberOfPeople) {
      errors.push(
        new ValidationError(
          'numberOfPeople',
          'Number of people is required for group bookings'
        )
      )
    } else if (!Number.isInteger(Number(data.numberOfPeople))) {
      errors.push(
        new ValidationError(
          'numberOfPeople',
          'Number of people must be a valid number'
        )
      )
    } else if (Number(data.numberOfPeople) < 2) {
      errors.push(
        new ValidationError(
          'numberOfPeople',
          'Group bookings must have at least 2 people'
        )
      )
    } else if (Number(data.numberOfPeople) > 50) {
      errors.push(
        new ValidationError(
          'numberOfPeople',
          'Group bookings cannot exceed 50 people'
        )
      )
    }
  }

  // Validate selected package
  if (!data.selectedPackage) {
    errors.push(
      new ValidationError('selectedPackage', 'Selected package is required')
    )
  } else if (typeof data.selectedPackage !== 'string') {
    errors.push(
      new ValidationError(
        'selectedPackage',
        'Selected package must be a string'
      )
    )
  } else if (data.selectedPackage.trim().length < 2) {
    errors.push(
      new ValidationError('selectedPackage', 'Selected package is too short')
    )
  } else if (data.selectedPackage.trim().length > 255) {
    errors.push(
      new ValidationError('selectedPackage', 'Selected package is too long')
    )
  }

  if (errors.length > 0) {
    const error = new Error('Validation failed')
    error.name = 'ValidationError'
    error.errors = errors
    throw error
  }

  return true
}

/**
 * Validate admin login data
 */
export function validateLoginData(data) {
  const errors = []

  // Validate username
  if (!data.username) {
    errors.push(new ValidationError('username', 'Username is required'))
  } else if (typeof data.username !== 'string') {
    errors.push(new ValidationError('username', 'Username must be a string'))
  } else if (data.username.trim().length < 3) {
    errors.push(
      new ValidationError('username', 'Username must be at least 3 characters')
    )
  } else if (data.username.trim().length > 50) {
    errors.push(
      new ValidationError(
        'username',
        'Username must be less than 50 characters'
      )
    )
  } else if (!/^[a-zA-Z0-9_-]+$/.test(data.username.trim())) {
    errors.push(
      new ValidationError(
        'username',
        'Username can only contain letters, numbers, underscores, and hyphens'
      )
    )
  }

  // Validate password
  if (!data.password) {
    errors.push(new ValidationError('password', 'Password is required'))
  } else if (typeof data.password !== 'string') {
    errors.push(new ValidationError('password', 'Password must be a string'))
  } else if (data.password.length < 6) {
    errors.push(
      new ValidationError('password', 'Password must be at least 6 characters')
    )
  } else if (data.password.length > 128) {
    errors.push(
      new ValidationError(
        'password',
        'Password must be less than 128 characters'
      )
    )
  }

  if (errors.length > 0) {
    const error = new Error('Validation failed')
    error.name = 'ValidationError'
    error.errors = errors
    throw error
  }

  return true
}

/**
 * Validate booking status update
 */
export function validateStatusUpdate(data) {
  const errors = []
  const validStatuses = ['pending', 'confirmed', 'cancelled']

  // Validate status
  if (!data.status) {
    errors.push(new ValidationError('status', 'Status is required'))
  } else if (!validStatuses.includes(data.status)) {
    errors.push(
      new ValidationError(
        'status',
        `Status must be one of: ${validStatuses.join(', ')}`
      )
    )
  }

  // Validate notes (optional)
  if (data.notes && typeof data.notes !== 'string') {
    errors.push(new ValidationError('notes', 'Notes must be a string'))
  } else if (data.notes && data.notes.length > 1000) {
    errors.push(
      new ValidationError('notes', 'Notes must be less than 1000 characters')
    )
  }

  if (errors.length > 0) {
    const error = new Error('Validation failed')
    error.name = 'ValidationError'
    error.errors = errors
    throw error
  }

  return true
}

/**
 * Sanitize input data
 */
export function sanitizeInput(data) {
  if (typeof data === 'string') {
    return data.trim().replace(/[<>]/g, '')
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized = {}
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }

  return data
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email.trim())
}

/**
 * Validate phone format
 */
export function isValidPhone(phone) {
  if (typeof phone !== 'string') return false
  const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '')
  return (
    PHONE_REGEX.test(cleanPhone) &&
    cleanPhone.length >= 10 &&
    cleanPhone.length <= 20
  )
}

/**
 * Format validation errors for API response
 */
export function formatValidationErrors(errors) {
  if (!Array.isArray(errors)) {
    return [{ field: 'unknown', message: 'Validation error occurred' }]
  }

  return errors.map((error) => ({
    field: error.field || 'unknown',
    message: error.message || 'Validation error',
    code: error.code || 'VALIDATION_ERROR',
  }))
}
