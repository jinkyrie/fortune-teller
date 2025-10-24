import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentMethod } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
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

    // Iyzico iyzilink API integration
    const iyzicoRequest = {
      locale: 'tr',
      conversationId: orderId,
      currencyCode: 'TRY',
      name: `Fortune Reading - ${order.fullName}`,
      description: `Personalized fortune reading for ${order.fullName}`,
      price: process.env.PAYMENT_AMOUNT || '50.00',
      stockEnabled: false,
      installmentRequested: 'false',
      addressIgnorable: 'true'
    };

    // Determine API endpoint based on sandbox mode
    const isSandbox = process.env.IYZICO_SANDBOX_MODE === 'true';
    const apiUrl = isSandbox 
      ? 'https://sandbox-api.iyzipay.com/v2/iyzilink/products'
      : 'https://api.iyzipay.com/v2/iyzilink/products';

    console.log(`🔗 Using Iyzico ${isSandbox ? 'Sandbox' : 'Production'} API: ${apiUrl}`);

    // Create iyzilink product
    const iyzicoResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `IYZWS ${process.env.IYZICO_API_KEY}:${process.env.IYZICO_SECRET_KEY}`
      },
      body: JSON.stringify(iyzicoRequest)
    });

    const iyzicoData = await iyzicoResponse.json();

    if (iyzicoData.status === 'success') {
      // Update order with payment URL
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentUrl: iyzicoData.url,
          paymentToken: iyzicoData.token,
          paymentProvider: 'iyzico'
        }
      });

      return NextResponse.json({
        success: true,
        paymentUrl: iyzicoData.url,
        token: iyzicoData.token
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to create payment link' },
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
