// lib/email.js - Fixed configuration for cPanel email
import nodemailer from 'nodemailer'

// IMPORTANT: Use the cPanel server IP directly until DNS propagates
// Your cPanel server IP: 198.38.92.6

// Primary email configuration - Using cPanel server directly
let emailConfig = {
  host: '198.38.92.6', // Direct cPanel server IP
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: 'hello@ehiopiancoffeeorgintrip.com',
    pass: 'j7YEMnZDS0h$1p5C',
  },
  // Important settings for cPanel
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates
    servername: 'ehiopiancoffeeorgintrip.com', // SNI for certificate matching
  },
  connectionTimeout: 30000,
  greetingTimeout: 10000,
  socketTimeout: 30000,
  requireTLS: true,
  pool: true,
  maxConnections: 1,
  maxMessages: 1,
}

// Alternative configurations for different scenarios
const alternativeConfigs = [
  {
    name: 'cPanel SSL Port 465',
    config: {
      host: '198.38.92.6',
      port: 465,
      secure: true, // SSL
      auth: {
        user: 'hello@ehiopiancoffeeorgintrip.com',
        pass: 'j7YEMnZDS0h$1p5C',
      },
      tls: {
        rejectUnauthorized: false,
        servername: 'ehiopiancoffeeorgintrip.com',
      },
      connectionTimeout: 30000,
      greetingTimeout: 10000,
      socketTimeout: 30000,
    },
  },
  {
    name: 'cPanel Hostname Port 587',
    config: {
      host: 'server.mysecurecloudhost.com', // Generic cPanel hostname
      port: 587,
      secure: false,
      auth: {
        user: 'hello@ehiopiancoffeeorgintrip.com',
        pass: 'j7YEMnZDS0h$1p5C',
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 30000,
      greetingTimeout: 10000,
      socketTimeout: 30000,
      requireTLS: true,
    },
  },
  {
    name: 'cPanel Non-SSL Port 25',
    config: {
      host: '198.38.92.6',
      port: 25,
      secure: false,
      auth: {
        user: 'hello@ehiopiancoffeeorgintrip.com',
        pass: 'j7YEMnZDS0h$1p5C',
      },
      tls: {
        rejectUnauthorized: false,
        servername: 'ehiopiancoffeeorgintrip.com',
      },
      connectionTimeout: 30000,
      greetingTimeout: 10000,
      socketTimeout: 30000,
      ignoreTLS: false,
    },
  },
]

// Create transporter with error handling
const createTransporter = () => {
  console.log('📧 Creating email transporter with config:', {
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    user: emailConfig.auth.user,
  })

  return nodemailer.createTransporter(emailConfig)
}

// Test email configuration
export const testEmailConfiguration = async () => {
  console.log('🔧 Testing email configuration...')

  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('✅ Email configuration is valid!')
    return { success: true }
  } catch (error) {
    console.error('❌ Email configuration test failed:', error.message)

    // Try alternative configurations
    for (const altConfig of alternativeConfigs) {
      try {
        console.log(`🔧 Testing ${altConfig.name}...`)
        const altTransporter = nodemailer.createTransporter(altConfig.config)
        await altTransporter.verify()
        console.log(`✅ ${altConfig.name} configuration is valid!`)

        // Update primary config if alternative works
        emailConfig = altConfig.config
        return { success: true, config: altConfig.name }
      } catch (altError) {
        console.error(`❌ ${altConfig.name} failed:`, altError.message)
      }
    }

    return { success: false, error: error.message }
  }
}

