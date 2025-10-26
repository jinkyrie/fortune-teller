import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  console.log('🚀 Iyzico payment endpoint called');
  
  try {
    const { orderId, paymentMethod } = await request.json();
    console.log('📋 Request data:', { orderId, paymentMethod });

    // Check credentials are loaded correctly
    console.log('🔑 Credentials Check:', {
      hasApiKey: !!process.env.IYZICO_API_KEY,
      hasSecretKey: !!process.env.IYZICO_SECRET_KEY,
      apiKeyLength: process.env.IYZICO_API_KEY?.length,
      secretKeyLength: process.env.IYZICO_SECRET_KEY?.length,
      apiKeyPrefix: process.env.IYZICO_API_KEY?.substring(0, 15),
      secretKeyPrefix: process.env.IYZICO_SECRET_KEY?.substring(0, 15)
    });

    // DETAILED DEBUGGING - Exact values for troubleshooting
    console.log('📊 EXACT VALUES FOR DEBUGGING:');
    console.log('🔑 API Key Length:', process.env.IYZICO_API_KEY?.length);
    console.log('🔑 Secret Key Length:', process.env.IYZICO_SECRET_KEY?.length);
    console.log('🔑 API Key:', process.env.IYZICO_API_KEY);
    console.log('🔑 Secret Key:', process.env.IYZICO_SECRET_KEY);

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

    // Check if we're in sandbox mode
    const isSandbox = process.env.IYZICO_SANDBOX_MODE === 'true' || process.env.NODE_ENV !== 'production';
    const IYZICO_BASE_URL = isSandbox 
      ? 'https://sandbox-api.iyzipay.com'
      : 'https://api.iyzipay.com';

    console.log('🔍 Iyzico Payment Debug:', {
      orderId,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      hasApiKey: !!process.env.IYZICO_API_KEY,
      hasSecretKey: !!process.env.IYZICO_SECRET_KEY,
      sandboxMode: isSandbox,
      iyzicoBaseUrl: IYZICO_BASE_URL
    });

    // Iyzico Authentication Implementation (COMPLETE WORKING VERSION)
    function generateIyzicoAuth(apiKey: string, secretKey: string, requestBody: any, uri: string) {
      // 1. Generate random key (MUST be string)
      const randomKey = new Date().getTime().toString() + "123456789";
      
      // 2. Stringify request body EXACTLY as it will be sent (no spaces, no formatting)
      const requestBodyString = JSON.stringify(requestBody);
      
      // 3. Create payload: randomKey + uri + requestBodyString
      const payload = randomKey + uri + requestBodyString;
      
      // 4. Generate HMACSHA256 signature in HEX format
      const signature = crypto
        .createHmac('sha256', secretKey)
        .update(payload, 'utf8')
        .digest('hex');
      
      // 5. Create authorization string
      const authString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;
      
      // 6. Base64 encode
      const base64Auth = Buffer.from(authString, 'utf8').toString('base64');
      
      console.log('🔐 Auth Debug:', {
        randomKey,
        payloadLength: payload.length,
        signatureLength: signature.length,
        signature: signature.substring(0, 20) + '...',
        base64Length: base64Auth.length
      });

      // DETAILED DEBUGGING - Exact values for troubleshooting
      console.log('📊 EXACT AUTHENTICATION VALUES:');
      console.log('🔑 RandomKey:', randomKey);
      console.log('🔑 URI Path:', uri);
      console.log('🔑 Payload Length:', payload.length);
      console.log('🔑 Signature (first 20 chars):', signature.substring(0, 20));
      console.log('🔑 Full Signature:', signature);
      console.log('🔑 Base64 Auth Length:', base64Auth.length);
      
      return {
        authorization: `IYZWSv2 ${base64Auth}`,
        randomKey: randomKey
      };
    }

    // Create iyzico checkout form request with proper structure
    const price = process.env.PAYMENT_AMOUNT || '50.00';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Get client IP from request headers
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1';
    
    // Create request body - MUST be EXACT
    const requestBody = {
      locale: "tr",
      conversationId: orderId,
      price: "50.00",
      paidPrice: "50.00",
      currency: "TRY",
      basketId: orderId,
      paymentGroup: "PRODUCT",
      callbackUrl: `${baseUrl}/api/payment/callback/iyzico`,
      enabledInstallments: [2, 3, 6, 9],
      buyer: {
        id: "BY789",
        name: "John",
        surname: "Doe",
        gsmNumber: "+905350000000",
        email: "john.doe@example.com",
        identityNumber: "74300864791",
        lastLoginDate: "2015-10-05 12:43:35",
        registrationDate: "2013-04-21 15:12:09",
        registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        ip: clientIP,
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34732"
      },
      shippingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742"
      },
      billingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742"
      },
      basketItems: [
        {
          id: "BI101",
          name: "Fortune Reading",
          category1: "Services",
          category2: "Fortune Telling",
          itemType: "VIRTUAL",
          price: "50.00"
        }
      ]
    };

    console.log('🚀 Starting iyzico payment for order:', orderId);

    // URI path for checkout form initialization
    const uri = '/payment/iyzipos/checkoutform/initialize/auth/ecom';
    
    // DETAILED DEBUGGING - URI and Base URL
    console.log('📊 EXACT URI VALUES:');
    console.log('🔑 URI Path:', uri);
    console.log('🔑 Base URL:', IYZICO_BASE_URL);
    console.log('🔑 Full URL:', `${IYZICO_BASE_URL}${uri}`);
    
    // Generate authentication BEFORE stringifying for sending
    const auth = generateIyzicoAuth(
      process.env.IYZICO_API_KEY!,
      process.env.IYZICO_SECRET_KEY!,
      requestBody,
      uri
    );

    // Prepare request body string (must be IDENTICAL to what was used in signature)
    const requestBodyString = JSON.stringify(requestBody);

    console.log('📤 Request Details:', {
      url: `${IYZICO_BASE_URL}${uri}`,
      bodyLength: requestBodyString.length,
      randomKey: auth.randomKey
    });

    console.log('🔐 Auth details:', {
      hasAuth: !!auth.authorization,
      randomKey: auth.randomKey,
      authLength: auth.authorization.length
    });

    // Make the API call to iyzico with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(`${IYZICO_BASE_URL}${uri}`, {
        method: 'POST',
        headers: {
          'Authorization': auth.authorization,
          'Content-Type': 'application/json',
          'x-iyzi-rnd': auth.randomKey
        },
        body: requestBodyString,  // Use the EXACT same string
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const responseText = await response.text();
      console.log('📊 Iyzico API Response Status:', response.status);
      console.log('📊 Iyzico API Response Headers:', Object.fromEntries(response.headers.entries()));
      console.log('📊 Iyzico API Response Body:', responseText);

      const data = await response.json();
      
      console.log('📊 Iyzico Response:', {
        status: data.status,
        errorCode: data.errorCode,
        errorMessage: data.errorMessage
      });

      if (data.status === 'success') {
        return NextResponse.json({
          success: true,
          paymentPageUrl: data.paymentPageUrl,
          token: data.token
        });
      } else {
        console.error('❌ Iyzico Error:', data);
        return NextResponse.json({
          success: false,
          error: data.errorMessage,
          errorCode: data.errorCode
        }, { status: 400 });
      }
    } catch (fetchError: any) {
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