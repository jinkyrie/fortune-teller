# Railway Quick Start Guide

## 🚀 Ready to Deploy!

Based on your Railway environment variables, here's exactly what you need to do:

## Step 1: Set Environment Variables in Railway

In your Railway dashboard → Service → Variables, add these:

```
# Database (Railway auto-provides - DO NOT CHANGE)
DATABASE_URL=${{DATABASE_URL}}
DIRECT_URL=${{DATABASE_PUBLIC_URL}}

# Authentication (Get from Clerk dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

# Image Storage (Get from Cloudinary dashboard)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service (Get from Resend dashboard)
RESEND_API_KEY=re_...

# App Settings
ADMIN_EMAIL=your-admin@email.com
NEXT_PUBLIC_BASE_URL=https://your-app.railway.app
```

## Step 2: Deploy

1. Connect your GitHub repo to Railway
2. Railway will automatically build and deploy
3. Your app will be available at `https://your-app.railway.app`

## Step 3: Database Setup

After deployment, in Railway terminal:
```bash
npx prisma db push
node create-admin.js
```

## Step 4: Verify

Run the setup checker:
```bash
npm run railway:setup
```

## ✅ Your Railway Variables Are Perfect!

Railway has already provided:
- ✅ `DATABASE_URL` - Private connection
- ✅ `DATABASE_PUBLIC_URL` - Public connection  
- ✅ All PostgreSQL credentials
- ✅ Railway domains and ports

You just need to add the application-specific variables (Clerk, Cloudinary, etc.).

## 🎯 Key Points

1. **Database**: Railway handles everything automatically
2. **DIRECT_URL**: Set to `${{DATABASE_PUBLIC_URL}}` for Prisma migrations
3. **Build**: Railway will use `npm run build` automatically
4. **Environment**: All Railway variables are production-ready

Your setup is Railway-ready! 🚀
