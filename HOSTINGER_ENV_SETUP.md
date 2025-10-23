# 🔧 Hostinger Environment Variables Setup

## **Hostinger Shared Hosting Limitation:**
Hostinger shared hosting **doesn't have a built-in environment variables interface** like Netlify. We need to use a different approach.

## **Solution: Create .env File**

### **Step 1: Create .env File**
Create a `.env` file in your project root with all your environment variables:

```env
# Database
DATABASE_URL=mysql://username:password@localhost:3306/fortune_teller

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
RESEND_API_KEY=re_...

# App Settings
ADMIN_EMAIL=your-admin@email.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### **Step 2: Secure the .env File**
Add this to your `.htaccess` file to protect the .env file:

```apache
# Protect .env file
<Files ".env">
    Order Allow,Deny
    Deny from all
</Files>
```

### **Step 3: Update Build Script**
I'll update the build script to handle .env files for Hostinger.

## **Alternative: Use Hostinger VPS/Cloud Hosting**

If you have **VPS or Cloud hosting** on Hostinger:
1. **SSH access** to your server
2. **Set environment variables** in your shell profile
3. **Or use PM2** to manage environment variables

## **Next Steps:**
1. **Create .env file** with your variables
2. **Update build script** to handle .env
3. **Deploy to Hostinger**
4. **Test the application**

## **Benefits of .env File Approach:**
✅ **Works on shared hosting**
✅ **Easy to manage**
✅ **Secure** (protected by .htaccess)
✅ **Version control** friendly
✅ **No hosting panel limitations**
