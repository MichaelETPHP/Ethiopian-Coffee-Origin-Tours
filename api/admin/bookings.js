// api/admin/bookings.js - Simple working version
import jwt from 'jsonwebtoken'
import pg from 'pg'

const { Pool } = pg

// Create database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  max: 10,
})

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

  // Simple authentication check
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    )
    console.log('Token verified for user:', decoded.username)
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }

  // Handle different methods
  if (req.method === 'GET') {
    return await getBookings(req, res)
  } else if (req.method === 'PATCH') {
    return await updateBooking(req, res)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

// Get all bookings
async function getBookings(req, res) {
  try {
    const {
      page = 1,
      limit = 50,
      search = '',
      status = '',
      package: packageFilter = '',
    } = req.query

    console.log('Getting bookings with filters:', {
      page,
      limit,
      search,
      status,
      packageFilter,
    })

    const offset = (page - 1) * limit

    let query = 'SELECT * FROM bookings WHERE 1=1'
    let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE 1=1'
    const params = []
    const countParams = []
    let paramIndex = 1

    // Add search filter
    if (search) {
      query += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${
        paramIndex + 1
      } OR phone ILIKE $${paramIndex + 2})`
      countQuery += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${
        paramIndex + 1
      } OR phone ILIKE $${paramIndex + 2})`
      const searchParam = `%${search}%`
      params.push(searchParam, searchParam, searchParam)
      countParams.push(searchParam, searchParam, searchParam)
      paramIndex += 3
    }

    // Add status filter
    if (status) {
      query += ` AND status = $${paramIndex}`
      countQuery += ` AND status = $${paramIndex}`
      params.push(status)
      countParams.push(status)
      paramIndex += 1
    }

    // Add package filter
    if (packageFilter) {
      query += ` AND selected_package ILIKE $${paramIndex}`
      countQuery += ` AND selected_package ILIKE $${paramIndex}`
      params.push(`%${packageFilter}%`)
      countParams.push(`%${packageFilter}%`)
      paramIndex += 1
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${
      paramIndex + 1
    }`
    params.push(parseInt(limit), parseInt(offset))

    const client = await pool.connect()

    try {
      console.log('Executing query:', query)
      console.log('With params:', params)

      const [bookingsResult, countResult] = await Promise.all([
        client.query(query, params),
        client.query(countQuery, countParams),
      ])

      console.log('Found', bookingsResult.rows.length, 'bookings')

      res.status(200).json({
        success: true,
        bookings: bookingsResult.rows,
        total: parseInt(countResult.rows[0]?.total || 0),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((countResult.rows[0]?.total || 0) / limit),
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Get bookings error:', error)
    res.status(500).json({
      error: 'Failed to fetch bookings',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}

// Update booking status
async function updateBooking(req, res) {
  try {
    const { id } = req.query
    const { status, notes } = req.body

    console.log('Updating booking', id, 'to status:', status)

    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required' })
    }

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const client = await pool.connect()

    try {
      const result = await client.query(
        'UPDATE bookings SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [status, notes || null, id]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' })
      }

      console.log('Booking updated successfully')

      res.status(200).json({
        success: true,
        message: 'Booking updated successfully',
        booking: result.rows[0],
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Update booking error:', error)
    res.status(500).json({
      error: 'Failed to update booking',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}
