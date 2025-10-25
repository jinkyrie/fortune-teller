import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentMethod } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Check if Iyzico credentials are configured
    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      console.error('❌ Iyzico credentials not configured');
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if we're in sandbox mode
    const isSandbox = process.env.IYZICO_SANDBOX_MODE === 'true' || process.env.NODE_ENV !== 'production';
    const iyzicoBaseUrl = isSandbox ? 'https://sandbox-api.iyzipay.com' : 'https://api.iyzipay.com';

    console.log('🔍 Iyzico Payment Debug:', {
      orderId,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      hasApiKey: !!process.env.IYZICO_API_KEY,
      hasSecretKey: !!process.env.IYZICO_SECRET_KEY,
      sandboxMode: isSandbox,
      iyzicoBaseUrl
    });

    // Iyzico Authentication Implementation (SHA1 + Base64)
    function createIyzicoAuth(apiKey: string, secretKey: string, uriPath: string, requestBody: string) {
      const randomKey = new Date().getTime() + Math.random().toString(36).substring(2, 15);
      const payload = randomKey + uriPath + requestBody;
      
      // Use SHA1 hash (not SHA256) as per iyzico documentation
      const hash = crypto.createHash('sha1').update(payload).digest('hex');
      const authorizationString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${hash}`;
      const base64Auth = Buffer.from(authorizationString).toString('base64');
      
      return {
        authorization: `IYZWSv2 ${base64Auth}`,
        randomKey: randomKey
      };
    }

    // Create Iyzico checkout form request with proper structure
    const price = process.env.PAYMENT_AMOUNT || '50.00';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Get client IP from request headers
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1';
    
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
          itemType: 'VIRTUAL',
          price: price
        }
      ]
    };

    console.log('📤 Creating Iyzico checkout form with correct authentication...');
    console.log('📋 Request payload:', JSON.stringify(iyzicoRequest, null, 2));

    // Create authentication for the request
    const auth = createIyzicoAuth(
      process.env.IYZICO_API_KEY!,
      process.env.IYZICO_SECRET_KEY!,
      '/payment/iyzipos/checkoutform/initialize',
      JSON.stringify(iyzicoRequest)
    );

    console.log('🔐 Auth details:', {
      hasAuth: !!auth.authorization,
      randomKey: auth.randomKey,
      authLength: auth.authorization.length
    });

    // Make the API call to iyzico with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`${iyzicoBaseUrl}/payment/iyzipos/checkoutform/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth.authorization
        },
        body: JSON.stringify(iyzicoRequest),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const responseText = await response.text();
      console.log('📊 Iyzico API Response Status:', response.status);
      console.log('📊 Iyzico API Response Headers:', Object.fromEntries(response.headers.entries()));
      console.log('📊 Iyzico API Response Body:', responseText);

      let iyzicoData;
      try {
        iyzicoData = JSON.parse(responseText);
        console.log('📊 Iyzico Response Data:', iyzicoData);
      } catch (parseError) {
        console.error('❌ Failed to parse Iyzico response:', parseError);
        return NextResponse.json(
          { 
            error: 'Invalid response from payment gateway',
            details: responseText,
            status: response.status
          },
          { status: 500 }
        );
      }

      if (iyzicoData.status === 'success') {
        // Update order with payment URL
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentUrl: iyzicoData.paymentPageUrl,
            paymentToken: iyzicoData.token,
            paymentProvider: 'iyzico'
          }
        });

        console.log('✅ Payment form created successfully!');
        console.log('🔗 Payment URL:', iyzicoData.paymentPageUrl);

        return NextResponse.json({
          success: true,
          paymentUrl: iyzicoData.paymentPageUrl,
          token: iyzicoData.token
        });
      } else {
        console.error('❌ Iyzico API failed:', iyzicoData);
        return NextResponse.json(
          { 
            error: 'Failed to create payment link',
            details: iyzicoData.errorMessage || 'Unknown error',
            errorCode: iyzicoData.errorCode,
            iyzicoResponse: iyzicoData
          },
          { status: 500 }
        );
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('❌ Fetch error:', fetchError);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Payment gateway timeout' },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to connect to payment gateway',
          details: fetchError.message
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Iyzico payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
