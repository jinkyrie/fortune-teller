# KahveYolu Development Startup Script
Write-Host "Starting KahveYolu Development Environment..." -ForegroundColor Magenta
Write-Host "Directory: $(Get-Location)" -ForegroundColor Cyan

# Check if we're in the correct directory
if (!(Test-Path "package.json")) {
    Write-Host "Error: Not in the fortune-teller directory!" -ForegroundColor Red
    Write-Host "Please run this script from: C:\Users\kyrg3\Desktop\NEW WEBS\Fortune Teller\fortune-teller" -ForegroundColor Yellow
    exit 1
}

# Check if .env.local exists
if (!(Test-Path ".env.local")) {
    Write-Host "Warning: .env.local not found. Creating basic template..." -ForegroundColor Yellow
    @"
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
RESEND_API_KEY="your-resend-api-key"
DAILY_ORDER_LIMIT="10"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "Created .env.local template. Please update with your API keys." -ForegroundColor Green
}

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Blue
npx prisma generate

# Push database schema
Write-Host "Setting up database..." -ForegroundColor Blue
npx prisma db push

# Create admin user
Write-Host "Creating admin user..." -ForegroundColor Blue
node create-admin.js

# Start development server
Write-Host "Starting development server..." -ForegroundColor Green
Write-Host "Frontend & Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Admin Panel: http://localhost:3000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev