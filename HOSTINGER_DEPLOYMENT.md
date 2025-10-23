# 🚀 Hostinger Deployment Guide

## **Hostinger Setup Requirements**

### **1. Hosting Requirements**
- **Node.js hosting** (not shared hosting)
- **Database support** (MySQL/PostgreSQL)
- **Environment variables support**
- **File upload support**

### **2. Database Setup**
Hostinger provides MySQL databases. We need to:
1. **Create a MySQL database** in Hostinger panel
2. **Update Prisma schema** to use MySQL instead of PostgreSQL
3. **Set DATABASE_URL** with MySQL connection string

### **3. Environment Variables**
Set these in your Hostinger hosting panel:
```
DATABASE_URL=mysql://username:password@host:port/database
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

## **Steps to Deploy:**

### **Step 1: Update Prisma Schema for MySQL**
We need to change from PostgreSQL to MySQL.

### **Step 2: Create Hostinger Database**
1. **Login to Hostinger panel**
2. **Go to "Databases"**
3. **Create new MySQL database**
4. **Note the connection details**

### **Step 3: Update Build Configuration**
Hostinger uses different build process than Netlify.

### **Step 4: Upload Files**
Upload the project files to your hosting directory.

## **Next Steps:**
1. **Update Prisma schema** for MySQL
2. **Create build script** for Hostinger
3. **Set up database** in Hostinger
4. **Configure environment variables**
5. **Deploy files**
