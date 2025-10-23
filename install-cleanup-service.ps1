# Install Fortune Teller Cleanup Service
# This script creates a Windows service for automated cleanup

param(
    [string]$ServiceName = "FortuneTellerCleanup",
    [string]$DisplayName = "Fortune Teller Image Cleanup",
    [string]$Description = "Automatically cleans up old images from Cloudinary"
)

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires administrator privileges. Please run as administrator." -ForegroundColor Red
    exit 1
}

$ScriptPath = $PSScriptRoot
$PowerShellPath = (Get-Command powershell.exe).Source
$ServiceScript = Join-Path $ScriptPath "start-cleanup-service.ps1"

Write-Host "🔧 Installing Fortune Teller Cleanup Service..." -ForegroundColor Green

try {
    # Create the service
    $ServiceArgs = "-ExecutionPolicy Bypass -File `"$ServiceScript`""
    
    New-Service -Name $ServiceName -DisplayName $DisplayName -Description $Description -BinaryPathName "$PowerShellPath $ServiceArgs" -StartupType Automatic
    
    Write-Host "✅ Service '$ServiceName' created successfully!" -ForegroundColor Green
    Write-Host "📋 Service Details:" -ForegroundColor Cyan
    Write-Host "   Name: $ServiceName" -ForegroundColor White
    Write-Host "   Display Name: $DisplayName" -ForegroundColor White
    Write-Host "   Startup Type: Automatic" -ForegroundColor White
    
    # Start the service
    Write-Host "🚀 Starting service..." -ForegroundColor Yellow
    Start-Service -Name $ServiceName
    
    Write-Host "✅ Service started successfully!" -ForegroundColor Green
    Write-Host "📊 Service Status:" -ForegroundColor Cyan
    Get-Service -Name $ServiceName | Format-Table -AutoSize
    
    Write-Host "🎉 Installation completed!" -ForegroundColor Green
    Write-Host "💡 The service will now run automatically and clean up old images every 24 hours." -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error installing service: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
