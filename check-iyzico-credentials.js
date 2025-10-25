// Check if Iyzico credentials are valid
console.log('🔍 Checking Iyzico credentials...');

const apiKey = 'sandbox-vrMqCkK0DbVB8DhB8BtTOgMyoKEETIfP';
const secretKey = 'ErnRrrnrlAq9WUr7qRzZUNKp5mQaNXaYP';

console.log('📋 Credential Analysis:');
console.log('- API Key length:', apiKey.length);
console.log('- Secret Key length:', secretKey.length);
console.log('- API Key starts with "sandbox-":', apiKey.startsWith('sandbox-'));
console.log('- Secret Key starts with "sandbox-":', secretKey.startsWith('sandbox-'));

// Check if these look like real credentials
const apiKeyPattern = /^sandbox-[a-zA-Z0-9]{20,}$/;
const secretKeyPattern = /^[a-zA-Z0-9]{20,}$/; // Secret keys don't always start with sandbox-

console.log('- API Key format valid:', apiKeyPattern.test(apiKey));
console.log('- Secret Key format valid:', secretKeyPattern.test(secretKey));

// Check if these are the old placeholder credentials
if (apiKey.includes('vrMqCkK0DbVB8DhB8BtTOgMyoKEETIfP') && 
    secretKey.includes('9VJ6umMMgv1wjrxkbuOUSGCfRhJ9gDAb')) {
  console.log('⚠️  WARNING: These appear to be placeholder/example credentials!');
  console.log('📝 You need to get real sandbox credentials from Iyzico.');
  console.log('🔗 Go to: https://sandbox-merchant.iyzipay.com/auth/register');
} else {
  console.log('✅ These look like real sandbox credentials!');
  console.log('🧪 Let\'s test them with a payment...');
}




