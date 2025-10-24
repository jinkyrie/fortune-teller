# Iyzico Sandbox Setup Guide

## Overview
This guide will help you set up Iyzico sandbox payments for testing on your deployed application.

## 1. Get Iyzico Sandbox Credentials

1. **Sign up for Iyzico Sandbox Account**
   - Go to: https://sandbox-merchant.iyzipay.com/
   - Create a sandbox merchant account
   - Complete the registration process

2. **Get Your Sandbox API Keys**
   - Login to your sandbox merchant panel
   - Go to "API Keys" section
   - Copy your:
     - API Key (starts with `sandbox-`)
     - Secret Key (long random string)

## 2. Environment Variables Setup

Add these environment variables to your deployment platform:

```env
# Iyzico Sandbox Configuration
IYZICO_API_KEY=your-sandbox-api-key-here
IYZICO_SECRET_KEY=your-sandbox-secret-key-here
IYZICO_SANDBOX_MODE=true
```

## 3. Deployment Platform Setup

### For Railway:
```bash
railway variables set IYZICO_API_KEY=your-sandbox-api-key
railway variables set IYZICO_SECRET_KEY=your-sandbox-secret-key
railway variables set IYZICO_SANDBOX_MODE=true
```

### For Vercel:
```bash
vercel env add IYZICO_API_KEY
vercel env add IYZICO_SECRET_KEY
vercel env add IYZICO_SANDBOX_MODE
```

### For Hostinger:
Add the variables in your hosting control panel under "Environment Variables"

## 4. Test the Setup

### Local Testing:
```bash
# Test environment variables
node test-iyzico-env.js

# Test API endpoint
curl -X POST http://localhost:3000/api/test-iyzico
```

### Production Testing:
```bash
# Test on your deployed app
curl -X POST https://yourdomain.com/api/test-iyzico
```

## 5. Test Payment Flow

1. **Create a Test Order**
   - Go to your deployed application
   - Fill out the order form
   - Select Iyzico as payment method

2. **Test Payment Process**
   - You'll be redirected to Iyzico sandbox
   - Use test card numbers:
     - **Success**: 5528790000000008
     - **Failure**: 5528790000000016
     - **3D Secure**: 5528790000000024

3. **Verify Webhook**
   - Check your application logs
   - Verify order status updates
   - Test email notifications

## 6. Sandbox Test Cards

| Card Number | Result | Description |
|-------------|--------|-------------|
| 5528790000000008 | Success | Normal payment |
| 5528790000000016 | Failure | Declined payment |
| 5528790000000024 | 3D Secure | Requires 3D Secure |
| 5528790000000032 | Insufficient Funds | Low balance |

## 7. Monitoring and Debugging

### Check Logs:
```bash
# Railway
railway logs

# Vercel
vercel logs

# Check environment variables
railway variables
```

### Common Issues:

1. **"Invalid API Key" Error**
   - Verify your sandbox API key is correct
   - Ensure `IYZICO_SANDBOX_MODE=true`

2. **"Authentication Failed" Error**
   - Check your secret key
   - Verify the format: `IYZWS api-key:secret-key`

3. **Webhook Not Working**
   - Ensure your webhook URL is accessible
   - Check if your deployment platform supports webhooks

## 8. Production Migration

When ready for production:

1. **Get Production Credentials**
   - Apply for Iyzico production account
   - Complete merchant verification
   - Get production API keys

2. **Update Environment Variables**
   ```env
   IYZICO_API_KEY=your-production-api-key
   IYZICO_SECRET_KEY=your-production-secret-key
   IYZICO_SANDBOX_MODE=false
   ```

3. **Test Production**
   - Use real payment methods
   - Test with small amounts first
   - Monitor transactions carefully

## 9. Security Best Practices

- ✅ Never commit API keys to code
- ✅ Use environment variables only
- ✅ Rotate keys regularly
- ✅ Monitor for suspicious activity
- ✅ Use HTTPS for all webhook URLs

## 10. Support

- **Iyzico Documentation**: https://dev.iyzipay.com/
- **Sandbox Support**: Available through merchant panel
- **API Status**: https://status.iyzipay.com/

---

## Quick Test Commands

```bash
# Test environment setup
node test-iyzico-env.js

# Test API connection
curl -X POST https://yourdomain.com/api/test-iyzico

# Check deployment logs
railway logs --follow
```

Your Iyzico sandbox integration is now ready for testing! 🚀
