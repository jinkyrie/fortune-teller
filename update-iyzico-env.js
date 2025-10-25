// Update Iyzico Environment Variables
console.log('🔧 Updating Iyzico Environment Variables...');
console.log('==========================================');

// Your new credentials
const newApiKey = 'sandbox-vrMqCkK0DbVB8DhB8BtTOgMyoKEETIfP';
const newSecretKey = 'ErnRrrnrlAq9WUr7qRzZUNKp5mQaNXaYP';

console.log('📋 New Credentials:');
console.log('   API Key:', newApiKey);
console.log('   Secret Key:', newSecretKey);
console.log('');

console.log('🌐 Environment Variables to Set:');
console.log('================================');
console.log('');
console.log('📝 For Vercel Dashboard:');
console.log('   IYZICO_API_KEY=' + newApiKey);
console.log('   IYZICO_SECRET_KEY=' + newSecretKey);
console.log('   IYZICO_SANDBOX_MODE=true');
console.log('');

console.log('📝 For Local .env.local:');
console.log('   IYZICO_API_KEY=' + newApiKey);
console.log('   IYZICO_SECRET_KEY=' + newSecretKey);
console.log('   IYZICO_SANDBOX_MODE=true');
console.log('');

console.log('🧪 Test Commands:');
console.log('================');
console.log('   1. Test credentials: node check-iyzico-credentials.js');
console.log('   2. Test payment: node test-iyzipay-official.js');
console.log('   3. Test API endpoint: curl -X POST https://your-app.vercel.app/api/debug-iyzico-connection');
console.log('');

console.log('📋 Next Steps:');
console.log('==============');
console.log('   1. Update Vercel environment variables');
console.log('   2. Update local .env.local file');
console.log('   3. Test the payment flow');
console.log('   4. Deploy and verify');
console.log('');

console.log('✅ Ready to test with real credentials!');
