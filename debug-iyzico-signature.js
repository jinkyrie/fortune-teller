// Debug Iyzico Signature Generation
console.log('🔍 Debugging Iyzico Signature Generation');
console.log('========================================');
console.log('');

const apiKey = 'sandbox-vrMqCkK0DbVB8DhB8BtTOgMyoKEETIfP';
const secretKey = 'ErnRrrnrlAq9WUr7qRzZUNKp5mQaNXaYP';

console.log('📋 Current Credentials:');
console.log('   API Key:', apiKey);
console.log('   Secret Key:', secretKey);
console.log('');

// Test different authentication methods
console.log('🧪 Testing Authentication Methods:');
console.log('==================================');
console.log('');

// Method 1: Basic Auth (what we're currently using)
const authString = `${apiKey}:${secretKey}`;
const basicAuth = Buffer.from(authString).toString('base64');
console.log('1. Basic Auth Method:');
console.log('   Auth String:', authString);
console.log('   Base64:', basicAuth.substring(0, 20) + '...');
console.log('   Header: Basic ' + basicAuth.substring(0, 20) + '...');
console.log('');

// Method 2: Check if credentials have any issues
console.log('2. Credential Analysis:');
console.log('   API Key starts with "sandbox-":', apiKey.startsWith('sandbox-'));
console.log('   Secret Key length:', secretKey.length);
console.log('   API Key length:', apiKey.length);
console.log('   Contains spaces:', apiKey.includes(' ') || secretKey.includes(' '));
console.log('   Contains newlines:', apiKey.includes('\n') || secretKey.includes('\n'));
console.log('');

// Method 3: Test with minimal request
console.log('3. Testing with Minimal Request:');
console.log('===============================');

const minimalRequest = {
  locale: 'tr',
  conversationId: 'minimal_test_' + Date.now(),
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

console.log('📤 Minimal Request:', JSON.stringify(minimalRequest, null, 2));
console.log('');

// Test the actual API call
async function testMinimalAPI() {
  try {
    console.log('📡 Making API call with minimal request...');
    
    const response = await fetch('https://sandbox-api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${basicAuth}`
      },
      body: JSON.stringify(minimalRequest)
    });

    const responseText = await response.text();
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Text:', responseText);
    
    if (response.status === 200) {
      try {
        const data = JSON.parse(responseText);
        console.log('✅ Success! Response:', data);
      } catch (parseError) {
        console.log('❌ Failed to parse response as JSON');
        console.log('📊 Raw response:', responseText);
      }
    } else {
      console.log('❌ API call failed with status:', response.status);
    }

  } catch (error) {
    console.log('❌ API call error:', error.message);
  }
}

testMinimalAPI();

console.log('');
console.log('🔍 POSSIBLE CAUSES OF "Geçersiz imza" ERROR:');
console.log('=============================================');
console.log('');
console.log('1. ❌ Wrong API endpoint');
console.log('2. ❌ Incorrect authentication method');
console.log('3. ❌ Invalid credentials (expired/inactive)');
console.log('4. ❌ Request format issues');
console.log('5. ❌ Encoding problems (UTF-8 required)');
console.log('6. ❌ Missing required fields');
console.log('');
console.log('📋 NEXT STEPS:');
console.log('==============');
console.log('1. Check if credentials are still valid');
console.log('2. Verify API endpoint is correct');
console.log('3. Test with different authentication method');
console.log('4. Contact Iyzico support with specific error details');