// Send email with retry logic
const sendEmailWithRetry = async (mailOptions, maxRetries = 3) => {
  // First test the configuration
  const testResult = await testEmailConfiguration()
  if (!testResult.success) {
    console.error('❌ Email configuration test failed, cannot send emails')
    return { success: false, error: 'Email configuration invalid' }
  }

  let transporter = createTransporter()

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📧 Attempt ${attempt}: Sending email to ${mailOptions.to}`)
      console.log(`📧 Using host: ${emailConfig.host}:${emailConfig.port}`)

      const info = await transporter.sendMail({
        ...mailOptions,
        from:
          mailOptions.from ||
          '"Ethiopian Coffee Origin Tours" <hello@ehiopiancoffeeorgintrip.com>',
        // Add message headers for better deliverability
        headers: {
          'X-Mailer': 'Ethiopian Coffee Tours Website',
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal',
        },
      })

      console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`)
      console.log(`📧 Response: ${info.response}`)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message)
      console.error(`Error code: ${error.code}`)

      if (attempt === maxRetries) {
        console.error(`❌ All attempts failed for ${mailOptions.to}`)
        return { success: false, error: error.message }
      }

      // Wait before retrying
      const delay = Math.pow(2, attempt) * 1000
      console.log(`⏳ Waiting ${delay}ms before retry...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

// Send booking confirmation email to user
const sendBookingConfirmationEmail = async (booking) => {
  const mailOptions = {
    to: booking.email,
    subject: '🎉 Your Ethiopian Coffee Tour Booking Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">☕ Ethiopian Coffee Origin Tours</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your Coffee Adventure Awaits!</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #8B4513; margin-top: 0;">🎉 Booking Confirmation</h2>
          
          <p>Dear <strong>${booking.full_name}</strong>,</p>
          
          <p>Thank you for choosing Ethiopian Coffee Origin Tours! We're excited to welcome you on your coffee adventure.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #8B4513; margin-top: 0;">📋 Booking Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 8px 0;"><strong>Tour Package:</strong> ${
                booking.selected_package
              }</li>
              <li style="margin: 8px 0;"><strong>Booking Type:</strong> ${
                booking.booking_type
              }</li>
              <li style="margin: 8px 0;"><strong>Number of People:</strong> ${
                booking.number_of_people
              }</li>
              <li style="margin: 8px 0;"><strong>Country:</strong> ${
                booking.country
              }</li>
              <li style="margin: 8px 0;"><strong>Phone:</strong> ${
                booking.phone
              }</li>
              <li style="margin: 8px 0;"><strong>Booking Date:</strong> ${new Date(
                booking.created_at
              ).toLocaleDateString()}</li>
            </ul>
          </div>
          
          <p>Our team will review your booking and contact you within 24 hours to confirm your tour dates and provide additional details.</p>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h4 style="color: #28a745; margin-top: 0;">📞 Next Steps</h4>
            <ul style="margin: 10px 0;">
              <li>We'll contact you to confirm tour dates</li>
              <li>Receive detailed itinerary and preparation guide</li>
              <li>Get ready for an unforgettable coffee experience!</li>
            </ul>
          </div>
          
          <p>If you have any questions, please don't hesitate to contact us:</p>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 5px 0;">📧 Email: hello@ehiopiancoffeeorgintrip.com</li>
            <li style="margin: 5px 0;">📱 Phone: +251 911 123 456</li>
          </ul>
          
          <p>Thank you for choosing Ethiopian Coffee Origin Tours!</p>
          
          <p>Best regards,<br>
          <strong>The Ethiopian Coffee Origin Tours Team</strong></p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>© 2024 Ethiopian Coffee Origin Tours. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  console.log(
    `📧 Preparing to send booking confirmation email to: ${booking.email}`
  )
  const result = await sendEmailWithRetry(mailOptions)

  if (result.success) {
    console.log(
      `✅ Booking confirmation email sent successfully to ${booking.email}`
    )
  } else {
    console.error(
      `❌ Failed to send booking confirmation email to ${booking.email}: ${result.error}`
    )
  }

  return result
}

// Send admin notification email
const sendAdminNotificationEmail = async (booking) => {
  const adminEmail = 'hello@ehiopiancoffeeorgintrip.com'

  const mailOptions = {
    to: adminEmail,
    subject: '🔔 New Booking Notification - Ethiopian Coffee Tours',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #dc3545, #c82333); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">☕ Ethiopian Coffee Origin Tours</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">New Booking Alert!</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #dc3545; margin-top: 0;">🔔 New Booking Received</h2>
          
          <p>A new booking has been submitted through the website.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc3545; margin-top: 0;">📋 Booking Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 8px 0;"><strong>Customer Name:</strong> ${
                booking.full_name
              }</li>
              <li style="margin: 8px 0;"><strong>Email:</strong> ${
                booking.email
              }</li>
              <li style="margin: 8px 0;"><strong>Phone:</strong> ${
                booking.phone
              }</li>
              <li style="margin: 8px 0;"><strong>Country:</strong> ${
                booking.country
              }</li>
              <li style="margin: 8px 0;"><strong>Tour Package:</strong> ${
                booking.selected_package
              }</li>
              <li style="margin: 8px 0;"><strong>Booking Type:</strong> ${
                booking.booking_type
              }</li>
              <li style="margin: 8px 0;"><strong>Number of People:</strong> ${
                booking.number_of_people
              }</li>
              <li style="margin: 8px 0;"><strong>Booking Date:</strong> ${new Date(
                booking.created_at
              ).toLocaleDateString()}</li>
              <li style="margin: 8px 0;"><strong>Booking Time:</strong> ${new Date(
                booking.created_at
              ).toLocaleTimeString()}</li>
            </ul>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-top: 0;">⚠️ Action Required</h4>
            <p style="margin: 10px 0;">Please review this booking and contact the customer within 24 hours to confirm tour dates and provide additional details.</p>
          </div>
          
          <p><strong>Booking ID:</strong> ${booking.id}</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>© 2024 Ethiopian Coffee Origin Tours. All rights reserved.</p>
        </div>
      </div>
    `,
  }

  console.log(`📧 Preparing to send admin notification to: ${adminEmail}`)
  const result = await sendEmailWithRetry(mailOptions)

  if (result.success) {
    console.log(`✅ Admin notification email sent successfully`)
  } else {
    console.error(`❌ Failed to send admin notification: ${result.error}`)
  }

  return result
}

