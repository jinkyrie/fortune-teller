# Check Fortune Teller Cleanup Service Status

Write-Host "🔍 Checking Fortune Teller Cleanup Service Status..." -ForegroundColor Green
Write-Host ""

try {
    # Check if service exists
    $ServiceName = "FortuneTellerCleanup"
    $Service = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    
    if ($Service) {
        Write-Host "📊 Service Status:" -ForegroundColor Cyan
        $Service | Format-Table -AutoSize
        
        if ($Service.Status -eq "Running") {
            Write-Host "✅ Service is running and will automatically clean up old images" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Service is not running. Starting service..." -ForegroundColor Yellow
            Start-Service -Name $ServiceName
            Write-Host "✅ Service started!" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ Service not found. Please run install-service.bat first." -ForegroundColor Red
    }
    
    # Check cleanup API status
    Write-Host ""
    Write-Host "🌐 Checking cleanup API status..." -ForegroundColor Cyan
    
    try {
        $Response = Invoke-RestMethod -Uri "http://localhost:3001/api/cleanup" -Method GET
        Write-Host "📋 Cleanup Status:" -ForegroundColor Cyan
        Write-Host "   Old Orders Found: $($Response.oldOrdersCount)" -ForegroundColor White
        Write-Host "   Cutoff Date: $($Response.cutoffDate)" -ForegroundColor White
        Write-Host "   Message: $($Response.message)" -ForegroundColor White
    } catch {
        Write-Host "⚠️  Could not connect to cleanup API. Make sure the app is running." -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error checking status: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🏁 Status check completed!" -ForegroundColor Green
