import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('🔍 Debugging Iyzico Connection...');
    
    // Check environment variables
    const envCheck = {
      IYZICO_API_KEY: process.env.IYZICO_API_KEY ? 'Set' : 'Missing',
      IYZICO_SECRET_KEY: process.env.IYZICO_SECRET_KEY ? 'Set' : 'Missing',
      IYZICO_SANDBOX_MODE: process.env.IYZICO_SANDBOX_MODE,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      PAYMENT_AMOUNT: process.env.PAYMENT_AMOUNT
    };

    console.log('📋 Environment Check:', envCheck);

    // Test Iyzico API with minimal request
    const testRequest = {
      locale: 'tr',
      conversationId: 'debug_' + Date.now(),
      price: '1.00',
      paidPrice: '1.00',
      currency: 'TRY',
      installment: '1',
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      buyer: {
        id: 'debug@test.com',
        name: 'Debug',
        surname: 'Test',
        gsmNumber: '+905551234567',
        email: 'debug@test.com',
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
        contactName: 'Debug Test',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Test Address',
        zipCode: '34000'
      },
      billingAddress: {
        contactName: 'Debug Test',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Test Address',
        zipCode: '34000'
      },
      basketItems: [
        {
          id: 'debug_item',
          name: 'Debug Fortune Reading',
          category1: 'Services',
          itemType: 'VIRTUAL',
          price: '1.00'
        }
      ]
    };

    const apiUrl = 'https://sandbox-api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize';
    
    // Create proper authorization header
    const authString = `${process.env.IYZICO_API_KEY}:${process.env.IYZICO_SECRET_KEY}`;
    const authHeader = Buffer.from(authString).toString('base64');

    console.log('📤 Sending request to:', apiUrl);
    console.log('🔑 Auth header format:', `IYZWS ${authHeader.substring(0, 20)}...`);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `IYZWS ${authHeader}`
      },
      body: JSON.stringify(testRequest)
    });

    const responseText = await response.text();
    console.log('📊 Raw Response:', responseText);
    console.log('📊 Status:', response.status);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      responseData = { raw: responseText, parseError: parseError.message };
    }

    return NextResponse.json({
      success: response.status === 200,
      status: response.status,
      environment: envCheck,
      request: testRequest,
      response: responseData,
      debug: {
        apiUrl,
        authHeaderLength: authHeader.length,
        requestSize: JSON.stringify(testRequest).length
      }
    });

  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
