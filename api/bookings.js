// api/bookings.js
import pg from 'pg'
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
  if (req.method === 'DELETE' && req.query.id) {
    try {
      const { id } = req.query
      const client = await pool.connect()

      const result = await client.query('DELETE FROM bookings WHERE id = $1', [
        id,
      ])
      client.release()

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Booking not found' })
      }

      res.status(200).json({ message: 'Booking deleted successfully' })
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
          // Send confirmation email to customer
          await sendBookingConfirmationEmail(booking)

          // Send notification email to admin
          await sendAdminNotificationEmail(booking)

          console.log('✅ Emails sent successfully for booking:', booking.id)
        } catch (emailError) {
          console.error('❌ Email sending failed:', emailError)
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
