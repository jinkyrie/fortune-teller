import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    await requireAuth();
    
    // Get user info from auth
    const { sessionClaims } = await auth();
    
    // Get email from session claims
    const userEmail = sessionClaims?.email || 
                     sessionClaims?.email_addresses?.[0]?.email_address ||
                     sessionClaims?.primary_email_address?.email_address;

    console.log('🔍 User Orders API: Session claims:', sessionClaims);
    console.log('🔍 User Orders API: User email:', userEmail);

    if (!userEmail) {
      console.log('❌ User Orders API: No email found in session claims');
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

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

