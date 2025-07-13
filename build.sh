#!/bin/bash

# Vercel build script for Ethiopian Coffee Tours
echo "🚀 Starting Vercel build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --include=dev

# Build admin files
echo "🔧 Building admin files..."
node -e "const fs=require('fs');const path=require('path');if(!fs.existsSync('dist'))fs.mkdirSync('dist');fs.cpSync('public/admin','dist/admin',{recursive:true});"

# Build React app
echo "⚛️ Building React app..."
npx vite build

echo "✅ Build completed successfully!" 