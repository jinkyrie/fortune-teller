# Fortune Teller Payment Backend

A Node.js Express backend for iyzico payment integration with sandbox testing capabilities.

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
# Install backend dependencies
npm install --save express cors helmet dotenv

# Install development dependencies
npm install --save-dev nodemon
```

### 2. Environment Setup

Copy the environment example file:
```powershell
Copy-Item backend.env.example .env
```

Edit `.env` with your iyzico sandbox credentials:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
IYZICO_API_KEY=your-iyzico-sandbox-api-key
IYZICO_SECRET_KEY=your-iyzico-sandbox-secret-key
IYZICO_SANDBOX_MODE=true
```

### 3. Start the Backend Server

```powershell
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## 🔧 API Endpoints

### POST /api/iyzico/create-payment

Creates a new iyzico payment session.

**Request Body:**
```json
{
  "amount": "50.00",
  "currency": "TRY",
  "email": "user@example.com",
  "basketId": "order-123",
  "items": [
    {
      "id": "item-1",
      "name": "Fortune Reading",
      "price": "50.00"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "paymentUrl": "https://sandbox-api.iyzipay.com/payment/iyzipos/checkoutform/initialize/auth",
  "token": "payment-token-here",
  "status": "success"
}
```

### POST /api/iyzico/callback

Handles iyzico payment callbacks (optional).

## 🔒 Security Features

- **Helmet.js** for HTTP security headers
- **CORS** configuration for frontend communication
- **Environment variable** protection for credentials
- **Request validation** and error handling
- **PKI signature** generation for iyzico authentication

## 🧪 Testing with Sandbox

### Test Cards (Iyzico Sandbox)

Use these test card numbers for sandbox testing:

- **Successful Payment:** 5528790000000008
- **Failed Payment:** 5528790000000016
- **3D Secure:** 5528790000000024

**Test Details:**
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

### Frontend Integration

Your existing frontend can call the backend like this:

```javascript
// Example frontend call
const response = await fetch('http://localhost:3001/api/iyzico/create-payment', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: '50.00',
    currency: 'TRY',
    email: 'user@example.com',
    basketId: 'order-123',
    items: [{
      id: 'fortune-reading',
      name: 'Fortune Reading',
      price: '50.00'
    }]
  })
});

const paymentData = await response.json();
if (paymentData.success) {
  window.location.href = paymentData.paymentUrl;
}
```

## 📁 Project Structure

```
fortune-teller/
├── server.js                 # Main Express server
├── config/
│   └── config.js            # Environment configuration
├── controllers/
│   └── iyzicoController.js  # Payment logic
├── backend.env.example      # Environment template
└── README-BACKEND.md        # This file
```

## 🔄 Integration with Existing Frontend

The backend is designed to work with your existing Next.js frontend:

1. **Frontend calls:** `POST /api/iyzico/create-payment`
2. **Backend processes:** iyzico payment creation
3. **Backend returns:** payment URL and token
4. **Frontend redirects:** user to iyzico payment page

## 🐛 Debugging

Enable detailed logging by setting:
```env
NODE_ENV=development
```

Check console output for:
- 🔍 Payment creation logs
- 📊 API response details
- ❌ Error messages
- ✅ Success confirmations

## 🚀 Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Set `IYZICO_SANDBOX_MODE=false`
3. Use production iyzico credentials
4. Configure proper CORS origins
5. Set up SSL/HTTPS

## 📞 Support

For iyzico integration issues:
- Check iyzico sandbox documentation
- Verify credentials in iyzico merchant panel
- Test with provided sandbox cards
- Check server logs for detailed error messages
