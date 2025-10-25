// Test Different Iyzico API Endpoints
console.log('🔍 Testing Iyzico API Endpoints');
console.log('================================');
console.log('');

const endpoints = [
  'https://sandbox-api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize',
  'https://sandbox-api.iyzipay.com/payment/iyzipos/checkoutform/initialize',
  'https://sandbox-api.iyzipay.com/v2/payment/checkoutform/initialize',
  'https://sandbox-api.iyzipay.com/payment/checkoutform/initialize',
  'https://sandbox-api.iyzipay.com/v2/checkoutform/initialize',
  'https://sandbox-api.iyzipay.com/checkoutform/initialize'
];

async function testEndpoint(endpoint) {
  try {
    console.log(`🧪 Testing: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'IYZWSv2 test'
      },
      body: JSON.stringify({ test: 'data' })
    });

    const responseText = await response.text();
    console.log(`   Status: ${response.status}`);
    
    if (response.status === 200) {
      try {
        const data = JSON.parse(responseText);
        console.log(`   ✅ JSON Response: ${JSON.stringify(data).substring(0, 100)}...`);
        return { endpoint, status: 'success', data };
      } catch (parseError) {
        console.log(`   ❌ HTML Response (404): ${responseText.substring(0, 100)}...`);
        return { endpoint, status: 'html_404', data: responseText };
      }
    } else if (response.status === 401) {
      console.log(`   🔑 Authentication Required (Good sign!)`);
      return { endpoint, status: 'auth_required', data: responseText };
    } else {
      console.log(`   ❌ Error ${response.status}: ${responseText.substring(0, 100)}...`);
      return { endpoint, status: 'error', data: responseText };
    }
  } catch (error) {
    console.log(`   ❌ Network Error: ${error.message}`);
    return { endpoint, status: 'network_error', data: error.message };
  }
}

async function testAllEndpoints() {
  console.log('📡 Testing all possible Iyzico endpoints...');
  console.log('');
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    console.log('');
  }
  
  console.log('📊 RESULTS SUMMARY:');
  console.log('==================');
  console.log('');
  
  const successful = results.filter(r => r.status === 'success');
  const authRequired = results.filter(r => r.status === 'auth_required');
  const html404 = results.filter(r => r.status === 'html_404');
  
  if (successful.length > 0) {
    console.log('✅ Working Endpoints:');
    successful.forEach(r => console.log(`   - ${r.endpoint}`));
  }
  
  if (authRequired.length > 0) {
    console.log('🔑 Endpoints Requiring Authentication (Good!):');
    authRequired.forEach(r => console.log(`   - ${r.endpoint}`));
  }
  
  if (html404.length > 0) {
    console.log('❌ 404 Endpoints (Wrong):');
    html404.forEach(r => console.log(`   - ${r.endpoint}`));
  }
  
  console.log('');
  console.log('🎯 RECOMMENDATION:');
  console.log('==================');
  
  if (authRequired.length > 0) {
    console.log('Use the endpoint that requires authentication:');
    console.log(`   ${authRequired[0].endpoint}`);
    console.log('');
    console.log('This means the endpoint exists but needs proper authentication.');
  } else if (successful.length > 0) {
    console.log('Use the working endpoint:');
    console.log(`   ${successful[0].endpoint}`);
  } else {
    console.log('❌ No working endpoints found. Check Iyzico documentation for correct URLs.');
  }
}

testAllEndpoints();
