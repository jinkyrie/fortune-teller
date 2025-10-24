// Test Iyzico Environment Variables
console.log('🧪 Testing Iyzico Environment Configuration...\n');

// Check environment variables
const requiredVars = ['IYZICO_API_KEY', 'IYZICO_SECRET_KEY'];
const optionalVars = ['IYZICO_SANDBOX_MODE'];

console.log('📋 Environment Variables Status:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: Not set`);
  }
});

optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`ℹ️ ${varName}: ${value}`);
  } else {
    console.log(`⚠️ ${varName}: Not set (defaults to production)`);
  }
});

// Check if we're in sandbox mode
const isSandbox = process.env.IYZICO_SANDBOX_MODE === 'true';
console.log(`\n🔧 Configuration:`);
console.log(`Mode: ${isSandbox ? 'Sandbox' : 'Production'}`);
console.log(`API URL: ${isSandbox ? 'https://sandbox-api.iyzipay.com' : 'https://api.iyzipay.com'}`);

// Test API connection
async function testIyzicoConnection() {
  try {
    console.log('\n🚀 Testing Iyzico API Connection...');
    
    const testRequest = {
      locale: 'tr',
      conversationId: 'test_' + Date.now(),
      currencyCode: 'TRY',
      name: 'Test Fortune Reading',
      description: 'Test payment link for KahveYolu',
      price: '1.00',
      stockEnabled: false,
      installmentRequested: 'false',
      addressIgnorable: 'true'
    };

    const apiUrl = isSandbox 
      ? 'https://sandbox-api.iyzipay.com/v2/iyzilink/products'
      : 'https://api.iyzipay.com/v2/iyzilink/products';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `IYZWS ${process.env.IYZICO_API_KEY}:${process.env.IYZICO_SECRET_KEY}`
      },
      body: JSON.stringify(testRequest)
    });

    const data = await response.json();
    
    if (data.status === 'success') {
      console.log('✅ Iyzico API test successful!');
      console.log(`🔗 Test URL: ${data.url}`);
      console.log(`📊 Response:`, JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Iyzico API test failed');
      console.log(`📊 Response:`, JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log('❌ Connection test failed:', error.message);
  }
}

// Run the test
testIyzicoConnection();