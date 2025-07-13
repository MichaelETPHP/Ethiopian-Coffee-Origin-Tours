// api/bookings/[id].js - Individual booking operations
import pg from 'pg'
import {
  sendBookingConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendStatusUpdateEmail,
  sendAdminNotificationEmail,
} from '../../lib/email.js'

const { Pool } = pg

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
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

  const { id } = req.query

  if (!id) {
    return res.status(400).json({ error: 'Booking ID is required' })
  }

  // Handle different methods
  if (req.method === 'GET') {
    return await getBooking(req, res, id)
  } else if (req.method === 'PATCH') {
    return await updateBooking(req, res, id)
  } else if (req.method === 'DELETE') {
    return await deleteBooking(req, res, id)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

// Get single booking
async function getBooking(req, res, id) {
  try {
    const client = await pool.connect()

    try {
      const result = await client.query(
        'SELECT * FROM bookings WHERE id = $1',
        [id]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' })
      }

      res.status(200).json({
        success: true,
        booking: result.rows[0],
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Get booking error:', error)
    res.status(500).json({
      error: 'Failed to fetch booking',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}

// Update booking
async function updateBooking(req, res, id) {
  try {
    const { status, notes } = req.body

    console.log('Updating booking', id, 'to status:', status)

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const client = await pool.connect()

    try {
      // Get current booking to check status change
      const currentBooking = await client.query(
        'SELECT * FROM bookings WHERE id = $1',
        [id]
      )

      if (currentBooking.rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' })
      }

      const oldStatus = currentBooking.rows[0].status

      const result = await client.query(
        'UPDATE bookings SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [status, notes || null, id]
      )

      const booking = result.rows[0]
      console.log('Booking updated successfully')

      // Send email notifications
      try {
        if (status === 'confirmed') {
          // Send payment confirmation email
          await sendPaymentConfirmationEmail(booking)
          console.log('✅ Payment confirmation email sent to:', booking.email)
        } else if (oldStatus !== status) {
          // Send status update email
          await sendStatusUpdateEmail(booking, oldStatus, status)
          console.log('✅ Status update email sent to:', booking.email)
        }
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError)
        // Don't fail the update if email fails
      }

      res.status(200).json({
        success: true,
        booking,
        message: 'Booking updated successfully',
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

// Delete booking
async function deleteBooking(req, res, id) {
  try {
    console.log('Deleting booking:', id)

    const client = await pool.connect()

    try {
      const result = await client.query(
        'DELETE FROM bookings WHERE id = $1 RETURNING *',
        [id]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' })
      }

      console.log('Booking deleted successfully:', id)

      res.status(200).json({
        success: true,
        message: 'Booking deleted successfully',
      })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Delete booking error:', error)
    res.status(500).json({
      error: 'Failed to delete booking',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}
