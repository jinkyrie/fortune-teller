// Direct Iyzico API test

async function testIyzicoDirect() {
  console.log('🧪 Testing Iyzico API directly...');
  
  const testRequest = {
    locale: 'tr',
    conversationId: 'test_' + Date.now(),
    price: '1.00',
    paidPrice: '1.00',
    currency: 'TRY',
    installment: '1',
    paymentChannel: 'WEB',
    paymentGroup: 'PRODUCT',
    callbackUrl: 'http://localhost:3000/payment/success',
    buyer: {
      id: 'test@example.com',
      name: 'Test',
      surname: 'User',
      gsmNumber: '+905551234567',
      email: 'test@example.com',
      identityNumber: '11111111111',
      lastLoginDate: '2024-01-01 10:30:00',
      registrationDate: '2024-01-01 10:30:00',
      registrationAddress: 'Test Address',
      ip: '127.0.0.1',
      city: 'Istanbul',
      country: 'Turkey',
      zipCode: '34000'
    },
    shippingAddress: {
      contactName: 'Test User',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Test Address',
      zipCode: '34000'
    },
    billingAddress: {
      contactName: 'Test User',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Test Address',
      zipCode: '34000'
    },
    basketItems: [
      {
        id: 'test_item',
        name: 'Test Fortune Reading',
        category1: 'Services',
        itemType: 'VIRTUAL',
        price: '1.00'
      }
    ]
  };

  const apiUrl = 'https://sandbox-api.iyzipay.com/v2/iyzilink/products';
  
  // Test with your actual credentials
  const apiKey = 'sandbox-vrMqCkK0DbVB8DhB8BtTOgMyoKEETIfP';
  const secretKey = 'sandbox-9VJ6umMMgv1wjrxkbuOUSGCfRhJ9gDAb';
  
  // Try different auth formats
  const authString = `${apiKey}:${secretKey}`;
  const authHeader = Buffer.from(authString).toString('base64');

  console.log('📤 Request details:');
  console.log('- URL:', apiUrl);
  console.log('- API Key:', apiKey);
  console.log('- Secret Key:', secretKey);
  console.log('- Auth header length:', authHeader.length);
  console.log('- Request body size:', JSON.stringify(testRequest).length);

  // Try Bearer token format
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(testRequest)
    });

    const responseText = await response.text();
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('📊 Response body:', responseText);

    if (response.status === 200) {
      console.log('✅ Iyzico API call successful!');
    } else {
      console.log('❌ Iyzico API call failed');
    }

  } catch (error) {
    console.error('❌ Error calling Iyzico API:', error.message);
  }
}

testIyzicoDirect();
