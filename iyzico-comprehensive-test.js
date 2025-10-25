// Comprehensive Iyzico Sandbox Diagnostic Test
const Iyzipay = require('iyzipay');

console.log('🔍 === COMPREHENSIVE IYZICO SANDBOX ANALYSIS ===');
console.log('');

// Test 1: Environment Check
console.log('📋 1. ENVIRONMENT CHECK');
console.log('=====================');

const apiKey = 'sandbox-vrMqCkK0DbVB8DhB8BtTOgMyoKEETIfP';
const secretKey = 'ErnRrrnrlAq9WUr7qRzZUNKp5mQaNXaYP';

console.log('API Key:', apiKey);
console.log('Secret Key:', secretKey);
console.log('API Key Length:', apiKey.length);
console.log('Secret Key Length:', secretKey.length);
console.log('');

// Test 2: Merchant Account Status Check
console.log('📋 2. MERCHANT ACCOUNT STATUS');
console.log('=============================');

async function checkMerchantStatus() {
  try {
    const iyzipay = new Iyzipay({
      apiKey: apiKey,
      secretKey: secretKey,
      uri: 'https://sandbox-api.iyzipay.com'
    });

    // Test with minimal request to check account status
    const testRequest = {
      locale: 'tr',
      conversationId: 'status_check_' + Date.now(),
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
    };

    console.log('🧪 Testing merchant account status...');
    
    const result = await new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(testRequest, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    console.log('📊 Response:', result);
    
    if (result.status === 'success') {
      console.log('✅ Merchant account is active and working!');
      console.log('🔗 Payment URL:', result.paymentPageUrl);
    } else {
      console.log('❌ Merchant account issue detected:');
      console.log('   Error Code:', result.errorCode);
      console.log('   Error Message:', result.errorMessage);
      
      // Analyze specific error codes
      switch (result.errorCode) {
        case '1000':
          console.log('🔍 Analysis: Invalid signature - Authentication problem');
          console.log('   Possible causes:');
          console.log('   - Wrong API credentials');
          console.log('   - Account not verified');
          console.log('   - API access not enabled');
          break;
        case '1001':
          console.log('🔍 Analysis: Invalid request - Request format issue');
          break;
        case '1002':
          console.log('🔍 Analysis: Merchant not found');
          break;
        default:
          console.log('🔍 Analysis: Unknown error - Check Iyzico documentation');
      }
    }

  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
}

// Test 3: Direct API Call Test
console.log('📋 3. DIRECT API CALL TEST');
console.log('==========================');

async function testDirectAPI() {
  try {
    const testRequest = {
      locale: 'tr',
      conversationId: 'direct_test_' + Date.now(),
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
    };

    const authString = `${apiKey}:${secretKey}`;
    const authHeader = Buffer.from(authString).toString('base64');

    console.log('🔑 Auth header created:', authHeader.substring(0, 20) + '...');
    console.log('📤 Making direct API call...');

    const response = await fetch('https://sandbox-api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`
      },
      body: JSON.stringify(testRequest)
    });

    const responseText = await response.text();
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Text:', responseText);

    if (response.status === 200) {
      const data = JSON.parse(responseText);
      console.log('✅ Direct API call successful!');
      console.log('📊 Response Data:', data);
    } else {
      console.log('❌ Direct API call failed');
      console.log('📊 Error Response:', responseText);
    }

  } catch (error) {
    console.log('❌ Direct API test failed:', error.message);
  }
}

// Test 4: System Requirements Check
console.log('📋 4. SYSTEM REQUIREMENTS CHECK');
console.log('===============================');

console.log('Node.js Version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);

// Check if we can make HTTPS requests
console.log('🔍 Testing HTTPS connectivity...');
fetch('https://sandbox-api.iyzipay.com')
  .then(response => {
    console.log('✅ HTTPS connectivity: OK');
    console.log('📊 Status:', response.status);
  })
  .catch(error => {
    console.log('❌ HTTPS connectivity failed:', error.message);
  });

// Run all tests
async function runAllTests() {
  console.log('');
  console.log('🧪 Running comprehensive tests...');
  console.log('');
  
  await checkMerchantStatus();
  console.log('');
  
  await testDirectAPI();
  console.log('');
  
  console.log('📋 5. RECOMMENDATIONS');
  console.log('====================');
  console.log('');
  console.log('If tests are failing:');
  console.log('1. Check if your Iyzico sandbox account is fully verified');
  console.log('2. Ensure API access is enabled in your merchant dashboard');
  console.log('3. Verify that your credentials are correct and active');
  console.log('4. Check if your account has any restrictions');
  console.log('5. Contact Iyzico support for account verification');
  console.log('');
  console.log('🔗 Iyzico Support: https://www.iyzico.com/en/support');
  console.log('🔗 Sandbox Dashboard: https://sandbox-merchant.iyzipay.com');
}

runAllTests();
