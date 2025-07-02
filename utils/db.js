// utils/db.js
import mysql from 'mysql2/promise'

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3308,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'tour_booking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
}

let pool = null

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

export async function initializeDatabase() {
  try {
    const connection = await getPool().getConnection()

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

    connection.release()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

// utils/auth.js
import jwt from 'jsonwebtoken'
import { getPool } from './db.js'

export async function authenticateAdmin(req) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return { error: 'Access denied. No token provided.', status: 401 }
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    )
    const connection = await getPool().getConnection()

    const [users] = await connection.execute(
      'SELECT id, username, email, role FROM admin_users WHERE id = ?',
      [decoded.userId]
    )
    connection.release()

    if (users.length === 0) {
      return { error: 'Invalid token.', status: 401 }
    }

    return { user: users[0] }
  } catch (error) {
    return { error: 'Invalid token.', status: 401 }
  }
}

export function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL || 'https://your-app.vercel.app'
      : 'http://localhost:5173'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res)
    res.status(200).end()
    return true
  }
  return false
}

// utils/email.js
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail(to, subject, html, cc = null) {
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
