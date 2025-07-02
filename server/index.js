import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import { body, validationResult } from 'express-validator'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com'],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://cdn.tailwindcss.com',
          'https://unpkg.com',
        ],
        fontSrc: ["'self'", 'https:', 'data:'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: [
          "'self'",
          'http://localhost:3001',
          'http://localhost:5173',
        ],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        manifestSrc: ["'self'"],
      },
    },
  })
)
// Optimized CORS configuration
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Add compression for better performance
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Booking rate limiting (more restrictive)
const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 booking attempts per hour
})

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Add request logging for monitoring performance
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`)
  })
  next()
})

// Database configuration - Optimized for performance
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3308,
  user: process.env.DB_USER || 'root',
  waitForConnections: true,
  connectionLimit: 20, // Increased for better concurrency
  queueLimit: 0,
  acquireTimeout: 60000, // 60 seconds
  timeout: 60000, // 60 seconds
  reconnect: true,
  charset: 'utf8mb4',
}

const databaseName = process.env.DB_NAME || 'tour_booking_system'

// Create database connection pool
const pool = mysql.createPool(dbConfig)

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Initialize database
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection()

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${databaseName}`)
    await connection.query(`USE ${databaseName}`)

    // Create bookings table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        country VARCHAR(100) NOT NULL,
        booking_type ENUM('individual', 'group') NOT NULL,
        number_of_people INT DEFAULT 1,
        selected_package VARCHAR(255) NOT NULL,
        status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_created_at (created_at),
        INDEX idx_status (status)
      )
    `)

    // Database migration - Add missing columns if they don't exist
    const migrations = [
      {
        name: 'selected_package',
        sql: `ALTER TABLE bookings ADD COLUMN selected_package VARCHAR(255) NOT NULL DEFAULT 'southern-ethiopia'`,
      },
      {
        name: 'status',
        sql: `ALTER TABLE bookings ADD COLUMN status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending'`,
      },
      {
        name: 'notes',
        sql: `ALTER TABLE bookings ADD COLUMN notes TEXT`,
      },
      {
        name: 'updated_at',
        sql: `ALTER TABLE bookings ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
      },
      {
        name: 'idx_email',
        sql: `CREATE INDEX idx_email ON bookings(email)`,
      },
      {
        name: 'idx_created_at',
        sql: `CREATE INDEX idx_created_at ON bookings(created_at)`,
      },
      {
        name: 'idx_status',
        sql: `CREATE INDEX idx_status ON bookings(status)`,
      },
    ]

    for (const migration of migrations) {
      try {
        await connection.execute(migration.sql)
        console.log(`✅ Added ${migration.name} to bookings table`)
      } catch (error) {
        if (
          error.code === 'ER_DUP_FIELDNAME' ||
          error.code === 'ER_DUP_KEYNAME'
        ) {
          console.log(`ℹ️  ${migration.name} already exists`)
        } else {
          console.error(`❌ Error adding ${migration.name}:`, error.message)
        }
      }
    }

    // Create admin users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'manager') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
      )
    `)

    // Create default admin user if none exists
    const [adminUsers] = await connection.execute(
      'SELECT COUNT(*) as count FROM admin_users'
    )
    if (adminUsers[0].count === 0) {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123'
      const hashedPassword = await bcrypt.hash(defaultPassword, 12)

      await connection.execute(
        `
        INSERT INTO admin_users (username, email, password_hash, role) 
        VALUES (?, ?, ?, ?)
      `,
        [
          'admin',
          process.env.ADMIN_EMAIL || 'admin@ethiopiancoffeetrip.com',
          hashedPassword,
          'admin',
        ]
      )

      console.log('Default admin user created with username: admin')
      console.log('Default password:', defaultPassword)
    }

    connection.release()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

// JWT middleware for admin authentication
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res
        .status(401)
        .json({ error: 'Access denied. No token provided.' })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    )
    const connection = await pool.getConnection()

    const [users] = await connection.execute(
      'SELECT id, username, email, role FROM admin_users WHERE id = ?',
      [decoded.userId]
    )

    connection.release()

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid token.' })
    }

    req.user = users[0]
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' })
  }
}

