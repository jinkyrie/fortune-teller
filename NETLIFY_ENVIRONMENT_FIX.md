# 🔧 Netlify Environment Variables Fix

## Issues Found:
1. **Clerk using development keys** (not production keys)
2. **Missing Cloudinary environment variables** (causing 404 on /api/upload)
3. **Missing other required environment variables**

## ✅ Required Environment Variables for Netlify

Add these to your **Netlify Dashboard → Site Settings → Environment Variables**:

### 1. **Clerk Authentication (Production Keys)**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... (NOT pk_test_...)
CLERK_SECRET_KEY=sk_live_... (NOT sk_test_...)
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
```

### 2. **Cloudinary (Image Uploads)**
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. **Email Service (Resend)**
```
RESEND_API_KEY=re_...
```

### 4. **Payment Gateways (Choose One)**
**Option A: iyzico**
```
IYZICO_API_KEY=your-iyzico-api-key
IYZICO_SECRET_KEY=your-iyzico-secret-key
```

**Option B: PayTR**
```
PAYTR_MERCHANT_ID=your-paytr-merchant-id
PAYTR_MERCHANT_KEY=your-paytr-merchant-key
PAYTR_MERCHANT_SALT=your-paytr-merchant-salt
```

### 5. **Application Settings**
```
ADMIN_EMAIL=your-admin@email.com
DAILY_ORDER_LIMIT=10
NEXT_PUBLIC_BASE_URL=https://your-site-name.netlify.app
```

## 🚨 **Critical Fixes Needed:**

### **Fix 1: Clerk Production Keys**
- Go to your Clerk dashboard
- Switch to **Production** mode
- Copy the **Live** keys (not test keys)
- Update in Netlify environment variables

### **Fix 2: Cloudinary Setup**
1. **Sign up at [cloudinary.com](https://cloudinary.com)** (free tier available)
2. **Get your credentials** from the dashboard
3. **Add to Netlify environment variables**

### **Fix 3: Test Upload Route**
If Cloudinary isn't set up yet, the app will use the test route at `/api/upload/test`

## 🔍 **How to Get These Values:**

### **Clerk Production Keys:**
1. Go to [clerk.com](https://clerk.com) dashboard
2. Switch to **Production** mode (not Development)
3. Copy the **Live** keys

### **Cloudinary Credentials:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → Settings
3. Copy: Cloud Name, API Key, API Secret

### **Resend API Key:**
1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys → Create new key
3. Copy the key

## ✅ **After Setting Variables:**
1. **Redeploy** your site
2. **Test** the upload functionality
3. **Check** that Clerk shows production mode
