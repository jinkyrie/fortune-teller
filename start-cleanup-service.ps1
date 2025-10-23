# Fortune Teller - Automated Cleanup Service
# This script starts the application with background cleanup services

param(
    [int]$DaysOld = 14,
    [int]$IntervalHours = 24
)

Write-Host "🚀 Starting Fortune Teller with Automated Cleanup Service..." -ForegroundColor Green
Write-Host "📅 Will delete images older than $DaysOld days" -ForegroundColor Cyan
Write-Host "⏰ Running cleanup every $IntervalHours hours" -ForegroundColor Cyan

# Set environment variables for cleanup service
$env:CLEANUP_DAYS_OLD = $DaysOld
$env:CLEANUP_INTERVAL_HOURS = $IntervalHours
$env:AUTO_CLEANUP = "true"

try {
    # Start the Next.js application
    Write-Host "🔄 Starting Next.js application..." -ForegroundColor Yellow
    npm run dev
    
} catch {
    Write-Host "❌ Error starting application: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
