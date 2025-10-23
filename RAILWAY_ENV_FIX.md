# Railway Environment Variables Fix

## 🚨 **CRITICAL: Set These Environment Variables in Railway**

The build is failing because these environment variables are missing in Railway:

### **Required Environment Variables:**

```
# Database (Railway auto-provides these)
DATABASE_URL=${{DATABASE_URL}}
DATABASE_PUBLIC_URL=${{DATABASE_PUBLIC_URL}}

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

## 🔧 **How to Fix in Railway:**

1. **Go to Railway Dashboard**
2. **Select your project**
3. **Go to Variables tab**
4. **Add all the variables above**
5. **Redeploy your application**

## ⚠️ **Important Notes:**

- **DATABASE_URL**: Railway automatically provides this when you add PostgreSQL
- **DATABASE_PUBLIC_URL**: Railway automatically provides this (Railway's direct connection)
- **Clerk Keys**: Use production keys (`pk_live_` not `pk_test_`)
- **All other variables**: Get from respective service dashboards

## 🚀 **After Setting Variables:**

1. Railway will automatically redeploy
2. Build should complete successfully
3. Database connection will work
4. Authentication will function properly

The build failure is due to missing environment variables, not code issues!
