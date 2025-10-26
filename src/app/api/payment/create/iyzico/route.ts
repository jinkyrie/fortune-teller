import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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

    // Iyzico Authentication Implementation (HMACSHA256 - CRITICAL FIX)
    function createIyzicoAuth(apiKey: string, secretKey: string, uriPath: string, requestBody: string) {
      // 1. Generate random key (timestamp + random string)
      const randomKey = new Date().getTime() + "123456789";
      
      // 2. Create payload: randomKey + uri + stringified request body
      const payload = randomKey + uriPath + requestBody;
      
      // 3. CRITICAL: Generate HMACSHA256 signature - MUST BE HEX FORMAT
      const signature = crypto
        .createHmac('sha256', secretKey)
        .update(payload)
        .digest('hex');  // ⚠️ CRITICAL: Must be 'hex', not omitted
      
      // 4. Create authorization string with EXACT format
      const authString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;
      
      // 5. Base64 encode the authorization string
      const base64Auth = Buffer.from(authString, 'utf8').toString('base64');
      
      // 6. Return with IYZWSv2 prefix
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
    
    // Create iyzico checkout form request with correct structure
    const iyzicoRequest = {
      locale: 'tr',
      conversationId: orderId,
      price: "50.00",
      paidPrice: "50.00",
      currency: 'TRY',
      basketId: orderId,
      paymentGroup: 'PRODUCT',
      callbackUrl: `${baseUrl}/api/payment/callback/iyzico`,
      enabledInstallments: [2, 3, 6, 9],  // Must be integer array
      buyer: {
        id: "BY789",
        name: "John",
        surname: "Doe",
        gsmNumber: "+905350000000",
        email: "john.doe@example.com",
        identityNumber: "74300864791",
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
          category1: "Services",  // MANDATORY field
          category2: "Fortune Telling",
          itemType: "VIRTUAL",
          price: "50.00"
        }
      ]
    };

    console.log('📤 Creating Iyzico checkout form with correct authentication...');
    console.log('📋 Request payload:', JSON.stringify(iyzicoRequest, null, 2));

    // URI path for checkout form initialization
    const uri = '/payment/iyzipos/checkoutform/initialize/auth/ecom';
    
    // Create authentication for the request
    const auth = createIyzicoAuth(
      process.env.IYZICO_API_KEY!,
      process.env.IYZICO_SECRET_KEY!,
      uri,
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
      const response = await fetch(`${IYZICO_BASE_URL}${uri}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth.authorization,
          'x-iyzi-rnd': auth.randomKey.toString()
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
        console.log('✅ Payment form created successfully!');
        console.log('🔗 Payment URL:', iyzicoData.paymentPageUrl);

        // Note: Database update removed to avoid Prisma issues
        // You can add this back once the basic flow works

        return NextResponse.json({
          success: true,
          paymentPageUrl: iyzicoData.paymentPageUrl,
          token: iyzicoData.token,
          checkoutFormContent: iyzicoData.checkoutFormContent
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