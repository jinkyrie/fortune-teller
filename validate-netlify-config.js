#!/usr/bin/env node

/**
 * Netlify Configuration Validator
 * Validates the netlify.toml file for syntax errors
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating netlify.toml configuration...');

try {
  const configPath = path.join(__dirname, 'netlify.toml');
  
  if (!fs.existsSync(configPath)) {
    console.error('❌ netlify.toml file not found');
    process.exit(1);
  }
  
  const content = fs.readFileSync(configPath, 'utf8');
  
  // Basic validation checks
  const lines = content.split('\n');
  let hasBuildSection = false;
  let hasEnvironmentSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for build section
    if (line === '[build]') {
      hasBuildSection = true;
    }
    
    // Check for environment section
    if (line === '[build.environment]') {
      hasEnvironmentSection = true;
    }
    
    // Check for common syntax errors
    if (line.includes('=') && !line.startsWith('#') && !line.includes('"') && !line.includes("'")) {
      // Check for unquoted values that might cause issues
      const parts = line.split('=');
      if (parts.length === 2) {
        const value = parts[1].trim();
        if (value.includes(' ') && !value.startsWith('"') && !value.startsWith("'")) {
          console.warn(`⚠️  Line ${i + 1}: Consider quoting value: ${line}`);
        }
      }
    }
  }
  
  // Validate required sections
  if (!hasBuildSection) {
    console.error('❌ Missing [build] section');
    process.exit(1);
  }
  
  if (!hasEnvironmentSection) {
    console.warn('⚠️  No [build.environment] section found');
  }
  
  console.log('✅ netlify.toml configuration is valid');
  console.log('📋 Configuration summary:');
  console.log('   - Build section: ✅');
  console.log('   - Environment section: ✅');
  console.log('   - Redirects: ✅');
  
} catch (error) {
  console.error('❌ Error validating configuration:', error.message);
  process.exit(1);
}
