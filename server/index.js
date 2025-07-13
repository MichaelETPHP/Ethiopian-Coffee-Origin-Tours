// server/index.js - Route to existing API files
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
import fs from 'fs'

const { Pool } = pg
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

// Initialize database tables
async function initializeDatabase() {
  try {
    console.log('🔧 Initializing database tables...')
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

    // Create admin_users table
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

    // Create indexes for better performance
    await client.query(
      'CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email)'
    )
    await client.query(
      'CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at)'
    )
    await client.query(
      'CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)'
    )
    await client.query(
      'CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username)'
    )

    // Create update trigger for bookings
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `)

    await client.query(`
      DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
      CREATE TRIGGER update_bookings_updated_at 
        BEFORE UPDATE ON bookings 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column()
    `)

    // Check if admin user exists, if not create it
    const adminCheck = await client.query(
      'SELECT COUNT(*) as count FROM admin_users WHERE username = $1',
      ['admin']
    )

    if (parseInt(adminCheck.rows[0].count) === 0) {
      console.log('👤 Creating default admin user...')
      const passwordHash = await bcrypt.hash('admin123', 12)

      await client.query(
        'INSERT INTO admin_users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['admin', 'admin@ethiopiancoffee.com', passwordHash, 'admin']
      )
      console.log('✅ Default admin user created')
      console.log('   Username: admin')
      console.log('   Password: admin123')
    } else {
      console.log('✅ Admin user already exists')
    }

    // Insert sample bookings if table is empty
    const bookingCheck = await client.query(
      'SELECT COUNT(*) as count FROM bookings'
    )
    if (parseInt(bookingCheck.rows[0].count) === 0) {
      console.log('📊 Creating sample bookings...')
      await client.query(`
        INSERT INTO bookings (full_name, age, email, phone, country, booking_type, number_of_people, selected_package, status) VALUES
        ('John Smith', 35, 'john@example.com', '+1234567890', 'USA', 'individual', 1, 'Yirgacheffe Coffee Tour', 'pending'),
        ('Maria Garcia', 28, 'maria@example.com', '+1234567891', 'Spain', 'group', 4, 'Sidamo Coffee Experience', 'confirmed'),
        ('Ahmed Hassan', 42, 'ahmed@example.com', '+1234567892', 'Egypt', 'individual', 1, 'Limu Coffee Journey', 'pending'),
        ('Sarah Johnson', 31, 'sarah@example.com', '+1234567893', 'Canada', 'group', 2, 'Harar Coffee Adventure', 'confirmed')
      `)
      console.log('✅ Sample bookings created')
    }

    client.release()
    console.log('✅ Database initialization completed successfully!')
  } catch (error) {
    console.error('❌ Database initialization error:', error)
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

// Booking submission - Use existing api/bookings.js
app.post('/api/bookings', async (req, res) => {
  await executeAPIFile('bookings.js', req, res)
})

app.delete('/api/bookings/:id', async (req, res) => {
  await executeAPIFile('bookings.js', req, res)
})

// Serve static files for React app (for production)
app.use(express.static(path.join(process.cwd(), 'dist')))

// Handle React routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't handle API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' })
  }

  // Serve React app for all other routes
  const indexPath = path.join(process.cwd(), 'dist', 'index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).send('React app not built. Run "npm run build" first.')
  }
})

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 API endpoints available:`)
  console.log(`   - POST /api/admin/login - Admin login`)
  console.log(`   - GET /api/admin/bookings - Get bookings`)
  console.log(`   - PATCH /api/admin/bookings - Update booking`)
  console.log(`   - POST /api/bookings - Create booking`)
  console.log(`   - GET /api/health - Health check`)
  console.log(``)
  console.log(`🌐 React app should be served by Vite on port 5175`)
  console.log(`🔗 Admin dashboard: http://localhost:5175/admin`)
  console.log(``)
  console.log(`🔧 Initializing database...`)

  // Initialize database tables
  await initializeDatabase()

  console.log(``)
  console.log(`🎉 Server ready! You can now:`)
  console.log(`   1. Start your React app: npm run dev`)
  console.log(`   2. Access admin at: http://localhost:5175/admin`)
  console.log(`   3. Login with: admin / admin123`)
})
