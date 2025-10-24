// Test Iyzico Environment Variables
console.log('🧪 Testing Iyzico Environment Variables...\n');

const requiredVars = [
  'IYZICO_API_KEY',
  'IYZICO_SECRET_KEY'
];

let allPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allPresent = false;
  }
});

console.log('\n📊 Environment Check:');
if (allPresent) {
  console.log('✅ All required environment variables are set!');
  console.log('🚀 Ready to test Iyzico API');
} else {
  console.log('❌ Missing environment variables');
  console.log('💡 Set these in your .env file or deployment environment');
}

console.log('\n🔗 Test your API endpoint:');
console.log('POST /api/test-iyzico');
console.log('GET /api/test-iyzico (for info)');
