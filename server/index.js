// server/index.js - Express server with Google Sheets backend
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// Import Google Sheets service
import {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
  checkDuplicateBooking,
} from '../lib/sheets.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5175',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`)
  })
  next()
})

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Booking endpoints
app.post(
  '/api/bookings',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('age')
      .isInt({ min: 1, max: 120 })
      .withMessage('Valid age is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('bookingType')
      .isIn(['individual', 'group'])
      .withMessage('Valid booking type is required'),
    body('selectedPackage').notEmpty().withMessage('Tour package is required'),
  ],
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array(),
        })
      }

      const {
        fullName,
        email,
        phone,
        age,
        country,
        bookingType,
        numberOfPeople,
        selectedPackage,
      } = req.body

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
        const customerEmailResult = await sendBookingConfirmationEmail(booking)

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
        // Don't fail the booking if email fails
      }

      res.status(201).json({
        message: 'Booking submitted successfully',
        bookingId: booking.id,
      })
    } catch (error) {
      console.error('Booking submission error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// Admin endpoints
app.get('/api/admin/bookings', authenticateAdmin, async (req, res) => {
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
})

app.patch('/api/admin/bookings', authenticateAdmin, async (req, res) => {
  try {
    const { id, status, notes } = req.body

    if (!id || !status) {
      return res
        .status(400)
        .json({ error: 'Booking ID and status are required' })
    }

    const updatedBooking = await updateBooking(id, { status, notes })

    // Send status update email
    try {
      await sendStatusUpdateEmail(updatedBooking)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
    }

    res.status(200).json({
      success: true,
      booking: updatedBooking,
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.delete('/api/admin/bookings/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params

    await deleteBooking(id)

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting booking:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Admin authentication middleware
async function authenticateAdmin(req, res, next) {
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

    req.admin = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' })
  }
}

// Email functions
async function sendBookingConfirmationEmail(booking) {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: booking.email,
      subject: 'Booking Confirmation - Ethiopian Coffee Tours',
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${booking.fullName},</p>
        <p>Thank you for booking your Ethiopian Coffee Tour!</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li>Booking ID: ${booking.id}</li>
          <li>Tour Package: ${booking.selectedPackage}</li>
          <li>Booking Type: ${booking.bookingType}</li>
          <li>Status: ${booking.status}</li>
        </ul>
        <p>We'll contact you soon to confirm your tour details.</p>
        <p>Best regards,<br>Ethiopian Coffee Tours Team</p>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}

async function sendAdminNotificationEmail(booking) {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Booking - Ethiopian Coffee Tours',
      html: `
        <h2>New Booking Received</h2>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li>Booking ID: ${booking.id}</li>
          <li>Name: ${booking.fullName}</li>
          <li>Email: ${booking.email}</li>
          <li>Phone: ${booking.phone}</li>
          <li>Tour Package: ${booking.selectedPackage}</li>
          <li>Booking Type: ${booking.bookingType}</li>
          <li>Status: ${booking.status}</li>
        </ul>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}

async function sendStatusUpdateEmail(booking) {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: booking.email,
      subject: 'Booking Status Update - Ethiopian Coffee Tours',
      html: `
        <h2>Booking Status Update</h2>
        <p>Dear ${booking.fullName},</p>
        <p>Your booking status has been updated.</p>
        <p><strong>Updated Details:</strong></p>
        <ul>
          <li>Booking ID: ${booking.id}</li>
          <li>New Status: ${booking.status}</li>
          <li>Tour Package: ${booking.selectedPackage}</li>
        </ul>
        <p>We'll contact you soon with more details.</p>
        <p>Best regards,<br>Ethiopian Coffee Tours Team</p>
      `,
    }

    const result = await transporter.sendMail(mailOptions)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}

// Serve static files
app.use(express.static(path.join(__dirname, '../dist')))

// Catch-all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📧 Email configured: ${process.env.SMTP_USER ? 'Yes' : 'No'}`)
  console.log(
    `🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Using default'}`
  )
  console.log(`📊 Google Sheets: Connected`)
})
