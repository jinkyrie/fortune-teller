# Railway Deployment Fix

## Issues Fixed

### 1. DATABASE_URL Environment Variable
- **Problem**: Missing DATABASE_URL causing Prisma connection failures
- **Solution**: Set DATABASE_URL in Railway environment variables

### 2. Clerk Authentication Error
- **Problem**: `useUser` hook called outside ClerkProvider during build
- **Solution**: Added build-time checks to prevent Clerk hooks from running during build

## Deployment Steps

### 1. Set Environment Variables in Railway

Go to your Railway project dashboard and set these variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... (or pk_test_...)
CLERK_SECRET_KEY=sk_live_... (or sk_test_...)
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RESEND_API_KEY=re_...
ADMIN_EMAIL=your-admin@email.com
NEXT_PUBLIC_BASE_URL=https://your-railway-domain.railway.app
```

### 2. Database Setup

1. Add a PostgreSQL service to your Railway project
2. Railway will provide the DATABASE_URL automatically
3. Copy this URL and set it as the DATABASE_URL environment variable

### 3. Deploy

1. Push your code to GitHub
2. Connect your GitHub repository to Railway
3. Railway will automatically build and deploy using the `railway.json` configuration

### 4. Post-Deployment

After deployment, run these commands in Railway's console:

```bash
npx prisma db push
```

This will create the database schema.

## Build Process

The build process now includes:

1. **Environment Check**: Verifies required environment variables
2. **Prisma Generation**: Generates Prisma client
3. **Next.js Build**: Builds the application with proper error handling
4. **Clerk Provider**: Only initializes when environment variables are available

## Troubleshooting

### If build still fails:

1. Check that all environment variables are set correctly
2. Verify DATABASE_URL is accessible
3. Check Clerk keys are valid
4. Ensure Cloudinary credentials are correct

### Common Issues:

- **DATABASE_URL not found**: Add PostgreSQL service in Railway
- **Clerk errors**: Verify Clerk keys are correct and not placeholder values
- **Build timeout**: Increase build timeout in Railway settings
