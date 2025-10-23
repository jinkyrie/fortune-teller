#!/usr/bin/env node

/**
 * Database URL Validator
 * Validates that DATABASE_URL has the correct PostgreSQL format
 */

const url = process.env.DATABASE_URL;

if (!url) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

console.log('🔍 Checking DATABASE_URL format...');
console.log('URL:', url.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

// Check if URL starts with correct protocol
if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
  console.error('❌ DATABASE_URL must start with "postgresql://" or "postgres://"');
  console.error('Current format:', url.substring(0, 20) + '...');
  console.error('Expected format: postgresql://username:password@host:port/database');
  process.exit(1);
}

// Parse the URL to validate structure
try {
  const parsedUrl = new URL(url);
  
  if (!parsedUrl.hostname) {
    console.error('❌ DATABASE_URL missing hostname');
    process.exit(1);
  }
  
  if (!parsedUrl.pathname || parsedUrl.pathname === '/') {
    console.error('❌ DATABASE_URL missing database name');
    process.exit(1);
  }
  
  console.log('✅ DATABASE_URL format is correct');
  console.log('Host:', parsedUrl.hostname);
  console.log('Port:', parsedUrl.port || '5432 (default)');
  console.log('Database:', parsedUrl.pathname.substring(1));
  
} catch (error) {
  console.error('❌ DATABASE_URL is not a valid URL:', error.message);
  process.exit(1);
}
