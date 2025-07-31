// lib/email.js - Production-ready email service
import nodemailer from 'nodemailer'
import { config } from './config.js'

// Create transporter with production configuration
function createTransporter() {
  return nodemailer.createTransporter({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: config.email.auth,
    connectionTimeout: config.email.connectionTimeout,
    greetingTimeout: config.email.greetingTimeout,
    socketTimeout: config.email.socketTimeout,
    tls: config.email.tls,
    pool: config.email.pool,
    maxConnections: config.email.maxConnections,
    maxMessages: config.email.maxMessages,
    requireTLS: config.email.requireTLS,
  })
}

// Singleton transporter instance
let transporter = null

function getTransporter() {
  if (!transporter) {
    transporter = createTransporter()
  }
  return transporter
}

/**
 * Test email configuration
 */
export async function testEmailConfiguration() {
  try {
    const testTransporter = createTransporter()
    await testTransporter.verify()
    console.log('✅ Email configuration verified')
    return { success: true, message: 'Email configuration is valid' }
  } catch (error) {
    console.error('❌ Email configuration test failed:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * Send email with retry logic and professional error handling
 */
async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
  // First test the configuration
  const testResult = await testEmailConfiguration()
  if (!testResult.success) {
    console.error('❌ Email configuration invalid, cannot send emails')
    return { success: false, error: 'Email configuration invalid' }
  }

  let lastError = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `📧 Email attempt ${attempt}/${maxRetries} to ${mailOptions.to}`
      )
      console.log(`📧 Using SMTP: ${config.email.host}:${config.email.port}`)

      const transporter = getTransporter()
      const info = await transporter.sendMail({
        ...mailOptions,
        from:
          mailOptions.from ||
          `"${config.email.from.name}" <${config.email.from.address}>`,
        // Add message headers for better deliverability
        headers: {
          'X-Mailer': `${config.app.name} v${config.app.version}`,
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal',
          'Message-ID': `<${Date.now()}.${Math.random()}@${config.email.host}>`,
          Date: new Date().toUTCString(),
        },
      })

      console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`)
      console.log(`📧 Response: ${info.response}`)

      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
        attempt,
      }
    } catch (error) {
      lastError = error
      console.error(`❌ Email attempt ${attempt} failed:`, error.message)
      console.error(`Error code: ${error.code}`)

      // Reset transporter on connection errors
      if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
        transporter = null
      }

      if (attempt === maxRetries) {
        console.error(
          `❌ All ${maxRetries} attempts failed for ${mailOptions.to}`
        )
        break
      }

      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
      console.log(`⏳ Waiting ${delay}ms before retry...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Failed to send email after retries',
    code: lastError?.code,
    attempts: maxRetries,
  }
}

/**
 * Send booking confirmation email to customer
 */
