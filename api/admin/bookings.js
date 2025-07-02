/**
 * Admin Bookings API Handler
 * Manages CRUD operations for bookings with proper authentication,
 * validation, error handling, and response formatting.
 * 
 * @route GET /api/admin/bookings - Fetch paginated bookings with filters
 * @route PATCH /api/admin/bookings - Update booking status
 * @auth Required - Admin/Manager role
 */

import { getPool, executeQuery } from '../../lib/db.js'
import { 
  authenticateAdmin, 
  setCorsHeaders, 
  handleOptions 
} from '../../lib/auth.js'
import { 
  sanitizeQuery, 
  statusUpdateValidation, 
  handleValidationErrors 
} from '../../lib/validation.js'
import { 
  sendStatusUpdate, 
  sendBookingConfirmation 
} from '../../lib/email.js'
import { 
  BOOKING_STATUS, 
  MESSAGES 
} from '../../lib/constants.js'

/**
 * Main handler function
 */
export default async function handler(req, res) {
  try {
    // Setup CORS headers
    setCorsHeaders(res)
    if (handleOptions(req, res)) return

    // Authenticate admin user
    const authResult = await authenticateAdmin(req)
    if (!authResult.success) {
      return sendErrorResponse(res, authResult.error, authResult.status)
    }

    // Route to appropriate method handler
    switch (req.method) {
      case 'GET':
        return await handleGetBookings(req, res, authResult.user)
      case 'PATCH':
        return await handleUpdateBooking(req, res, authResult.user)
      default:
        return sendErrorResponse(res, 'Method not allowed', 405)
    }
  } catch (error) {
    console.error('Admin bookings handler error:', error)
    return sendErrorResponse(res, 'Internal server error', 500)
  }
}

/**
 * Handle GET requests - Fetch bookings with pagination and filters
 */
