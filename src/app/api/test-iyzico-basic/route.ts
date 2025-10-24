import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  try {
    // Most basic Iyzico request possible
    const basicRequest = {
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

    console.log('🧪 Testing basic Iyzico request:', JSON.stringify(basicRequest, null, 2));

    const isSandbox = process.env.IYZICO_SANDBOX_MODE === 'true';
    const apiUrl = isSandbox 
      ? 'https://sandbox-api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize/auth'
      : 'https://api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize/auth';

    console.log(`🔗 Testing Iyzico ${isSandbox ? 'Sandbox' : 'Production'} API: ${apiUrl}`);
    console.log('🔑 Using API Key:', process.env.IYZICO_API_KEY ? 'Set' : 'Missing');
    console.log('🔑 Using Secret Key:', process.env.IYZICO_SECRET_KEY ? 'Set' : 'Missing');

    const iyzicoResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `IYZWS ${process.env.IYZICO_API_KEY}:${process.env.IYZICO_SECRET_KEY}`
      },
      body: JSON.stringify(basicRequest)
    });

    const responseText = await iyzicoResponse.text();
    console.log('📊 Raw Response:', responseText);
    
    let iyzicoData;
    try {
      iyzicoData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse response as JSON:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON response from Iyzico',
        rawResponse: responseText,
        status: iyzicoResponse.status
      }, { status: 500 });
    }
    
    console.log('📊 Iyzico Basic Test Response:', {
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
      message: 'Basic Iyzico test successful!',
      data: iyzicoData
    });

  } catch (error) {
    console.error('❌ Basic Iyzico test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Basic Iyzico test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
