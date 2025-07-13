// setup-env.js - Set up environment variables for Supabase
import fs from 'fs'
import path from 'path'

const envContent = `# Database Configuration - Supabase
DATABASE_URL=postgresql://postgres.fztchjilybqettzahibs:admin123@db.fztchjilybqettzahibs.supabase.co:5432/postgres

# JWT Secret for authentication
JWT_SECRET=ethiopian_coffee_admin_secret_key_2024_supabase

# Environment
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5175

# Supabase Configuration
SUPABASE_URL=https://fztchjilybqettzahibs.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dGNoamlseWJxZXR0emFoaWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjMwNzcsImV4cCI6MjA2NzkzOTA3N30.omKOlXANNCjnqI2mHJXOaW6aF2H0IhrdRJyIrhA0EiA
`

try {
  // Write the .env file
  fs.writeFileSync('.env', envContent)
  console.log('✅ .env file created successfully!')
  console.log('📋 Environment variables set:')
  console.log('   - DATABASE_URL: Supabase PostgreSQL connection')
  console.log('   - JWT_SECRET: Authentication secret')
  console.log('   - SUPABASE_URL: Your Supabase project URL')
  console.log('   - SUPABASE_ANON_KEY: Your Supabase API key')
  console.log('')
  console.log('🎯 Next steps:')
  console.log('1. Run the SQL script in Supabase SQL Editor')
  console.log('2. Test the connection: node test-admin-setup.js')
  console.log('3. Start the server: npm run server')
  console.log('4. Access admin at: http://localhost:5175/admin')
  console.log('')
  console.log('🔑 Admin credentials:')
  console.log('   - Username: admin')
  console.log('   - Password: admin123')
} catch (error) {
  console.error('❌ Error creating .env file:', error.message)
}
