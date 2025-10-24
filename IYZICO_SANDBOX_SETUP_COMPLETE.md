# 🔧 Iyzico Sandbox Setup - Complete Guide

## **Critical Issues Fixed:**

### ✅ **1. Authentication Method**
- **Before:** `Authorization: IYZWS ${base64}`
- **After:** `Authorization: Basic ${base64}` (Standard Basic Auth)

### ✅ **2. API Endpoint**
- **Sandbox:** `https://sandbox-api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize`
- **Production:** `https://api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize`

## **🔑 Required Vercel Environment Variables:**

Set these in your Vercel dashboard:

```bash
# Iyzico Sandbox Credentials
IYZICO_API_KEY=sandbox-vrMqCkK0DbVB8DhB8BtTOgMyoKEETIfP
IYZICO_SECRET_KEY=sandbox-9VJ6umMMgv1wjrxkbuOUSGCfRhJ9gDAb
IYZICO_SANDBOX_MODE=true

# App Configuration
NEXT_PUBLIC_BASE_URL=https://fortune-teller-dosz0utaq-jins-projects-f65c2efb.vercel.app
PAYMENT_AMOUNT=50.00
```

## **🧪 Test Endpoints:**

### **1. Environment Check:**
```
GET https://your-app.vercel.app/api/test-iyzico-simple
```

### **2. Debug Connection:**
```
POST https://your-app.vercel.app/api/debug-iyzico-connection
```

### **3. Payment Creation:**
```
POST https://your-app.vercel.app/api/payment/create/iyzico
Content-Type: application/json
{
  "orderId": "test-order-123",
  "paymentMethod": "iyzico"
}
```

## **🔍 Troubleshooting:**

### **If Still Getting 500 Errors:**

1. **Check Vercel Logs:**
   - Go to Vercel Dashboard → Functions → View Logs
   - Look for Iyzico API responses

2. **Verify Sandbox Credentials:**
   - Login to [Iyzico Sandbox](https://sandbox-merchant.iyzipay.com)
   - Check if your API keys are valid
   - Ensure they start with `sandbox-`

3. **Test with Debug Endpoint:**
   - Use the debug endpoint to see exact error responses
   - Check authentication header format

## **📋 Iyzico Sandbox Test Cards:**

For testing payments:
- **Card Number:** `5526080000000006`
- **Bank:** Akbank
- **Type:** MasterCard Credit
- **Expiry:** Future date
- **CVV:** Any 3 digits

## **✅ Success Indicators:**

- Environment variables show "Set" status
- Debug endpoint returns successful Iyzico response
- Payment creation returns `paymentUrl` and `token`
- No 500 errors in Vercel logs

**Ready to test!** 🚀
