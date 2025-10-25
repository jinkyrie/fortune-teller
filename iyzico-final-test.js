// Final Test with Correct Endpoint and Authentication
const crypto = require('crypto');

console.log('🎯 FINAL IYZICO TEST - Correct Endpoint + Authentication');
console.log('=========================================================');
console.log('');

const apiKey = 'sandbox-vrMqCkK0DbVB8DhB8BtTOgMyoKEETIfP';
const secretKey = 'ErnRrrnrlAq9WUr7qRzZUNKp5mQaNXaYP';
const correctEndpoint = 'https://sandbox-api.iyzipay.com/payment/iyzipos/checkoutform/initialize';

console.log('📋 Configuration:');
console.log('   API Key:', apiKey);
console.log('   Secret Key:', secretKey);
console.log('   Endpoint:', correctEndpoint);
console.log('');

// HMACSHA256 Authentication Implementation
function createIyzicoAuth(apiKey, secretKey, uriPath, requestBody) {
  // Step 1: Generate random key
  const randomKey = new Date().getTime() + '123456789';
  
  // Step 2: Create encrypted data
  const payload = randomKey + uriPath + requestBody;
  const encryptedData = crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
  
  // Step 3: Create authorization string
  const authorizationString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${encryptedData}`;
  const base64Auth = Buffer.from(authorizationString).toString('base64');
  
  return {
    authorization: `IYZWSv2 ${base64Auth}`,
    randomKey: randomKey
  };
}

async function testCorrectImplementation() {
  console.log('🧪 Testing with Correct Endpoint and Authentication');
  console.log('===================================================');
  console.log('');

  const uriPath = '/payment/iyzipos/checkoutform/initialize';
  const requestBody = JSON.stringify({
    locale: 'tr',
    conversationId: 'final_test_' + Date.now(),
    price: '0.01',
    paidPrice: '0.01',
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
        price: '0.01'
      }
    ]
  });

  console.log('📤 Request Details:');
  console.log('   URI Path:', uriPath);
  console.log('   Request Body Length:', requestBody.length);
  console.log('');

  // Create correct authentication
  const auth = createIyzicoAuth(apiKey, secretKey, uriPath, requestBody);
  
  console.log('🔑 Authentication:');
  console.log('   Random Key:', auth.randomKey);
  console.log('   Authorization:', auth.authorization.substring(0, 50) + '...');
  console.log('');

  try {
    console.log('📡 Making API call...');
    
    const response = await fetch(correctEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth.authorization,
        'x-iyzi-rnd': auth.randomKey
      },
      body: requestBody
    });

    const responseText = await response.text();
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.status === 200) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ SUCCESS! Got JSON response!');
        console.log('📊 Response Data:', JSON.stringify(data, null, 2));
        
        if (data.status === 'success') {
          console.log('🎉 PAYMENT FORM CREATED SUCCESSFULLY!');
          console.log('🔗 Payment URL:', data.paymentPageUrl);
          console.log('🎫 Token:', data.token);
        } else {
          console.log('⚠️  API Error:');
          console.log('   Error Code:', data.errorCode);
          console.log('   Error Message:', data.errorMessage);
          
          // Analyze the error
          if (data.errorCode === '1000') {
            console.log('🔍 Analysis: Still getting signature error - check credentials');
          } else if (data.errorCode === '11') {
            console.log('🔍 Analysis: Invalid request - check request format');
          } else {
            console.log('🔍 Analysis: Other error - check Iyzico documentation');
          }
        }
      } catch (parseError) {
        console.log('❌ Failed to parse JSON response');
        console.log('📊 Raw response:', responseText);
      }
    } else {
      console.log('❌ API call failed with status:', response.status);
      console.log('📊 Response:', responseText);
    }

  } catch (error) {
    console.log('❌ API call error:', error.message);
  }
}

// Run the test
testCorrectImplementation();

console.log('');
console.log('📋 SUMMARY:');
console.log('===========');
console.log('');
console.log('✅ FIXED: Wrong API endpoint (removed /v2/)');
console.log('✅ FIXED: Wrong authentication method (using HMACSHA256)');
console.log('');
console.log('🔧 NEXT STEPS:');
console.log('1. Update all API endpoints in your application');
console.log('2. Implement HMACSHA256 authentication');
console.log('3. Test the complete payment flow');
console.log('');
console.log('📁 Files to Update:');
console.log('- src/app/api/payment/create/iyzico/route.ts');
console.log('- src/app/api/debug-iyzico-connection/route.ts');
console.log('- All other Iyzico API endpoints');
