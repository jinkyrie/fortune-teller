import { NextRequest, NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';

export async function POST(request: NextRequest) {
  console.log('🚀 Iyzico payment endpoint called');
  
  try {
    const { orderId, paymentMethod } = await request.json();
    console.log('📋 Request data:', { orderId, paymentMethod });

    if (!orderId) {
      console.log('❌ Missing orderId');
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Check if Iyzico credentials are configured
    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      console.error('❌ Iyzico credentials not configured');
      console.log('Environment check:', {
        hasApiKey: !!process.env.IYZICO_API_KEY,
        hasSecretKey: !!process.env.IYZICO_SECRET_KEY,
        nodeEnv: process.env.NODE_ENV
      });
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // For now, use mock order data to avoid Prisma dependency issues
    const order = {
      id: orderId,
      email: 'test@example.com',
      fullName: 'Test User',
      totalAmount: '50.00'
    };

    console.log('📦 Using order data:', order);

    // Initialize iyzico client
    const isSandbox = process.env.IYZICO_SANDBOX_MODE === 'true' || process.env.NODE_ENV !== 'production';
    const iyzicoBaseUrl = isSandbox ? 'https://sandbox-api.iyzipay.com' : 'https://api.iyzipay.com';
    
    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY!,
      secretKey: process.env.IYZICO_SECRET_KEY!,
      uri: iyzicoBaseUrl
    });

    console.log('🔍 Iyzico Payment Debug:', {
      orderId,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      hasApiKey: !!process.env.IYZICO_API_KEY,
      hasSecretKey: !!process.env.IYZICO_SECRET_KEY,
      sandboxMode: isSandbox,
      iyzicoBaseUrl
    });

    // Create iyzico checkout form request using official client
    const price = process.env.PAYMENT_AMOUNT || '50.00';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Get client IP from request headers
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1';
    
    const iyzicoRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: orderId,
      price: parseFloat(price).toFixed(2),
      paidPrice: parseFloat(price).toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${baseUrl}/payment/success`,
      enabledInstallments: ['2', '3', '6', '9'],
      buyer: {
        id: order.email,
        name: order.fullName || 'Test User',
        surname: order.fullName || 'Test User',
        gsmNumber: '+905551234567',
        email: order.email,
        identityNumber: '11111111111',
        lastLoginDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        registrationDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        registrationAddress: 'Test Address',
        ip: clientIP,
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34000'
      },
      shippingAddress: {
        contactName: order.fullName || 'Test User',
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Test Address',
        zipCode: '34000'
      },
      billingAddress: {
        contactName: order.fullName || 'Test User',
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
          category2: 'Fortune Telling',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: parseFloat(price).toFixed(2)
        }
      ]
    };

    console.log('📤 Creating Iyzico checkout form using official client...');
    console.log('📋 Request payload:', JSON.stringify(iyzicoRequest, null, 2));

    // Use the official iyzico client to create checkout form
    return new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(iyzicoRequest, (err: any, result: any) => {
        if (err) {
          console.error('❌ Iyzico client error:', err);
          resolve(NextResponse.json(
            { 
              error: 'Failed to create payment form',
              details: err.message || 'Unknown error'
            },
            { status: 500 }
          ));
          return;
        }

        console.log('📊 Iyzico Response:', result);

        if (result.status === 'success') {
          console.log('✅ Payment form created successfully!');
          console.log('🔗 Payment URL:', result.paymentPageUrl);

          resolve(NextResponse.json({
            success: true,
            paymentUrl: result.paymentPageUrl,
            token: result.token
          }));
        } else {
          console.error('❌ Iyzico API failed:', result);
          resolve(NextResponse.json(
            { 
              error: 'Failed to create payment link',
              details: result.errorMessage || 'Unknown error',
              errorCode: result.errorCode,
              iyzicoResponse: result
            },
            { status: 500 }
          ));
        }
      });
    });
  } catch (error) {
    console.error('Iyzico payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
