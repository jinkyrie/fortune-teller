import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  console.log('🔄 Iyzico callback endpoint called');
  
  try {
    const { token } = await request.json();
    console.log('📋 Callback token:', token);

    if (!token) {
      console.log('❌ Missing token in callback');
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Check if Iyzico credentials are configured
    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      console.error('❌ Iyzico credentials not configured');
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // Check if we're in sandbox mode
    const isSandbox = process.env.IYZICO_SANDBOX_MODE === 'true' || process.env.NODE_ENV !== 'production';
    const iyzicoBaseUrl = isSandbox 
      ? 'https://sandbox-api.iyzipay.com/payment/iyzipos/checkoutform/auth/ecom/detail'
      : 'https://api.iyzipay.com/payment/iyzipos/checkoutform/auth/ecom/detail';

    // Iyzico Authentication Implementation (HMACSHA256)
    function createIyzicoAuth(apiKey: string, secretKey: string, uriPath: string, requestBody: string) {
      const randomKey = new Date().getTime() + "123456789";
      const payload = randomKey + uriPath + requestBody;
      
      const hash = crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
      const authorizationString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${hash}`;
      const base64Auth = Buffer.from(authorizationString).toString('base64');
      
      return {
        authorization: `IYZWSv2 ${base64Auth}`,
        randomKey: randomKey
      };
    }

    // Create retrieve request
    const retrieveRequest = {
      locale: 'tr',
      conversationId: Date.now().toString(),
      token: token
    };

    console.log('📤 Retrieving payment details from iyzico...');
    console.log('📋 Retrieve payload:', JSON.stringify(retrieveRequest, null, 2));

    // Create authentication for the retrieve request
    const auth = createIyzicoAuth(
      process.env.IYZICO_API_KEY!,
      process.env.IYZICO_SECRET_KEY!,
      '/payment/iyzipos/checkoutform/auth/ecom/detail',
      JSON.stringify(retrieveRequest)
    );

    console.log('🔐 Auth details:', {
      hasAuth: !!auth.authorization,
      randomKey: auth.randomKey,
      authLength: auth.authorization.length
    });

    // Make the API call to retrieve payment details
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(iyzicoBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': auth.authorization,
          'x-iyzi-rnd': auth.randomKey.toString()
        },
        body: JSON.stringify(retrieveRequest),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const responseText = await response.text();
      console.log('📊 Iyzico Retrieve Response Status:', response.status);
      console.log('📊 Iyzico Retrieve Response Body:', responseText);

      let iyzicoData;
      try {
        iyzicoData = JSON.parse(responseText);
        console.log('📊 Iyzico Retrieve Data:', iyzicoData);
      } catch (parseError) {
        console.error('❌ Failed to parse Iyzico retrieve response:', parseError);
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
        console.log('✅ Payment retrieved successfully!');
        console.log('💰 Payment Status:', iyzicoData.paymentStatus);
        console.log('💳 Payment ID:', iyzicoData.paymentId);

        // Here you can update your database with the payment status
        // Example: Update order status to 'paid' or 'failed'
        
        return NextResponse.json({
          success: true,
          paymentStatus: iyzicoData.paymentStatus,
          paymentId: iyzicoData.paymentId,
          conversationId: iyzicoData.conversationId,
          price: iyzicoData.price,
          paidPrice: iyzicoData.paidPrice,
          currency: iyzicoData.currency,
          installment: iyzicoData.installment,
          paymentStatus: iyzicoData.paymentStatus,
          fraudStatus: iyzicoData.fraudStatus,
          merchantCommissionRate: iyzicoData.merchantCommissionRate,
          merchantCommissionRateAmount: iyzicoData.merchantCommissionRateAmount,
          iyziCommissionRateAmount: iyzicoData.iyziCommissionRateAmount,
          iyziCommissionFee: iyzicoData.iyziCommissionFee,
          cardType: iyzicoData.cardType,
          cardAssociation: iyzicoData.cardAssociation,
          cardFamily: iyzicoData.cardFamily,
          cardToken: iyzicoData.cardToken,
          cardUserKey: iyzicoData.cardUserKey,
          binNumber: iyzicoData.binNumber,
          lastFourDigits: iyzicoData.lastFourDigits,
          basketId: iyzicoData.basketId
        });
      } else {
        console.error('❌ Iyzico retrieve failed:', iyzicoData);
        return NextResponse.json(
          { 
            error: 'Failed to retrieve payment details',
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
    console.error('Iyzico callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
