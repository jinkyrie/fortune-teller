# 🚀 Netlify Deployment Guide

## What to Upload

You have **3 options** to deploy to Netlify:

### Option 1: Direct Folder Upload (Recommended)
1. **Go to [netlify.com](https://netlify.com)**
2. **Sign in** to your account
3. **Drag and drop** the entire `fortune-teller` folder
4. **Set environment variables** (see below)
5. **Deploy!**

### Option 2: ZIP Upload
1. **Create a ZIP** of the `fortune-teller` folder
2. **Upload the ZIP** to Netlify
3. **Set environment variables**
4. **Deploy!**

### Option 3: Git Repository (Advanced)
1. **Push to GitHub/GitLab**
2. **Connect repository** to Netlify
3. **Set environment variables**
4. **Auto-deploy on push**

## 🔧 Required Environment Variables

**Go to Netlify Dashboard → Site Settings → Environment Variables**

Set these variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
ADMIN_EMAIL=your-admin@email.com
RESEND_API_KEY=re_...
```

## 📋 Build Settings

Netlify will automatically detect:
- **Build command**: `npm run build:prod`
- **Publish directory**: `.next`
- **Node version**: `22.21.0`

## ✅ What's Included in Upload

**Essential files only:**
- `src/` - Source code
- `public/` - Static assets
- `prisma/` - Database schema
- `package.json` - Dependencies
- `next.config.ts` - Next.js config
- `netlify.toml` - Netlify config
- `.netlifyignore` - Exclude unnecessary files

**Excluded files:**
- `node_modules/` - Will be installed during build
- Development files
- Documentation
- Test files

## 🎯 Quick Start

1. **Upload** the `fortune-teller` folder to Netlify
2. **Set** the environment variables above
3. **Deploy** and wait for build to complete
4. **Visit** your live site!

## 🔍 Troubleshooting

If deployment fails:
1. Check `DATABASE_URL` starts with `postgresql://`
2. Verify all environment variables are set
3. Check build logs for specific errors
4. Ensure Node.js version is 22.21.0
