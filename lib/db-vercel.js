// lib/db-vercel.js - Database configuration for Vercel deployment
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
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })

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

    // Check if admin user exists, if not create it
    const adminCheck = await client.query(
      'SELECT COUNT(*) as count FROM admin_users WHERE username = $1',
      ['admin']
    )

    if (parseInt(adminCheck.rows[0]?.count || 0) === 0) {
      console.log('👤 Creating default admin user...')
      const bcrypt = await import('bcrypt')
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

    client.release()
    console.log('✅ Database initialized successfully')
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    throw error
  }
}

// Database interface for API files
export const db = {
  // Bookings
  async run(query, params = []) {
    const result = await executeQuery(query, params)
    return {
      lastID: result.rows[0]?.id,
      changes: result.rowCount,
    }
  },

  async get(query, params = []) {
    const result = await executeQuery(query, params)
    return result.rows[0] || null
  },

  async all(query, params = []) {
    const result = await executeQuery(query, params)
    return result.rows
  },

  async exec(query) {
    return executeQuery(query)
  },
}

// Export for compatibility
export default db
