# PowerShell script to start the backend server
# Run this script to start the payment backend

Write-Host "🚀 Starting Fortune Teller Payment Backend..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    if (Test-Path "backend.env.example") {
        Copy-Item "backend.env.example" ".env"
        Write-Host "✅ Created .env file from template" -ForegroundColor Green
        Write-Host "📝 Please edit .env file with your iyzico credentials" -ForegroundColor Yellow
    } else {
        Write-Host "❌ backend.env.example not found" -ForegroundColor Red
        exit 1
    }
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install express cors helmet dotenv
    npm install --save-dev nodemon
}

# Start the server
Write-Host "🌐 Starting server on http://localhost:3001..." -ForegroundColor Green
Write-Host "📊 Health check: http://localhost:3001/health" -ForegroundColor Cyan
Write-Host "💳 Payment endpoint: http://localhost:3001/api/iyzico/create-payment" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

# Start the server
node server.js
