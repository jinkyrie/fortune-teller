import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getQueueStats, addToQueue, updateQueuePositions, getQueuePosition } from '@/lib/queue';
import { sendEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Orders API: Starting authentication check');
    
    // Require any authenticated user (not just admin for testing)
    const { userId } = await requireAuth();
    console.log('✅ Orders API: User authenticated:', userId);
    
    console.log('🔍 Orders API: Querying database...');
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        fullName: true,
        age: true,
        maritalStatus: true,
        gender: true,
        email: true,
        photos: true,
        paymentStatus: true,
        orderStatus: true,
        createdAt: true,
        completedAt: true,
        paymentProvider: true,
        paidAmount: true,
        paymentCurrency: true,
        readingContent: true,
        readingNotes: true,
        queuePosition: true,
        estimatedWaitTime: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('📊 Orders API: Found', orders.length, 'orders');
    return NextResponse.json(orders);
  } catch (error) {
    console.error('❌ Orders API Error:', error);
    if (error instanceof Error && error.message === "Unauthorized") {
      console.log('🚫 Orders API: Auth error:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, age, maritalStatus, gender, email, photos, paymentStatus } = body;

    // User authentication will be handled later when creating the order

    // Check daily order limit and queue status (temporarily disabled)
    let queueStats;
    try {
      queueStats = await getQueueStats();
    } catch (queueStatsError) {
      console.error('Queue stats error (non-fatal):', queueStatsError);
      // Use default stats if queue stats fail
      queueStats = {
        totalInQueue: 0,
        estimatedWaitTime: 30,
        dailyLimit: 100,
        dailyOrders: 0,
        canAcceptNewOrders: true
      };
    }
    
    // Temporarily disable daily limit check
    // if (!queueStats.canAcceptNewOrders) {
    //   return NextResponse.json(
    //     { 
    //       error: 'Daily order limit reached. Please try again tomorrow.',
    //       queueStats 
    //     },
    //     { status: 429 }
    //   );
    // }

    // Authenticate user but don't link to local User table for now
    await requireAuth();
    console.log('✅ Order creation: Using userId: null (no foreign key constraint)');
    
    const order = await prisma.order.create({
      data: {
        userId: null, // Don't link to local User table for now
        fullName,
        age: parseInt(age),
        maritalStatus,
        gender,
        email,
        photos: JSON.stringify(photos),
        paymentStatus: 'pending', // Enable payment processing
        orderStatus: 'pending_payment',
        paidAmount: 0,
        paymentCurrency: 'TRY'
      }
    });

    console.log(`✅ Order created: ${order.id} with status: pending_payment`);

    // Email will be sent after successful payment

    return NextResponse.json({
      orderId: order.id,
      status: 'pending_payment',
      message: 'Order created successfully. Please proceed with payment.'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
