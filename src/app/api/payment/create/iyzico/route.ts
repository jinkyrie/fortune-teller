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

    // Iyzico Pay with Iyzico API integration
    const price = process.env.PAYMENT_AMOUNT || '50.00';
    const iyzicoRequest = {
      locale: 'tr',
      conversationId: orderId,
      price: price,
      paidPrice: price,
      currency: 'TRY',
      installment: '1',
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      enabledInstallments: ['2', '3', '6', '9'],
      buyer: {
        id: order.email,
        name: order.fullName,
        surname: order.fullName,
        gsmNumber: '+905551234567',
        email: order.email,
        identityNumber: '11111111111',
        lastLoginDate: new Date().toISOString().split('T')[0] + ' 10:30:00',
        registrationDate: new Date().toISOString().split('T')[0] + ' 10:30:00',
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

    // Determine API endpoint based on sandbox mode
    const isSandbox = process.env.IYZICO_SANDBOX_MODE === 'true';
    const apiUrl = isSandbox 
      ? 'https://sandbox-api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize/auth'
      : 'https://api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize/auth';

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
    
    console.log('📊 Iyzico API Response:', {
      status: iyzicoResponse.status,
      data: iyzicoData
    });

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
          details: iyzicoData.errorMessage || 'Unknown error'
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
