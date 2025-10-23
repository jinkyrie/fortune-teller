import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addToQueue } from '@/lib/queue';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, status, paymentId, paidPrice, currency, installment, paymentStatus } = body;

    // Verify webhook signature (implement proper verification based on Iyzico docs)
    // For now, we'll process the webhook

    if (status === 'success' && paymentStatus === 'SUCCESS') {
      // Find order by token
      const order = await prisma.order.findFirst({
        where: { paymentToken: token }
      });

      if (order) {
        // Update order status
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'completed',
            orderStatus: 'queued', // Add to queue
            paymentId: paymentId,
            paidAmount: parseFloat(paidPrice),
            paymentCurrency: currency,
            installmentCount: installment || 1
          }
        });

        // Add to queue and get position
        try {
          const queuePosition = await addToQueue(order.id);
          
          // Send queue position email
          await sendEmail({
            to: order.email,
            subject: 'Your Reading is in Queue - KahveYolu',
            template: 'queue-position',
            data: {
              fullName: order.fullName,
              position: queuePosition.position,
              estimatedWaitTime: queuePosition.estimatedWaitTime,
              orderId: order.id
            }
          });
        } catch (queueError) {
          console.error('Failed to add order to queue:', queueError);
        }

        return NextResponse.json({ status: 'success' });
      }
    }

    return NextResponse.json({ status: 'ignored' });
  } catch (error) {
    console.error('Iyzico webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
