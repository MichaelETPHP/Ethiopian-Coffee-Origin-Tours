// api/bookings.js
import pg from 'pg'
import jwt from 'jsonwebtoken'
import {
  sendBookingConfirmationEmail,
  sendAdminNotificationEmail,
} from '../lib/email.js'

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

  // Handle DELETE requests (for specific booking)
  if (req.method === 'DELETE') {
    try {
      // Get ID from URL parameters (req.params) or query parameters (req.query)
      const id = req.params?.id || req.query?.id

      if (!id) {
        return res.status(400).json({ error: 'Booking ID is required' })
      }

      // Verify admin authentication
      const token = req.header('Authorization')?.replace('Bearer ', '')
      if (!token) {
        return res
          .status(401)
          .json({ error: 'Access denied. No token provided.' })
      }

      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'your-secret-key'
        )
        const client = await pool.connect()

        // Verify admin user exists
        const adminUser = await client.query(
          'SELECT id, username, role FROM admin_users WHERE id = $1',
          [decoded.userId]
        )

        if (adminUser.rows.length === 0) {
          client.release()
          return res.status(401).json({ error: 'Invalid token.' })
        }

        // Delete the booking
        const result = await client.query(
          'DELETE FROM bookings WHERE id = $1',
          [id]
        )
        client.release()

        if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Booking not found' })
        }

        console.log(
          `✅ Booking ${id} deleted by admin ${adminUser.rows[0].username}`
        )
        res.status(200).json({
          success: true,
          message: 'Booking deleted successfully',
        })
      } catch (jwtError) {
        return res.status(401).json({ error: 'Invalid token.' })
      }
    } catch (error) {
      console.error('Delete booking error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
    return
  }

  // Handle POST requests (create booking)
  if (req.method === 'POST') {
    try {
      const {
        fullName,
        age,
        email,
        phone,
        country,
        bookingType,
        numberOfPeople,
        selectedPackage,
      } = req.body

      // Basic validation
      if (
        !fullName ||
        !age ||
        !email ||
        !phone ||
        !country ||
        !bookingType ||
        !selectedPackage
      ) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const client = await pool.connect()

      try {
        await client.query('BEGIN')

        // Check for duplicate bookings
        const existingBookings = await client.query(
          `SELECT id FROM bookings 
           WHERE email = $1 AND selected_package = $2 
           AND (status IS NULL OR status != 'cancelled') 
           LIMIT 1`,
          [email, selectedPackage]
        )

        if (existingBookings.rows.length > 0) {
          await client.query('ROLLBACK')
          return res.status(409).json({
            error:
              'A booking with this email already exists for the selected package.',
          })
        }

        // Insert booking
        const result = await client.query(
          `INSERT INTO bookings (
            full_name, age, email, phone, country, booking_type, 
            number_of_people, selected_package, status, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW()) 
          RETURNING *`,
          [
            fullName,
            age,
            email,
            phone,
            country,
            bookingType,
            bookingType === 'group' ? numberOfPeople : 1,
            selectedPackage,
          ]
        )

        const booking = result.rows[0]

        await client.query('COMMIT')

        // Send confirmation emails
        try {
          console.log(
            '📧 Starting email sending process for booking:',
            booking.id
          )

          // Send confirmation email to customer
          console.log('📧 Sending customer confirmation email...')
          const customerEmailResult = await sendBookingConfirmationEmail(
            booking
          )

          if (customerEmailResult.success) {
            console.log('✅ Customer confirmation email sent successfully')
            console.log('📧 Message ID:', customerEmailResult.messageId)
          } else {
            console.error(
              '❌ Customer confirmation email failed:',
              customerEmailResult.error
            )
          }

          // Send notification email to admin
          console.log('📧 Sending admin notification email...')
          const adminEmailResult = await sendAdminNotificationEmail(booking)

          if (adminEmailResult.success) {
            console.log('✅ Admin notification email sent successfully')
            console.log('📧 Message ID:', adminEmailResult.messageId)
          } else {
            console.error(
              '❌ Admin notification email failed:',
              adminEmailResult.error
            )
          }

          console.log('✅ All emails processed for booking:', booking.id)
        } catch (emailError) {
          console.error('❌ Email sending failed:', emailError)
          console.error('❌ Email error details:', {
            message: emailError.message,
            stack: emailError.stack,
          })
          // Don't fail the booking if email fails
        }

        res.status(201).json({
          message: 'Booking submitted successfully',
          bookingId: booking.id,
        })
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      } finally {
        client.release()
      }
    } catch (error) {
      console.error('Booking submission error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
    return
  }

  // Method not allowed
  res.status(405).json({ error: 'Method not allowed' })
}
