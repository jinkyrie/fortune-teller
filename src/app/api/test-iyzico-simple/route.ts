import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      IYZICO_API_KEY: process.env.IYZICO_API_KEY ? 'Set' : 'Missing',
      IYZICO_SECRET_KEY: process.env.IYZICO_SECRET_KEY ? 'Set' : 'Missing',
      IYZICO_SANDBOX_MODE: process.env.IYZICO_SANDBOX_MODE,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
    };

    console.log('🔍 Environment Check:', envCheck);

    return NextResponse.json({
      success: true,
      message: 'Environment variables check',
      environment: envCheck
    });
  } catch (error) {
    console.error('❌ Environment check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log('🧪 Testing Iyzico API connection...');
    
    // Simple Iyzico test request
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

    console.log('📤 Sending request to Iyzico...');
    
    const apiUrl = 'https://sandbox-api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize/auth';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `IYZWS ${process.env.IYZICO_API_KEY}:${process.env.IYZICO_SECRET_KEY}`
      },
      body: JSON.stringify(testRequest)
    });

    const responseText = await response.text();
    console.log('📊 Iyzico Response:', responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      responseData = { raw: responseText };
    }

    return NextResponse.json({
      success: response.status === 200,
      status: response.status,
      response: responseData,
      request: testRequest
    });

  } catch (error) {
    console.error('❌ Iyzico test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
