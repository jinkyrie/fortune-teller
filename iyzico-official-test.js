// Official Iyzico Test Based on Documentation
const crypto = require('crypto');

console.log('🧪 Official Iyzico Test (No Postman Required)');
console.log('==============================================');
console.log('');

const apiKey = 'sandbox-vrMqCkK0DbVB8DhB8BtTOgMyoKEETIfP';
const secretKey = 'ErnRrrnrlAq9WUr7qRzZUNKp5mQaNXaYP';

console.log('📋 Using Official Documentation:');
console.log('   API Key:', apiKey);
console.log('   Secret Key:', secretKey);
console.log('');

// Based on official documentation example
function createIyzicoAuth(apiKey, secretKey, uriPath, requestBody) {
  // Step 1: Generate random key (as per docs)
  const randomKey = new Date().getTime() + "123456789";
  
  // Step 2: Create payload (as per docs: randomKey + uriPath + requestBody)
  const payload = randomKey + uriPath + requestBody;
  
  // Step 3: Generate HMACSHA256 signature (as per docs)
  const encryptedData = crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
  
  // Step 4: Create authorization string (as per docs)
  const authorizationString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${encryptedData}`;
  
  // Step 5: Base64 encode (as per docs)
  const base64Auth = Buffer.from(authorizationString).toString('base64');
  
  return {
    authorization: `IYZWSv2 ${base64Auth}`,
    randomKey: randomKey
  };
}

async function testOfficialBinCheck() {
  console.log('🧪 Testing Official Bin Check (from documentation)');
  console.log('================================================');
  console.log('');

  // Using the exact example from documentation
  const uriPath = '/payment/bin/check';
  const requestBody = JSON.stringify({
    "locale": "tr",
    "binNumber": "535805",
    "conversationId": "docsTest-v1"
  });

  console.log('📤 Request Details (from docs):');
  console.log('   URI Path:', uriPath);
  console.log('   Request Body:', requestBody);
  console.log('');

  // Create authentication using official method
  const auth = createIyzicoAuth(apiKey, secretKey, uriPath, requestBody);
  
  console.log('🔑 Authentication (per docs):');
  console.log('   Random Key:', auth.randomKey);
  console.log('   Authorization:', auth.authorization.substring(0, 50) + '...');
  console.log('');

  try {
    console.log('📡 Making API call to sandbox...');
    
    const response = await fetch('https://sandbox-api.iyzipay.com' + uriPath, {
      method: 'POST',
      headers: {
        'Authorization': auth.authorization,
        'x-iyzi-rnd': auth.randomKey,
        'Content-Type': 'application/json'
      },
      body: requestBody
    });

    const responseText = await response.text();
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.status === 200) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ SUCCESS! Official Iyzico API working!');
        console.log('📊 Response Data:', JSON.stringify(data, null, 2));
        
        if (data.status === 'success') {
          console.log('🎉 Bin check successful!');
        } else {
          console.log('⚠️  API responded with:', data.errorMessage);
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

async function testCheckoutForm() {
  console.log('');
  console.log('🧪 Testing Checkout Form Initialize');
  console.log('===================================');
  console.log('');

  // Try checkout form endpoint
  const uriPath = '/payment/iyzipos/checkoutform/initialize';
  const requestBody = JSON.stringify({
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
  });

  console.log('📤 Checkout Form Request:');
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
    console.log('📡 Making checkout form API call...');
    
    const response = await fetch('https://sandbox-api.iyzipay.com' + uriPath, {
      method: 'POST',
      headers: {
        'Authorization': auth.authorization,
        'x-iyzi-rnd': auth.randomKey,
        'Content-Type': 'application/json'
      },
      body: requestBody
    });

    const responseText = await response.text();
    console.log('📊 Response Status:', response.status);
    
    if (response.status === 200) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ SUCCESS! Checkout form API working!');
        console.log('📊 Response Data:', JSON.stringify(data, null, 2));
        
        if (data.status === 'success') {
          console.log('🎉 Payment form created successfully!');
          console.log('🔗 Payment URL:', data.paymentPageUrl);
        } else {
          console.log('⚠️  API responded with:', data.errorMessage);
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

// Run both tests
async function runTests() {
  await testOfficialBinCheck();
  await testCheckoutForm();
  
  console.log('');
  console.log('📋 SUMMARY:');
  console.log('==========');
  console.log('✅ Using official Iyzico documentation');
  console.log('✅ HMACSHA256 authentication implemented');
  console.log('✅ No Postman required - direct API calls');
  console.log('✅ Testing with official examples');
  console.log('');
  console.log('🔗 Documentation References:');
  console.log('- https://docs.iyzico.com/en/getting-started/preliminaries/authentication/hmacsha256-auth');
  console.log('- https://docs.iyzico.com/en/getting-started/preliminaries/postman-collections');
}

runTests();
