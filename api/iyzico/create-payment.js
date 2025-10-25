const crypto = require('crypto');

/**
 * Creates iyzico authentication signature
 * Implements the PKI string generation, SHA-1 hash, and Base64 encoding
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
 * Vercel serverless function for creating iyzico payments
 */
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Creating iyzico payment...');
    
    // Validate environment
    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      return res.status(500).json({
        error: 'Iyzico credentials not configured'
      });
    }
    
    // Extract payment data from request body
    const { amount, currency, email, basketId, items } = req.body;
    
    // Validate required fields
    if (!amount || !email || !basketId) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['amount', 'email', 'basketId']
      });
    }
    
    // Determine environment
    const isSandbox = process.env.IYZICO_SANDBOX_MODE === 'true' || process.env.NODE_ENV !== 'production';
    const baseUrl = isSandbox ? 'https://sandbox-api.iyzipay.com' : 'https://api.iyzipay.com';
    const checkoutFormUrl = `${baseUrl}/payment/iyzipos/checkoutform/initialize`;
    
    console.log('📊 Environment Info:', {
      isSandbox,
      baseUrl,
      hasApiKey: !!process.env.IYZICO_API_KEY,
      hasSecretKey: !!process.env.IYZICO_SECRET_KEY
    });
    
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
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success`,
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
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1',
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
    const response = await fetch(checkoutFormUrl, {
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
