#!/usr/bin/env node

/**
 * 🔐 Change Admin Email Script
 * Cross-platform Node.js script to change admin email
 */

const fs = require('fs');
const path = require('path');

// Get new admin email from command line argument
const newAdminEmail = process.argv[2];

if (!newAdminEmail) {
  console.log('🔐 Change Admin Email');
  console.log('');
  console.log('Usage: node change-admin.js <new-admin-email>');
  console.log('');
  console.log('Example: node change-admin.js new-admin@example.com');
  process.exit(1);
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(newAdminEmail)) {
  console.log('❌ Invalid email format');
  console.log('Please provide a valid email address');
  process.exit(1);
}

console.log(`🔐 Changing admin email to: ${newAdminEmail}`);

try {
  const envPath = path.join(__dirname, '.env.local');
  
  // Read current .env.local file
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Update or add ADMIN_EMAIL
  const lines = envContent.split('\n');
  let updated = false;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('ADMIN_EMAIL=')) {
      lines[i] = `ADMIN_EMAIL=${newAdminEmail}`;
      updated = true;
      break;
    }
  }
  
  // If ADMIN_EMAIL doesn't exist, add it
  if (!updated) {
    lines.push(`ADMIN_EMAIL=${newAdminEmail}`);
  }
  
  // Write back to file
  fs.writeFileSync(envPath, lines.join('\n'));
  
  console.log('✅ Admin email changed successfully!');
  console.log(`📧 New admin: ${newAdminEmail}`);
  console.log('🔄 Please restart the development server for changes to take effect');
  console.log('');
  console.log('To restart: Ctrl+C then "npm run dev"');
  
} catch (error) {
  console.log('❌ Error changing admin email:', error.message);
  process.exit(1);
}
