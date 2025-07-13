// test-admin-setup.js - Test admin setup and database connection
import dotenv from 'dotenv'
import pg from 'pg'

const { Pool } = pg

dotenv.config()

async function testSetup() {
  console.log('🔧 Testing admin setup...')
  
  // Check environment variables
  console.log('\n📋 Environment Variables:')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set')
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set')
  console.log('NODE_ENV:', process.env.NODE_ENV || 'development')
  
  if (!process.env.DATABASE_URL && !process.env.DB_URL) {
    console.log('\n❌ No database URL found!')
    console.log('Please set DATABASE_URL or DB_URL environment variable')
    return
  }
  
  // Test database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.DB_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 5,
  })
  
  try {
    console.log('\n🔌 Testing database connection...')
    const client = await pool.connect()
    
    // Test basic query
    const result = await client.query('SELECT NOW() as current_time')
    console.log('✅ Database connected successfully!')
    console.log('Current time:', result.rows[0].current_time)
    
    // Check if admin_users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
      )
    `)
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ admin_users table exists')
      
      // Check if admin user exists
      const userCheck = await client.query(
        'SELECT COUNT(*) as count FROM admin_users WHERE username = $1',
        ['admin']
      )
      
      if (parseInt(userCheck.rows[0].count) > 0) {
        console.log('✅ Admin user exists')
      } else {
        console.log('⚠️  Admin user does not exist - run setup-admin.js')
      }
    } else {
      console.log('❌ admin_users table does not exist - run setup-admin.js')
    }
    
    // Check if bookings table exists
    const bookingsCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'bookings'
      )
    `)
    
    if (bookingsCheck.rows[0].exists) {
      console.log('✅ bookings table exists')
      
      // Count bookings
      const bookingCount = await client.query('SELECT COUNT(*) as count FROM bookings')
      console.log(`📊 Total bookings: ${bookingCount.rows[0].count}`)
    } else {
      console.log('❌ bookings table does not exist')
    }
    
    client.release()
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  } finally {
    await pool.end()
  }
  
  console.log('\n🎯 Next steps:')
  console.log('1. If tables don\'t exist, run: node setup-admin.js')
  console.log('2. Start the server: npm run server')
  console.log('3. Start the React app: npm run dev')
  console.log('4. Access admin at: http://localhost:5173/admin')
}

testSetup().catch(console.error) 