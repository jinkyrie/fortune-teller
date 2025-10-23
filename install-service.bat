@echo off
echo Installing Fortune Teller Cleanup Service...
echo This will create a Windows service for automated image cleanup.
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

powershell -ExecutionPolicy Bypass -File "install-cleanup-service.ps1"

echo.
echo Installation completed!
echo The service will now automatically clean up old images.
pause
