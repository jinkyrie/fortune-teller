import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🧪 Creating test order for payment flow...');
    
    // Create a test order
    const testOrder = await prisma.order.create({
      data: {
        email: 'test@example.com',
        fullName: 'Test User',
        phoneNumber: '+905551234567',
        birthDate: '1990-01-01',
        birthTime: '10:30',
        birthPlace: 'Istanbul',
        question: 'Test fortune reading',
        status: 'pending',
        readingType: 'basic'
      }
    });

    console.log('✅ Test order created:', testOrder.id);

    // Now test the payment creation
    const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/create/iyzico`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: testOrder.id,
        paymentMethod: 'iyzico'
      })
    });

    const paymentResult = await paymentResponse.json();
    
    console.log('📊 Payment API Response:', {
      status: paymentResponse.status,
      result: paymentResult
    });

    return NextResponse.json({
      success: true,
      testOrder: {
        id: testOrder.id,
        email: testOrder.email,
        status: testOrder.status
      },
      paymentResult: {
        status: paymentResponse.status,
        data: paymentResult
      }
    });

  } catch (error) {
    console.error('❌ Test payment flow error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
