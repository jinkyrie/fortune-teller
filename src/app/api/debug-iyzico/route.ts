import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Debugging Iyzico Configuration...');
    
    // Check environment variables
    const envCheck = {
      IYZICO_API_KEY: process.env.IYZICO_API_KEY ? `${process.env.IYZICO_API_KEY.substring(0, 10)}...` : 'Missing',
      IYZICO_SECRET_KEY: process.env.IYZICO_SECRET_KEY ? `${process.env.IYZICO_SECRET_KEY.substring(0, 10)}...` : 'Missing',
      IYZICO_SANDBOX_MODE: process.env.IYZICO_SANDBOX_MODE,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      PAYMENT_AMOUNT: process.env.PAYMENT_AMOUNT
    };

    console.log('📋 Environment Variables:', envCheck);

    // Test basic connectivity
    const testUrl = 'https://sandbox-api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize/auth';
    console.log('🔗 Testing URL:', testUrl);

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
        id: 'debug@example.com',
        name: 'Debug',
        surname: 'User',
        gsmNumber: '+905551234567',
        email: 'debug@example.com',
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
        contactName: 'Debug User',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Test Address',
        zipCode: '34000'
      },
      billingAddress: {
        contactName: 'Debug User',
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

    console.log('📤 Request being sent:', JSON.stringify(testRequest, null, 2));

    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `IYZWS ${process.env.IYZICO_API_KEY}:${process.env.IYZICO_SECRET_KEY}`
      },
      body: JSON.stringify(testRequest)
    });

    const responseText = await response.text();
    console.log('📊 Raw Response:', responseText);
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      responseData = { raw: responseText };
    }

    return NextResponse.json({
      success: response.status === 200,
      environment: envCheck,
      request: testRequest,
      response: {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData
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
