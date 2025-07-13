#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting deployment preparation...');

// Check if required files exist
const requiredFiles = [
  '.env',
  'vercel.json',
  'package.json',
  'public/admin/index.html'
];

console.log('📋 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
    process.exit(1);
  }
});

// Build the project
console.log('🔨 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Check if admin files were copied
const adminPath = path.join('dist', 'admin', 'index.html');
if (fs.existsSync(adminPath)) {
  console.log('✅ Admin files copied successfully');
} else {
  console.log('❌ Admin files not found in dist/');
  process.exit(1);
}

// Check environment variables
console.log('🔧 Checking environment variables...');
const envContent = fs.readFileSync('.env', 'utf8');
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'FRONTEND_URL'];

requiredEnvVars.forEach(varName => {
  if (envContent.includes(varName + '=')) {
    console.log(`✅ ${varName}`);
  } else {
    console.log(`⚠️  ${varName} - Not found in .env`);
  }
});

console.log('\n🎉 Deployment preparation completed!');
console.log('\n📝 Next steps:');
console.log('1. Push your code to GitHub');
console.log('2. Connect your repository to Vercel');
console.log('3. Set environment variables in Vercel dashboard');
console.log('4. Deploy!');
console.log('\n🔗 Admin panel will be available at: your-domain.vercel.app/admin'); 