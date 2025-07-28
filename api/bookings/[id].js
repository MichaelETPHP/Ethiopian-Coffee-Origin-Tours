// api/bookings/[id].js - Individual booking operations
import {
  sendBookingConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendStatusUpdateEmail,
  sendAdminNotificationEmail,
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
    const booking = await db.get('SELECT * FROM bookings WHERE id = $1', [id])

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    res.status(200).json({
      success: true,
      booking,
    })
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

    const result = await db.run(
      'UPDATE bookings SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [status, notes || null, id]
    )

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    // Get updated booking
    const booking = await db.get('SELECT * FROM bookings WHERE id = $1', [id])

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
    console.log(`🗑️ Deleting booking ${id}...`)

    const result = await db.run('DELETE FROM bookings WHERE id = $1', [id])

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    console.log(`✅ Booking ${id} deleted successfully`)

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    })
  } catch (error) {
    console.error('Delete booking error:', error)
    res.status(500).json({
      error: 'Failed to delete booking',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    })
  }
}
