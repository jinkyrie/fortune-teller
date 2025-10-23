import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getQueueStats, getQueueOrders, processNextOrder, completeOrder, cancelOrder } from '@/lib/queue';

/**
 * Get queue statistics and orders
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    
    const [stats, orders] = await Promise.all([
      getQueueStats(),
      getQueueOrders()
    ]);

    return NextResponse.json({
      stats,
      orders
    });
  } catch (error) {
    console.error('Error fetching queue data:', error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch queue data' },
      { status: 500 }
    );
  }
}

/**
 * Process next order in queue
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    
    const body = await request.json();
    const { action, orderId, readingContent, readingNotes } = body;

    switch (action) {
      case 'process_next':
        const nextOrderId = await processNextOrder();
        if (!nextOrderId) {
          return NextResponse.json(
            { error: 'No orders in queue' },
            { status: 404 }
          );
        }
        return NextResponse.json({ 
          success: true, 
          orderId: nextOrderId,
          message: 'Next order is now being processed'
        });

      case 'complete':
        if (!orderId || !readingContent) {
          return NextResponse.json(
            { error: 'Order ID and reading content are required' },
            { status: 400 }
          );
        }
        
        await completeOrder(orderId, readingContent, readingNotes);
        return NextResponse.json({ 
          success: true,
          message: 'Order completed and notification sent'
        });

      case 'cancel':
        if (!orderId) {
          return NextResponse.json(
            { error: 'Order ID is required' },
            { status: 400 }
          );
        }
        
        await cancelOrder(orderId);
        return NextResponse.json({ 
          success: true,
          message: 'Order cancelled and queue updated'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing queue action:', error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to process queue action' },
      { status: 500 }
    );
  }
}
