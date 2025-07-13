// api/bookings/[id]/send-email.js - Manual email sending for regular bookings
import pg from 'pg'
import {
  sendBookingConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendStatusUpdateEmail,
  sendAdminNotificationEmail,
} from '../../../lib/email.js'

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
  if (req.method === 'POST') {
    return await sendEmail(req, res, id)
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}

// Send email for booking
async function sendEmail(req, res, id) {
  try {
    const { emailType } = req.body

    console.log('Sending email for booking', id, 'type:', emailType)

    if (!emailType) {
      return res.status(400).json({ error: 'Email type is required' })
    }

    const validEmailTypes = [
      'booking-confirmation',
      'payment-confirmation',
      'status-update',
      'admin-notification',
    ]

    if (!validEmailTypes.includes(emailType)) {
      return res.status(400).json({
        error: 'Invalid email type',
        validTypes: validEmailTypes,
      })
    }

    const client = await pool.connect()

    try {
      // Get booking details
      const result = await client.query(
        'SELECT * FROM bookings WHERE id = $1',
        [id]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' })
      }

      const booking = result.rows[0]
      let emailResult = null

      // Send appropriate email based on type
      switch (emailType) {
        case 'booking-confirmation':
          emailResult = await sendBookingConfirmationEmail(booking)
          break
        case 'payment-confirmation':
          emailResult = await sendPaymentConfirmationEmail(booking)
          break
        case 'status-update':
          // For status update, we need the old status
          emailResult = await sendStatusUpdateEmail(
            booking,
            'pending',
            booking.status
          )
          break
        case 'admin-notification':
          emailResult = await sendAdminNotificationEmail(booking)
          break
        default:
          return res.status(400).json({ error: 'Invalid email type' })
      }

      if (emailResult.success) {
        console.log(
          `✅ ${emailType} email sent successfully to:`,
          booking.email
        )
        res.status(200).json({
          success: true,
          message: `${emailType} email sent successfully`,
          recipient: booking.email,
          messageId: emailResult.messageId,
        })
      } else {
        console.error(
          `❌ Failed to send ${emailType} email:`,
          emailResult.error
        )
        res.status(500).json({
          error: `Failed to send ${emailType} email`,
          details: emailResult.error,
        })
      }
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Send email error:', error)
    res.status(500).json({
      error: 'Failed to send email',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}
