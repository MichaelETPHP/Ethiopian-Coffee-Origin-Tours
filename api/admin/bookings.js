// api/admin/bookings.js
import jwt from 'jsonwebtoken'
import {
  sendPaymentConfirmationEmail,
  sendStatusUpdateEmail,
} from '../../lib/email.js'

// Import database for Vercel deployment
import { db } from '../../lib/db-vercel.js'

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

  // Verify admin authentication
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    )

    // Verify admin user exists
    const adminUser = await db.get(
      'SELECT id, username, role FROM admin_users WHERE id = $1',
      [decoded.userId]
    )

    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid token.' })
    }

    // Handle different methods
    if (req.method === 'GET') {
      return await getBookings(req, res)
    } else if (req.method === 'PATCH') {
      return await updateBooking(req, res)
    } else if (req.method === 'DELETE') {
      return await deleteBooking(req, res)
    } else {
      return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (jwtError) {
    return res.status(401).json({ error: 'Invalid token.' })
  }
}

// Get all bookings with pagination and filtering
async function getBookings(req, res) {
  try {
    const {
      page = 1,
      limit = 50,
      search = '',
      status = '',
      package: packageFilter = '',
    } = req.query
    const offset = (page - 1) * limit

    let query = 'SELECT * FROM bookings WHERE 1=1'
    let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE 1=1'
    const params = []
    const countParams = []
    let paramIndex = 1

    // Add filters
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

    if (status) {
      query += ` AND status = $${paramIndex}`
      countQuery += ` AND status = $${paramIndex}`
      params.push(status)
      countParams.push(status)
      paramIndex += 1
    }

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

    const [bookingsResult, countResult] = await Promise.all([
      db.all(query, params),
      db.all(countQuery, countParams),
    ])

    const total = parseInt(countResult[0]?.total || 0)

    res.status(200).json({
      success: true,
      bookings: bookingsResult,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update booking status
async function updateBooking(req, res) {
  try {
    const { id, status, notes } = req.body

    if (!id || !status) {
      return res
        .status(400)
        .json({ error: 'Booking ID and status are required' })
    }

    console.log(`🔄 Updating booking ${id} status to ${status}`)

    const result = await db.run(
      'UPDATE bookings SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [status, notes || null, id]
    )

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    // Get updated booking
    const booking = await db.get('SELECT * FROM bookings WHERE id = $1', [id])

    // Send status update email
    try {
      console.log(`📧 Sending status update email for booking ${id}`)
      const emailResult = await sendStatusUpdateEmail(booking)

      if (emailResult.success) {
        console.log('✅ Status update email sent successfully')
      } else {
        console.error('❌ Status update email failed:', emailResult.error)
      }
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError)
      // Don't fail the update if email fails
    }

    console.log(`✅ Booking ${id} updated successfully`)

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      booking,
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Delete booking
async function deleteBooking(req, res) {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required' })
    }

    console.log(`🗑️ Deleting booking ${id}...`)

    // Delete the booking
    const result = await db.run('DELETE FROM bookings WHERE id = $1', [id])

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    console.log(`✅ Booking ${id} deleted successfully`)

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      deletedId: id,
    })
  } catch (error) {
    console.error('Error deleting booking:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
