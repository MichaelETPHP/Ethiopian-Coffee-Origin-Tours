// lib/email.js - Email sending utilities
import nodemailer from 'nodemailer'

/**
 * Create email transporter (singleton pattern)
 */
let transporter = null

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Optional: Add connection timeout
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000, // 5 seconds
    })
  }
  return transporter
}

/**
 * Send email with error handling
 * @param {Object} options - Email options
 * @returns {Promise<Object>} - Send result
 */
export async function sendEmail(options) {
  try {
    const {
      to,
      subject,
      html,
      text,
      cc,
      bcc,
      from = process.env.SMTP_FROM || 'noreply@ethiopiancoffeetrip.com'
    } = options

    if (!to || !subject || (!html && !text)) {
      throw new Error('Missing required email parameters: to, subject, and content')
    }

    const mailOptions = {
      from,
      to,
      subject,
      ...(html && { html }),
      ...(text && { text }),
      ...(cc && { cc }),
      ...(bcc && { bcc })
    }

    const transporter = getTransporter()
    const info = await transporter.sendMail(mailOptions)

    console.log('✅ Email sent successfully:', {
      to,
      subject,
      messageId: info.messageId
    })

    return {
      success: true,
      messageId: info.messageId,
      info
    }
  } catch (error) {
    console.error('❌ Email sending error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Verify email transporter configuration
 * @returns {Promise<boolean>} - Verification result
 */
export async function verifyEmailConfig() {
  try {
    const transporter = getTransporter()
    await transporter.verify()
    console.log('✅ Email configuration verified')
    return true
  } catch (error) {
    console.error('❌ Email configuration error:', error)
    return false
  }
}

/**
 * Email templates
 */
export const emailTemplates = {
  /**
   * Booking confirmation email
   * @param {Object} booking - Booking data
   * @returns {Object} - Email template
   */
  bookingConfirmation: (booking) => ({
    subject: 'Booking Confirmation - Ethiopian Coffee Origin Trip',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ea580c, #dc2626); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
          .status { display: inline-block; padding: 6px 12px; border-radius: 20px; font-weight: bold; text-transform: uppercase; font-size: 12px; }
          .status.confirmed { background: #dcfce7; color: #166534; }
          .status.pending { background: #fef3c7; color: #92400e; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌟 Booking Confirmation</h1>
          <p>Ethiopian Coffee Origin Trip</p>
        </div>
        
        <div class="content">
          <h2>Dear ${booking.full_name},</h2>
          <p>Thank you for booking with Ethiopian Coffee Origin Trip! We're excited to have you join us on this amazing journey.</p>
          
          <div class="details">
            <h3>📋 Booking Details</h3>
            <p><strong>Booking ID:</strong> #${booking.id}</p>
            <p><strong>Package:</strong> ${booking.selected_package.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            <p><strong>Status:</strong> <span class="status ${booking.status}">${booking.status}</span></p>
            <p><strong>Booking Type:</strong> ${booking.booking_type}</p>
            ${booking.booking_type === 'group' ? `<p><strong>Number of People:</strong> ${booking.number_of_people}</p>` : ''}
            <p><strong>Country:</strong> ${booking.country}</p>
            <p><strong>Phone:</strong> ${booking.phone}</p>
            ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
          </div>
          
          <div class="details">
            <h3>☕ What's Next?</h3>
            <ul>
              <li>Our team will review your booking within 24 hours</li>
              <li>You'll receive detailed itinerary and preparation information</li>
              <li>We'll contact you for any additional arrangements</li>
              <li>Get ready for an unforgettable coffee experience!</li>
            </ul>
          </div>
          
          <div class="details">
            <h3>📞 Contact Information</h3>
            <p><strong>Email:</strong> info@ethiopiancoffeetrip.com</p>
            <p><strong>Phone:</strong> +251-XXX-XXXX</p>
            <p><strong>Website:</strong> www.ethiopiancoffeetrip.com</p>
          </div>
        </div>
        
        <div class="footer">
          <p>Thank you for choosing Ethiopian Coffee Origin Trip!</p>
          <p>We look forward to sharing the authentic taste of Ethiopian coffee with you.</p>
          <p><small>This is an automated email. Please do not reply to this message.</small></p>
        </div>
      </body>
      </html>
    `,
    text: `
      Booking Confirmation - Ethiopian Coffee Origin Trip
      
      Dear ${booking.full_name},
      
      Thank you for booking with Ethiopian Coffee Origin Trip!
      
      Booking Details:
      - Booking ID: #${booking.id}
      - Package: ${booking.selected_package}
      - Status: ${booking.status}
      - Booking Type: ${booking.booking_type}
      ${booking.booking_type === 'group' ? `- Number of People: ${booking.number_of_people}` : ''}
      - Country: ${booking.country}
      - Phone: ${booking.phone}
      ${booking.notes ? `- Notes: ${booking.notes}` : ''}
      
      Our team will review your booking within 24 hours.
      
      Contact: info@ethiopiancoffeetrip.com
      
      Thank you for choosing Ethiopian Coffee Origin Trip!
    `
  }),

  /**
   * Admin notification email
   * @param {Object} booking - New booking data
   * @returns {Object} - Email template
   */
  adminNotification: (booking) => ({
    subject: `New Booking Received - ${booking.full_name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Booking Notification</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; border-radius: 8px; }
          .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .urgent { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔔 New Booking Alert</h1>
          <p>Ethiopian Coffee Origin Trip - Admin Panel</p>
        </div>
        
        <div class="urgent">
          <h2>⚡ Action Required</h2>
          <p>A new booking has been submitted and requires your attention.</p>
        </div>
        
        <div class="content">
          <h3>👤 Customer Details</h3>
          <p><strong>Name:</strong> ${booking.full_name}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Phone:</strong> ${booking.phone}</p>
          <p><strong>Age:</strong> ${booking.age}</p>
          <p><strong>Country:</strong> ${booking.country}</p>
          
          <h3>📦 Booking Information</h3>
          <p><strong>Package:</strong> ${booking.selected_package}</p>
          <p><strong>Type:</strong> ${booking.booking_type}</p>
          ${booking.booking_type === 'group' ? `<p><strong>Group Size:</strong> ${booking.number_of_people} people</p>` : ''}
          <p><strong>Status:</strong> Pending Review</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          
          <div style="margin: 20px 0; padding: 20px; background: white; border-radius: 8px;">
            <h3>🎯 Quick Actions</h3>
            <p>Log into your admin dashboard to:</p>
            <ul>
              <li>Review and approve the booking</li>
              <li>Contact the customer</li>
              <li>Send confirmation email</li>
              <li>Update booking status</li>
            </ul>
            <p><a href="${process.env.FRONTEND_URL || 'https://your-domain.com'}/admin" 
                  style="background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
                  Go to Admin Dashboard
               </a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      New Booking Alert - Ethiopian Coffee Origin Trip
      
      A new booking has been submitted:
      
      Customer: ${booking.full_name}
      Email: ${booking.email}
      Phone: ${booking.phone}
      Package: ${booking.selected_package}
      Type: ${booking.booking_type}
      ${booking.booking_type === 'group' ? `Group Size: ${booking.number_of_people}` : ''}
      
      Please log into the admin dashboard to review and process this booking.
    `
  }),

  /**
   * Booking status update email
   * @param {Object} booking - Updated booking data
   * @param {string} oldStatus - Previous status
   * @returns {Object} - Email template
   */
  statusUpdate: (booking, oldStatus) => ({
    subject: `Booking Status Update - ${booking.status.toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Status Update</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ea580c, #dc2626); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .status-change { background: white; padding: 15px; border-radius: 6px; text-align: center; margin: 15px 0; }
          .status { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 0 10px; }
          .status.confirmed { background: #dcfce7; color: #166534; }
          .status.pending { background: #fef3c7; color: #92400e; }
          .status.cancelled { background: #fee2e2; color: #dc2626; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📋 Booking Status Update</h1>
          <p>Ethiopian Coffee Origin Trip</p>
        </div>
        
        <div class="content">
          <h2>Dear ${booking.full_name},</h2>
          <p>We wanted to update you on the status of your booking for the Ethiopian Coffee Origin Trip.</p>
          
          <div class="status-change">
            <h3>Status Change</h3>
            <p>
              <span class="status ${oldStatus}">${oldStatus}</span>
              →
              <span class="status ${booking.status}">${booking.status}</span>
            </p>
          </div>
          
          ${booking.status === 'confirmed' ? `
            <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>🎉 Congratulations!</h3>
              <p>Your booking has been confirmed! We're excited to welcome you on this amazing journey.</p>
              <p>You'll receive detailed itinerary and preparation instructions within the next 24 hours.</p>
            </div>
          ` : ''}
          
          ${booking.status === 'cancelled' ? `
            <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>😔 Booking Cancelled</h3>
              <p>Unfortunately, your booking has been cancelled. If you have any questions, please contact us immediately.</p>
              <p>We apologize for any inconvenience and hope to serve you in the future.</p>
            </div>
          ` : ''}
          
          ${booking.notes ? `
            <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <h3>📝 Additional Notes</h3>
              <p>${booking.notes}</p>
            </div>
          ` : ''}
          
          <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <h3>📞 Need Help?</h3>
            <p>If you have any questions or concerns, please don't hesitate to contact us:</p>
            <p><strong>Email:</strong> info@ethiopiancoffeetrip.com</p>
            <p><strong>Phone:</strong> +251-XXX-XXXX</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Booking Status Update - Ethiopian Coffee Origin Trip
      
      Dear ${booking.full_name},
      
      Your booking status has been updated:
      ${oldStatus} → ${booking.status}
      
      Booking ID: #${booking.id}
      Package: ${booking.selected_package}
      
      ${booking.notes ? `Notes: ${booking.notes}` : ''}
      
      Contact us: info@ethiopiancoffeetrip.com
    `
  }),

  /**
   * Welcome email for new admin users
   * @param {Object} admin - Admin user data
   * @param {string} tempPassword - Temporary password
   * @returns {Object} - Email template
   */
  adminWelcome: (admin, tempPassword) => ({
    subject: 'Welcome to Ethiopian Coffee Tours Admin Panel',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Admin Welcome</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .credentials { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #f59e0b; }
          .warning { background: #fee2e2; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #dc2626; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔐 Welcome to Admin Panel</h1>
          <p>Ethiopian Coffee Origin Trip</p>
        </div>
        
        <div class="content">
          <h2>Welcome ${admin.username}!</h2>
          <p>You've been granted access to the Ethiopian Coffee Tours admin panel.</p>
          
          <div class="credentials">
            <h3>🔑 Login Credentials</h3>
            <p><strong>Username:</strong> ${admin.username}</p>
            <p><strong>Email:</strong> ${admin.email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
            <p><strong>Role:</strong> ${admin.role}</p>
          </div>
          
          <div class="warning">
            <h3>⚠️ Important Security Notice</h3>
            <p>Please change your password immediately after your first login for security purposes.</p>
            <p>Never share your login credentials with anyone.</p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <h3>🚀 Getting Started</h3>
            <p>You can access the admin panel at:</p>
            <p><a href="${process.env.FRONTEND_URL || 'https://your-domain.com'}/admin" 
                  style="background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Access Admin Panel
               </a></p>
          </div>
        </div>
      </body>
      </html>
    `
  })
}

/**
 * Send booking confirmation email
 * @param {Object} booking - Booking data
 * @returns {Promise<Object>} - Send result
 */
export async function sendBookingConfirmation(booking) {
  const template = emailTemplates.bookingConfirmation(booking)
  return sendEmail({
    to: booking.email,
    subject: template.subject,
    html: template.html,
    text: template.text
  })
}

/**
 * Send admin notification email
 * @param {Object} booking - New booking data
 * @returns {Promise<Object>} - Send result
 */
export async function sendAdminNotification(booking) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ethiopiancoffeetrip.com'
  const template = emailTemplates.adminNotification(booking)
  
  return sendEmail({
    to: adminEmail,
    subject: template.subject,
    html: template.html,
    text: template.text
  })
}

/**
 * Send booking status update email
 * @param {Object} booking - Updated booking data
 * @param {string} oldStatus - Previous status
 * @returns {Promise<Object>} - Send result
 */
export async function sendStatusUpdate(booking, oldStatus) {
  const template = emailTemplates.statusUpdate(booking, oldStatus)
  return sendEmail({
    to: booking.email,
    subject: template.subject,
    html: template.html,
    text: template.text
  })
}

/**
 * Send bulk emails (with rate limiting)
 * @param {Array} recipients - Array of email recipients
 * @param {Object} template - Email template
 * @param {number} delay - Delay between emails (ms)
 * @returns {Promise<Array>} - Array of send results
 */
export async function sendBulkEmails(recipients, template, delay = 1000) {
  const results = []
  
  for (const recipient of recipients) {
    try {
      const result = await sendEmail({
        to: recipient.email,
        subject: template.subject,
        html: template.html,
        text: template.text
      })
      
      results.push({
        recipient: recipient.email,
        success: result.success,
        messageId: result.messageId,
        error: result.error
      })
      
      // Add delay to avoid rate limiting
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    } catch (error) {
      results.push({
        recipient: recipient.email,
        success: false,
        error: error.message
      })
    }
  }
  
  return results
}