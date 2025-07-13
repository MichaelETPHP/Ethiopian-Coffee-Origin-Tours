// setup-admin.js - Script to create initial admin user
import bcrypt from 'bcryptjs'
import pg from 'pg'

const { Pool } = pg

// Create database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  max: 10,
})

async function setupAdmin() {
  const client = await pool.connect()

  try {
    console.log('🔧 Setting up admin user...')

    // Check if admin_users table exists, if not create it
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

    console.log('✅ Admin users table ready')

    // Check if admin user already exists
    const existingUser = await client.query(
      'SELECT id FROM admin_users WHERE username = $1',
      ['admin']
    )

    if (existingUser.rows.length > 0) {
      console.log('⚠️  Admin user already exists')
      return
    }

    // Create admin user
    const password = 'admin123' // Change this to your desired password
    const passwordHash = await bcrypt.hash(password, 12)

    await client.query(
      'INSERT INTO admin_users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      ['admin', 'admin@ethiopiancoffee.com', passwordHash, 'admin']
    )

    console.log('✅ Admin user created successfully!')
    console.log('📧 Username: admin')
    console.log('🔑 Password: admin123')
    console.log('⚠️  Please change the password after first login!')
  } catch (error) {
    console.error('❌ Error setting up admin:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

// Run the setup
setupAdmin().catch(console.error)
