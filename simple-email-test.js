// simple-email-test-fixed.js - Fixed nodemailer import
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

// Load environment variables
dotenv.config()

async function testEmailConnection() {
  console.log('🧪 Testing email configuration...')

  // Debug: Check nodemailer object
  console.log('📦 Nodemailer object:', typeof nodemailer)
  console.log('📦 Available methods:', Object.keys(nodemailer))

  // Validate environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error(
      '❌ Missing EMAIL_USER or EMAIL_PASS in environment variables'
    )
    return
  }

  console.log('📧 Email User:', process.env.EMAIL_USER)

  try {
    // Correct way to create transporter (note: createTransport, not createTransporter)
    const transporter = nodemailer.createTransport({
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
      debug: true, // Enable debug
      logger: true, // Enable logging
    })

    // Test connection
    console.log('🔌 Testing SMTP connection...')
    await transporter.verify()
    console.log('✅ SMTP connection successful!')

    // Send test email
    console.log('📨 Sending test email...')
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to: 'michaeltaye012@gmail.com',
      subject: 'Test Email - Connection Successful',
      html: `
        <h2>🎉 Email Test Successful!</h2>
        <p>This is a test email to confirm your email configuration is working.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
      `,
      text: `Email Test Successful! Sent at ${new Date().toLocaleString()}`,
    })

    console.log('✅ Email sent successfully!')
    console.log('📨 Message ID:', info.messageId)
    console.log('📬 Email sent to: michaeltaye012@gmail.com')
  } catch (error) {
    console.error('❌ Email test failed:', error.message)
    console.error('❌ Full error:', error)

    // Provide specific error hints
    if (error.code === 'EAUTH') {
      console.error(
        '💡 Authentication failed. Check your EMAIL_USER and EMAIL_PASS'
      )
    } else if (error.code === 'ETIMEDOUT') {
      console.error('💡 Connection timeout. Try a different SMTP provider')
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Connection refused. Check SMTP_HOST and SMTP_PORT')
    }
  }
}

// Run the test
testEmailConnection()
