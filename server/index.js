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
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
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
    const apiModule = await import(`file://${fullPath}?t=${Date.now()}`)

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

app.patch('/api/admin/bookings/:id', async (req, res) => {
  await executeAPIFile('admin/bookings.js', req, res)
})

// Booking submission - Use existing api/bookings.js
app.post('/api/bookings', async (req, res) => {
  await executeAPIFile('bookings.js', req, res)
})

app.delete('/api/bookings/:id', async (req, res) => {
  await executeAPIFile('bookings.js', req, res)
})

// Admin Pages - Use existing API files that return HTML

// Admin login page - Use existing api/admin.js (login page)
app.get('/admin', async (req, res) => {
  try {
    const adminFilePath = path.join(process.cwd(), 'api', 'admin.js')

    if (fs.existsSync(adminFilePath)) {
      console.log('Using existing api/admin.js for login page')
      await executeAPIFile('admin.js', req, res)
    } else {
      // Fallback simple login if api/admin.js doesn't exist
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Admin Login</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 min-h-screen flex items-center justify-center">
            <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 class="text-2xl font-bold mb-6 text-center">Admin Login</h1>
                <form id="loginForm">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input type="text" id="username" value="admin" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input type="password" id="password" value="secure_admin_password_123" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required>
                    </div>
                    <button type="submit" class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Sign In</button>
                </form>
                <div id="message" class="mt-4 p-3 rounded hidden"></div>
            </div>
            
            <script>
                document.getElementById('loginForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value;
                    
                    try {
                        const response = await fetch('/api/admin/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, password }),
                        });
                        
                        const data = await response.json();
                        
                        if (response.ok) {
                            localStorage.setItem('authToken', data.token);
                            window.location.href = '/admin/dashboard';
                        } else {
                            document.getElementById('message').innerHTML = '<div class="bg-red-100 text-red-700 p-3 rounded">' + (data.error || 'Login failed') + '</div>';
                            document.getElementById('message').classList.remove('hidden');
                        }
                    } catch (error) {
                        document.getElementById('message').innerHTML = '<div class="bg-red-100 text-red-700 p-3 rounded">Login failed: ' + error.message + '</div>';
                        document.getElementById('message').classList.remove('hidden');
                    }
                });
            </script>
        </body>
        </html>
      `)
    }
  } catch (error) {
    console.error('Error serving admin login:', error)
    res.status(500).send('Error loading admin login page')
  }
})

// Admin dashboard page - Use existing api/admin/dashboard.js
app.get('/admin/dashboard', async (req, res) => {
  try {
    const dashboardFilePath = path.join(
      process.cwd(),
      'api',
      'admin',
      'dashboard.js'
    )

    if (fs.existsSync(dashboardFilePath)) {
      console.log('Using existing api/admin/dashboard.js for dashboard page')
      await executeAPIFile('admin/dashboard.js', req, res)
    } else {
      // Check if there's an index.html in server/dashboard
      const htmlPath = path.join(__dirname, 'dashboard', 'index.html')
      if (fs.existsSync(htmlPath)) {
        console.log('Using server/dashboard/index.html')
        const htmlContent = fs.readFileSync(htmlPath, 'utf8')

        // Inject auth check
        const modifiedHtml = htmlContent.replace(
          '</head>',
          `<script>
            if (!localStorage.getItem('authToken')) {
              window.location.href = '/admin';
            }
          </script></head>`
        )

        res.setHeader('Content-Type', 'text/html')
        res.send(modifiedHtml)
      } else {
        // Fallback dashboard
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Admin Dashboard</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-gray-100">
            <script>
              if (!localStorage.getItem('authToken')) {
                window.location.href = '/admin';
              }
            </script>
            <div class="p-8">
              <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>
              <p class="text-gray-600 mb-4">Dashboard loaded successfully!</p>
              <button onclick="localStorage.removeItem('authToken'); window.location.href='/admin'" class="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </div>
          </body>
          </html>
        `)
      }
    }
  } catch (error) {
    console.error('Error serving admin dashboard:', error)
    res.status(500).send('Error loading admin dashboard')
  }
})

// Handle /admin/dashboard/ (with trailing slash)
app.get('/admin/dashboard/', (req, res) => {
  res.redirect('/admin/dashboard')
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    availableRoutes: [
      'GET /admin - Admin login page',
      'GET /admin/dashboard - Admin dashboard',
      'POST /api/admin/login - Admin login API',
      'GET /api/admin/bookings - Get bookings API',
      'GET /api/health - Health check',
    ],
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local development server running on port ${PORT}`)
  console.log(`📊 Admin login: http://localhost:${PORT}/admin`)
  console.log(`📋 Admin dashboard: http://localhost:${PORT}/admin/dashboard`)
  console.log(``)
  console.log(`📁 Using existing API files:`)
  console.log(`   - Login Page: api/admin.js`)
  console.log(`   - Dashboard: api/admin/dashboard.js`)
  console.log(`   - Login API: api/admin/login.js`)
  console.log(`   - Bookings API: api/admin/bookings.js`)
  console.log(``)
  console.log(`🔄 Routes are forwarded to your existing API files!`)
})
