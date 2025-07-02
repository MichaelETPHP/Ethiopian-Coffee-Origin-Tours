// lib/db.js - Database connection and utilities
import pg from 'pg'

const { Pool } = pg

// Singleton pattern for connection pool
let pool = null

/**
 * Get database connection pool
 * @returns {Pool} PostgreSQL connection pool
 */
export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || process.env.DB_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10, // Maximum connections in pool
      idleTimeoutMillis: 30000, // Close idle connections after 30s
      connectionTimeoutMillis: 10000, // Timeout after 10s
    })

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Database pool error:', err)
    })
  }

  return pool
}

/**
 * Execute a database query with connection handling
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
export async function executeQuery(query, params = []) {
  const client = await getPool().connect()
  
  try {
    const result = await client.query(query, params)
    return result
  } finally {
    client.release()
  }
}

/**
 * Execute multiple queries in a transaction
 * @param {Function} transactionFn - Function containing transaction logic
 * @returns {Promise<any>} Transaction result
 */
export async function executeTransaction(transactionFn) {
  const client = await getPool().connect()
  
  try {
    await client.query('BEGIN')
    const result = await transactionFn(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

/**
 * Initialize database tables (run once on startup)
 */
export async function initializeDatabase() {
  try {
    const client = await getPool().connect()

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

    // Create indexes for better performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email)')
    await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at)')
    await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)')

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

    client.release()
    console.log('✅ Database initialized successfully')
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    throw error
  }
}

/**
 * Database query helpers
 */
export const db = {
  // Bookings queries
  bookings: {
    async create(bookingData) {
      const {
        fullName, age, email, phone, country, 
        bookingType, numberOfPeople, selectedPackage
      } = bookingData

      return executeQuery(
        `INSERT INTO bookings (
          full_name, age, email, phone, country, booking_type, 
          number_of_people, selected_package, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW()) 
        RETURNING id`,
        [
          fullName, age, email, phone, country, bookingType,
          bookingType === 'group' ? numberOfPeople : 1, selectedPackage
        ]
      )
    },

    async findByEmail(email, packageName) {
      return executeQuery(
        `SELECT id FROM bookings 
         WHERE email = $1 AND selected_package = $2 
         AND (status IS NULL OR status != 'cancelled') 
         LIMIT 1`,
        [email, packageName]
      )
    },

    async getAll(filters = {}) {
      const { page = 1, limit = 50, search = '', status = '', package: packageFilter = '' } = filters
      const offset = (page - 1) * limit

      let query = 'SELECT * FROM bookings WHERE 1=1'
      let countQuery = 'SELECT COUNT(*) as total FROM bookings WHERE 1=1'
      const params = []
      const countParams = []
      let paramIndex = 1

      // Add filters
      if (search) {
        query += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex + 1} OR phone ILIKE $${paramIndex + 2})`
        countQuery += ` AND (full_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex + 1} OR phone ILIKE $${paramIndex + 2})`
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

      query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
      params.push(parseInt(limit), parseInt(offset))

      const [bookingsResult, countResult] = await Promise.all([
        executeQuery(query, params),
        executeQuery(countQuery, countParams)
      ])

      return {
        bookings: bookingsResult.rows,
        total: parseInt(countResult.rows[0]?.total || 0),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil((countResult.rows[0]?.total || 0) / limit)
      }
    },

    async updateStatus(id, status, notes = null) {
      return executeQuery(
        'UPDATE bookings SET status = $1, notes = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [status, notes, id]
      )
    },

    async delete(id) {
      return executeQuery('DELETE FROM bookings WHERE id = $1', [id])
    }
  },

  // Admin users queries
  admin: {
    async findByUsername(username) {
      return executeQuery(
        'SELECT id, username, email, password_hash, role FROM admin_users WHERE username = $1',
        [username]
      )
    },

    async updateLastLogin(userId) {
      return executeQuery(
        'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [userId]
      )
    },

    async create(userData) {
      const { username, email, passwordHash, role = 'admin' } = userData
      return executeQuery(
        'INSERT INTO admin_users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [username, email, passwordHash, role]
      )
    }
  }
}