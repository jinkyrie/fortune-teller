# Vercel Deployment Guide

## 🚀 Deploying to Vercel

Your backend will work perfectly on Vercel! Here's how to set it up:

### 1. Environment Variables in Vercel

Go to your Vercel dashboard → Project Settings → Environment Variables and add:

```env
# Iyzico Sandbox Credentials
IYZICO_API_KEY=your-iyzico-sandbox-api-key
IYZICO_SECRET_KEY=your-iyzico-sandbox-secret-key
IYZICO_SANDBOX_MODE=true

# App Configuration
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### 2. API Endpoints Available

After deployment, these endpoints will be available:

- `https://your-domain.vercel.app/api/iyzico/create-payment` - Create payment
- `https://your-domain.vercel.app/api/iyzico/callback` - Handle callbacks
- `https://your-domain.vercel.app/health` - Health check

### 3. Frontend Integration

The frontend is already configured to use the new API routes. No changes needed!

### 4. Testing

1. **Health Check**: Visit `https://your-domain.vercel.app/health`
2. **Payment Flow**: Test with sandbox credentials
3. **Test Cards**: Use iyzico sandbox test cards

## 🔧 How It Works

### Vercel Serverless Functions
- `/api/iyzico/create-payment.js` - Handles payment creation
- `/api/iyzico/callback.js` - Handles payment callbacks  
- `/api/health.js` - Health check endpoint

### Frontend Flow
1. User selects iyzico payment
2. Frontend calls `/api/iyzico/create-payment`
3. API creates iyzico payment session
4. User redirected to iyzico payment page
5. After payment, iyzico calls `/api/iyzico/callback`

## ✅ Benefits of Vercel Deployment

- **Serverless**: No server management needed
- **Auto-scaling**: Handles traffic spikes automatically
- **Global CDN**: Fast worldwide performance
- **Easy deployment**: Git push = automatic deployment
- **Environment variables**: Secure credential management

## 🧪 Testing Your Deployment

1. Deploy to Vercel
2. Check health endpoint: `https://your-domain.vercel.app/health`
3. Test payment flow with sandbox credentials
4. Verify iyzico integration works

## 📞 Next Steps

1. **Deploy**: Push to GitHub, Vercel auto-deploys
2. **Configure**: Add environment variables in Vercel dashboard
3. **Test**: Use sandbox credentials and test cards
4. **Go Live**: Switch to production credentials when ready

Your backend will work perfectly on Vercel! 🎉
