# Railway Environment Variables Setup

## Quick Setup for Railway

### 1. Database Variables (Auto-provided by Railway)
When you add a PostgreSQL service to Railway, it automatically provides:
- `DATABASE_URL` - Connection string with pooling
- `DATABASE_PUBLIC_URL` - Direct connection string

### 2. Set These in Railway Dashboard

Go to your Railway project → Service → Variables tab and add:

```
# Database (Railway auto-provides these - DO NOT CHANGE)
DATABASE_URL=${{DATABASE_URL}}
DIRECT_URL=${{DATABASE_PUBLIC_URL}}

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

# Image Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service
RESEND_API_KEY=re_...

# App Settings
ADMIN_EMAIL=your-admin@email.com
NEXT_PUBLIC_BASE_URL=https://your-app.railway.app
```

### 3. Railway Variable Syntax

Railway uses `${{VARIABLE_NAME}}` syntax to reference other variables:
- `DATABASE_URL=${{DATABASE_URL}}` - Uses Railway's auto-provided DATABASE_URL
- `DIRECT_URL=${{DATABASE_PUBLIC_URL}}` - Uses Railway's auto-provided DATABASE_PUBLIC_URL

### 4. Verification

Run the setup script to verify your configuration:
```bash
npm run railway:setup
```

This will check all required variables and provide guidance.

## Why Use DATABASE_PUBLIC_URL for DIRECT_URL?

- **DATABASE_URL**: Includes connection pooling (good for runtime)
- **DATABASE_PUBLIC_URL**: Direct connection (good for migrations and development)
- **Prisma**: Uses DIRECT_URL for migrations and direct database access

This setup ensures optimal performance and compatibility with Railway's infrastructure.
