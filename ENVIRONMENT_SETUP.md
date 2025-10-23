# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory (`fortune-teller/`) with the following variables:

### 1. Database Configuration
```env
DATABASE_URL="file:./dev.db"
```
*This is already set up for local SQLite development.*

### 2. Cloudinary Configuration (for photo uploads)
Get these from: https://cloudinary.com/console
```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Payment Gateway Configuration
Choose ONE of the following:

**Option A: iyzico (Turkish payment gateway)**
```env
IYZICO_API_KEY="your-iyzico-api-key"
IYZICO_SECRET_KEY="your-iyzico-secret-key"
```

**Option B: PayTR (Turkish payment gateway)**
```env
PAYTR_MERCHANT_ID="your-paytr-merchant-id"
PAYTR_MERCHANT_KEY="your-paytr-merchant-key"
PAYTR_MERCHANT_SALT="your-paytr-merchant-salt"
```

### 4. Email Configuration (Resend)
Get API key from: https://resend.com/api-keys
```env
RESEND_API_KEY="your-resend-api-key"
```

### 5. Admin Configuration
```env
ADMIN_EMAIL="admin@yourdomain.com"
DAILY_ORDER_LIMIT=10
JWT_SECRET="your-secret-key-here-make-it-long-and-random"
```

### 6. Application Configuration
```env
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Quick Setup Steps

### For Development (Minimal Setup)
If you just want to test the application locally, you only need:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### For Production (Full Setup)
You'll need to set up accounts with:

1. **Cloudinary** (free tier available)
   - Sign up at https://cloudinary.com
   - Get your cloud name, API key, and API secret from the dashboard

2. **Resend** (free tier available)
   - Sign up at https://resend.com
   - Create an API key in the dashboard

3. **Payment Gateway** (choose one)
   - **iyzico**: https://www.iyzico.com (Turkish)
   - **PayTR**: https://www.paytr.com (Turkish)
   - Or use Stripe for international payments

## What I Need From You

To get the application fully functional, I need you to:

1. **Create the `.env.local` file** in the `fortune-teller/` directory
2. **Set up at least the minimal configuration** (database and JWT secret)
3. **Optionally set up external services** for full functionality

### Minimal Working Configuration
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="mystic-brew-secret-key-2024"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### For Full Functionality
You'll need to provide:
- Cloudinary credentials (for photo uploads)
- Resend API key (for email notifications)
- Payment gateway credentials (for payments)

## Current Status
✅ Database is set up and working
✅ Application is running on http://localhost:3000
✅ All pages are functional
❌ Photo uploads (needs Cloudinary)
❌ Email notifications (needs Resend)
❌ Payment processing (needs payment gateway)

The application will work without these external services, but some features will be limited.

