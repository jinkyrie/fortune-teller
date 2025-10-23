# Railway Environment Variables Setup

## Required Environment Variables for Railway Deployment

Set these environment variables in your Railway project dashboard:

### Database
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... (or pk_test_... for testing)
CLERK_SECRET_KEY=sk_live_... (or sk_test_... for testing)
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
```

### Cloudinary (Image Uploads)
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Email Service
```
RESEND_API_KEY=re_...
```

### App Settings
```
ADMIN_EMAIL=your-admin@email.com
NEXT_PUBLIC_BASE_URL=https://your-railway-domain.railway.app
```

### Optional: Payment Gateways
```
IYZICO_API_KEY=your-iyzico-api-key
IYZICO_SECRET_KEY=your-iyzico-secret-key
PAYTR_MERCHANT_ID=your-paytr-merchant-id
PAYTR_MERCHANT_KEY=your-paytr-merchant-key
PAYTR_MERCHANT_SALT=your-paytr-merchant-salt
```

## How to Set Environment Variables in Railway

1. Go to your Railway project dashboard
2. Click on your service
3. Go to the "Variables" tab
4. Add each environment variable with its value
5. Redeploy your service

## Database Setup

Railway provides PostgreSQL databases. To get your DATABASE_URL:

1. In your Railway project, add a PostgreSQL service
2. Railway will automatically provide the DATABASE_URL
3. Copy this URL and set it as the DATABASE_URL environment variable
4. Run `npx prisma db push` to create the database schema
