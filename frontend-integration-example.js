/**
 * Example: Frontend Integration with Backend
 * This shows how to modify your existing frontend to use the new backend
 */

// Example: Modified PaymentSelector component integration
async function handleIyzicoPayment(orderDraft) {
  try {
    console.log('🔍 Creating payment with backend...');
    
    // Call your new backend endpoint
    const response = await fetch('http://localhost:3001/api/iyzico/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: orderDraft.totalAmount || '50.00',
        currency: 'TRY',
        email: orderDraft.email,
        basketId: orderDraft.orderId,
        items: [{
          id: orderDraft.orderId,
          name: 'Fortune Reading',
          price: orderDraft.totalAmount || '50.00'
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create payment');
    }

    const paymentData = await response.json();
    
    if (paymentData.success) {
      console.log('✅ Payment created successfully!');
      console.log('🔗 Payment URL:', paymentData.paymentUrl);
      
      // Redirect to iyzico payment page
      window.location.href = paymentData.paymentUrl;
    } else {
      throw new Error(paymentData.error || 'Payment creation failed');
    }
    
  } catch (error) {
    console.error('❌ Payment error:', error);
    throw error;
  }
}

// Example: Modified payment selector logic
const paymentProviders = [
  {
    id: 'iyzico',
    name: 'Iyzico',
    description: 'Secure payment with credit/debit cards',
    icon: '/pay_with_iyzico_colored.svg',
    features: ['All major cards', 'Secure SSL', 'Fast processing']
  }
];

// Example: Updated handleProceed function
async function handleProceed(paymentMethod) {
  setLoading(true);
  setStep('processing');

  try {
    if (paymentMethod === 'iyzico') {
      // Use the new backend integration
      await handleIyzicoPayment(orderDraft);
    } else {
      // Handle other payment methods or fallback
      throw new Error('Payment method not supported');
    }
  } catch (error) {
    onPaymentError(error.message);
  } finally {
    setLoading(false);
  }
}

// Example: Testing the integration
async function testBackendConnection() {
  try {
    const response = await fetch('http://localhost:3001/health');
    const data = await response.json();
    console.log('✅ Backend is running:', data);
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return false;
  }
}

// Example: Complete payment flow test
async function testPaymentFlow() {
  console.log('🧪 Testing payment flow...');
  
  // Test backend connection
  const isBackendRunning = await testBackendConnection();
  if (!isBackendRunning) {
    console.error('❌ Backend not running. Start with: npm run dev');
    return;
  }
  
  // Test payment creation
  try {
    const testOrder = {
      orderId: 'test-' + Date.now(),
      email: 'test@example.com',
      totalAmount: '50.00'
    };
    
    await handleIyzicoPayment(testOrder);
    console.log('✅ Payment flow test completed');
  } catch (error) {
    console.error('❌ Payment flow test failed:', error);
  }
}

// Export for use in your components
export {
  handleIyzicoPayment,
  testBackendConnection,
  testPaymentFlow
};
