import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { orderStatus } = await request.json();
    
    const order = await prisma.order.update({
      where: { id },
      data: {
        orderStatus,
        completedAt: orderStatus === 'completed' ? new Date() : null
      }
    });

    // TODO: Send notification email if order is completed
    if (orderStatus === 'completed') {
      // Trigger email notification
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: id,
          email: order.email,
          type: 'completion'
        })
      }).catch(console.error);
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}

