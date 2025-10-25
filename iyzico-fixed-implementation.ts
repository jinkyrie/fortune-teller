// Fixed Iyzico Implementation with Correct Authentication and Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// HMACSHA256 Authentication Implementation
function createIyzicoAuth(apiKey: string, secretKey: string, uriPath: string, requestBody: string) {
  // Step 1: Generate random key (x-iyzi-rnd)
  const randomKey = new Date().getTime() + Math.random().toString(36).substring(2, 15);
  
  // Step 2: Create encrypted data using HMACSHA256
  const payload = randomKey + uriPath + requestBody;
  const encryptedData = crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
  
  // Step 3: Create authorization string
  const authorizationString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${encryptedData}`;
  const base64Auth = Buffer.from(authorizationString).toString('base64');
  
  return {
    authorization: `IYZWSv2 ${base64Auth}`,
    randomKey: randomKey
  };
}

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

    console.log('🔍 Iyzico Payment Debug:', {
      orderId,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      hasApiKey: !!process.env.IYZICO_API_KEY,
      hasSecretKey: !!process.env.IYZICO_SECRET_KEY,
      sandboxMode: process.env.IYZICO_SANDBOX_MODE === 'true'
    });

    // Create Iyzico checkout form request
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
          category2: 'Fortune Telling',
          itemType: 'VIRTUAL',
          price: price
        }
      ]
    };

    console.log('📤 Creating Iyzico checkout form with correct authentication...');

    // Use correct sandbox endpoint (without /v2/)
    const isSandbox = process.env.IYZICO_SANDBOX_MODE === 'true';
    const apiUrl = isSandbox 
      ? 'https://sandbox-api.iyzipay.com/payment/iyzipos/checkoutform/initialize'
      : 'https://api.iyzipay.com/payment/iyzipos/checkoutform/initialize';

    const uriPath = '/payment/iyzipos/checkoutform/initialize';
    const requestBody = JSON.stringify(iyzicoRequest);

    // Create HMACSHA256 authentication
    const auth = createIyzicoAuth(
      process.env.IYZICO_API_KEY!,
      process.env.IYZICO_SECRET_KEY!,
      uriPath,
      requestBody
    );

    console.log('🔑 Authentication created:', {
      randomKey: auth.randomKey,
      authHeader: auth.authorization.substring(0, 50) + '...'
    });

    // Make API call with correct authentication
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth.authorization,
        'x-iyzi-rnd': auth.randomKey
      },
      body: requestBody
    });

    const responseText = await response.text();
    console.log('📊 Iyzico API Response Status:', response.status);

    let iyzicoData;
    try {
      iyzicoData = JSON.parse(responseText);
      console.log('📊 Iyzico Response Data:', iyzicoData);
    } catch (parseError) {
      console.error('❌ Failed to parse Iyzico response:', parseError);
      return NextResponse.json(
        { error: 'Invalid response from payment gateway' },
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
          errorCode: iyzicoData.errorCode
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
