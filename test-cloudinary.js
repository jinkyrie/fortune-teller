// Test Cloudinary Configuration
const { v2: cloudinary } = require('cloudinary');
require('dotenv').config({ path: '.env.local' });

console.log('🔮 Testing Cloudinary Configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '***configured***' : 'NOT SET');
console.log('');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test the configuration
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connection successful!');
    console.log('Status:', result.status);
  })
  .catch(error => {
    console.log('❌ Cloudinary connection failed:');
    console.log('Error:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('1. Check your API credentials in .env.local');
    console.log('2. Make sure API Secret is correct (not hidden)');
    console.log('3. Verify your Cloudinary account is active');
  });
