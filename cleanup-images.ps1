# Image Cleanup PowerShell Script
# Run this script daily to clean up old images

Write-Host "🧹 Starting Fortune Teller Image Cleanup..." -ForegroundColor Green
Write-Host "📅 Time: $(Get-Date)" -ForegroundColor Cyan

# Change to script directory
Set-Location $PSScriptRoot

try {
    # Run the cleanup
    Write-Host "🔄 Running cleanup script..." -ForegroundColor Yellow
    npm run cleanup
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Cleanup completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Cleanup failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "💥 Error running cleanup: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "🏁 Script finished at $(Get-Date)" -ForegroundColor Cyan
