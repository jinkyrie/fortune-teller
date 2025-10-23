import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { readingContent, readingNotes, resendEmail } = await request.json();

    // Require authentication
    await requireAuth();

    // Update the order with reading content and notes
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        readingContent: readingContent || undefined,
        readingNotes: readingNotes || undefined,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        readingContent: true,
        readingNotes: true,
        orderStatus: true
      }
    });

    // If resendEmail is true and readingContent exists, send the reading to customer
    if (resendEmail && readingContent && updatedOrder.email) {
      try {
        await sendEmail({
          to: updatedOrder.email,
          subject: `Your Fortune Reading is Ready - ${updatedOrder.fullName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0B0C10 0%, #1a1a2e 100%); color: #ffffff; padding: 20px; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #D4AF37; font-size: 28px; margin-bottom: 10px;">🔮 Your Fortune Reading</h1>
                <p style="color: #888; font-size: 16px;">Dear ${updatedOrder.fullName}, your coffee cup reading is ready!</p>
              </div>
              
              <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid #D4AF37; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h2 style="color: #D4AF37; font-size: 20px; margin-bottom: 15px;">📖 Your Reading</h2>
                <div style="line-height: 1.6; font-size: 16px; white-space: pre-wrap;">${readingContent}</div>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #888; font-size: 14px;">Thank you for choosing KahveYolu for your mystical journey.</p>
                <p style="color: #D4AF37; font-size: 16px; font-weight: bold;">✨ May the coffee grounds guide your path ✨</p>
              </div>
            </div>
          `
        });
        console.log('✅ Reading email sent successfully to:', updatedOrder.email);
      } catch (emailError) {
        console.error('❌ Failed to send reading email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      emailSent: resendEmail && readingContent ? true : false
    });

  } catch (error) {
    console.error('Error updating reading:', error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update reading' },
      { status: 500 }
    );
  }
}
