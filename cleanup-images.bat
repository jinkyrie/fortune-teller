@echo off
echo Starting image cleanup...
cd /d "%~dp0"
npm run cleanup
echo Cleanup completed.
pause
