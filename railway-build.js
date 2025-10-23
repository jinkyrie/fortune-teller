#!/usr/bin/env node

/**
 * Railway Build Script
 * Handles environment variables and build process for Railway deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Railway build process...');

// Check if we're in Railway environment
const isRailway = process.env.RAILWAY_ENVIRONMENT === 'production' || process.env.RAILWAY_ENVIRONMENT === 'development';

if (isRailway) {
  console.log('✅ Railway environment detected');
  
  // Check for required environment variables
  const requiredVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Missing environment variables:', missingVars.join(', '));
    console.warn('⚠️  Build will continue but some features may not work');
  } else {
    console.log('✅ All required environment variables are set');
  }
} else {
  console.log('ℹ️  Local development environment detected');
}

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Build Next.js application
  console.log('🏗️  Building Next.js application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
