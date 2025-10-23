import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addToQueue } from '@/lib/queue';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const merchantOid = formData.get('merchant_oid') as string;
    const status = formData.get('status') as string;
    const totalAmount = formData.get('total_amount') as string;
    const hash = formData.get('hash') as string;

    // Verify hash
    const merchantSalt = process.env.PAYTR_MERCHANT_SALT;
    const merchantKey = process.env.PAYTR_MERCHANT_KEY;
    const hashString = `${merchantOid}${merchantKey}${merchantSalt}${status}${totalAmount}`;
    const calculatedHash = crypto.createHash('sha256').update(hashString).digest('base64');

    if (hash !== calculatedHash) {
      return NextResponse.json(
        { error: 'Invalid hash' },
        { status: 400 }
      );
    }

    if (status === 'success') {
      // Find order by merchant_oid
      const order = await prisma.order.findUnique({
        where: { id: merchantOid }
      });

      if (order) {
        // Update order status
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'completed',
            orderStatus: 'queued', // Add to queue
            paidAmount: parseFloat(totalAmount) / 100, // Convert from kuruş
            paymentCurrency: 'TRY'
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

        return NextResponse.json({ status: 'OK' });
      }
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error) {
    console.error('PayTR webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
