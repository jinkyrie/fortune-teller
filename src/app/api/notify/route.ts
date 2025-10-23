import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  try {
    const { orderId, email, type } = await request.json();

    let subject = '';
    let html = '';

    if (type === 'confirmation') {
      subject = 'Your Reading Has Begun';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #D4AF37; text-align: center;">KahveYolu</h1>
          <h2 style="color: #F8F6F0;">Your Mystical Journey Begins</h2>
          <p style="color: #A8A8A8;">Dear Seeker,</p>
          <p style="color: #A8A8A8;">Your coffee reading is being prepared by our master fortune teller. Your mystical insights will be ready within 40 minutes.</p>
          <p style="color: #A8A8A8;">Order ID: ${orderId}</p>
          <p style="color: #A8A8A8;">Thank you for choosing KahveYolu for your spiritual journey!</p>
        </div>
      `;
    } else if (type === 'completion') {
      subject = 'Your Coffee Reading Is Ready';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #D4AF37; text-align: center;">KahveYolu</h1>
          <h2 style="color: #F8F6F0;">Your Mystical Reading Is Ready</h2>
          <p style="color: #A8A8A8;">Dear Seeker,</p>
          <p style="color: #A8A8A8;">Your personalized mystical reading has been completed. The ancient wisdom awaits your discovery.</p>
          <p style="color: #A8A8A8;">Order ID: ${orderId}</p>
          <p style="color: #A8A8A8;">With mystical blessings,<br>The KahveYolu Team</p>
        </div>
      `;
    }

    if (resend) {
      await resend.emails.send({
        from: 'KahveYolu <noreply@kahveyolu.com>',
        to: [email],
        subject,
        html,
      });
    } else {
      console.log('Email not sent - Resend API key not configured');
      console.log('Email would be sent to:', email);
      console.log('Subject:', subject);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
