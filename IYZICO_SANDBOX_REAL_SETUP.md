# 🔧 Iyzico Sandbox - REAL Setup Guide

## ⚠️ **CRITICAL ISSUE IDENTIFIED**

You're currently using **PLACEHOLDER CREDENTIALS** that won't work!

### 🚨 **Current Problem:**
```javascript
// These are EXAMPLE credentials - they won't work!
apiKey: 'sandbox-vrMqCkK0DbVB8DhB8BtTOgMyoKEETIfP'
secretKey: 'sandbox-9VJ6umMMgv1wjrxkbuOUSGCfRhJ9gDAb'
```

## 🔑 **Step 1: Get REAL Sandbox Credentials**

### **1.1 Register for Iyzico Sandbox**
1. Go to: **https://sandbox-merchant.iyzipay.com/auth/register**
2. Fill out the registration form
3. Verify your email address
4. Complete the merchant application

### **1.2 Get Your API Keys**
1. Login to: **https://sandbox-merchant.iyzipay.com**
2. Go to **Settings** → **API Keys**
3. Generate new API keys for sandbox
4. Copy your **API Key** and **Secret Key**

### **1.3 Your Real Credentials Should Look Like:**
```javascript
// REAL credentials (yours will be different)
apiKey: 'sandbox-ABC123DEF456GHI789JKL'
secretKey: 'sandbox-XYZ789UVW456RST123MNO'
```

## 🔧 **Step 2: Update Your Environment**

### **2.1 Update Vercel Environment Variables**
In your Vercel dashboard, set:
```bash
IYZICO_API_KEY=your-real-sandbox-api-key
IYZICO_SECRET_KEY=your-real-sandbox-secret-key
IYZICO_SANDBOX_MODE=true
```

### **2.2 Update Local Environment**
Create/update your `.env.local`:
```bash
IYZICO_API_KEY=your-real-sandbox-api-key
IYZICO_SECRET_KEY=your-real-sandbox-secret-key
IYZICO_SANDBOX_MODE=true
```

## 🧪 **Step 3: Test Your Setup**

### **3.1 Test Credentials**
```bash
node check-iyzico-credentials.js
```

### **3.2 Test Payment Creation**
```bash
node test-iyzipay-official.js
```

### **3.3 Test API Endpoint**
```bash
curl -X POST https://your-app.vercel.app/api/debug-iyzico-connection
```

## 📋 **Step 4: Test Cards for Sandbox**

Use these test cards in sandbox mode:

| Card Number | Bank | Type | Description |
|-------------|------|------|-------------|
| `5526080000000006` | Akbank | MasterCard | Credit |
| `4603450000000000` | Akbank | Visa | Credit |
| `5528790000000008` | Akbank | MasterCard | Debit |

**Test Details:**
- **Expiry:** Any future date (e.g., 12/25)
- **CVV:** Any 3 digits (e.g., 123)
- **Name:** Any name

## ✅ **Step 5: Verify Success**

### **Success Indicators:**
- ✅ Credentials start with `sandbox-` but are YOUR real keys
- ✅ No "placeholder" or "example" in the keys
- ✅ Test endpoints return success responses
- ✅ Payment creation returns valid `paymentUrl`
- ✅ No 500 errors in logs

## 🚨 **Common Issues:**

### **Issue 1: Still Getting 500 Errors**
- **Cause:** Using placeholder credentials
- **Solution:** Get real sandbox credentials from Iyzico

### **Issue 2: Authentication Failed**
- **Cause:** Wrong API endpoint or headers
- **Solution:** Use `Authorization: Basic` header format

### **Issue 3: Invalid Credentials**
- **Cause:** Credentials not properly set in environment
- **Solution:** Double-check Vercel environment variables

## 🔗 **Important Links:**

- **Iyzico Sandbox Registration:** https://sandbox-merchant.iyzipay.com/auth/register
- **Iyzico Documentation:** https://docs.iyzico.com/en
- **API Reference:** https://docs.iyzico.com/en/iyzipay/api

## 🎯 **Next Steps:**

1. **Register for Iyzico Sandbox** (if not done)
2. **Get your real API credentials**
3. **Update environment variables**
4. **Test the payment flow**
5. **Deploy and verify**

**The placeholder credentials will NEVER work - you need real ones!** 🚨
