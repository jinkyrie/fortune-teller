#!/usr/bin/env node

/**
 * Railway Deployment Setup Script
 * This script helps prepare the application for Railway deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Railway Deployment Setup');
console.log('============================');

// Check if we're in production mode
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;

console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);

// Check required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'RESEND_API_KEY',
  'ADMIN_EMAIL',
  'NEXT_PUBLIC_BASE_URL'
];

console.log('\n📋 Checking Environment Variables:');
let missingVars = [];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.includes('your-') || value.includes('...')) {
    missingVars.push(varName);
    console.log(`❌ ${varName}: Missing or placeholder value`);
  } else {
    console.log(`✅ ${varName}: Set`);
  }
});

if (missingVars.length > 0) {
  console.log('\n⚠️  Missing Environment Variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\nPlease set these in Railway dashboard under Variables tab');
}

// Check database URL format
const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;
const databasePublicUrl = process.env.DATABASE_PUBLIC_URL;
const railwayPrivateDomain = process.env.RAILWAY_PRIVATE_DOMAIN;
const railwayTcpProxyDomain = process.env.RAILWAY_TCP_PROXY_DOMAIN;

if (databaseUrl) {
  if (databaseUrl.startsWith('postgresql://')) {
    console.log('\n✅ Database: PostgreSQL (Production ready)');
    
    // Check for Railway-specific variables
    if (railwayPrivateDomain && databaseUrl.includes(railwayPrivateDomain)) {
      console.log('✅ Railway private domain detected in DATABASE_URL');
    }
    
    if (databasePublicUrl) {
      console.log('✅ Railway DATABASE_PUBLIC_URL detected');
      if (directUrl === databasePublicUrl || directUrl === '${{DATABASE_PUBLIC_URL}}') {
        console.log('✅ DIRECT_URL correctly set to DATABASE_PUBLIC_URL');
      } else {
        console.log('💡 Tip: Set DIRECT_URL=${{DATABASE_PUBLIC_URL}} in Railway');
      }
    } else if (directUrl) {
      console.log('✅ DIRECT_URL set');
    } else {
      console.log('⚠️  DIRECT_URL not set - set to ${{DATABASE_PUBLIC_URL}} in Railway');
    }
  } else if (databaseUrl.startsWith('file:')) {
    console.log('\n⚠️  Database: SQLite (Development only)');
    console.log('   Railway requires PostgreSQL for production');
  } else {
    console.log('\n❌ Database: Unknown format');
  }
}

// Check Clerk configuration
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (clerkKey) {
  if (clerkKey.startsWith('pk_live_')) {
    console.log('\n✅ Clerk: Production keys detected');
  } else if (clerkKey.startsWith('pk_test_')) {
    console.log('\n⚠️  Clerk: Test keys detected (use production keys for Railway)');
  } else {
    console.log('\n❌ Clerk: Invalid key format');
  }
}

console.log('\n🔧 Next Steps:');
console.log('1. Set all missing environment variables in Railway dashboard');
console.log('2. Deploy your code to Railway');
console.log('3. Run database migration: npx prisma db push');
console.log('4. Create admin user: node create-admin.js');
console.log('5. Test your application');

console.log('\n📚 For detailed instructions, see RAILWAY_DEPLOYMENT.md');

if (missingVars.length === 0) {
  console.log('\n🎉 All environment variables are set! Ready for deployment.');
} else {
  console.log('\n⚠️  Please fix the missing environment variables before deploying.');
  process.exit(1);
}
