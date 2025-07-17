// lib/email.js - Enhanced email configuration with timeout handling

import nodemailer from 'nodemailer'

// Enhanced email configuration with timeout settings
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password for Gmail
    },
    // Timeout configurations
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000, // 30 seconds
    socketTimeout: 75000, // 75 seconds
    // Pool configuration
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    // Retry configuration
    retryDelay: 1000,
    maxRetries: 3,
    // TLS options
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
    // Debug options (enable in development)
    debug: process.env.NODE_ENV === 'development',
    logger: process.env.NODE_ENV === 'development',
  }

  return nodemailer.createTransporter(config)
}

// Create a singleton transporter instance
let transporter = null

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter()
  }
  return transporter
}

// Enhanced retry mechanism
async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
  let lastError = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📧 Email attempt ${attempt}/${maxRetries}`)

      const transporter = getTransporter()

      // Verify transporter connection before sending
      await transporter.verify()
      console.log('✅ SMTP connection verified')

      const info = await transporter.sendMail(mailOptions)

      console.log('✅ Email sent successfully')
      console.log('Message ID:', info.messageId)

      return {
        success: true,
        messageId: info.messageId,
        attempt: attempt,
      }
    } catch (error) {
      lastError = error
      console.error(`❌ Email attempt ${attempt} failed:`, error.message)

      // Reset transporter on connection errors
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        transporter = null
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
        console.log(`⏳ Waiting ${delay}ms before retry...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Failed to send email after retries',
    lastError: lastError,
  }
}

// Enhanced booking confirmation email
export async function sendBookingConfirmationEmail(booking) {
  try {
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'Your Company',
        address: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      },
      to: booking.email,
      subject: `Booking Confirmation - ${booking.package}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Booking Confirmation</h2>
          <p>Dear ${booking.name},</p>
          <p>Thank you for your booking! Here are your details:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Booking Details</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Package:</strong> ${booking.package}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
            ${
              booking.booking_date
                ? `<p><strong>Date:</strong> ${new Date(
                    booking.booking_date
                  ).toLocaleDateString()}</p>`
                : ''
            }
          </div>
          
          <p>We'll contact you soon with more details about your booking.</p>
          
          <p>Best regards,<br>Your Travel Team</p>
        </div>
      `,
      text: `
        Dear ${booking.name},
        
        Thank you for your booking! Here are your details:
        
        Booking ID: ${booking.id}
        Package: ${booking.package}
        Status: ${booking.status}
        
        We'll contact you soon with more details about your booking.
        
        Best regards,
        Your Travel Team
      `,
    }

    return await sendEmailWithRetry(mailOptions)
  } catch (error) {
    console.error('Error in sendBookingConfirmationEmail:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Enhanced payment confirmation email
export async function sendPaymentConfirmationEmail(booking) {
  try {
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'Your Company',
        address: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      },
      to: booking.email,
      subject: `Payment Confirmation - Booking #${booking.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Payment Confirmed</h2>
          <p>Dear ${booking.name},</p>
          <p>Your payment has been successfully processed!</p>
          
          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #c3e6cb;">
            <h3 style="color: #155724; margin-top: 0;">Payment Details</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Package:</strong> ${booking.package}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
            ${
              booking.amount
                ? `<p><strong>Amount:</strong> $${booking.amount}</p>`
                : ''
            }
          </div>
          
          <p>Thank you for your payment. We'll be in touch soon!</p>
          
          <p>Best regards,<br>Your Travel Team</p>
        </div>
      `,
    }

    return await sendEmailWithRetry(mailOptions)
  } catch (error) {
    console.error('Error in sendPaymentConfirmationEmail:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Status update email
export async function sendStatusUpdateEmail(booking, oldStatus, newStatus) {
  try {
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'Your Company',
        address: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      },
      to: booking.email,
      subject: `Booking Status Update - #${booking.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">Booking Status Update</h2>
          <p>Dear ${booking.name},</p>
          <p>Your booking status has been updated:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Package:</strong> ${booking.package}</p>
            <p><strong>Previous Status:</strong> <span style="color: #6c757d;">${oldStatus}</span></p>
            <p><strong>New Status:</strong> <span style="color: #007bff;">${newStatus}</span></p>
          </div>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>Your Travel Team</p>
        </div>
      `,
    }

    return await sendEmailWithRetry(mailOptions)
  } catch (error) {
    console.error('Error in sendStatusUpdateEmail:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Admin notification email
export async function sendAdminNotificationEmail(booking) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER

    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'Your Company',
        address: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      },
      to: adminEmail,
      subject: `New Booking Notification - #${booking.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc3545;">New Booking Alert</h2>
          <p>A new booking has been received:</p>
          
          <div style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #f5c6cb;">
            <h3 style="color: #721c24; margin-top: 0;">Booking Details</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Customer:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Package:</strong> ${booking.package}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
            ${
              booking.phone
                ? `<p><strong>Phone:</strong> ${booking.phone}</p>`
                : ''
            }
            ${
              booking.booking_date
                ? `<p><strong>Date:</strong> ${new Date(
                    booking.booking_date
                  ).toLocaleDateString()}</p>`
                : ''
            }
          </div>
          
          <p>Please review and process this booking.</p>
        </div>
      `,
    }

    return await sendEmailWithRetry(mailOptions)
  } catch (error) {
    console.error('Error in sendAdminNotificationEmail:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Graceful shutdown
export function closeEmailTransporter() {
  if (transporter) {
    transporter.close()
    transporter = null
  }
}
