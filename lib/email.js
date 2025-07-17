// lib/email.js - Updated with working configuration
import nodemailer from 'nodemailer'

// Create transporter with working configuration
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail', // Use Gmail service for simplicity
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // This should be your App Password
    },
    // Timeout configurations
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 75000,
    // Pool configuration for better performance
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  })
}

// Enhanced retry mechanism
async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
  let lastError = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📧 Email attempt ${attempt}/${maxRetries}`)

      const transporter = createTransporter()
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

// Booking confirmation email
export async function sendBookingConfirmationEmail(booking) {
  try {
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'Ethiopian Coffee Origin Tours',
        address: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      },
      to: booking.email,
      subject: `Booking Confirmation - ${
        booking.package || 'Ethiopian Coffee Tour'
      }`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B4513; margin: 0;">Ethiopian Coffee Origin Tours</h1>
            <p style="color: #666; margin: 5px 0;">Discover the birthplace of coffee</p>
          </div>
          
          <h2 style="color: #28a745;">🎉 Booking Confirmation</h2>
          <p>Dear ${booking.name},</p>
          <p>Thank you for booking with Ethiopian Coffee Origin Tours! We're excited to share the coffee journey with you.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B4513;">
            <h3 style="color: #8B4513; margin-top: 0;">📋 Booking Details</h3>
            <p><strong>Booking ID:</strong> #${booking.id}</p>
            <p><strong>Package:</strong> ${
              booking.package || 'Ethiopian Coffee Tour'
            }</p>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Status:</strong> <span style="color: #28a745;">${
              booking.status || 'Confirmed'
            }</span></p>
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
            ${
              booking.guests
                ? `<p><strong>Guests:</strong> ${booking.guests}</p>`
                : ''
            }
          </div>
          
          <div style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #0066cc; margin-top: 0;">☕ What's Next?</h4>
            <ul style="color: #333; padding-left: 20px;">
              <li>We'll contact you within 24 hours with detailed itinerary</li>
              <li>Payment instructions will be sent separately</li>
              <li>Please check your email regularly for updates</li>
              <li>If you have questions, reply to this email</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #8B4513; font-weight: bold;">Experience the origin of coffee in Ethiopia!</p>
          </div>
          
          <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; color: #666; font-size: 12px;">
            <p><strong>Ethiopian Coffee Origin Tours</strong></p>
            <p>Email: ${process.env.FROM_EMAIL || process.env.EMAIL_USER}</p>
            <p>This is an automated confirmation email. Please keep it for your records.</p>
          </div>
        </div>
      `,
      text: `
Ethiopian Coffee Origin Tours - Booking Confirmation

Dear ${booking.name},

Thank you for booking with Ethiopian Coffee Origin Tours!

Booking Details:
- Booking ID: #${booking.id}
- Package: ${booking.package || 'Ethiopian Coffee Tour'}
- Name: ${booking.name}
- Email: ${booking.email}
- Status: ${booking.status || 'Confirmed'}
${booking.phone ? `- Phone: ${booking.phone}` : ''}
${
  booking.booking_date
    ? `- Date: ${new Date(booking.booking_date).toLocaleDateString()}`
    : ''
}

What's Next?
- We'll contact you within 24 hours with detailed itinerary
- Payment instructions will be sent separately
- Please check your email regularly for updates

Experience the origin of coffee in Ethiopia!

Ethiopian Coffee Origin Tours
Email: ${process.env.FROM_EMAIL || process.env.EMAIL_USER}
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

// Payment confirmation email
export async function sendPaymentConfirmationEmail(booking) {
  try {
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'Ethiopian Coffee Origin Tours',
        address: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      },
      to: booking.email,
      subject: `Payment Confirmed - Booking #${booking.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #28a745;">💳 Payment Confirmed</h2>
          <p>Dear ${booking.name},</p>
          <p>Your payment has been successfully processed!</p>
          
          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #c3e6cb;">
            <h3 style="color: #155724; margin-top: 0;">✅ Payment Details</h3>
            <p><strong>Booking ID:</strong> #${booking.id}</p>
            <p><strong>Package:</strong> ${booking.package}</p>
            <p><strong>Status:</strong> Paid</p>
            ${
              booking.amount
                ? `<p><strong>Amount:</strong> $${booking.amount}</p>`
                : ''
            }
          </div>
          
          <p>Thank you for your payment. We'll be in touch soon with your complete itinerary!</p>
          
          <p>Best regards,<br>Ethiopian Coffee Origin Tours Team</p>
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
        name: process.env.FROM_NAME || 'Ethiopian Coffee Origin Tours',
        address: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      },
      to: booking.email,
      subject: `Booking Status Update - #${booking.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #007bff;">📋 Booking Status Update</h2>
          <p>Dear ${booking.name},</p>
          <p>Your booking status has been updated:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Booking ID:</strong> #${booking.id}</p>
            <p><strong>Package:</strong> ${booking.package}</p>
            <p><strong>Previous Status:</strong> <span style="color: #6c757d;">${oldStatus}</span></p>
            <p><strong>New Status:</strong> <span style="color: #007bff;">${newStatus}</span></p>
          </div>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>Ethiopian Coffee Origin Tours Team</p>
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
        name: process.env.FROM_NAME || 'Ethiopian Coffee Origin Tours',
        address: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      },
      to: adminEmail,
      subject: `🔔 New Booking Alert - #${booking.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc3545;">🔔 New Booking Received</h2>
          <p>A new booking has been submitted on your website:</p>
          
          <div style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #f5c6cb;">
            <h3 style="color: #721c24; margin-top: 0;">📋 Booking Details</h3>
            <p><strong>Booking ID:</strong> #${booking.id}</p>
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
            ${
              booking.guests
                ? `<p><strong>Guests:</strong> ${booking.guests}</p>`
                : ''
            }
            ${
              booking.message
                ? `<p><strong>Message:</strong> ${booking.message}</p>`
                : ''
            }
          </div>
          
          <p><strong>Action Required:</strong> Please review and process this booking promptly.</p>
          
          <div style="margin: 20px 0;">
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Contact the customer within 24 hours</li>
              <li>Send detailed itinerary</li>
              <li>Process payment if required</li>
              <li>Update booking status</li>
            </ul>
          </div>
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
