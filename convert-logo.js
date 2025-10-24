// Script to convert KahveYolu.png to base64 for PDF use
const fs = require('fs');
const path = require('path');

try {
  const logoPath = path.join(__dirname, 'public', 'KahveYolu.png');
  
  if (fs.existsSync(logoPath)) {
    const logoBuffer = fs.readFileSync(logoPath);
    const base64 = logoBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;
    
    console.log('✅ Logo converted to base64 successfully!');
    console.log('📋 Copy this base64 string and replace the placeholder in src/lib/logo-utils.ts:');
    console.log('');
    console.log(dataUrl);
    console.log('');
    console.log('📝 Instructions:');
    console.log('1. Copy the base64 string above');
    console.log('2. Open src/lib/logo-utils.ts');
    console.log('3. Replace the KAHVEYOLU_LOGO_BASE64 constant with your base64 string');
  } else {
    console.log('❌ KahveYolu.png not found in public folder');
    console.log('💡 Make sure the file exists at: public/KahveYolu.png');
  }
} catch (error) {
  console.error('❌ Error converting logo:', error);
}
