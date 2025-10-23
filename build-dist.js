#!/usr/bin/env node

/**
 * Build Script for Hostinger - Creates dist folder with everything needed
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building for Hostinger deployment...');

try {
  // Set production environment
  process.env.NODE_ENV = 'production';
  process.env.NEXT_TELEMETRY_DISABLED = '1';
  
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Build the application
  console.log('🔨 Building application...');
  execSync('next build', { stdio: 'inherit' });
  
  // Create dist directory
  console.log('📁 Creating dist folder...');
  fs.mkdirSync('dist', { recursive: true });
  
  // Copy .next folder
  console.log('📋 Copying .next folder...');
  execSync('xcopy .next dist\\.next /E /I /H /Y', { stdio: 'inherit' });
  
  // Copy public folder
  console.log('📋 Copying public folder...');
  if (fs.existsSync('public')) {
    execSync('xcopy public dist\\public /E /I /H /Y', { stdio: 'inherit' });
  }
  
  // Copy prisma folder
  console.log('📋 Copying prisma folder...');
  if (fs.existsSync('prisma')) {
    execSync('xcopy prisma dist\\prisma /E /I /H /Y', { stdio: 'inherit' });
  }
  
  // Create .htaccess
  console.log('📝 Creating .htaccess...');
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
  
  fs.writeFileSync('dist/.htaccess', htaccess);
  
  // Create production package.json
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
  
  fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));
  
  // Create .env template
  console.log('📝 Creating .env template...');
  const envTemplate = `# Hostinger Environment Variables
# Fill in your actual values

# Database (MySQL on Hostinger)
DATABASE_URL=mysql://username:password@localhost:3306/fortune_teller

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service
RESEND_API_KEY=re_...

# App Settings
ADMIN_EMAIL=your-admin@email.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
`;
  
  fs.writeFileSync('dist/.env', envTemplate);
  
  // Create deployment instructions
  console.log('📋 Creating deployment instructions...');
  const instructions = `# Hostinger Deployment Instructions

## What's in this dist folder:
- .next/ - Next.js build output
- public/ - Static files
- prisma/ - Database schema
- package.json - Production dependencies
- .htaccess - Server configuration
- .env - Environment variables (fill in your values)

## Deployment Steps:
1. Upload ALL contents of this dist folder to your Hostinger hosting directory
2. Fill in your actual values in the .env file
3. Create MySQL database in Hostinger panel
4. Update DATABASE_URL in .env file
5. Run: npm install
6. Run: npx prisma db push
7. Run: npm start

## Environment Variables to Set:
- DATABASE_URL: Your MySQL connection string
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: Your Clerk publishable key
- CLERK_SECRET_KEY: Your Clerk secret key
- CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
- CLOUDINARY_API_KEY: Your Cloudinary API key
- CLOUDINARY_API_SECRET: Your Cloudinary API secret
- RESEND_API_KEY: Your Resend API key
- ADMIN_EMAIL: Your admin email
- NEXT_PUBLIC_BASE_URL: Your domain URL

## Database Setup:
1. Go to Hostinger panel → Databases → MySQL Databases
2. Create new database
3. Update DATABASE_URL in .env file
4. Run: npx prisma db push

## That's it! Your app should be running.
`;
  
  fs.writeFileSync('dist/DEPLOYMENT_INSTRUCTIONS.md', instructions);
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Everything is ready in the "dist" folder');
  console.log('');
  console.log('🚀 Upload these files to Hostinger:');
  console.log('   📁 dist/.next/');
  console.log('   📁 dist/public/');
  console.log('   📁 dist/prisma/');
  console.log('   📄 dist/package.json');
  console.log('   📄 dist/.htaccess');
  console.log('   📄 dist/.env (fill in your values)');
  console.log('   📄 dist/DEPLOYMENT_INSTRUCTIONS.md');
  console.log('');
  console.log('📋 Next steps:');
  console.log('   1. Upload dist folder contents to Hostinger');
  console.log('   2. Fill in .env file with your values');
  console.log('   3. Create MySQL database');
  console.log('   4. Run: npm install && npx prisma db push && npm start');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
