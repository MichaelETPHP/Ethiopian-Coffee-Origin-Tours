#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 Testing Vercel configuration...\n')

// Check vercel.json
console.log('1. Checking vercel.json...')
if (fs.existsSync('vercel.json')) {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'))
  console.log('✅ vercel.json exists and is valid JSON')

  // Check rewrites
  if (vercelConfig.rewrites && vercelConfig.rewrites.length > 0) {
    console.log('✅ Rewrites configured')
  } else {
    console.log('❌ No rewrites found')
  }

  // Check functions
  if (vercelConfig.functions && vercelConfig.functions['api/**/*.js']) {
    console.log('✅ API functions configured')
  } else {
    console.log('❌ API functions not configured')
  }
} else {
  console.log('❌ vercel.json not found')
}

// Check API routes
console.log('\n2. Checking API routes...')
const apiDir = 'api'
if (fs.existsSync(apiDir)) {
  const apiFiles = fs.readdirSync(apiDir)
  console.log(`✅ API directory exists with ${apiFiles.length} files`)

  apiFiles.forEach((file) => {
    if (file.endsWith('.js')) {
      console.log(`   - ${file}`)
    }
  })

  // Check admin subdirectory
  const adminDir = path.join(apiDir, 'admin')
  if (fs.existsSync(adminDir)) {
    const adminFiles = fs.readdirSync(adminDir)
    console.log(`   - admin/ (${adminFiles.length} files)`)
  }
} else {
  console.log('❌ API directory not found')
}

// Check build output
console.log('\n3. Checking build output...')
if (fs.existsSync('dist')) {
  console.log('✅ dist directory exists')

  if (fs.existsSync('dist/admin')) {
    console.log('✅ admin files copied to dist/')
  } else {
    console.log('❌ admin files not in dist/')
  }

  if (fs.existsSync('dist/index.html')) {
    console.log('✅ React app built successfully')
  } else {
    console.log('❌ React app not built')
  }
} else {
  console.log('❌ dist directory not found - run npm run build first')
}

// Check environment variables
console.log('\n4. Checking environment variables...')
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8')
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'FRONTEND_URL']

  requiredVars.forEach((varName) => {
    if (envContent.includes(varName + '=')) {
      console.log(`✅ ${varName}`)
    } else {
      console.log(`⚠️  ${varName} - Not found`)
    }
  })
} else {
  console.log('❌ .env file not found')
}

console.log('\n🎉 Vercel configuration test completed!')
console.log('\n📝 Next steps:')
console.log('1. Push your code to GitHub')
console.log('2. Connect repository to Vercel')
console.log('3. Set environment variables in Vercel dashboard')
console.log('4. Deploy!')
console.log(
  '\n🔗 Your admin panel will be available at: your-domain.vercel.app/admin'
)
