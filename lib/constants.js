// lib/constants.js - Application constants
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
}

export const BOOKING_TYPE = {
  INDIVIDUAL: 'individual',
  GROUP: 'group'
}

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager'
}

export const TOUR_PACKAGES = [
  'southern-ethiopia',
  'northern-ethiopia',
  'western-ethiopia',
  'complete-ethiopia'
]

export const MESSAGES = {
  SUCCESS: {
    BOOKING_CREATED: 'Booking submitted successfully',
    LOGIN_SUCCESS: 'Login successful',
    EMAIL_SENT: 'Email sent successfully'
  },
  ERROR: {
    BOOKING_EXISTS: 'A booking with this email already exists for the selected package',
    INVALID_CREDENTIALS: 'Invalid username or password',
    UNAUTHORIZED: 'Access denied. Authentication required',
    VALIDATION_FAILED: 'Validation failed'
  }
}

export const RATE_LIMITS = {
  BOOKING: { WINDOW_MS: 60 * 60 * 1000, MAX_REQUESTS: 5 },
  LOGIN: { WINDOW_MS: 15 * 60 * 1000, MAX_REQUESTS: 5 },
  GENERAL: { WINDOW_MS: 15 * 60 * 1000, MAX_REQUESTS: 100 }
}