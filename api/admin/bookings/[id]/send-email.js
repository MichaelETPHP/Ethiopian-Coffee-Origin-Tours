// api/admin/bookings/[id]/send-email.js - Manual email sending
import jwt from 'jsonwebtoken'
import {
  sendBookingConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendStatusUpdateEmail,
  sendAdminNotificationEmail,
} from '../../../../lib/email.js'

// Import database for Vercel deployment
import { db } from '../../../../lib/db-vercel.js'

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
  } catch (jwtError) {
    return res.status(401).json({ error: 'Invalid token.' })
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

    // Get booking details
    const booking = await db.get('SELECT * FROM bookings WHERE id = $1', [id])

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

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
        emailResult = await sendStatusUpdateEmail(booking)
        break
      case 'admin-notification':
        emailResult = await sendAdminNotificationEmail(booking)
        break
      default:
        return res.status(400).json({ error: 'Invalid email type' })
    }

    if (emailResult.success) {
      console.log(`✅ Email sent successfully for booking ${id}`)
      res.status(200).json({
        success: true,
        message: 'Email sent successfully',
        messageId: emailResult.messageId,
      })
    } else {
      console.error(`❌ Email failed for booking ${id}:`, emailResult.error)
      res.status(500).json({
        success: false,
        error: 'Failed to send email',
        details: emailResult.error,
      })
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
