import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  try {
    // Minimal Iyzico request to test basic connectivity
    const minimalRequest = {
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

    console.log('🧪 Testing minimal Iyzico request:', JSON.stringify(minimalRequest, null, 2));

    const isSandbox = process.env.IYZICO_SANDBOX_MODE === 'true';
    const apiUrl = isSandbox 
      ? 'https://sandbox-api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize/auth'
      : 'https://api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize/auth';

    console.log(`🔗 Testing Iyzico ${isSandbox ? 'Sandbox' : 'Production'} API: ${apiUrl}`);

    const iyzicoResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `IYZWS ${process.env.IYZICO_API_KEY}:${process.env.IYZICO_SECRET_KEY}`
      },
      body: JSON.stringify(minimalRequest)
    });

    const iyzicoData = await iyzicoResponse.json();
    
    console.log('📊 Iyzico Minimal Test Response:', {
      status: iyzicoResponse.status,
      statusText: iyzicoResponse.statusText,
      data: iyzicoData
    });

    if (iyzicoResponse.status !== 200) {
      return NextResponse.json({
        success: false,
        error: 'Iyzico API failed',
        details: {
          status: iyzicoResponse.status,
          statusText: iyzicoResponse.statusText,
          response: iyzicoData
        }
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Minimal Iyzico test successful!',
      data: iyzicoData
    });

  } catch (error) {
    console.error('❌ Minimal Iyzico test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Minimal Iyzico test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
