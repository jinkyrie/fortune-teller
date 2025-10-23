#!/usr/bin/env node

/**
 * Hostinger Build Script
 * Optimized for Hostinger hosting environment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Hostinger production build...');

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
  
  // Create .htaccess for Hostinger
  console.log('📝 Creating .htaccess for Hostinger...');
  const htaccess = `# Hostinger .htaccess for Next.js
RewriteEngine On

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]

# Protect .env file
<Files ".env">
    Order Allow,Deny
    Deny from all
</Files>

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
`;
  
  fs.writeFileSync('.htaccess', htaccess);
  console.log('✅ Created .htaccess file');
  
  // Create package.json for production
  console.log('📦 Creating production package.json...');
  const packageJson = {
    "name": "fortune-teller",
    "version": "0.1.0",
    "private": true,
    "scripts": {
      "start": "next start -p 3000"
    },
    "dependencies": {
      "@clerk/nextjs": "^6.33.7",
      "@cloudinary/react": "^1.14.3",
      "@cloudinary/url-gen": "^1.22.0",
      "@fontsource/cormorant-garamond": "^5.2.11",
      "@fontsource/inter": "^5.2.8",
      "@hookform/resolvers": "^5.2.2",
      "@prisma/client": "^6.17.1",
      "@radix-ui/react-dialog": "^1.1.15",
      "@radix-ui/react-label": "^2.1.7",
      "@radix-ui/react-select": "^2.2.6",
      "@radix-ui/react-slot": "^1.2.3",
      "@react-email/render": "^1.4.0",
      "@stripe/stripe-js": "^8.1.0",
      "@types/bcryptjs": "^2.4.6",
      "bcryptjs": "^3.0.2",
      "class-variance-authority": "^0.7.1",
      "cloudinary": "^2.8.0",
      "clsx": "^2.1.1",
      "framer-motion": "^12.23.24",
      "html2canvas": "^1.4.1",
      "jspdf": "^3.0.3",
      "lucide-react": "^0.546.0",
      "next": "^15.5.6",
      "next-auth": "^5.0.0-beta.29",
      "next-themes": "^0.4.6",
      "prisma": "^6.17.1",
      "react": "19.1.0",
      "react-dom": "19.1.0",
      "react-hook-form": "^7.65.0",
      "resend": "^6.2.1",
      "sonner": "^2.0.7",
      "stripe": "^19.1.0",
      "tailwind-merge": "^3.3.1",
      "zod": "^4.1.12"
    }
  };
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('✅ Created production package.json');
  
  console.log('✅ Hostinger build completed successfully!');
  console.log('📊 Build size:', getBuildSize());
  console.log('');
  console.log('🚀 Ready to upload to Hostinger!');
  console.log('📁 Upload these files to your hosting directory:');
  console.log('   - .next/ (build output)');
  console.log('   - public/ (static files)');
  console.log('   - package.json');
  console.log('   - .htaccess');
  console.log('   - prisma/ (database schema)');
  
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
