import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Test Iyzico Pay with Iyzico API
    const testRequest = {
      locale: 'tr',
      conversationId: 'test_' + Date.now(),
      price: '1.00',
      paidPrice: '1.00',
      currency: 'TRY',
      installment: '1',
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      enabledInstallments: ['2', '3', '6', '9'],
      buyer: {
        id: 'test@example.com',
        name: 'Test',
        surname: 'User',
        gsmNumber: '+905551234567',
        email: 'test@example.com',
        identityNumber: '11111111111',
        lastLoginDate: new Date().toISOString().split('T')[0] + ' 10:30:00',
        registrationDate: new Date().toISOString().split('T')[0] + ' 10:30:00',
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

    console.log('🧪 Testing Iyzico API with request:', testRequest);

    // Determine API endpoint based on sandbox mode
    const isSandbox = process.env.IYZICO_SANDBOX_MODE === 'true';
    const apiUrl = isSandbox 
      ? 'https://sandbox-api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize/auth'
      : 'https://api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize/auth';

    console.log(`🔗 Testing Iyzico ${isSandbox ? 'Sandbox' : 'Production'} API: ${apiUrl}`);

    // Test the API
    const iyzicoResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `IYZWS ${process.env.IYZICO_API_KEY}:${process.env.IYZICO_SECRET_KEY}`
      },
      body: JSON.stringify(testRequest)
    });

    const iyzicoData = await iyzicoResponse.json();
    
    console.log('📊 Iyzico API Response:', iyzicoData);

    if (iyzicoData.status === 'success') {
      return NextResponse.json({
        success: true,
        message: 'Iyzico API test successful!',
        data: {
          status: iyzicoData.status,
          token: iyzicoData.token,
          paymentPageUrl: iyzicoData.paymentPageUrl
        },
        testUrl: iyzicoData.paymentPageUrl
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Iyzico API test failed',
        details: iyzicoData,
        status: iyzicoResponse.status
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Iyzico API test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Iyzico API test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Iyzico API Test Endpoint',
    usage: 'POST to test Iyzico API connection',
    requiredEnvVars: ['IYZICO_API_KEY', 'IYZICO_SECRET_KEY'],
    sandboxUrl: 'https://sandbox-api.iyzipay.com/v2/iyzilink/products'
  });
}
