import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Iyzipay from 'iyzipay';

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

    // Initialize Iyzico client
    const isSandbox = process.env.IYZICO_SANDBOX_MODE === 'true';
    const iyzipay = new Iyzipay({
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      uri: isSandbox ? 'https://sandbox-api.iyzipay.com' : 'https://api.iyzipay.com'
    });

    console.log('🔍 Iyzico Payment Debug:', {
      orderId,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      hasApiKey: !!process.env.IYZICO_API_KEY,
      hasSecretKey: !!process.env.IYZICO_SECRET_KEY,
      sandboxMode: isSandbox
    });

    // Create Iyzico checkout form request
    const price = process.env.PAYMENT_AMOUNT || '50.00';
    const request = {
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

    console.log('📤 Creating Iyzico checkout form...');

    // Create checkout form using official Iyzico client
    const checkoutFormInitialize = await new Promise((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(request, (err, result) => {
        if (err) {
          console.error('❌ Iyzico API Error:', err);
          reject(err);
        } else {
          console.log('📊 Iyzico Response:', result);
          resolve(result);
        }
      });
    });

    if (checkoutFormInitialize.status === 'success') {
      // Update order with payment URL
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentUrl: checkoutFormInitialize.paymentPageUrl,
          paymentToken: checkoutFormInitialize.token,
          paymentProvider: 'iyzico'
        }
      });

      return NextResponse.json({
        success: true,
        paymentUrl: checkoutFormInitialize.paymentPageUrl,
        token: checkoutFormInitialize.token
      });
    } else {
      console.error('❌ Iyzico API failed:', checkoutFormInitialize);
      return NextResponse.json(
        { 
          error: 'Failed to create payment link',
          details: checkoutFormInitialize.errorMessage || 'Unknown error'
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
