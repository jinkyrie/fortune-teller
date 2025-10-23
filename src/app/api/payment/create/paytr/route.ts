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

    const merchantId = process.env.PAYTR_MERCHANT_ID;
    const merchantKey = process.env.PAYTR_MERCHANT_KEY;
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT;
    
    if (!merchantId || !merchantKey || !merchantSalt) {
      return NextResponse.json(
        { error: 'PayTR configuration missing' },
        { status: 500 }
      );
    }
    
    const amount = parseFloat(process.env.PAYMENT_AMOUNT || '50.00') * 100; // Convert to kuruş
    const currency = process.env.PAYMENT_CURRENCY || 'TL';
    const orderIdStr = orderId;
    const userIp = '127.0.0.1'; // In production, get from request
    const userEmail = order.email;
    const userName = order.fullName;
    const userAddress = 'N/A';
    const userPhone = 'N/A';
    const merchantOid = orderId;
    const paymentAmount = amount.toString();
    const paytrToken = `${merchantId}${userIp}${merchantOid}${userEmail}${paymentAmount}${userName}${userAddress}${userPhone}${merchantSalt}`;
    const paytrTokenHash = crypto.createHash('sha256').update(paytrToken).digest('base64');

    const paytrRequest = {
      merchant_id: merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email: userEmail,
      payment_amount: paymentAmount,
      paytr_token: paytrTokenHash,
      user_basket: JSON.stringify([{
        name: 'Fortune Reading',
        price: paymentAmount,
        quantity: 1
      }]),
      debug_on: '1',
      no_installment: '0',
      max_installment: '0',
      user_name: userName,
      user_address: userAddress,
      user_phone: userPhone,
      merchant_ok_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      merchant_fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/fail`,
      timeout_limit: '30',
      currency: currency
    };

    // Create PayTR payment
    const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(paytrRequest)
    });

    const paytrData = await paytrResponse.json();

    if (paytrData.status === 'success') {
      // Update order with payment token
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentToken: paytrData.token,
          paymentProvider: 'paytr'
        }
      });

      return NextResponse.json({
        success: true,
        token: paytrData.token,
        paymentUrl: `https://www.paytr.com/odeme/guvenli/${paytrData.token}`
      });
    } else {
      return NextResponse.json(
        { error: paytrData.reason || 'Failed to create payment' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('PayTR payment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