// Send email function
async function sendEmail(to, subject, html, cc = null) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@ethiopiancoffeetrip.com',
      to,
      subject,
      html,
    }

    if (cc) {
      mailOptions.cc = cc
    }

    await transporter.sendMail(mailOptions)
    console.log('Email sent successfully to:', to)
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

// Validation rules
const bookingValidation = [
  body('fullName').trim().isLength({ min: 2, max: 255 }).escape(),
  body('age').isInt({ min: 18, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().isLength({ min: 5, max: 50 }).escape(),
  body('country').trim().isLength({ min: 2, max: 100 }).escape(),
  body('bookingType').isIn(['individual', 'group']),
  body('numberOfPeople').optional().isInt({ min: 1, max: 20 }),
  body('selectedPackage').trim().isLength({ min: 1, max: 255 }).escape(),
]

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Submit booking
app.post(
  '/api/bookings',
  bookingLimiter,
  bookingValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const {
        fullName,
        age,
        email,
        phone,
        country,
        bookingType,
        numberOfPeople,
        selectedPackage,
      } = req.body

      const connection = await pool.getConnection()

      try {
        // Use transaction for better performance and data consistency
        await connection.beginTransaction()

        // Check for duplicate bookings (same email and package) - Optimized query
        const [existingBookings] = await connection.execute(
          'SELECT id FROM bookings WHERE email = ? AND selected_package = ? AND (status IS NULL OR status != "cancelled") LIMIT 1',
          [email, selectedPackage]
        )

        if (existingBookings.length > 0) {
          await connection.rollback()
          return res.status(409).json({
            error:
              'A booking with this email already exists for the selected package.',
          })
        }

        // Insert booking - Optimized with better field mapping
        const [result] = await connection.execute(
          `
        INSERT INTO bookings (
          full_name, age, email, phone, country, booking_type, 
          number_of_people, selected_package, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
      `,
          [
            fullName,
            age,
            email,
            phone,
            country,
            bookingType,
            bookingType === 'group' ? numberOfPeople : 1,
            selectedPackage,
          ]
        )

        await connection.commit()
        res.status(201).json({
          message: 'Booking submitted successfully',
          bookingId: result.insertId,
        })
      } catch (error) {
        await connection.rollback()
        throw error
      } finally {
        connection.release()
      }
    } catch (error) {
      console.error('Booking submission error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// Admin login
app.post(
  '/api/admin/login',
  [
    body('username').trim().isLength({ min: 1 }).escape(),
    body('password').isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { username, password } = req.body
      const connection = await pool.getConnection()

      const [users] = await connection.execute(
        'SELECT id, username, email, password_hash, role FROM admin_users WHERE username = ?',
        [username]
      )

      if (users.length === 0) {
        connection.release()
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const user = users[0]
      const isValidPassword = await bcrypt.compare(password, user.password_hash)

      if (!isValidPassword) {
        connection.release()
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Update last login
      await connection.execute(
        'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id]
      )

      connection.release()

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      )

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// Get all bookings (admin only)
app.get('/api/admin/bookings', authenticateAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = '',
      status = '',
      package: packageFilter = '',
    } = req.query
    const offset = (page - 1) * limit

    let query = 'SELECT * FROM bookings WHERE 1=1'
    let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE 1=1'
    const params = []
    const countParams = []

    // Add search filter
    if (search) {
      query += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)'
      countQuery += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)'
      const searchParam = `%${search}%`
      params.push(searchParam, searchParam, searchParam)
      countParams.push(searchParam, searchParam, searchParam)
    }

    // Add status filter
    if (status) {
      query += ' AND status = ?'
      countQuery += ' AND status = ?'
      params.push(status)
      countParams.push(status)
    }

    // Add package filter
    if (packageFilter) {
      query += ' AND selected_package LIKE ?'
      countQuery += ' AND selected_package LIKE ?'
      params.push(`%${packageFilter}%`)
      countParams.push(`%${packageFilter}%`)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), parseInt(offset))

    const connection = await pool.getConnection()

    const [bookings] = await connection.execute(query, params)
    const [countResult] = await connection.execute(countQuery, countParams)

    connection.release()

    console.log('Bookings:', bookings)

    res.json({
      bookings,
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(countResult[0].total / limit),
    })
  } catch (error) {
    console.error('Get bookings error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update booking status (admin only)
app.patch(
  '/api/admin/bookings/:id',
  authenticateAdmin,
  [
    body('status').isIn(['pending', 'confirmed', 'cancelled']),
    body('notes').optional().trim().escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { id } = req.params
      const { status, notes } = req.body

      const connection = await pool.getConnection()

      await connection.execute(
        'UPDATE bookings SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, notes || null, id]
      )

      connection.release()

      res.json({ message: 'Booking updated successfully' })
    } catch (error) {
      console.error('Update booking error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// Send confirmation email (admin only)
app.post(
  '/api/admin/bookings/:id/send-email',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { id } = req.params
      const connection = await pool.getConnection()

      const [bookings] = await connection.execute(
        'SELECT * FROM bookings WHERE id = ?',
        [id]
      )

      connection.release()

      if (bookings.length === 0) {
        return res.status(404).json({ error: 'Booking not found' })
      }

      const booking = bookings[0]

      const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6F4E37;">Booking Confirmation</h2>
        <p>Dear ${booking.full_name},</p>
        <p>Your booking for the Ethiopian Coffee Origin Trip has been confirmed!</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #6F4E37; margin-top: 0;">Booking Details</h3>
          <p><strong>Booking ID:</strong> #${booking.id}</p>
          <p><strong>Package:</strong> ${booking.selected_package}</p>
          <p><strong>Status:</strong> ${booking.status}</p>
          <p><strong>Booking Type:</strong> ${booking.booking_type}</p>
          ${
            booking.booking_type === 'group'
              ? `<p><strong>Number of People:</strong> ${booking.number_of_people}</p>`
              : ''
          }
        </div>
        
        <p>We look forward to welcoming you on this amazing journey!</p>
        
        <p>Best regards,<br>
        Ethiopian Coffee Origin Trip Team</p>
      </div>
    `

      await sendEmail(
        booking.email,
        'Booking Confirmation - Ethiopian Coffee Origin Trip',
        emailHtml
      )

      res.json({ message: 'Confirmation email sent successfully' })
    } catch (error) {
      console.error('Send email error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// Export bookings as CSV (admin only)
app.get('/api/admin/bookings/export', authenticateAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection()

    const [bookings] = await connection.execute(`
      SELECT 
        id, full_name, email, phone, country, age, booking_type, 
        number_of_people, selected_package, status, created_at
      FROM bookings 
      ORDER BY created_at DESC
    `)

    connection.release()

    // Generate CSV
    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Country',
      'Age',
      'Booking Type',
      'Number of People',
      'Selected Package',
      'Status',
      'Created At',
    ]

    let csv = headers.join(',') + '\n'

    bookings.forEach((booking) => {
      const row = [
        booking.id,
        `"${booking.full_name}"`,
        booking.email,
        `"${booking.phone}"`,
        `"${booking.country}"`,
        booking.age,
        booking.booking_type,
        booking.number_of_people,
        `"${booking.selected_package}"`,
        booking.status,
        booking.created_at.toISOString(),
      ]
      csv += row.join(',') + '\n'
    })

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv')
    res.send(csv)
  } catch (error) {
    console.error('Export bookings error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Serve admin dashboard
app.use('/admin', express.static(path.join(__dirname, 'admin')))

// Delete a booking by ID
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params
    const connection = await pool.getConnection()
    const [result] = await connection.execute(
      'DELETE FROM bookings WHERE id = ?',
      [id]
    )
    connection.release()
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    res.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    console.error('Delete booking error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Admin dashboard: http://localhost:${PORT}/admin`)
  })
})
