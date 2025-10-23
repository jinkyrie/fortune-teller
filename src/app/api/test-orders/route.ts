import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    await requireAuth();
    
    // Get user info from currentUser
    const user = await currentUser();
    
    // Get email from user object
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    console.log('🔍 Test Orders API: User object:', user);
    console.log('🔍 Test Orders API: User email:', userEmail);

    if (!userEmail) {
      console.log('❌ Test Orders API: No email found in session claims');
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: {
        email: userEmail
      },
      select: {
        id: true,
        fullName: true,
        orderStatus: true,
        createdAt: true,
        completedAt: true,
        queuePosition: true,
        estimatedWaitTime: true,
        paymentStatus: true,
        photos: true,
        readingContent: true,
        readingNotes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('✅ Test Orders API: Found orders:', orders.length);

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching test orders:', error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch test orders' },
      { status: 500 }
    );
  }
}
