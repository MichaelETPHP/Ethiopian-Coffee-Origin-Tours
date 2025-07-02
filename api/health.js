// api/health.js
export default function handler(req, res) {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
}

// api/bookings.js - Main booking submission
import { body, validationResult } from 'express-validator'
import { getPool, initializeDatabase } from '../utils/db.js'
import { setCorsHeaders, handleOptions } from '../utils/auth.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (handleOptions(req, res)) return

  if (req.method === 'DELETE' && req.query.id) {
    // Handle DELETE /api/bookings/:id
    try {
      const { id } = req.query
      const connection = await getPool().getConnection()
      const [result] = await connection.execute('DELETE FROM bookings WHERE id = ?', [id])
      connection.release()
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Booking not found' })
      }
      res.json({ message: 'Booking deleted successfully' })
    } catch (error) {
      console.error('Delete booking error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await initializeDatabase()

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

    // Basic validation
    if (!fullName || !age || !email || !phone || !country || !bookingType || !selectedPackage) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const connection = await getPool().getConnection()

    try {
      await connection.beginTransaction()

      // Check for duplicate bookings
      const [existingBookings] = await connection.execute(
        'SELECT id FROM bookings WHERE email = ? AND selected_package = ? AND (status IS NULL OR status != "cancelled") LIMIT 1',
        [email, selectedPackage]
      )

      if (existingBookings.length > 0) {
        await connection.rollback()
        return res.status(409).json({
          error: 'A booking with this email already exists for the selected package.',
        })
      }

      // Insert booking
      const [result] = await connection.execute(
        `INSERT INTO bookings (
          full_name, age, email, phone, country, booking_type, 
          number_of_people, selected_package, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
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

// api/admin/login.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getPool, initializeDatabase } from '../../utils/db.js'
import { setCorsHeaders, handleOptions } from '../../utils/auth.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (handleOptions(req, res)) return

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await initializeDatabase()

    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }

    const connection = await getPool().getConnection()

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