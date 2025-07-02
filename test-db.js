// test-db.js - Simple database connection test
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// Check if we're using Neon (contains neon.tech in URL)
const connectionString = process.env.DATABASE_URL || process.env.DB_URL
const isNeon = connectionString && connectionString.includes('neon.tech')

console.log(
  '🔗 Connection string detected:',
  isNeon ? 'Neon PostgreSQL' : 'Local/Other PostgreSQL'
)

const pool = new Pool({
  connectionString,
  ssl: isNeon ? { rejectUnauthorized: false } : false,
})

async function testDB() {
  try {
    console.log('🔍 Testing database connection...')

    if (!connectionString) {
      throw new Error(
        'No DATABASE_URL or DB_URL found in environment variables'
      )
    }

    const client = await pool.connect()
    console.log('✅ Connected successfully!')

    // Test basic query
    const result = await client.query(
      'SELECT NOW() as current_time, current_database() as db_name, version() as version'
    )
    console.log('⏰ Current time:', result.rows[0].current_time)
    console.log('🗄️ Database:', result.rows[0].db_name)
    console.log(
      '📋 Version:',
      result.rows[0].version.split(' ')[0],
      result.rows[0].version.split(' ')[1]
    )

    // Check tables
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    console.log('📊 Tables found:', tables.rows.length)
    if (tables.rows.length > 0) {
      tables.rows.forEach((row) => console.log('  -', row.table_name))
    } else {
      console.log('  (No tables found - database might be empty)')
    }

    client.release()
    console.log('🎉 Database connection test PASSED!')
  } catch (error) {
    console.log('❌ Database connection FAILED!')
    console.log('Error:', error.message)

    // Provide troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:')
    if (error.message.includes('SSL')) {
      console.log('- SSL issue: Check if your database requires SSL connection')
      console.log('- For Neon: SSL is required')
      console.log('- For local: SSL should be disabled')
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('- DNS issue: Check your database host URL')
    } else if (error.message.includes('authentication')) {
      console.log('- Auth issue: Check your username/password')
    } else if (
      error.message.includes('database') &&
      error.message.includes('does not exist')
    ) {
      console.log('- Database issue: Check your database name')
    }
    console.log(
      '- Verify your .env file has the correct DATABASE_URL or DB_URL'
    )
  } finally {
    await pool.end()
  }
}

// Show environment info
console.log('⚙️ Environment check:')
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set')
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
console.log('DB_URL exists:', !!process.env.DB_URL)

testDB()
