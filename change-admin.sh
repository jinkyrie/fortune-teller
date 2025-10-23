#!/bin/bash

# 🔐 Change Admin Email Script
# Cross-platform bash script to change admin email

if [ $# -eq 0 ]; then
    echo "🔐 Change Admin Email"
    echo ""
    echo "Usage: ./change-admin.sh <new-admin-email>"
    echo ""
    echo "Example: ./change-admin.sh new-admin@example.com"
    exit 1
fi

NEW_EMAIL="$1"

# Validate email format
if [[ ! $NEW_EMAIL =~ ^[^\s@]+@[^\s@]+\.[^\s@]+$ ]]; then
    echo "❌ Invalid email format"
    echo "Please provide a valid email address"
    exit 1
fi

echo "🔐 Changing admin email to: $NEW_EMAIL"

# Update .env.local file
if [ -f ".env.local" ]; then
    # Update existing ADMIN_EMAIL or add new one
    if grep -q "ADMIN_EMAIL=" .env.local; then
        sed -i "s/ADMIN_EMAIL=.*/ADMIN_EMAIL=$NEW_EMAIL/" .env.local
        echo "✅ Updated ADMIN_EMAIL in .env.local"
    else
        echo "ADMIN_EMAIL=$NEW_EMAIL" >> .env.local
        echo "✅ Added ADMIN_EMAIL to .env.local"
    fi
else
    echo "ADMIN_EMAIL=$NEW_EMAIL" > .env.local
    echo "✅ Created .env.local with ADMIN_EMAIL"
fi

echo ""
echo "🎯 Admin email changed successfully!"
echo "📧 New admin: $NEW_EMAIL"
echo "🔄 Please restart the development server for changes to take effect"
echo ""
echo "To restart: Ctrl+C then 'npm run dev'"
