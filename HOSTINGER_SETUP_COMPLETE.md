# 🚀 Complete Hostinger Setup Guide

## **What We've Configured:**

### ✅ **1. Updated Prisma Schema**
- **Changed from PostgreSQL to MySQL** (Hostinger's database)
- **Updated DATABASE_URL** to use standard format

### ✅ **2. Created Hostinger Build Script**
- **Optimized build process** for Hostinger
- **Creates .htaccess** for proper routing
- **Generates production package.json**
- **Handles static file optimization**

### ✅ **3. Build Command**
```bash
npm run build:hostinger
```

## **Next Steps for Hostinger Deployment:**

### **Step 1: Create MySQL Database in Hostinger**
1. **Login to Hostinger panel**
2. **Go to "Databases" → "MySQL Databases"**
3. **Create new database:**
   - Database name: `fortune_teller`
   - Username: `your_username`
   - Password: `your_password`
4. **Note the connection details**

### **Step 2: Set Environment Variables**
In your Hostinger hosting panel, set these environment variables:

```
DATABASE_URL=mysql://username:password@localhost:3306/fortune_teller
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RESEND_API_KEY=re_...
ADMIN_EMAIL=your-admin@email.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### **Step 3: Build for Hostinger**
```bash
npm run build:hostinger
```

### **Step 4: Upload Files**
Upload these files to your Hostinger hosting directory:
- `.next/` (build output)
- `public/` (static files)
- `package.json` (production version)
- `.htaccess` (routing configuration)
- `prisma/` (database schema)

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

## **Hostinger-Specific Features:**

### ✅ **MySQL Database Support**
- **Prisma configured** for MySQL
- **Database migration** ready
- **Connection string** format updated

### ✅ **Static File Optimization**
- **.htaccess** for proper routing
- **Compression** enabled
- **Caching** configured
- **Client-side routing** handled

### ✅ **Production Ready**
- **Optimized build** for hosting
- **Environment variables** configured
- **Database schema** updated
- **Build process** streamlined

## **Benefits of Hostinger:**

✅ **More control** over hosting environment
✅ **MySQL database** included
✅ **Custom domain** support
✅ **Environment variables** support
✅ **File upload** capabilities
✅ **Better performance** for production

## **Ready to Deploy!**

Run `npm run build:hostinger` and upload the files to Hostinger! 🚀
