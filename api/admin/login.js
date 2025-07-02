// api/admin/login.js - POST /api/admin/login
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { getPool, initializeDatabase } from '../utils/db.js'
import { setCorsHeaders, handleOptions } from '../utils/auth.js'

export default async function handler(req, res) {
  setCorsHeaders(res)
  if (handleOptions(req, res)) return

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Initialize database
    await initializeDatabase()

    // Validate input
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username, password } = req.body

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'Username and password are required' })
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
