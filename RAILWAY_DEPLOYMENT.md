# Railway Deployment Guide

## Prerequisites
1. Railway account (https://railway.app)
2. GitHub repository with your code
3. Clerk account for authentication
4. Cloudinary account for image storage
5. Resend account for email service

## Step 1: Database Setup

### Option A: Use Railway PostgreSQL (Recommended)
1. In Railway dashboard, create a new project
2. Add PostgreSQL service
3. Railway will automatically provide `DATABASE_URL`
4. Copy the `DATABASE_URL` for environment variables

### Option B: Use External PostgreSQL
- Use services like Supabase, Neon, or PlanetScale
- Get connection string and set as `DATABASE_URL`

## Step 2: Environment Variables

Set these in Railway dashboard under your service's "Variables" tab:

### Railway Database Variables:
Railway automatically provides these when you add a PostgreSQL service:
- `DATABASE_URL` - Private connection string
- `DATABASE_PUBLIC_URL` - Public connection string (use this for DIRECT_URL)

### Required Variables:
```
# Railway automatically provides these database variables:
DATABASE_URL=${{DATABASE_URL}}
DIRECT_URL=${{DATABASE_PUBLIC_URL}}
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RESEND_API_KEY=re_...
ADMIN_EMAIL=your-admin@email.com
NEXT_PUBLIC_BASE_URL=https://your-railway-app.railway.app
```

### Optional Payment Gateways:
```
IYZICO_API_KEY=your-iyzico-api-key
IYZICO_SECRET_KEY=your-iyzico-secret-key
PAYTR_MERCHANT_ID=your-paytr-merchant-id
PAYTR_MERCHANT_KEY=your-paytr-merchant-key
PAYTR_MERCHANT_SALT=your-paytr-merchant-salt
```

## Step 3: Deploy to Railway

1. Connect your GitHub repository to Railway
2. Railway will automatically detect it's a Next.js project
3. The build will run automatically
4. Railway will provide a URL like `https://your-app.railway.app`

## Step 4: Database Migration

After deployment, run database migration:
```bash
# In Railway dashboard, go to your service and open terminal
npx prisma db push
```

## Step 5: Create Admin User

```bash
# In Railway terminal
node create-admin.js
```

## Important Notes

### Database Differences:
- **Local Development**: Uses SQLite (`file:./dev.db`)
- **Railway Production**: Uses PostgreSQL

### Build Process:
- Railway automatically runs `npm run build`
- Prisma generates client for PostgreSQL
- Database migrations run automatically

### Environment Detection:
- The app automatically detects production vs development
- Clerk authentication works differently in production
- Database connections are optimized for PostgreSQL

## Troubleshooting

### Common Issues:
1. **Database Connection**: Ensure `DATABASE_URL` is correct
2. **Clerk Keys**: Use production keys (`pk_live_` not `pk_test_`)
3. **Build Failures**: Check Railway logs for specific errors
4. **Environment Variables**: Ensure all required variables are set

### Local Testing with PostgreSQL:
To test locally with PostgreSQL:
1. Install PostgreSQL locally or use Docker
2. Set `DATABASE_URL` to your local PostgreSQL instance
3. Run `npx prisma db push`
4. Test the application

## Production Optimizations

1. **Database Indexing**: Add indexes for better performance
2. **Connection Pooling**: Railway handles this automatically
3. **Caching**: Consider Redis for session storage
4. **CDN**: Use Cloudinary for image optimization
