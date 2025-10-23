# 🚀 Complete Hostinger Setup Guide

## **The Issue: Hostinger Shared Hosting**
Hostinger shared hosting **doesn't have environment variables interface** in the panel. We need to use a different approach.

## **Solution: .env File Approach**

### **Step 1: Create .env File**
1. **Copy `env.example` to `.env`**
2. **Fill in your actual values:**

```env
# Database (MySQL on Hostinger)
DATABASE_URL=mysql://username:password@localhost:3306/fortune_teller

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service
RESEND_API_KEY=re_...

# App Settings
ADMIN_EMAIL=your-admin@email.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### **Step 2: Build for Hostinger**
```bash
npm run build:hostinger
```

### **Step 3: Upload to Hostinger**
Upload these files to your hosting directory:
- `.next/` (build output)
- `public/` (static files)
- `package.json` (production version)
- `.htaccess` (routing + security)
- `prisma/` (database schema)
- `.env` (environment variables)

### **Step 4: Set Up Database**
1. **Login to Hostinger panel**
2. **Go to "Databases" → "MySQL Databases"**
3. **Create new database:**
   - Database name: `fortune_teller`
   - Username: `your_username`
   - Password: `your_password`
4. **Update DATABASE_URL** in your `.env` file

### **Step 5: Install Dependencies**
In your Hostinger hosting panel:
```bash
npm install
```

### **Step 6: Run Database Migration**
```bash
npx prisma db push
```

### **Step 7: Start the Application**
```bash
npm start
```

## **Security Features:**

### ✅ **.env File Protection**
The build script creates `.htaccess` with:
```apache
# Protect .env file
<Files ".env">
    Order Allow,Deny
    Deny from all
</Files>
```

### ✅ **Static File Optimization**
- **Compression** enabled
- **Caching** configured
- **Client-side routing** handled

## **Benefits of This Approach:**

✅ **Works on shared hosting**
✅ **Easy to manage**
✅ **Secure** (protected by .htaccess)
✅ **No hosting panel limitations**
✅ **Full control** over environment variables

## **Ready to Deploy!**

1. **Create .env file** with your values
2. **Run `npm run build:hostinger`**
3. **Upload files to Hostinger**
4. **Set up database**
5. **Install dependencies**
6. **Run migration**
7. **Start application**

**This approach works perfectly on Hostinger shared hosting!** 🎉
