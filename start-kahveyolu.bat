@echo off
echo 🔮 Starting KahveYolu Development Environment...
echo.

REM Change to the correct directory
cd /d "C:\Users\kyrg3\Desktop\NEW WEBS\Fortune Teller\fortune-teller"

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ Error: Not in the fortune-teller directory!
    echo Please run this from: C:\Users\kyrg3\Desktop\NEW WEBS\Fortune Teller\fortune-teller
    pause
    exit /b 1
)

REM Start the development server
echo 🚀 Starting KahveYolu Development Server...
echo 🌐 Frontend ^& Backend: http://localhost:3000
echo 🔮 Admin Panel: http://localhost:3000/admin
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