async function handleGetBookings(req, res, user) {
  try {
    // Sanitize and validate query parameters
    const filters = sanitizeQuery(req.query)
    const { page, limit, search, status, package: packageFilter } = filters

    // Build dynamic query with parameterized inputs
    const queryBuilder = new BookingsQueryBuilder()
    const { query, countQuery, params, countParams } = queryBuilder
      .addSearch(search)
      .addStatusFilter(status)
      .addPackageFilter(packageFilter)
      .addPagination(page, limit)
      .build()

    // Execute queries concurrently for better performance
    const [bookingsResult, countResult] = await Promise.all([
      executeQuery(query, params),
      executeQuery(countQuery, countParams)
    ])

    const total = parseInt(countResult.rows[0]?.total || 0)
    const totalPages = Math.ceil(total / limit)

    // Format response data
    const responseData = {
      bookings: bookingsResult.rows.map(formatBookingForResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        search: search || null,
        status: status || null,
        package: packageFilter || null
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestedBy: user.username
      }
    }

    return sendSuccessResponse(res, responseData)

  } catch (error) {
    console.error('Get bookings error:', error)
    return sendErrorResponse(res, 'Failed to fetch bookings', 500, {
      code: 'FETCH_BOOKINGS_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

/**
 * Handle PATCH requests - Update booking status
 */
async function handleUpdateBooking(req, res, user) {
  try {
    const { id } = req.query
    if (!id) {
      return sendErrorResponse(res, 'Booking ID is required', 400)
    }

    // Validate request body
    await Promise.all(statusUpdateValidation.map(validation => validation.run(req)))
    const validationErrors = handleValidationErrors(req, res)
    if (validationErrors) return

    const { status, notes } = req.body

    // Verify booking exists and get current data
    const bookingResult = await executeQuery(
      'SELECT * FROM bookings WHERE id = $1',
      [id]
    )

    if (bookingResult.rows.length === 0) {
      return sendErrorResponse(res, 'Booking not found', 404)
    }

    const currentBooking = bookingResult.rows[0]
    const oldStatus = currentBooking.status

    // Prevent unnecessary updates
    if (currentBooking.status === status && currentBooking.notes === notes) {
      return sendSuccessResponse(res, {
        message: 'Booking already has the requested status',
        booking: formatBookingForResponse(currentBooking)
      })
    }

    // Update booking with audit trail
    const updateResult = await executeQuery(
      `UPDATE bookings 
       SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [status, notes, id]
    )

    const updatedBooking = updateResult.rows[0]

    // Log admin action
    console.log(`Admin action: ${user.username} updated booking ${id} from ${oldStatus} to ${status}`)

    // Send status update email asynchronously (don't wait for completion)
    if (oldStatus !== status) {
      setImmediate(async () => {
        try {
          await sendStatusUpdate(updatedBooking, oldStatus)
          
          // Send confirmation email for confirmed bookings
          if (status === BOOKING_STATUS.CONFIRMED) {
            await sendBookingConfirmation(updatedBooking)
          }
        } catch (emailError) {
          console.error('Email notification failed:', emailError)
        }
      })
    }

    return sendSuccessResponse(res, {
      message: MESSAGES.SUCCESS.BOOKING_UPDATED || 'Booking updated successfully',
      booking: formatBookingForResponse(updatedBooking),
      changes: {
        status: { from: oldStatus, to: status },
        notes: { from: currentBooking.notes, to: notes },
        updatedBy: user.username,
        updatedAt: updatedBooking.updated_at
      }
    })

  } catch (error) {
    console.error('Update booking error:', error)
    return sendErrorResponse(res, 'Failed to update booking', 500, {
      code: 'UPDATE_BOOKING_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}

/**
 * Query builder class for dynamic booking queries
 */
class BookingsQueryBuilder {
  constructor() {
    this.baseQuery = 'SELECT * FROM bookings WHERE 1=1'
    this.baseCountQuery = 'SELECT COUNT(*) as total FROM bookings WHERE 1=1'
    this.params = []
    this.countParams = []
    this.paramIndex = 1
  }

  addSearch(search) {
    if (search) {
      const searchCondition = ` AND (full_name ILIKE $${this.paramIndex} OR email ILIKE $${this.paramIndex + 1} OR phone ILIKE $${this.paramIndex + 2})`
      this.baseQuery += searchCondition
      this.baseCountQuery += searchCondition
      
      const searchParam = `%${search}%`
      this.params.push(searchParam, searchParam, searchParam)
      this.countParams.push(searchParam, searchParam, searchParam)
      this.paramIndex += 3
    }
    return this
  }

  addStatusFilter(status) {
    if (status) {
      this.baseQuery += ` AND status = $${this.paramIndex}`
      this.baseCountQuery += ` AND status = $${this.paramIndex}`
      this.params.push(status)
      this.countParams.push(status)
      this.paramIndex += 1
    }
    return this
  }

  addPackageFilter(packageFilter) {
    if (packageFilter) {
      this.baseQuery += ` AND selected_package ILIKE $${this.paramIndex}`
      this.baseCountQuery += ` AND selected_package ILIKE $${this.paramIndex}`
      this.params.push(`%${packageFilter}%`)
      this.countParams.push(`%${packageFilter}%`)
      this.paramIndex += 1
    }
    return this
  }

  addPagination(page, limit) {
    const offset = (page - 1) * limit
    this.baseQuery += ` ORDER BY created_at DESC LIMIT $${this.paramIndex} OFFSET $${this.paramIndex + 1}`
    this.params.push(parseInt(limit), parseInt(offset))
    return this
  }

  build() {
    return {
      query: this.baseQuery,
      countQuery: this.baseCountQuery,
      params: this.params,
      countParams: this.countParams
    }
  }
}

/**
 * Format booking object for API response
 */
function formatBookingForResponse(booking) {
  return {
    id: booking.id,
    customer: {
      fullName: booking.full_name,
      email: booking.email,
      phone: booking.phone,
      age: booking.age,
      country: booking.country
    },
    booking: {
      type: booking.booking_type,
      numberOfPeople: booking.number_of_people,
      selectedPackage: booking.selected_package,
      status: booking.status,
      notes: booking.notes
    },
    timestamps: {
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    }
  }
}

/**
 * Send standardized success response
 */
function sendSuccessResponse(res, data, status = 200) {
  return res.status(status).json({
    success: true,
    data,
    timestamp: new Date().toISOString()
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
      ...meta
    },
    timestamp: new Date().toISOString()
  })
}