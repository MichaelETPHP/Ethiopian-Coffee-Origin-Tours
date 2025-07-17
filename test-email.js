// test-email.js - Multiple ways to import based on your file structure

// Option 1: If test-email.js is in the root and lib/email.js exists
import { sendBookingConfirmationEmail } from './lib/email.js'

// Option 2: If you're in a different directory
import { sendBookingConfirmationEmail } from '../lib/email.js'

// Option 3: If email.js is in the same directory
import { sendBookingConfirmationEmail } from './email.js'

// Option 4: Using absolute path from project root
import { sendBookingConfirmationEmail } from './lib/email.js'

// Option 5: If using CommonJS (no "type": "module" in package.json)
const { sendBookingConfirmationEmail } = require('./lib/email.js')

// Option 6: Create the email.js file inline for testing
// If the file doesn't exist, create it first

import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

// Inline email function for testing if import fails
async function sendBookingConfirmationEmailInline(booking) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 75000,
    })

    // Email options
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to: booking.email,
      subject: `Booking Confirmation - ${booking.package}`,
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${booking.name},</p>
        <p>Thank you for your booking!</p>
        <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0;">
          <h3>Booking Details</h3>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <p><strong>Package:</strong> ${booking.package}</p>
          <p><strong>Status:</strong> ${booking.status}</p>
        </div>
        <p>Best regards,<br>Your Travel Team</p>
      `,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)

    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// Test function
async function testEmail() {
  console.log('🧪 Testing email functionality...')

  const testBooking = {
    id: 10,
    email: 'michaeltaye012@gmail.com',
    name: 'Michael Taye',
    package: 'complete-ethiopia',
    status: 'confirmed',
    booking_date: new Date().toISOString(),
  }

  try {
    // Try using the imported function first, fallback to inline
    let result
    try {
      result = await sendBookingConfirmationEmail(testBooking)
    } catch (importError) {
      console.log('📝 Using inline email function (import failed)')
      result = await sendBookingConfirmationEmailInline(testBooking)
    }

    if (result.success) {
      console.log('✅ Email test successful!')
      console.log('Message ID:', result.messageId)
    } else {
      console.error('❌ Email test failed:', result.error)
    }
  } catch (error) {
    console.error('❌ Test error:', error.message)
  }
}

testEmail()