// Send payment confirmation email to user
const sendPaymentConfirmationEmail = async (booking) => {
  const mailOptions = {
    to: booking.email,
    subject: '💳 Payment Confirmation - Ethiopian Coffee Tour',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">☕ Ethiopian Coffee Origin Tours</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Payment Confirmed!</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #28a745; margin-top: 0;">💳 Payment Confirmation</h2>
          
          <p>Dear <strong>${booking.full_name}</strong>,</p>
          
          <p>Great news! Your payment for your Ethiopian Coffee Origin Tour has been successfully processed.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-top: 0;">📋 Payment Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 8px 0;"><strong>Tour Package:</strong> ${
                booking.selected_package
              }</li>
              <li style="margin: 8px 0;"><strong>Number of People:</strong> ${
                booking.number_of_people
              }</li>
              <li style="margin: 8px 0;"><strong>Payment Status:</strong> <span style="color: #28a745; font-weight: bold;">✅ Confirmed</span></li>
              <li style="margin: 8px 0;"><strong>Confirmation Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
          
          <p>Thank you for your payment!</p>
          
          <p>Best regards,<br>
          <strong>The Ethiopian Coffee Origin Tours Team</strong></p>
        </div>
      </div>
    `,
  }

  const result = await sendEmailWithRetry(mailOptions)
  return result
}

// Send status update email to user
const sendStatusUpdateEmail = async (booking, status) => {
  const mailOptions = {
    to: booking.email,
    subject: `📋 Booking Status Update - ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">☕ Ethiopian Coffee Origin Tours</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Booking Status Update</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #007bff; margin-top: 0;">📋 Status Update</h2>
          
          <p>Dear <strong>${booking.full_name}</strong>,</p>
          
          <p>Your booking status has been updated to: <strong>${status}</strong></p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">📋 Booking Details</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin: 8px 0;"><strong>Tour Package:</strong> ${
                booking.selected_package
              }</li>
              <li style="margin: 8px 0;"><strong>New Status:</strong> <span style="color: #007bff; font-weight: bold;">${status}</span></li>
              <li style="margin: 8px 0;"><strong>Update Date:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
          
          <p>If you have any questions, please contact us.</p>
          
          <p>Best regards,<br>
          <strong>The Ethiopian Coffee Origin Tours Team</strong></p>
        </div>
      </div>
    `,
  }

  const result = await sendEmailWithRetry(mailOptions)
  return result
}

// Export all functions
export {
  sendBookingConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendStatusUpdateEmail,
  sendAdminNotificationEmail,
}
