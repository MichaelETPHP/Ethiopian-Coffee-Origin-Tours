// api/bookings.js
import jwt from 'jsonwebtoken'
import {
  sendBookingConfirmationEmail,
  sendAdminNotificationEmail,
} from '../lib/email.js'

// Import Google Sheets service
import {
  createBooking,
  checkDuplicateBooking,
  deleteBooking as deleteBookingFromSheets,
} from '../lib/sheets.js'

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

        // For now, we'll skip admin user verification since we're using Google Sheets
        // TODO: Implement admin user management with Google Sheets

        // Delete the booking
        try {
          await deleteBookingFromSheets(id)
          console.log(`✅ Booking ${id} deleted successfully`)
        } catch (error) {
          if (error.message === 'Booking not found') {
            return res.status(404).json({ error: 'Booking not found' })
          }
          throw error
        }

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

      try {
        // Check for duplicate bookings
        const existingBooking = await checkDuplicateBooking(
          email,
          selectedPackage
        )

        if (existingBooking) {
          return res.status(409).json({
            error:
              'A booking with this email already exists for the selected package.',
          })
        }

        // Create booking in Google Sheets
        const booking = await createBooking({
          fullName,
          age,
          email,
          phone,
          country,
          bookingType,
          numberOfPeople: bookingType === 'group' ? numberOfPeople : 1,
          selectedPackage,
        })

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
        throw error
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
