import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderStatus: true,
        queuePosition: true,
        estimatedWaitTime: true,
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // If order is not in queue, return current status
    if (order.orderStatus !== 'queued') {
      return NextResponse.json({
        position: 0,
        estimatedWaitTime: 0,
        status: order.orderStatus
      });
    }

    // Return queue position
    return NextResponse.json({
      position: order.queuePosition || 0,
      estimatedWaitTime: order.estimatedWaitTime || 0,
      status: order.orderStatus
    });

  } catch (error) {
    console.error('Error fetching queue position:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue position' },
      { status: 500 }
    );
  }
}
