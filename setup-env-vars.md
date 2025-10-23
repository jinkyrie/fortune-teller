# 🚀 Quick Environment Variables Setup

## **Immediate Fixes for Your Errors:**

### 1. **Fix Clerk Development Keys Warning**
**Problem:** Using `pk_test_...` keys (development)
**Solution:** Switch to production keys

**Steps:**
1. Go to [clerk.com](https://clerk.com) dashboard
2. **Switch to Production mode** (top right corner)
3. Copy the **Live** keys (start with `pk_live_...` and `sk_live_...`)
4. Update in Netlify environment variables

### 2. **Fix Upload 404 Error**
**Problem:** Missing Cloudinary environment variables
**Solution:** Add Cloudinary credentials

**Quick Setup:**
1. **Sign up at [cloudinary.com](https://cloudinary.com)** (free)
2. **Get credentials** from dashboard:
   - Cloud Name
   - API Key  
   - API Secret
3. **Add to Netlify environment variables**

### 3. **Alternative: Use Test Mode**
If you don't want to set up Cloudinary right now, the app will use test mode and show placeholder images.

## **Required Environment Variables for Netlify:**

```
# Clerk (Production Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
RESEND_API_KEY=re_...

# App Settings
ADMIN_EMAIL=your-admin@email.com
NEXT_PUBLIC_BASE_URL=https://your-site.netlify.app
```

## **After Setting Variables:**
1. **Redeploy** your site
2. **Test** the upload functionality
3. **Check** that Clerk warning is gone

## **Quick Test:**
- Upload should work (either with Cloudinary or test mode)
- Clerk should show production mode
- No more 404 errors on `/api/upload`
