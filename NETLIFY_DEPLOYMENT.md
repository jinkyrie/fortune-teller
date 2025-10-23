# Netlify Deployment Guide

## Required Environment Variables

Set these environment variables in your Netlify dashboard under Site Settings > Environment Variables:

### Database
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### Clerk Authentication
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Email Configuration
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
```

## Database Setup

1. **Option 1: Netlify Postgres (Recommended)**
   - Go to Netlify dashboard > Add-ons > Postgres
   - Create a new Postgres database
   - Copy the connection string to `DATABASE_URL`

2. **Option 2: External Database**
   - Use any PostgreSQL provider (Supabase, PlanetScale, etc.)
   - Set the connection string as `DATABASE_URL`

## Deployment Steps

1. **Connect Repository**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `.next`

2. **Set Environment Variables**
   - Add all required environment variables in Netlify dashboard

3. **Deploy**
   - Trigger a new deployment
   - The build should complete successfully

## Post-Deployment

1. **Database Migration**
   - Run `npx prisma db push` in Netlify Functions or locally
   - This will create the database tables

2. **Test the Application**
   - Verify authentication works
   - Test order creation
   - Check admin panel access

## Troubleshooting

- **Build fails**: Check all environment variables are set
- **Database errors**: Verify `DATABASE_URL` is correct
- **Authentication errors**: Check Clerk keys are valid
- **Email errors**: Verify SMTP credentials
