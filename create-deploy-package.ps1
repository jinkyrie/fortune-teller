# Create deployment package for Netlify
Write-Host "🚀 Creating deployment package..." -ForegroundColor Green

# Create temp directory
$tempDir = "deploy-temp"
$deployDir = "fortune-teller-deploy"

# Clean up previous attempts
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
if (Test-Path $deployDir) { Remove-Item $deployDir -Recurse -Force }

# Create deployment directory
New-Item -ItemType Directory -Path $deployDir -Force

Write-Host "📦 Copying essential files..." -ForegroundColor Yellow

# Copy essential files (excluding node_modules and build artifacts)
$filesToCopy = @(
    "src",
    "public", 
    "prisma",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "netlify.toml",
    ".netlifyignore",
    "tsconfig.json",
    "postcss.config.mjs",
    "eslint.config.mjs",
    "components.json",
    "build-prod.js",
    "validate-db-url.js"
)

foreach ($file in $filesToCopy) {
    if (Test-Path $file) {
        if ((Get-Item $file) -is [System.IO.DirectoryInfo]) {
            Copy-Item $file -Destination $deployDir -Recurse -Force
        } else {
            Copy-Item $file -Destination $deployDir -Force
        }
        Write-Host "✅ Copied $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️  $file not found, skipping..." -ForegroundColor Yellow
    }
}

# Create .env.example for reference
$envExample = @"
# Environment variables to set in Netlify dashboard
DATABASE_URL=postgresql://username:password@host:port/database
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
ADMIN_EMAIL=your-admin@email.com
RESEND_API_KEY=re_...
"@

$envExample | Out-File -FilePath "$deployDir\.env.example" -Encoding UTF8

Write-Host "📋 Created .env.example for reference" -ForegroundColor Green

# Create deployment instructions
$instructions = @"
# Netlify Deployment Instructions

## 1. Upload to Netlify
- Go to netlify.com
- Drag and drop this entire folder
- OR use the ZIP file: fortune-teller-deploy.zip

## 2. Set Environment Variables
In Netlify dashboard → Site settings → Environment variables:

DATABASE_URL=postgresql://username:password@host:port/database
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
ADMIN_EMAIL=your-admin@email.com
RESEND_API_KEY=re_...

## 3. Build Settings
- Build command: npm run build:prod
- Publish directory: .next
- Node version: 22.21.0

## 4. Deploy!
The site will automatically build and deploy.
"@

$instructions | Out-File -FilePath "$deployDir\DEPLOYMENT_INSTRUCTIONS.md" -Encoding UTF8

Write-Host "📋 Created deployment instructions" -ForegroundColor Green

# Create ZIP file
Write-Host "🗜️ Creating ZIP file..." -ForegroundColor Yellow
Compress-Archive -Path "$deployDir\*" -DestinationPath "fortune-teller-deploy.zip" -Force

Write-Host "✅ Deployment package created!" -ForegroundColor Green
Write-Host "📁 Folder: $deployDir" -ForegroundColor Cyan
Write-Host "📦 ZIP file: fortune-teller-deploy.zip" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Ready to deploy to Netlify!" -ForegroundColor Green
