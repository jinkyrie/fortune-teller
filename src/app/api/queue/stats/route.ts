import { NextRequest, NextResponse } from 'next/server';
import { getQueueStats } from '@/lib/queue';

/**
 * Get queue statistics for public access (no admin required)
 */
export async function GET(request: NextRequest) {
  try {
    const stats = await getQueueStats();
    
    return NextResponse.json({
      canAcceptNewOrders: stats.canAcceptNewOrders,
      totalInQueue: stats.totalInQueue,
      estimatedWaitTime: stats.estimatedWaitTime,
      dailyLimit: stats.dailyLimit,
      dailyOrders: stats.dailyOrders
    });
  } catch (error) {
    console.error('Error fetching queue stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue statistics' },
      { status: 500 }
    );
  }
}
