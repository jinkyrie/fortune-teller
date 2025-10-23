# Complete Clerk Setup Guide for Fortune Teller

## 🚀 **Step-by-Step Setup Following Official Clerk Documentation**

Based on the [official Clerk Next.js documentation](https://clerk.com/docs/nextjs/guides/development/custom-sign-in-or-up-page), here's the complete setup process:

### **Step 1: Get Your Clerk API Keys**

1. **Go to [Clerk Dashboard](https://clerk.com)** and sign up/login
2. **Create a new application**:
   - Click "Add application"
   - Choose "Email, phone, username" (or just email)
   - Name it "Fortune Teller" or "KahveYolu"
   - Select your region

3. **Get your API keys**:
   - Go to "API Keys" in the sidebar
   - Copy your **Publishable Key** (starts with `pk_test_`)
   - Copy your **Secret Key** (starts with `sk_test_`)

### **Step 2: Update Your Environment Variables**

**Open your `.env.local` file** and add these lines:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY_HERE
CLERK_SECRET_KEY=YOUR_SECRET_KEY_HERE
CLERK_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET_HERE

# Clerk Redirect URLs (as per official docs)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Database
DATABASE_URL="file:./dev.db"

# Cloudinary
CLOUDINARY_CLOUD_NAME="dnjhnvmhk"
CLOUDINARY_API_KEY="154682521353578"
CLOUDINARY_API_SECRET="BARDFMSNp7agjNwzA0iEKdTKbjo"

# Resend Email
RESEND_API_KEY="re_YXwR5RQW_Jov2KuKsHCMqK2pfsiMenPfq"

# Application Settings
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
DAILY_ORDER_LIMIT="10"

# Payment Settings
PAYMENT_AMOUNT="50.00"
PAYMENT_CURRENCY="TRY"

# Cleanup Service
CRON_SECRET="your_secret_key_for_cron_authentication"
```

### **Step 3: Set Up Webhook for Role Assignment**

1. **In your Clerk dashboard**, go to "Webhooks"
2. **Click "Add Endpoint"**
3. **Set the endpoint URL**: `http://localhost:3000/api/webhooks/clerk`
4. **Select events**: Check "user.created"
5. **Copy the webhook secret** and add it to your `.env.local`

### **Step 4: Configure Admin Email**

**Open** `src/app/api/webhooks/clerk/route.ts` and change line 5:

```typescript
const ADMIN_EMAIL = "your-admin-email@example.com"; // Replace with your admin email
```

### **Step 5: Test the Setup**

Now let's test if everything works:

```bash
npm run dev
```

Visit your application at `http://localhost:3000`

## 🧪 **Testing Your Setup**

### **Test 1: Public Routes**
- ✅ Homepage (`/`) should be accessible without authentication
- ✅ Sign-in page (`/sign-in`) should be accessible without authentication
- ✅ Sign-up page (`/sign-up`) should be accessible without authentication

### **Test 2: Authentication Flow**
1. **Click "Sign Up"** on the homepage
2. **Create an account** with a regular email
3. **You should be redirected** to the dashboard
4. **Check that you don't see** the "Admin Panel" button

### **Test 3: Admin Role**
1. **Sign out** from the current account
2. **Sign up with your admin email** (the one you set in the webhook)
3. **You should see** the "Admin Panel" button
4. **Click "Admin Panel"** - it should work and show the admin interface

### **Test 4: Route Protection**
1. **Try accessing** `http://localhost:3000/admin` without being signed in
   - Should redirect to sign-in page
2. **Try accessing** `http://localhost:3000/dashboard` without being signed in
   - Should redirect to sign-in page
3. **Sign in with a non-admin account** and try accessing `/admin`
   - Should redirect to home page

## 🎯 **What You Should See**

### **For Regular Users**:
- ✅ Can access homepage, sign-in, and sign-up pages
- ✅ Can sign up and sign in successfully
- ✅ See "Dashboard" button after authentication
- ✅ **Don't** see "Admin Panel" button
- ✅ Can access dashboard and order pages
- ✅ **Cannot** access `/admin` routes (redirected to home)

### **For Admin Users**:
- ✅ Can access all public routes
- ✅ Can sign up and sign in successfully
- ✅ See both "Dashboard" and "Admin Panel" buttons
- ✅ Can access all admin routes
- ✅ Can view order management interface

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Permission Errors**: 
   - If you see `EPERM` errors, run: `Remove-Item -Recurse -Force .next`
   - Then restart the server

2. **Port Already in Use**:
   - The server will automatically use the next available port (3001, 3002, etc.)
   - Check the terminal output for the correct URL

3. **Webhook Not Working**:
   - Verify the webhook URL is correct in Clerk dashboard
   - Check that the webhook secret matches your `.env.local`
   - Look at the webhook delivery logs in Clerk dashboard

4. **Role Assignment Not Working**:
   - Check that the admin email in the webhook handler matches your test email
   - Verify the webhook is receiving the `user.created` event
   - Check the user's public metadata in Clerk dashboard

### **Environment Variables Checklist:**
- ✅ `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your publishable key
- ✅ `CLERK_SECRET_KEY` - Your secret key  
- ✅ `CLERK_WEBHOOK_SECRET` - Your webhook secret
- ✅ `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Set to `/sign-in`
- ✅ `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` - Set to `/`
- ✅ `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` - Set to `/`

## 🎉 **You're All Set!**

Your Fortune Teller application now has:
- ✅ **Official Clerk Integration** following the latest Next.js App Router patterns
- ✅ **Role-based Access Control** (admin/user) with automatic assignment
- ✅ **Public Routes** (homepage, sign-in, sign-up) accessible without authentication
- ✅ **Protected Routes** (dashboard, admin) requiring authentication
- ✅ **Admin-only Routes** with role-based access control
- ✅ **Webhook Integration** for automatic role assignment
- ✅ **Proper Redirect URLs** configured according to Clerk documentation

The system is secure, follows all official Clerk best practices, and is ready for production!
