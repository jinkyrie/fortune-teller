#!/usr/bin/env node

/**
 * Production Build Script
 * Optimizes the build for smaller deployment size
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting optimized production build...');

try {
  // Set production environment
  process.env.NODE_ENV = 'production';
  process.env.NEXT_TELEMETRY_DISABLED = '1';
  
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }
  
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Build the application
  console.log('🔨 Building application...');
  execSync('next build', { stdio: 'inherit' });
  
  // Remove unnecessary files from build
  console.log('🗑️ Removing unnecessary files...');
  const filesToRemove = [
    '.next/cache',
    '.next/static/chunks/pages/_error',
    '.next/static/chunks/pages/_app',
  ];
  
  filesToRemove.forEach(file => {
    if (fs.existsSync(file)) {
      fs.rmSync(file, { recursive: true, force: true });
      console.log(`✅ Removed ${file}`);
    }
  });
  
  console.log('✅ Production build completed successfully!');
  console.log('📊 Build size:', getBuildSize());
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

function getBuildSize() {
  try {
    const { execSync } = require('child_process');
    const size = execSync('du -sh .next 2>/dev/null || echo "Unknown"', { encoding: 'utf8' });
    return size.trim();
  } catch {
    return 'Unknown';
  }
}
