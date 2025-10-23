# KahveYolu Setup Diagnostic Script
Write-Host "KahveYolu Setup Diagnostic" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Cyan

# Check if we're in the correct directory
Write-Host "`nDirectory Check:" -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "Correct directory" -ForegroundColor Green
} else {
    Write-Host "Wrong directory! Please run from fortune-teller folder" -ForegroundColor Red
    exit 1
}

# Check .env.local file
Write-Host "`nEnvironment Variables Check:" -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host ".env.local exists" -ForegroundColor Green
    
    # Check specific variables
    $envContent = Get-Content ".env.local" -Raw
    
    if ($envContent -match "CLOUDINARY_CLOUD_NAME") {
        if ($envContent -match "CLOUDINARY_CLOUD_NAME=`"your-cloud-name`"") {
            Write-Host "Cloudinary not configured (using placeholder)" -ForegroundColor Yellow
        } else {
            Write-Host "Cloudinary configured" -ForegroundColor Green
        }
    } else {
        Write-Host "Cloudinary not found in .env.local" -ForegroundColor Red
    }
    
    if ($envContent -match "RESEND_API_KEY") {
        if ($envContent -match "RESEND_API_KEY=`"your-resend-api-key`"") {
            Write-Host "Resend not configured (using placeholder)" -ForegroundColor Yellow
        } else {
            Write-Host "Resend configured" -ForegroundColor Green
        }
    } else {
        Write-Host "Resend not found in .env.local" -ForegroundColor Red
    }
} else {
    Write-Host ".env.local not found" -ForegroundColor Red
}

# Check database
Write-Host "`nDatabase Check:" -ForegroundColor Yellow
if (Test-Path "prisma/dev.db") {
    Write-Host "Database file exists" -ForegroundColor Green
} else {
    Write-Host "Database file not found (will be created on first run)" -ForegroundColor Yellow
}

# Check Node.js processes
Write-Host "`nServer Status:" -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Node.js processes running" -ForegroundColor Green
    Write-Host "Process IDs: $($nodeProcesses.Id -join ', ')" -ForegroundColor Cyan
} else {
    Write-Host "No Node.js processes running" -ForegroundColor Yellow
}

# Summary
Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "To start KahveYolu:" -ForegroundColor White
Write-Host "  .\start-kahveyolu.ps1" -ForegroundColor Green
Write-Host "  OR" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "Visit: http://localhost:3000" -ForegroundColor Cyan