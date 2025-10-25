# Backend Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Railway (Recommended)
1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard:
   ```
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://yourdomain.com
   IYZICO_API_KEY=your-production-api-key
   IYZICO_SECRET_KEY=your-production-secret-key
   IYZICO_SANDBOX_MODE=false
   ```
3. Railway will automatically deploy the backend

### Option 2: Vercel (Serverless)
1. Create `vercel.json` in your project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Option 3: Heroku
1. Create `Procfile`:
```
web: node server.js
```
2. Deploy with Heroku CLI

## 🔧 Environment Variables

### Required for Production:
```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
IYZICO_API_KEY=your-production-api-key
IYZICO_SECRET_KEY=your-production-secret-key
IYZICO_SANDBOX_MODE=false
```

### For Development:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
IYZICO_API_KEY=your-sandbox-api-key
IYZICO_SECRET_KEY=your-sandbox-secret-key
IYZICO_SANDBOX_MODE=true
```

## 📱 Frontend Configuration

Update your frontend `.env` file:
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

## 🧪 Testing

1. **Health Check**: `GET /health`
2. **Payment Creation**: `POST /api/iyzico/create-payment`
3. **Test with sandbox cards** (see README-BACKEND.md)

## 🔄 Current Status

✅ **Backend Code**: Ready and pushed to repository  
✅ **Frontend Integration**: Updated with fallback mechanism  
✅ **Environment Config**: Production-ready  
⏳ **Deployment**: Choose your preferred platform above  

## 📞 Next Steps

1. Deploy backend to your chosen platform
2. Update `NEXT_PUBLIC_BACKEND_URL` in your frontend
3. Test payment flow with sandbox credentials
4. Switch to production credentials when ready
