// lib/email.js - Email configuration and templates
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'mail.ehiopiancoffeeorgintrip.com',
  port: 465,
  secure: true, // Use SSL/TLS
  auth: {
    user: 'info@ehiopiancoffeeorgintrip.com',
    pass: 'TO=h1RW@++]e5Y+x',
  },
  tls: {
    rejectUnauthorized: false,
  },
})

// Verify transporter connection
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ SMTP connection error:', error)
  } else {
    console.log('✅ SMTP server is ready to send emails')
  }
})

/**
 * Send booking confirmation email to customer
 * @param {Object} booking - Booking data
 * @returns {Promise<Object>} - Email result
 */
export async function sendBookingConfirmationEmail(booking) {
  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - Ethiopian Coffee Origin Tours</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B4513, #D2691E); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #8B4513; }
            .status-pending { color: #f39c12; font-weight: bold; }
            .status-confirmed { color: #27ae60; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .contact-info { background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>☕ Ethiopian Coffee Origin Tours</h1>
                <p>Your Coffee Adventure Awaits!</p>
            </div>
            
            <div class="content">
                <h2>Booking Confirmation</h2>
                <p>Dear ${booking.full_name},</p>
                
                <p>Thank you for choosing Ethiopian Coffee Origin Tours! We have received your booking request and are excited to share the authentic coffee experience with you.</p>
                
                <div class="booking-details">
                    <h3>📋 Booking Details</h3>
                    <p><strong>Booking ID:</strong> #${booking.id}</p>
                    <p><strong>Package:</strong> ${booking.selected_package}</p>
                    <p><strong>Booking Type:</strong> ${
                      booking.booking_type
                    }</p>
                    <p><strong>Number of People:</strong> ${
                      booking.number_of_people
                    }</p>
                    <p><strong>Status:</strong> <span class="status-pending">Pending Confirmation</span></p>
                    <p><strong>Booking Date:</strong> ${new Date(
                      booking.created_at
                    ).toLocaleDateString()}</p>
                </div>
                
                <div class="contact-info">
                    <h3>📞 Next Steps</h3>
                    <p>Our team will review your booking and contact you within <strong>8 hours</strong> to:</p>
                    <ul>
                        <li>Confirm your booking details</li>
                        <li>Provide payment instructions</li>
                        <li>Share your personalized itinerary</li>
                        <li>Answer any questions you may have</li>
                    </ul>
                </div>
                
                <p>We look forward to welcoming you to the birthplace of coffee!</p>
                
                <p>Best regards,<br>
                <strong>The Ethiopian Coffee Origin Tours Team</strong></p>
            </div>
            
            <div class="footer">
                <p>For immediate assistance, contact us at:</p>
                <p>📧 info@ehiopiancoffeeorgintrip.com</p>
                <p>📱 +251933801212</p>
                <p>🌐 www.ethiopiancoffeeorgintrip.com</p>
            </div>
        </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: '"Ethiopian Coffee Origin Tours" <info@ehiopiancoffeeorgintrip.com>',
    to: booking.email,
    subject: `Booking Confirmation - ${booking.selected_package}`,
    html: emailTemplate,
  }

  try {
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Booking confirmation email sent to:', booking.email)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Error sending booking confirmation email:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send payment confirmation email to customer
 * @param {Object} booking - Booking data
 * @returns {Promise<Object>} - Email result
 */
export async function sendPaymentConfirmationEmail(booking) {
  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmed - Ethiopian Coffee Origin Tours</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #27ae60; }
            .status-confirmed { color: #27ae60; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .next-steps { background: #e8f8e8; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .celebration { text-align: center; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Payment Confirmed!</h1>
                <p>Your Coffee Adventure is Confirmed</p>
            </div>
            
            <div class="content">
                <div class="celebration">
                    <h2>🌟 Congratulations!</h2>
                    <p>Your payment has been successfully processed and your booking is now confirmed!</p>
                </div>
                
                <div class="booking-details">
                    <h3>📋 Confirmed Booking Details</h3>
                    <p><strong>Booking ID:</strong> #${booking.id}</p>
                    <p><strong>Package:</strong> ${booking.selected_package}</p>
                    <p><strong>Booking Type:</strong> ${
                      booking.booking_type
                    }</p>
                    <p><strong>Number of People:</strong> ${
                      booking.number_of_people
                    }</p>
                    <p><strong>Status:</strong> <span class="status-confirmed">✅ Confirmed</span></p>
                    <p><strong>Confirmation Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <div class="next-steps">
                    <h3>🚀 What's Next?</h3>
                    <p>Our team will contact you within <strong>24 hours</strong> to:</p>
                    <ul>
                        <li>Share your detailed itinerary</li>
                        <li>Provide arrival instructions</li>
                        <li>Confirm pickup arrangements</li>
                        <li>Answer any final questions</li>
                    </ul>
                </div>
                
                <p>Get ready for an unforgettable coffee experience in the birthplace of coffee!</p>
                
                <p>Best regards,<br>
                <strong>The Ethiopian Coffee Origin Tours Team</strong></p>
            </div>
            
            <div class="footer">
                <p>For any questions, contact us at:</p>
                <p>📧 info@ehiopiancoffeeorgintrip.com</p>
                <p>📱 +251933801212</p>
                <p>🌐 www.ethiopiancoffeeorgintrip.com</p>
            </div>
        </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: '"Ethiopian Coffee Origin Tours" <info@ehiopiancoffeeorgintrip.com>',
    to: booking.email,
    subject: `Payment Confirmed - ${booking.selected_package}`,
    html: emailTemplate,
  }

  try {
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Payment confirmation email sent to:', booking.email)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Error sending payment confirmation email:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send admin notification email
 * @param {Object} booking - Booking data
 * @returns {Promise<Object>} - Email result
 */
export async function sendAdminNotificationEmail(booking) {
  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Notification</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .booking-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .admin-link { background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>New Booking Received</h2>
            </div>
            
            <div class="content">
                <h3>Booking Details:</h3>
                <div class="booking-details">
                    <p><strong>Booking ID:</strong> #${booking.id}</p>
                    <p><strong>Customer:</strong> ${booking.full_name}</p>
                    <p><strong>Email:</strong> ${booking.email}</p>
                    <p><strong>Phone:</strong> ${booking.phone}</p>
                    <p><strong>Country:</strong> ${booking.country}</p>
                    <p><strong>Package:</strong> ${booking.selected_package}</p>
                    <p><strong>Type:</strong> ${booking.booking_type}</p>
                    <p><strong>People:</strong> ${booking.number_of_people}</p>
                    <p><strong>Date:</strong> ${new Date(
                      booking.created_at
                    ).toLocaleString()}</p>
                </div>
                
                <a href="http://localhost:5175/admin" class="admin-link">View in Admin Dashboard</a>
            </div>
        </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: '"Booking System" <info@ehiopiancoffeeorgintrip.com>',
    to: 'info@ehiopiancoffeeorgintrip.com',
    subject: `New Booking: ${booking.full_name} - ${booking.selected_package}`,
    html: emailTemplate,
  }

  try {
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Admin notification email sent')
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send booking status update email
 * @param {Object} booking - Booking data
 * @param {string} oldStatus - Previous status
 * @param {string} newStatus - New status
 * @returns {Promise<Object>} - Email result
 */
export async function sendStatusUpdateEmail(booking, oldStatus, newStatus) {
  const statusMessages = {
    pending: 'Your booking is pending confirmation',
    confirmed: 'Your booking has been confirmed!',
    cancelled: 'Your booking has been cancelled',
  }

  const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Status Update</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #34495e; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .status-update { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Booking Status Update</h2>
            </div>
            
            <div class="content">
                <p>Dear ${booking.full_name},</p>
                
                <div class="status-update">
                    <h3>Status Changed: ${oldStatus} → ${newStatus}</h3>
                    <p><strong>Booking ID:</strong> #${booking.id}</p>
                    <p><strong>Package:</strong> ${booking.selected_package}</p>
                    <p><strong>Message:</strong> ${statusMessages[newStatus]}</p>
                </div>
                
                <p>If you have any questions, please contact us.</p>
                
                <p>Best regards,<br>
                Ethiopian Coffee Origin Tours Team</p>
            </div>
        </div>
    </body>
    </html>
  `

  const mailOptions = {
    from: '"Ethiopian Coffee Origin Tours" <info@ehiopiancoffeeorgintrip.com>',
    to: booking.email,
    subject: `Booking Status Update - ${newStatus.toUpperCase()}`,
    html: emailTemplate,
  }

  try {
    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Status update email sent to:', booking.email)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Error sending status update email:', error)
    return { success: false, error: error.message }
  }
}

export default {
  sendBookingConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendAdminNotificationEmail,
  sendStatusUpdateEmail,
}
