import { prisma } from './prisma';
import { sendEmail } from './email';

export interface QueueStats {
  totalInQueue: number;
  estimatedWaitTime: number;
  dailyLimit: number;
  dailyOrders: number;
  canAcceptNewOrders: boolean;
}

export interface QueuePosition {
  position: number;
  estimatedWaitTime: number;
}

/**
 * Get current queue statistics
 */
export async function getQueueStats(): Promise<QueueStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get orders in queue (queued + in_progress)
  const queueOrders = await prisma.order.count({
    where: {
      orderStatus: {
        in: ['queued', 'in_progress']
      }
    }
  });

  // Get today's orders
  const todayOrders = await prisma.order.count({
    where: {
      createdAt: {
        gte: today,
        lt: tomorrow
      }
    }
  });

  const dailyLimit = parseInt(process.env.DAILY_ORDER_LIMIT || '10');
  const estimatedWaitTime = queueOrders * 30; // 30 minutes per reading

  return {
    totalInQueue: queueOrders,
    estimatedWaitTime,
    dailyLimit,
    dailyOrders: todayOrders,
    canAcceptNewOrders: todayOrders < dailyLimit
  };
}

/**
 * Get queue position for a specific order
 */
export async function getQueuePosition(orderId: string): Promise<QueuePosition | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { createdAt: true, orderStatus: true }
  });

  if (!order || order.orderStatus === 'completed' || order.orderStatus === 'cancelled') {
    return null;
  }

  // Count orders created before this one that are still in queue
  const position = await prisma.order.count({
    where: {
      createdAt: {
        lt: order.createdAt
      },
      orderStatus: {
        in: ['queued', 'in_progress']
      }
    }
  }) + 1;

  const estimatedWaitTime = (position - 1) * 30; // 30 minutes per reading

  return {
    position,
    estimatedWaitTime
  };
}

/**
 * Add order to queue and assign position
 */
export async function addToQueue(orderId: string): Promise<QueuePosition> {
  // Get the order to verify it exists and is queued
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { orderStatus: true, createdAt: true }
  });

  if (!order || order.orderStatus !== 'queued') {
    throw new Error('Order not found or not eligible for queue');
  }

  // Update all queue positions to ensure correct ordering
  await updateQueuePositions();
  
  // Get the updated order with queue position
  const updatedOrder = await prisma.order.findUnique({
    where: { id: orderId },
    select: { queuePosition: true, estimatedWaitTime: true }
  });

  if (!updatedOrder || !updatedOrder.queuePosition) {
    throw new Error('Failed to assign queue position');
  }

  const position = {
    position: updatedOrder.queuePosition,
    estimatedWaitTime: updatedOrder.estimatedWaitTime || 0
  };

  return position;
}

/**
 * Move to next order in queue
 */
export async function processNextOrder(): Promise<string | null> {
  // Find the next order in queue
  const nextOrder = await prisma.order.findFirst({
    where: {
      orderStatus: 'queued'
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  if (!nextOrder) {
    return null;
  }

  // Update order status to in_progress
  await prisma.order.update({
    where: { id: nextOrder.id },
    data: {
      orderStatus: 'in_progress',
      startedAt: new Date()
    }
  });

  // Update queue positions for remaining orders
  await updateQueuePositions();

  return nextOrder.id;
}

/**
 * Complete an order and send notification
 */
export async function completeOrder(orderId: string, readingContent: string, readingNotes?: string): Promise<void> {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      orderStatus: 'completed',
      completedAt: new Date(),
      readingContent,
      readingNotes
    }
  });

  // Update remaining queue positions
  await updateQueuePositions();

  // Send completion email notification
  await sendCompletionNotification(orderId);
}

/**
 * Update queue positions for all queued orders
 */
export async function updateQueuePositions(): Promise<void> {
  const queuedOrders = await prisma.order.findMany({
    where: {
      orderStatus: 'queued'
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  for (let i = 0; i < queuedOrders.length; i++) {
    const position = i + 1;
    const estimatedWaitTime = i * 30; // 30 minutes per reading

    await prisma.order.update({
      where: { id: queuedOrders[i].id },
      data: {
        queuePosition: position,
        estimatedWaitTime
      }
    });
  }
}

/**
 * Send completion notification email
 */
async function sendCompletionNotification(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true }
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // Use the imported sendEmail function
  
  await sendEmail({
    to: order.email,
    subject: 'Your Fortune Reading is Ready! 🔮',
    template: 'reading-complete',
    data: {
      fullName: order.fullName,
      readingContent: order.readingContent,
      orderId: order.id
    }
  });
}

/**
 * Get all orders in queue for admin panel
 */
export async function getQueueOrders() {
  return await prisma.order.findMany({
    where: {
      orderStatus: {
        in: ['queued', 'in_progress']
      }
    },
    orderBy: {
      createdAt: 'asc'
    },
    include: {
      user: true
    }
  });
}

/**
 * Cancel an order and update queue
 */
export async function cancelOrder(orderId: string): Promise<void> {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      orderStatus: 'cancelled'
    }
  });

  // Update queue positions
  await updateQueuePositions();
}
