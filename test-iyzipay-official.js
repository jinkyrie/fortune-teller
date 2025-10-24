// Test the official Iyzico Node.js client
const Iyzipay = require('iyzipay');

async function testOfficialIyzipay() {
  console.log('🧪 Testing Official Iyzico Node.js Client...');
  
  // Initialize Iyzico client
  const iyzipay = new Iyzipay({
    apiKey: 'sandbox-vrMqCkK0DbVB8DhB8BtTOgMyoKEETIfP',
    secretKey: 'sandbox-9VJ6umMMgv1wjrxkbuOUSGCfRhJ9gDAb',
    uri: 'https://sandbox-api.iyzipay.com'
  });

  const request = {
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
  };

  console.log('📤 Creating checkout form with official client...');

  try {
    const result = await new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(request, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    console.log('📊 Official Client Response:', result);
    
    if (result.status === 'success') {
      console.log('✅ Official Iyzico client works!');
      console.log('🔗 Payment URL:', result.paymentPageUrl);
    } else {
      console.log('❌ Official client failed:', result.errorMessage);
    }

  } catch (error) {
    console.error('❌ Official client error:', error);
  }
}

testOfficialIyzipay();
