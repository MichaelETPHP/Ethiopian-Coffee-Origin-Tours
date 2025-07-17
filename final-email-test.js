// final-email-test.js - ES6 Module Version
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

// Load environment variables
dotenv.config()

async function testEmailWithAppPassword() {
  console.log('🧪 Testing Gmail with App Password (ES6 Module)...')

  // Check environment variables
  console.log('📧 Email User:', process.env.EMAIL_USER)
  console.log(
    '🔐 Password Length:',
    process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'NOT SET'
  )

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Missing EMAIL_USER or EMAIL_PASS')
    console.error('💡 Make sure you have:')
    console.error('   1. Enabled 2-Step Verification on Gmail')
    console.error('   2. Generated an App Password (16 characters)')
    console.error('   3. Updated your .env file with the App Password')
    return
  }

  // Check if password looks like an App Password (16 chars, spaces)
  const cleanPassword = process.env.EMAIL_PASS.replace(/\s/g, '')
  if (cleanPassword.length !== 16) {
    console.warn(
      "⚠️  Warning: Your password doesn't look like a 16-character App Password"
    )
    console.warn(
      '💡 App passwords are exactly 16 characters (with spaces removed)'
    )
    console.warn('Current password length (no spaces):', cleanPassword.length)
  }

  try {
    // Create transporter with App Password (CORRECT: createTransport, not createTransporter)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // This should be your App Password
      },
      // Connection settings
      connectionTimeout: 60000,
      greetingTimeout: 30000,
      socketTimeout: 75000,
    })

    // Test connection first
    console.log('🔌 Testing SMTP connection...')
    await transporter.verify()
    console.log('✅ SMTP connection successful!')

    // Send test email
    console.log('📨 Sending test email...')
    const info = await transporter.sendMail({
      from: {
        name: 'Ethiopian Coffee Origin Tours',
        address: process.env.EMAIL_USER,
      },
      to: 'michaeltaye012@gmail.com',
      subject: '🎉 Email Configuration Fixed!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #28a745;">🎉 Success! Your Email Is Working!</h2>
          
          <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; border: 1px solid #c3e6cb; margin: 20px 0;">
            <h3 style="color: #155724; margin-top: 0;">✅ Configuration Details</h3>
            <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
            <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Authentication:</strong> App Password ✅</p>
            <p><strong>2FA Status:</strong> Enabled ✅</p>
          </div>
          
          <p>Great news! Your Ethiopian Coffee Origin Tours booking system can now send emails successfully.</p>
          
          <h4 style="color: #007bff;">Next Steps:</h4>
          <ul>
            <li>✅ Test your booking confirmation emails</li>
            <li>✅ Update your booking system with the working configuration</li>
            <li>✅ Monitor email delivery for any issues</li>
          </ul>
          
          <p style="color: #6c757d; font-size: 12px; border-top: 1px solid #dee2e6; padding-top: 15px; margin-top: 30px;">
            This is an automated test email from your Ethiopian Coffee Origin Tours booking system.
          </p>
        </div>
      `,
      text: `
🎉 Success! Your Email Is Working!

Configuration Details:
- From: ${process.env.EMAIL_USER}
- Test Time: ${new Date().toLocaleString()}
- Authentication: App Password ✅
- 2FA Status: Enabled ✅

Great news! Your Ethiopian Coffee Origin Tours booking system can now send emails successfully.

Next Steps:
✅ Test your booking confirmation emails
✅ Update your booking system with the working configuration
✅ Monitor email delivery for any issues
      `,
    })

    console.log('🎉 EMAIL TEST SUCCESSFUL!')
    console.log('📨 Message ID:', info.messageId)
    console.log('📬 Email sent to: michaeltaye012@gmail.com')
    console.log('✅ Your email configuration is now working!')
    console.log('')
    console.log('🚀 You can now use this configuration in your booking system!')
  } catch (error) {
    console.error('❌ Email test failed:', error.message)

    if (error.code === 'EAUTH') {
      console.error('')
      console.error("🔐 AUTHENTICATION ERROR - Here's how to fix it:")
      console.error('1. Go to https://myaccount.google.com/apppasswords')
      console.error('2. Sign in if prompted')
      console.error('3. Select "Mail" and your device/app name')
      console.error('4. Click "Generate"')
      console.error('5. Copy the 16-character password (with spaces)')
      console.error('6. Update EMAIL_PASS in your .env file')
      console.error('')
      console.error('💡 The App Password looks like: "abcd efgh ijkl mnop"')
    } else {
      console.error('Full error details:', error)
    }
  }
}

// Run the test
testEmailWithAppPassword().catch(console.error)
