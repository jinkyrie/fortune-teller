// Correct Iyzico HMACSHA256 Authentication Implementation
const crypto = require('crypto');

console.log('🔧 Implementing Correct Iyzico Authentication');
console.log('==============================================');
console.log('');

const apiKey = 'sandbox-vrMqCkK0DbVB8DhB8BtTOgMyoKEETIfP';
const secretKey = 'ErnRrrnrlAq9WUr7qRzZUNKp5mQaNXaYP';

console.log('📋 Credentials:');
console.log('   API Key:', apiKey);
console.log('   Secret Key:', secretKey);
console.log('');

// Step 1: Generate random key (x-iyzi-rnd)
function generateRandomKey() {
  return new Date().getTime() + '123456789';
}

// Step 2: Create encrypted data using HMACSHA256
function createEncryptedData(randomKey, uriPath, requestBody, secretKey) {
  const payload = randomKey + uriPath + requestBody;
  return crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
}

// Step 3: Create base64 encoded authorization
function createBase64Authorization(apiKey, randomKey, encryptedData) {
  const authorizationString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${encryptedData}`;
  return Buffer.from(authorizationString).toString('base64');
}

// Step 4: Create final authorization header
function createAuthorizationHeader(apiKey, secretKey, uriPath, requestBody) {
  const randomKey = generateRandomKey();
  const encryptedData = createEncryptedData(randomKey, uriPath, requestBody, secretKey);
  const base64Auth = createBase64Authorization(apiKey, randomKey, encryptedData);
  return {
    authorization: `IYZWSv2 ${base64Auth}`,
    randomKey: randomKey
  };
}

// Test the correct authentication
async function testCorrectAuthentication() {
  console.log('🧪 Testing Correct Iyzico Authentication');
  console.log('=====================================');
  console.log('');

  const uriPath = '/v2/payment/iyzipos/checkoutform/initialize';
  const requestBody = JSON.stringify({
    locale: 'tr',
    conversationId: 'correct_auth_test_' + Date.now(),
    price: '0.01',
    paidPrice: '0.01',
    currency: 'TRY',
    installment: '1',
    paymentChannel: 'WEB',
    paymentGroup: 'PRODUCT',
    callbackUrl: 'http://localhost:3000/test',
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
        name: 'Test Item',
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

  // Generate correct authentication
  const auth = createAuthorizationHeader(apiKey, secretKey, uriPath, requestBody);
  
  console.log('🔑 Authentication Details:');
  console.log('   Random Key:', auth.randomKey);
  console.log('   Authorization Header:', auth.authorization.substring(0, 50) + '...');
  console.log('');

  // Make API call with correct authentication
  try {
    console.log('📡 Making API call with correct authentication...');
    
    const response = await fetch('https://sandbox-api.iyzipay.com' + uriPath, {
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
        console.log('✅ SUCCESS! Correct authentication works!');
        console.log('📊 Response Data:', data);
        
        if (data.status === 'success') {
          console.log('🎉 Payment form created successfully!');
          console.log('🔗 Payment URL:', data.paymentPageUrl);
        } else {
          console.log('⚠️  API responded but with error:', data.errorMessage);
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
testCorrectAuthentication();

console.log('');
console.log('📋 SUMMARY OF CHANGES NEEDED:');
console.log('============================');
console.log('');
console.log('❌ OLD (Wrong): Authorization: Basic base64');
console.log('✅ NEW (Correct): Authorization: IYZWSv2 base64');
console.log('');
console.log('🔧 Required Changes:');
console.log('1. Use HMACSHA256 signature generation');
console.log('2. Include x-iyzi-rnd header');
console.log('3. Use IYZWSv2 authorization format');
console.log('4. Update all API calls in your application');
console.log('');
console.log('📁 Files to Update:');
console.log('- src/app/api/payment/create/iyzico/route.ts');
console.log('- src/app/api/debug-iyzico-connection/route.ts');
console.log('- All other Iyzico API endpoints');
