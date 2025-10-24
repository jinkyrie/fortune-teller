import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: NextRequest) {
  // Add CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  const startTime = Date.now();
  
  try {
    console.log('🔍 === DETAILED PAYMENT DEBUG START ===');
    
    // Step 1: Parse request
    let requestBody;
    try {
      requestBody = await request.json();
      console.log('📥 Request body:', requestBody);
    } catch (parseError) {
      console.error('❌ Request parsing failed:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { orderId, paymentMethod } = requestBody;

    // Step 2: Validate orderId
    if (!orderId) {
      console.log('❌ Missing orderId');
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Step 3: Check environment variables
    const envCheck = {
      IYZICO_API_KEY: process.env.IYZICO_API_KEY ? 'Set' : 'Missing',
      IYZICO_SECRET_KEY: process.env.IYZICO_SECRET_KEY ? 'Set' : 'Missing',
      IYZICO_SANDBOX_MODE: process.env.IYZICO_SANDBOX_MODE,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      PAYMENT_AMOUNT: process.env.PAYMENT_AMOUNT,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing'
    };
    
    console.log('🔧 Environment check:', envCheck);

    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      console.error('❌ Iyzico credentials missing');
      return NextResponse.json({ 
        error: 'Payment gateway not configured',
        envCheck 
      }, { status: 500 });
    }

    // Step 4: Test database connection
    let order;
    try {
      console.log('🗄️ Attempting to fetch order:', orderId);
      order = await prisma.order.findUnique({
        where: { id: orderId }
      });
      console.log('📋 Order found:', order ? 'Yes' : 'No');
      if (order) {
        console.log('📋 Order details:', {
          id: order.id,
          email: order.email,
          fullName: order.fullName,
          status: order.status
        });
      }
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 });
    }

    if (!order) {
      console.log('❌ Order not found');
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Step 5: Prepare Iyzico request
    const price = process.env.PAYMENT_AMOUNT || '50.00';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const iyzicoRequest = {
      locale: 'tr',
      conversationId: orderId,
      price: price,
      paidPrice: price,
      currency: 'TRY',
      installment: '1',
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      callbackUrl: `${baseUrl}/payment/success`,
      enabledInstallments: ['2', '3', '6', '9'],
      buyer: {
        id: order.email,
        name: order.fullName,
        surname: order.fullName,
        gsmNumber: '+905551234567',
        email: order.email,
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
        contactName: order.fullName,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Test Address',
        zipCode: '34000'
      },
      billingAddress: {
        contactName: order.fullName,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Test Address',
        zipCode: '34000'
      },
      basketItems: [
        {
          id: orderId,
          name: 'Fortune Reading',
          category1: 'Services',
          itemType: 'VIRTUAL',
          price: price
        }
      ]
    };

    console.log('📤 Iyzico request prepared:', {
      conversationId: iyzicoRequest.conversationId,
      price: iyzicoRequest.price,
      callbackUrl: iyzicoRequest.callbackUrl,
      buyerEmail: iyzicoRequest.buyer.email
    });

    // Step 6: Determine API endpoint
    const isSandbox = process.env.IYZICO_SANDBOX_MODE === 'true';
    const apiUrl = isSandbox 
      ? 'https://sandbox-api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize'
      : 'https://api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize';

    console.log('🔗 API Configuration:', {
      isSandbox,
      apiUrl,
      sandboxMode: process.env.IYZICO_SANDBOX_MODE
    });

    // Step 7: Create authorization header
    const authString = `${process.env.IYZICO_API_KEY}:${process.env.IYZICO_SECRET_KEY}`;
    const authHeader = Buffer.from(authString).toString('base64');

    console.log('🔑 Authorization:', {
      apiKeyPrefix: process.env.IYZICO_API_KEY?.substring(0, 15) + '...',
      secretKeyPrefix: process.env.IYZICO_SECRET_KEY?.substring(0, 15) + '...',
      authHeaderLength: authHeader.length,
      authHeaderPrefix: authHeader.substring(0, 20) + '...'
    });

    // Step 8: Make Iyzico API call
    console.log('📡 Making Iyzico API call...');
    const requestStartTime = Date.now();
    
    const iyzicoResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`
      },
      body: JSON.stringify(iyzicoRequest)
    });

    const requestDuration = Date.now() - requestStartTime;
    console.log('⏱️ Iyzico API call duration:', requestDuration + 'ms');

    // Step 9: Parse response
    const responseText = await iyzicoResponse.text();
    console.log('📊 Raw Iyzico response:', responseText);
    console.log('📊 Response status:', iyzicoResponse.status);
    console.log('📊 Response headers:', Object.fromEntries(iyzicoResponse.headers.entries()));

    let iyzicoData;
    try {
      iyzicoData = JSON.parse(responseText);
      console.log('📊 Parsed Iyzico data:', iyzicoData);
    } catch (parseError) {
      console.error('❌ Failed to parse Iyzico response:', parseError);
      iyzicoData = { raw: responseText, parseError: parseError.message };
    }

    const totalDuration = Date.now() - startTime;
    console.log('⏱️ Total request duration:', totalDuration + 'ms');

    // Step 10: Return comprehensive debug info
    return NextResponse.json({
      success: iyzicoResponse.status === 200,
      debug: {
        requestDuration,
        totalDuration,
        environment: envCheck,
        order: order ? {
          id: order.id,
          email: order.email,
          fullName: order.fullName
        } : null,
        iyzicoRequest: {
          conversationId: iyzicoRequest.conversationId,
          price: iyzicoRequest.price,
          callbackUrl: iyzicoRequest.callbackUrl
        },
        apiConfig: {
          isSandbox,
          apiUrl,
          authHeaderLength: authHeader.length
        },
        response: {
          status: iyzicoResponse.status,
          statusText: iyzicoResponse.statusText,
          data: iyzicoData
        }
      }
    }, { headers: corsHeaders });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error('❌ === DETAILED PAYMENT DEBUG ERROR ===');
    console.error('❌ Error:', error);
    console.error('❌ Stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('❌ Duration:', totalDuration + 'ms');
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: totalDuration
    }, { status: 500 });
  }
}
