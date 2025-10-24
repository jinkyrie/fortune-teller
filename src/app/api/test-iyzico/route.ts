import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Test Iyzico API connection and create a test iyzilink
    const testRequest = {
      locale: 'tr',
      conversationId: 'test_' + Date.now(),
      currencyCode: 'TRY',
      name: 'Test Fortune Reading',
      description: 'Test payment link for KahveYolu',
      price: '1.00', // Small test amount
      stockEnabled: false,
      installmentRequested: 'false',
      addressIgnorable: 'true'
    };

    console.log('🧪 Testing Iyzico API with request:', testRequest);

    // Test the sandbox API
    const iyzicoResponse = await fetch('https://sandbox-api.iyzipay.com/v2/iyzilink/products', {
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
          url: iyzicoData.url,
          imageUrl: iyzicoData.imageUrl
        },
        testUrl: iyzicoData.url
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
