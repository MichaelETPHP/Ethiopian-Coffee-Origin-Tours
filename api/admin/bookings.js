// api/admin/bookings.js - Simple working version
import jwt from 'jsonwebtoken'

// Import database from server
import { db } from '../../server/index.js'

// Import email functions
import {
  sendPaymentConfirmationEmail,
  sendStatusUpdateEmail,
} from '../../lib/email.js'

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
  } else if (req.method === 'DELETE') {
    return await deleteBooking(req, res)
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
      query += ` AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)`
      countQuery += ` AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)`
      const searchParam = `%${search}%`
      params.push(searchParam, searchParam, searchParam)
      countParams.push(searchParam, searchParam, searchParam)
      paramIndex += 3
    }

    // Add status filter
    if (status) {
      query += ` AND status = ?`
      countQuery += ` AND status = ?`
      params.push(status)
      countParams.push(status)
      paramIndex += 1
    }

    // Add package filter
    if (packageFilter) {
      query += ` AND selected_package LIKE ?`
      countQuery += ` AND selected_package LIKE ?`
      params.push(`%${packageFilter}%`)
      countParams.push(`%${packageFilter}%`)
      paramIndex += 1
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
    params.push(parseInt(limit), parseInt(offset))

    // Execute queries
    const [bookingsResult, countResult] = await Promise.all([
      db.all(query, params),
      db.get(countQuery, countParams),
    ])

    const total = countResult.total || 0

    console.log(`Found ${bookingsResult.length} bookings out of ${total} total`)

    res.status(200).json({
      success: true,
      bookings: bookingsResult,
      total: total,
      totalPages: Math.ceil(total / limit),
      page: parseInt(page),
      limit: parseInt(limit),
    })
  } catch (error) {
    console.error('Error getting bookings:', error)
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

    console.log(`Updating booking ${id} to status: ${status}`)

    // Update booking
    const result = await db.run(
      'UPDATE bookings SET status = ?, notes = ?, updated_at = datetime("now") WHERE id = ?',
      [status, notes || null, id]
    )

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    // Get updated booking
    const booking = await db.get('SELECT * FROM bookings WHERE id = ?', [id])

    // Send emails based on status
    try {
      if (status === 'confirmed') {
        console.log('📧 Sending payment confirmation email...')
        await sendPaymentConfirmationEmail(booking)
      } else if (status === 'cancelled') {
        console.log('📧 Sending status update email...')
        await sendStatusUpdateEmail(booking, status)
      }
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError)
      // Don't fail the update if email fails
    }

    console.log(`✅ Booking ${id} updated to ${status}`)

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
    const result = await db.run('DELETE FROM bookings WHERE id = ?', [id])

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
