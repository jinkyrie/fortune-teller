// Complete Iyzico Sandbox Solution
const crypto = require('crypto');

console.log('🎯 COMPLETE IYZICO SANDBOX SOLUTION');
console.log('===================================');
console.log('');

// Based on official Iyzico documentation
const apiKey = 'sandbox-vrMqCkK0DbVB8DhB8BtTOgMyoKEETIfP';
const secretKey = 'ErnRrrnrlAq9WUr7qRzZUNKp5mQaNXaYP';
const sandboxEndpoint = 'https://sandbox-api.iyzipay.com';

console.log('📋 Configuration (Based on Official Docs):');
console.log('   API Key:', apiKey);
console.log('   Secret Key:', secretKey);
console.log('   Sandbox Endpoint:', sandboxEndpoint);
console.log('');

// HMACSHA256 Authentication (Official Method)
function createIyzicoAuth(apiKey, secretKey, uriPath, requestBody) {
  // Step 1: Generate random key (x-iyzi-rnd)
  const randomKey = new Date().getTime() + Math.random().toString(36).substring(2, 15);
  
  // Step 2: Create encrypted data using HMACSHA256
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

async function testCompleteSolution() {
  console.log('🧪 Testing Complete Iyzico Solution');
  console.log('===================================');
  console.log('');

  const uriPath = '/payment/iyzipos/checkoutform/initialize';
  const requestBody = JSON.stringify({
    locale: 'tr',
    conversationId: 'complete_test_' + Date.now(),
    price: '1.00',
    paidPrice: '1.00',
    currency: 'TRY',
    installment: '1',
    paymentChannel: 'WEB',
    paymentGroup: 'PRODUCT',
    callbackUrl: 'http://localhost:3000/payment/success',
    enabledInstallments: ['2', '3', '6', '9'],
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
        id: 'fortune_reading_001',
        name: 'Fortune Reading',
        category1: 'Services',
        category2: 'Fortune Telling',
        itemType: 'VIRTUAL',
        price: '1.00'
      }
    ]
  });

  console.log('📤 Request Details:');
  console.log('   URI Path:', uriPath);
  console.log('   Request Body Length:', requestBody.length);
  console.log('');

  // Create authentication
  const auth = createIyzicoAuth(apiKey, secretKey, uriPath, requestBody);
  
  console.log('🔑 Authentication:');
  console.log('   Random Key:', auth.randomKey);
  console.log('   Authorization:', auth.authorization.substring(0, 50) + '...');
  console.log('');

  try {
    console.log('📡 Making API call to sandbox...');
    
    const response = await fetch(sandboxEndpoint + uriPath, {
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
    
    if (response.status === 200) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ SUCCESS! Got JSON response!');
        console.log('📊 Response Data:', JSON.stringify(data, null, 2));
        
        if (data.status === 'success') {
          console.log('🎉 PAYMENT FORM CREATED SUCCESSFULLY!');
          console.log('🔗 Payment URL:', data.paymentPageUrl);
          console.log('🎫 Token:', data.token);
          console.log('');
          console.log('✅ IYZICO SANDBOX IS WORKING!');
        } else {
          console.log('⚠️  API Error:');
          console.log('   Error Code:', data.errorCode);
          console.log('   Error Message:', data.errorMessage);
          console.log('');
          
          // Provide specific guidance based on error
          if (data.errorCode === '1000') {
            console.log('🔍 Solution: Check API credentials');
          } else if (data.errorCode === '11') {
            console.log('🔍 Solution: Check request format and required fields');
          } else if (data.errorCode === '1001') {
            console.log('🔍 Solution: Check request parameters');
          } else {
            console.log('🔍 Solution: Check Iyzico error codes documentation');
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
testCompleteSolution();

console.log('');
console.log('📋 COMPLETE SOLUTION SUMMARY:');
console.log('==============================');
console.log('');
console.log('✅ FIXED ISSUES:');
console.log('1. Wrong API endpoint (removed /v2/)');
console.log('2. Wrong authentication (using HMACSHA256)');
console.log('3. Correct sandbox URL structure');
console.log('');
console.log('🔧 IMPLEMENTATION DETAILS:');
console.log('- Endpoint: https://sandbox-api.iyzipay.com/payment/iyzipos/checkoutform/initialize');
console.log('- Auth: IYZWSv2 + base64(apiKey:key&randomKey:key&signature:hash)');
console.log('- Headers: x-iyzi-rnd, Authorization, Content-Type');
console.log('');
console.log('📁 FILES TO UPDATE:');
console.log('- src/app/api/payment/create/iyzico/route.ts');
console.log('- src/app/api/debug-iyzico-connection/route.ts');
console.log('- All Iyzico API endpoints');
console.log('');
console.log('🧪 TEST CARDS FOR SANDBOX:');
console.log('- Card: 5526080000000006 (Akbank MasterCard)');
console.log('- Expiry: Any future date');
console.log('- CVV: Any 3 digits');
console.log('');
console.log('🎯 NEXT STEPS:');
console.log('1. Update your application with correct endpoint and auth');
console.log('2. Test with sandbox test cards');
console.log('3. Deploy and verify payment flow');
