# Push to GitHub Script
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Green

# Initialize git if not already done
if (!(Test-Path ".git")) {
    Write-Host "📁 Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Add all files except dist and node_modules
Write-Host "📋 Adding files to git..." -ForegroundColor Yellow
git add .
git reset HEAD dist/
git reset HEAD node_modules/
git reset HEAD .next/

# Check if remote exists
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  No remote repository found. Please add your GitHub repository:" -ForegroundColor Red
    Write-Host "git remote add origin https://github.com/yourusername/your-repo.git" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or run: git remote add origin YOUR_GITHUB_URL" -ForegroundColor Cyan
    exit 1
}

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Yellow
git commit -m "Deploy to Vercel - Fortune Teller App"

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "🚀 Now you can deploy to Vercel!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to push to GitHub. Please check your repository URL." -ForegroundColor Red
}
