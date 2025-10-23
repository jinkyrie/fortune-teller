import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { updateQueuePositions, getQueuePosition } from '@/lib/queue';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, age, maritalStatus, gender, email, photos, paymentStatus } = body;

    // Authenticate user but don't link to local User table for now
    await requireAuth();
    
    // Get user info for logging
    const user = await currentUser();
    console.log('✅ Test Order creation: Using userId: null (no foreign key constraint)');
    console.log('🔍 Test Order creation: User email:', user?.primaryEmailAddress?.emailAddress);
    
    const order = await prisma.order.create({
      data: {
        userId: null, // Don't link to local User table for now
        fullName,
        age: parseInt(age),
        maritalStatus,
        gender,
        email,
        photos: JSON.stringify(photos),
        paymentStatus: 'completed', // Disable paywall for now
        orderStatus: 'queued',
        paidAmount: 0, // No payment required
        paymentCurrency: 'TRY'
      }
    });

    console.log('✅ Test Order created:', order.id);

    // Add to queue and get position
    let queuePosition;
    try {
      // First, update all existing queue positions
      await updateQueuePositions();
      
      // Then get the position for this order
      const position = await getQueuePosition(order.id);
      
      if (position) {
        // Update the order with the calculated position
        await prisma.order.update({
          where: { id: order.id },
          data: {
            queuePosition: position.position,
            estimatedWaitTime: position.estimatedWaitTime
          }
        });
        queuePosition = position;
        console.log('✅ Test Order added to queue with position:', queuePosition);
      } else {
        throw new Error('Failed to calculate queue position');
      }
    } catch (queueError) {
      console.error('Queue error (non-fatal):', queueError);
      // Continue without queue position if queue fails
      queuePosition = { position: 1, estimatedWaitTime: 30 };
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        queuePosition: queuePosition.position,
        estimatedWaitTime: queuePosition.estimatedWaitTime
      }
    });
  } catch (error) {
    console.error('Error creating test order:', error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create test order' },
      { status: 500 }
    );
  }
}
