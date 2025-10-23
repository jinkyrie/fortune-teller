# 🔐 EASIEST Admin Setup Guide

## ✅ **Current Admin:** `kyriakosginis@gmail.com`

## 🚀 **How to Change Admin (3 Easy Steps)**

### **Method 1: Node.js Script (Recommended)**
```bash
node change-admin.js new-admin@example.com
```

### **Method 2: Bash Script (Linux/Mac)**
```bash
./change-admin.sh new-admin@example.com
```

### **Method 3: Manual (Advanced)**
1. Open `.env.local`
2. Change: `ADMIN_EMAIL=new-admin@example.com`
3. Restart server: `Ctrl+C` then `npm run dev`

## 🎯 **Why This is the BEST Method:**

✅ **Super Easy**: Just run one command  
✅ **Super Secure**: Only one admin at a time  
✅ **No Code Changes**: Just environment variable  
✅ **Instant Effect**: Restart and it works  
✅ **No Database**: No complex setup needed  
✅ **Version Control Safe**: Admin email not in code  
✅ **Working Admin Panel**: Full access to queue management and orders  

## 🧪 **Test Your Admin Access:**

1. **Sign in** with your admin email
2. **Go to**: `http://localhost:3000`
3. **Click "Admin Panel"** button
4. **Should redirect** to admin panel automatically

## 🔒 **Security Features:**

- **Single Admin Only**: Only one admin at a time
- **Environment Variable**: Easy to change without code
- **Automatic Protection**: All admin routes protected
- **Access Logging**: All attempts logged
- **No External Dependencies**: No webhooks needed

## 📁 **Files:**

- **Admin Config**: `src/lib/admin-config.ts`
- **Environment**: `.env.local` (ADMIN_EMAIL)
- **Node.js Script**: `change-admin.js` (Cross-platform)
- **Bash Script**: `change-admin.sh` (Linux/Mac)

## 🚀 **For Production:**

When you deploy, just set the `ADMIN_EMAIL` environment variable in your hosting platform (Vercel, Netlify, etc.) to your production admin email.

**That's it! Super simple and secure!** 🎉