export async function sendBookingConfirmationEmail(booking) {
  try {
    console.log(`📧 Sending booking confirmation email to ${booking.email}`)

    const mailOptions = {
      to: booking.email,
      subject: `Booking Confirmation - ${config.app.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
            .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #8B4513; }
            .highlight { color: #D2691E; font-weight: bold; }
            .button { display: inline-block; background: #D2691E; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🇪🇹 ${config.app.name}</h1>
              <h2>Booking Confirmation</h2>
            </div>
            
            <div class="content">
              <p>Dear <strong>${booking.full_name}</strong>,</p>
              
              <p>Thank you for booking with us! We're excited to welcome you on an unforgettable Ethiopian coffee journey.</p>
              
              <div class="booking-details">
                <h3 style="color: #8B4513;">📋 Booking Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Booking ID:</span>
                  <span class="highlight">#${booking.id}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Package:</span>
                  <span>${booking.selected_package}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Type:</span>
                  <span>${
                    booking.booking_type === 'individual'
                      ? 'Individual'
                      : 'Group'
                  }</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Participants:</span>
                  <span>${booking.number_of_people} ${
        booking.number_of_people === 1 ? 'person' : 'people'
      }</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="highlight">Pending Confirmation</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Booked on:</span>
                  <span>${new Date(
                    booking.created_at
                  ).toLocaleDateString()}</span>
                </div>
              </div>
              
              <h3 style="color: #8B4513;">📞 Contact Information</h3>
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span>${booking.email}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span>
                  <span>${booking.phone}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Country:</span>
                  <span>${booking.country}</span>
                </div>
              </div>
              
              <h3 style="color: #8B4513;">🎯 What's Next?</h3>
              <ul>
                <li>Our team will review your booking within 24 hours</li>
                <li>You'll receive a confirmation email with detailed itinerary</li>
                <li>Payment instructions will be provided upon confirmation</li>
                <li>We'll contact you to discuss any special requirements</li>
              </ul>
              
              <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:${
                config.app.supportEmail
              }">${config.app.supportEmail}</a></p>
              
              <p>We look forward to sharing the rich coffee culture of Ethiopia with you!</p>
              
              <p style="margin-top: 30px;">
                <strong>Best regards,</strong><br>
                The ${config.app.name} Team
              </p>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${
        config.app.name
      }. All rights reserved.</p>
              <p>Email: ${config.app.supportEmail} | Website: ${
        config.app.frontendUrl
      }</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    const result = await sendEmailWithRetry(mailOptions)

    if (result.success) {
      console.log(`✅ Booking confirmation email sent to ${booking.email}`)
    } else {
      console.error(
        `❌ Failed to send booking confirmation email to ${booking.email}:`,
        result.error
      )
    }

    return result
  } catch (error) {
    console.error('❌ Error in sendBookingConfirmationEmail:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send admin notification email
 */
export async function sendAdminNotificationEmail(booking) {
  try {
    console.log(`📧 Sending admin notification for booking #${booking.id}`)

    const mailOptions = {
      to: config.email.admin.email,
      subject: `New Booking Alert - ${config.app.name} #${booking.id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Booking Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
            .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #dc3545; }
            .urgent { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 New Booking Alert</h1>
              <h2>Booking #${booking.id}</h2>
            </div>
            
            <div class="content">
              <div class="urgent">
                <strong>⚡ Action Required:</strong> A new booking has been submitted and requires your attention.
              </div>
              
              <div class="booking-details">
                <h3 style="color: #dc3545;">👤 Customer Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Name:</span>
                  <span>${booking.full_name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span><a href="mailto:${booking.email}">${
        booking.email
      }</a></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span>
                  <span>${booking.phone}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Age:</span>
                  <span>${booking.age} years</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Country:</span>
                  <span>${booking.country}</span>
                </div>
              </div>
              
              <div class="booking-details">
                <h3 style="color: #dc3545;">📦 Booking Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Package:</span>
                  <span>${booking.selected_package}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Type:</span>
                  <span>${
                    booking.booking_type === 'individual'
                      ? 'Individual'
                      : 'Group'
                  }</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Participants:</span>
                  <span>${booking.number_of_people} ${
        booking.number_of_people === 1 ? 'person' : 'people'
      }</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Submitted:</span>
                  <span>${new Date(booking.created_at).toLocaleString()}</span>
                </div>
              </div>
              
              <h3 style="color: #dc3545;">📋 Next Steps</h3>
              <ul>
                <li>Review the booking details</li>
                <li>Contact the customer within 24 hours</li>
                <li>Send confirmation and payment instructions</li>
                <li>Update booking status in admin panel</li>
              </ul>
              
              <p style="text-align: center;">
                <a href="${
                  config.app.frontendUrl
                }/admin" class="button">View in Admin Panel</a>
              </p>
            </div>
            
            <div class="footer">
              <p>This is an automated notification from ${config.app.name}</p>
              <p>Booking ID: #${
                booking.id
              } | Time: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    const result = await sendEmailWithRetry(mailOptions)

    if (result.success) {
      console.log(`✅ Admin notification sent for booking #${booking.id}`)
    } else {
      console.error(
        `❌ Failed to send admin notification for booking #${booking.id}:`,
        result.error
      )
    }

    return result
  } catch (error) {
    console.error('❌ Error in sendAdminNotificationEmail:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(booking) {
  try {
    console.log(`📧 Sending payment confirmation email to ${booking.email}`)

    const mailOptions = {
      to: booking.email,
      subject: `Payment Confirmed - ${config.app.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Confirmation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
            .booking-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .success-badge { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; border: 1px solid #c3e6cb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Payment Confirmed!</h1>
              <h2>Your Ethiopian Coffee Adventure Awaits</h2>
            </div>
            
            <div class="content">
              <p>Dear <strong>${booking.full_name}</strong>,</p>
              
              <div class="success-badge">
                <h3>🎉 Congratulations! Your booking is now confirmed.</h3>
              </div>
              
              <p>We're thrilled to confirm that your payment has been received and your Ethiopian coffee tour is officially booked!</p>
              
              <div class="booking-details">
                <h3 style="color: #28a745;">📋 Confirmed Booking Details</h3>
                <p><strong>Booking ID:</strong> #${booking.id}</p>
                <p><strong>Package:</strong> ${booking.selected_package}</p>
                <p><strong>Participants:</strong> ${booking.number_of_people} ${
        booking.number_of_people === 1 ? 'person' : 'people'
      }</p>
                <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">CONFIRMED</span></p>
              </div>
              
              <h3 style="color: #28a745;">📧 What Happens Next?</h3>
              <ul>
                <li>You'll receive a detailed itinerary within 48 hours</li>
                <li>Our local guide will contact you before your trip</li>
                <li>We'll send you packing tips and cultural insights</li>
                <li>Emergency contact information will be provided</li>
              </ul>
              
              <p>Get ready to discover the birthplace of coffee and experience Ethiopian culture like never before!</p>
              
              <p>If you have any questions, please contact us at <a href="mailto:${
                config.app.supportEmail
              }">${config.app.supportEmail}</a></p>
              
              <p style="margin-top: 30px;">
                <strong>Safe travels and see you soon in Ethiopia!</strong><br>
                The ${config.app.name} Team
              </p>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${
        config.app.name
      }. All rights reserved.</p>
              <p>Email: ${config.app.supportEmail} | Website: ${
        config.app.frontendUrl
      }</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    const result = await sendEmailWithRetry(mailOptions)

    if (result.success) {
      console.log(`✅ Payment confirmation email sent to ${booking.email}`)
    } else {
      console.error(
        `❌ Failed to send payment confirmation email to ${booking.email}:`,
        result.error
      )
    }

    return result
  } catch (error) {
    console.error('❌ Error in sendPaymentConfirmationEmail:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send status update email
 */
export async function sendStatusUpdateEmail(booking) {
  try {
    console.log(`📧 Sending status update email to ${booking.email}`)

    const statusMessages = {
      pending: 'Your booking is being reviewed',
      confirmed: 'Your booking has been confirmed!',
      cancelled: 'Your booking has been cancelled',
    }

    const statusColors = {
      pending: '#ffc107',
      confirmed: '#28a745',
      cancelled: '#dc3545',
    }

    const mailOptions = {
      to: booking.email,
      subject: `Booking Update - ${config.app.name} #${booking.id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${
              statusColors[booking.status]
            }; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
            .status-badge { background: ${
              statusColors[booking.status]
            }20; color: ${
        statusColors[booking.status]
      }; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; border: 1px solid ${
        statusColors[booking.status]
      }40; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Booking Status Update</h1>
              <h2>Booking #${booking.id}</h2>
            </div>
            
            <div class="content">
              <p>Dear <strong>${booking.full_name}</strong>,</p>
              
              <div class="status-badge">
                <h3>${statusMessages[booking.status]}</h3>
              </div>
              
              <p><strong>Package:</strong> ${booking.selected_package}</p>
              <p><strong>Current Status:</strong> <span style="color: ${
                statusColors[booking.status]
              }; font-weight: bold;">${booking.status.toUpperCase()}</span></p>
              
              ${
                booking.notes
                  ? `<p><strong>Notes:</strong> ${booking.notes}</p>`
                  : ''
              }
              
              <p>If you have any questions about this update, please contact us at <a href="mailto:${
                config.app.supportEmail
              }">${config.app.supportEmail}</a></p>
              
              <p style="margin-top: 30px;">
                <strong>Best regards,</strong><br>
                The ${config.app.name} Team
              </p>
            </div>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${
        config.app.name
      }. All rights reserved.</p>
              <p>Booking ID: #${
                booking.id
              } | Updated: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    const result = await sendEmailWithRetry(mailOptions)

    if (result.success) {
      console.log(`✅ Status update email sent to ${booking.email}`)
    } else {
      console.error(
        `❌ Failed to send status update email to ${booking.email}:`,
        result.error
      )
    }

    return result
  } catch (error) {
    console.error('❌ Error in sendStatusUpdateEmail:', error)
    return { success: false, error: error.message }
  }
}

export { testEmailConfiguration }
