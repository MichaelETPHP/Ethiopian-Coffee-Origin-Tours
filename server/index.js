// server/index.js - Updated for PostgreSQL/Neon
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import { body, validationResult } from 'express-validator'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const { Pool } = pg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from parent directory (root)
dotenv.config({ path: path.join(__dirname, '../.env') })

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

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})
app.use(limiter)

const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
})

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`)
  })
  next()
})

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

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
    const client = await pool.connect()

    // Create bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        age INTEGER NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        country VARCHAR(100) NOT NULL,
        booking_type VARCHAR(20) CHECK (booking_type IN ('individual', 'group')) NOT NULL,
        number_of_people INTEGER DEFAULT 1,
        selected_package VARCHAR(255) NOT NULL,
        status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes
    await client.query(
      'CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email)'
    )
    await client.query(
      'CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at)'
    )
    await client.query(
      'CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)'
    )

    // Create admin users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) CHECK (role IN ('admin', 'manager')) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
      )
    `)

    // Create default admin user if none exists
    const adminCheck = await client.query(
      'SELECT COUNT(*) as count FROM admin_users'
    )
    if (parseInt(adminCheck.rows[0].count) === 0) {
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123'
      const hashedPassword = await bcrypt.hash(defaultPassword, 12)

      await client.query(
        `INSERT INTO admin_users (username, email, password_hash, role) 
         VALUES ($1, $2, $3, $4)`,
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

    client.release()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

// JWT middleware
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
    const client = await pool.connect()

    const users = await client.query(
      'SELECT id, username, email, role FROM admin_users WHERE id = $1',
      [decoded.userId]
    )

    client.release()

    if (users.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token.' })
    }

    req.user = users.rows[0]
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

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Submit booking
app.post('/api/bookings', bookingLimiter, async (req, res) => {
  try {
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

    if (
      !fullName ||
      !age ||
      !email ||
      !phone ||
      !country ||
      !bookingType ||
      !selectedPackage
    ) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Check for duplicate bookings
      const existingBookings = await client.query(
        `SELECT id FROM bookings 
         WHERE email = $1 AND selected_package = $2 
         AND (status IS NULL OR status != 'cancelled') 
         LIMIT 1`,
        [email, selectedPackage]
      )

      if (existingBookings.rows.length > 0) {
        await client.query('ROLLBACK')
        return res.status(409).json({
          error:
            'A booking with this email already exists for the selected package.',
        })
      }

      // Insert booking
      const result = await client.query(
        `INSERT INTO bookings (
          full_name, age, email, phone, country, booking_type, 
          number_of_people, selected_package, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW()) 
        RETURNING id`,
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

      await client.query('COMMIT')
      res.status(201).json({
        message: 'Booking submitted successfully',
        bookingId: result.rows[0].id,
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Booking submission error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' })
    }

    const client = await pool.connect()

    const users = await client.query(
      'SELECT id, username, email, password_hash, role FROM admin_users WHERE username = $1',
      [username]
    )

    if (users.rows.length === 0) {
      client.release()
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = users.rows[0]
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      client.release()
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Update last login
    await client.query(
      'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    )

    client.release()

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
})

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
    let paramIndex = 1

    if (search) {
      query += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${
        paramIndex + 1
      } OR phone ILIKE $${paramIndex + 2})`
      countQuery += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${
        paramIndex + 1
      } OR phone ILIKE $${paramIndex + 2})`
      const searchParam = `%${search}%`
      params.push(searchParam, searchParam, searchParam)
      countParams.push(searchParam, searchParam, searchParam)
      paramIndex += 3
    }

    if (status) {
      query += ` AND status = $${paramIndex}`
      countQuery += ` AND status = $${paramIndex}`
      params.push(status)
      countParams.push(status)
      paramIndex += 1
    }

    if (packageFilter) {
      query += ` AND selected_package ILIKE $${paramIndex}`
      countQuery += ` AND selected_package ILIKE $${paramIndex}`
      params.push(`%${packageFilter}%`)
      countParams.push(`%${packageFilter}%`)
      paramIndex += 1
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${
      paramIndex + 1
    }`
    params.push(parseInt(limit), parseInt(offset))

    const client = await pool.connect()
    const bookings = await client.query(query, params)
    const countResult = await client.query(countQuery, countParams)
    client.release()

    res.json({
      bookings: bookings.rows,
      total: parseInt(countResult.rows[0].total),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(countResult.rows[0].total / limit),
    })
  } catch (error) {
    console.error('Get bookings error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update booking status
app.patch('/api/admin/bookings/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const client = await pool.connect()

    await client.query(
      'UPDATE bookings SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [status, notes || null, id]
    )

    client.release()

    res.json({ message: 'Booking updated successfully' })
  } catch (error) {
    console.error('Update booking error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params
    const client = await pool.connect()
    const result = await client.query('DELETE FROM bookings WHERE id = $1', [
      id,
    ])
    client.release()

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    res.json({ message: 'Booking deleted successfully' })
  } catch (error) {
    console.error('Delete booking error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})


app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'))
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
