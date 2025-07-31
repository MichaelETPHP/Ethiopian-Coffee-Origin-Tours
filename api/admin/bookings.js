// api/admin/bookings.js
import jwt from 'jsonwebtoken'
import {
  sendPaymentConfirmationEmail,
  sendStatusUpdateEmail,
} from '../../lib/email.js'

// Import Google Sheets service
import {
  getBookings,
  updateBooking,
  deleteBooking as deleteBookingFromSheets,
} from '../../lib/sheets.js'

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

    // For now, we'll skip admin user verification since we're using Google Sheets
    // TODO: Implement admin user management with Google Sheets

    // Handle different methods
    if (req.method === 'GET') {
      return await getBookingsHandler(req, res)
    } else if (req.method === 'PATCH') {
      return await updateBookingHandler(req, res)
    } else if (req.method === 'DELETE') {
      return await deleteBookingHandler(req, res)
    } else {
      return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (jwtError) {
    return res.status(401).json({ error: 'Invalid token.' })
  }
}

// Get all bookings with pagination and filtering
async function getBookingsHandler(req, res) {
  try {
    const {
      page = 1,
      limit = 50,
      search = '',
      status = '',
      package: packageFilter = '',
    } = req.query

    const result = await getBookings({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      status,
      package: packageFilter,
    })

    res.status(200).json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Update booking status
async function updateBookingHandler(req, res) {
  try {
    const { id, status, notes } = req.body

    if (!id || !status) {
      return res
        .status(400)
        .json({ error: 'Booking ID and status are required' })
    }

    console.log(`🔄 Updating booking ${id} status to ${status}`)

    try {
      const booking = await updateBooking(id, { status, notes })

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
async function deleteBookingHandler(req, res) {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required' })
    }

    console.log(`🗑️ Deleting booking ${id}...`)

    try {
      await deleteBookingFromSheets(id)
      console.log(`✅ Booking ${id} deleted successfully`)

      res.status(200).json({
        success: true,
        message: 'Booking deleted successfully',
        deletedId: id,
      })
    } catch (error) {
      if (error.message === 'Booking not found') {
        return res.status(404).json({ error: 'Booking not found' })
      }
      throw error
    }
  } catch (error) {
    console.error('Error deleting booking:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
