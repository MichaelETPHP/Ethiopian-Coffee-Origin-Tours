// server/index.js - Route to existing API files
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import { body, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5175',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(compression())
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

// SQLite database connection
let db = null

async function initializeDatabase() {
  try {
    console.log('🔧 Initializing SQLite database...')

    // Create database file in the server directory
    const dbPath = path.join(__dirname, 'database.sqlite')
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    // Create bookings table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        country TEXT NOT NULL,
        booking_type TEXT CHECK (booking_type IN ('individual', 'group')) NOT NULL,
        number_of_people INTEGER DEFAULT 1,
        selected_package TEXT NOT NULL,
        status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create admin_users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT CHECK (role IN ('admin', 'manager')) DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME NULL
      )
    `)

    // Create indexes for better performance
    await db.exec(
      'CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email)'
    )
    await db.exec(
      'CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at)'
    )
    await db.exec(
      'CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)'
    )

    // Check if admin user exists, if not create it
    const adminCheck = await db.get(
      'SELECT COUNT(*) as count FROM admin_users WHERE username = ?',
      ['admin']
    )

    if (!adminCheck || adminCheck.count === 0) {
      console.log('👤 Creating default admin user...')
      const passwordHash = await bcrypt.hash('admin123', 12)

      await db.run(
        'INSERT INTO admin_users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@ethiopiancoffee.com', passwordHash, 'admin']
      )
      console.log('✅ Default admin user created')
      console.log('   Username: admin')
      console.log('   Password: admin123')
    } else {
      console.log('✅ Admin user already exists')
    }

    console.log('✅ Database initialized successfully')
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    throw error
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

    const user = await db.get(
      'SELECT id, username, email, role FROM admin_users WHERE id = ?',
      [decoded.userId]
    )

    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' })
  }
}

// Helper function to read and execute API files
async function executeAPIFile(filePath, req, res) {
  try {
    const fullPath = path.join(process.cwd(), 'api', filePath)

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`API file not found: ${fullPath}`)
      return res.status(404).json({ error: 'API endpoint not found' })
    }

    // Dynamic import the API file
    const apiModule = await import(`file://${fullPath}`)

    // Execute the default handler
    if (apiModule.default && typeof apiModule.default === 'function') {
      await apiModule.default(req, res)
    } else {
      res.status(500).json({ error: 'Invalid API handler' })
    }
  } catch (error) {
    console.error(`Error executing API file ${filePath}:`, error)
    res
      .status(500)
      .json({ error: 'API execution error', details: error.message })
  }
}

// API Routes - Forward to existing API files

// Health check
app.get('/api/health', async (req, res) => {
  await executeAPIFile('health.js', req, res)
})

// Admin login - Use existing api/admin/login.js
app.post('/api/admin/login', async (req, res) => {
  await executeAPIFile('admin/login.js', req, res)
})

// Admin bookings - Use existing api/admin/bookings.js
app.get('/api/admin/bookings', async (req, res) => {
  await executeAPIFile('admin/bookings.js', req, res)
})

app.patch('/api/admin/bookings', async (req, res) => {
  await executeAPIFile('admin/bookings.js', req, res)
})

app.delete('/api/admin/bookings', async (req, res) => {
  await executeAPIFile('admin/bookings.js', req, res)
})

// Booking submission - Use existing api/bookings.js
app.post('/api/bookings', async (req, res) => {
  await executeAPIFile('bookings.js', req, res)
})

// Individual booking operations
app.get('/api/bookings/:id', async (req, res) => {
  await executeAPIFile(`bookings/${req.params.id}.js`, req, res)
})

app.patch('/api/bookings/:id', async (req, res) => {
  await executeAPIFile(`bookings/${req.params.id}.js`, req, res)
})

// Send email for booking
app.post('/api/bookings/:id/send-email', async (req, res) => {
  await executeAPIFile(`bookings/${req.params.id}/send-email.js`, req, res)
})

// Admin individual booking operations
app.get('/api/admin/bookings/:id', async (req, res) => {
  await executeAPIFile(`admin/bookings/${req.params.id}.js`, req, res)
})

app.patch('/api/admin/bookings/:id', async (req, res) => {
  await executeAPIFile(`admin/bookings/${req.params.id}.js`, req, res)
})

// Send email from admin
app.post('/api/admin/bookings/:id/send-email', async (req, res) => {
  await executeAPIFile(
    `admin/bookings/${req.params.id}/send-email.js`,
    req,
    res
  )
})

// Debug endpoint
app.get('/api/debug', async (req, res) => {
  await executeAPIFile('debug.js', req, res)
})

// Serve static files
app.use(express.static(path.join(process.cwd(), 'public')))

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'))
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
const server = app.listen(PORT, async () => {
  try {
    await initializeDatabase()
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📧 Email configured with: hello@ehiopiancoffeeorgintrip.com`)
    console.log(`💾 Database: SQLite (server/database.sqlite)`)
    console.log(`🌐 Frontend: http://localhost:5173`)
    console.log(`🔧 Backend: http://localhost:${PORT}`)
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

// Export for testing
export { app, db }
