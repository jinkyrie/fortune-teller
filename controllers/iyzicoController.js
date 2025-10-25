const crypto = require('crypto');
const { getIyzicoConfig, getEnvironmentInfo } = require('../config/config');

/**
 * Creates iyzico authentication signature
 * Implements the PKI string generation, SHA-1 hash, and Base64 encoding
 * as required by iyzico API documentation
 */
function createIyzicoSignature(apiKey, secretKey, uriPath, requestBody) {
  try {
    // Generate random key (timestamp + random string)
    const randomKey = new Date().getTime() + Math.random().toString(36).substring(2, 15);
    
    // Create PKI string: randomKey + uriPath + requestBody
    const pkiString = randomKey + uriPath + requestBody;
    
    // Generate SHA-1 hash
    const hash = crypto.createHash('sha1').update(pkiString).digest('hex');
    
    // Create authorization string
    const authString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${hash}`;
    
    // Base64 encode the authorization string
    const base64Auth = Buffer.from(authString).toString('base64');
    
    return {
      authorization: `IYZWSv2 ${base64Auth}`,
      randomKey: randomKey
    };
  } catch (error) {
    console.error('❌ Error creating iyzico signature:', error);
    throw new Error('Failed to create payment signature');
  }
}

/**
 * Validates required environment variables
 */
function validateEnvironment() {
  const requiredVars = ['IYZICO_API_KEY', 'IYZICO_SECRET_KEY'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Creates a new iyzico payment
 * POST /api/iyzico/create-payment
 */
async function createPayment(req, res) {
  try {
    console.log('🔍 Creating iyzico payment...');
    
    // Validate environment
    validateEnvironment();
    
    // Extract payment data from request body
    const { amount, currency, email, basketId, items } = req.body;
    
    // Validate required fields
    if (!amount || !email || !basketId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['amount', 'email', 'basketId']
      });
    }
    
    // Get environment configuration
    const envInfo = getEnvironmentInfo();
    const iyzicoConfig = getIyzicoConfig();
    
    console.log('📊 Environment Info:', envInfo);
    
    // Prepare iyzico payment request
    const paymentRequest = {
      locale: 'tr',
      conversationId: basketId,
      price: amount.toString(),
      paidPrice: amount.toString(),
      currency: currency || 'TRY',
      installment: '1',
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      callbackUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success`,
      enabledInstallments: ['2', '3', '6', '9'],
      buyer: {
        id: email,
        name: email.split('@')[0],
        surname: 'User',
        gsmNumber: '+905551234567',
        email: email,
        identityNumber: '11111111111',
        lastLoginDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        registrationDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        registrationAddress: 'Test Address',
        ip: req.ip || '127.0.0.1',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34000'
      },
      shippingAddress: {
        contactName: email.split('@')[0],
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Test Address',
        zipCode: '34000'
      },
      billingAddress: {
        contactName: email.split('@')[0],
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Test Address',
        zipCode: '34000'
      },
      basketItems: items || [{
        id: basketId,
        name: 'Fortune Reading',
        category1: 'Services',
        category2: 'Fortune Telling',
        itemType: 'VIRTUAL',
        price: amount.toString()
      }]
    };
    
    // Convert request to JSON string for signature
    const requestBody = JSON.stringify(paymentRequest);
    const uriPath = '/payment/iyzipos/checkoutform/initialize';
    
    // Create authentication signature
    const auth = createIyzicoSignature(
      process.env.IYZICO_API_KEY,
      process.env.IYZICO_SECRET_KEY,
      uriPath,
      requestBody
    );
    
    console.log('🔐 Authentication created:', {
      hasAuth: !!auth.authorization,
      randomKey: auth.randomKey
    });
    
    // Make request to iyzico API
    const response = await fetch(iyzicoConfig.checkoutForm, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth.authorization
      },
      body: requestBody
    });
    
    const responseText = await response.text();
    console.log('📊 Iyzico API Response Status:', response.status);
    console.log('📊 Iyzico API Response:', responseText);
    
    let iyzicoData;
    try {
      iyzicoData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse iyzico response:', parseError);
      return res.status(500).json({
        error: 'Invalid response from payment gateway',
        details: responseText
      });
    }
    
    // Handle iyzico response
    if (iyzicoData.status === 'success') {
      console.log('✅ Payment form created successfully!');
      console.log('🔗 Payment URL:', iyzicoData.paymentPageUrl);
      
      return res.json({
        success: true,
        paymentUrl: iyzicoData.paymentPageUrl,
        token: iyzicoData.token,
        status: iyzicoData.status
      });
    } else {
      console.error('❌ Iyzico API failed:', iyzicoData);
      return res.status(500).json({
        error: 'Failed to create payment link',
        details: iyzicoData.errorMessage || 'Unknown error',
        errorCode: iyzicoData.errorCode,
        status: iyzicoData.status
      });
    }
    
  } catch (error) {
    console.error('❌ Payment creation error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Handles iyzico payment callbacks
 * POST /api/iyzico/callback
 */
async function handleCallback(req, res) {
  try {
    console.log('📞 Received iyzico callback:', req.body);
    
    // Verify callback authenticity (implement signature verification)
    // For now, just log the callback data
    const { token, status, paymentId } = req.body;
    
    if (status === 'success') {
      console.log('✅ Payment successful:', { token, paymentId });
      // Here you would update your database to mark the order as paid
    } else {
      console.log('❌ Payment failed:', { token, status });
    }
    
    res.json({ received: true });
    
  } catch (error) {
    console.error('❌ Callback handling error:', error);
    res.status(500).json({ error: 'Callback processing failed' });
  }
}

module.exports = {
  createPayment,
  handleCallback
};
