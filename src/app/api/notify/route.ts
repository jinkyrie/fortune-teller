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
      subject = 'Your Fortune Reading is Ready - KahveYolu';
      html = `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0B0C10 0%, #1a1a2e 100%); color: #F8F6F0; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #D4AF37; font-size: 28px; margin-bottom: 10px;">☕ KahveYolu</h1>
            <h2 style="color: #D4AF37; margin: 0;">Your Mystical Reading Is Ready</h2>
          </div>
          
          <div style="background: rgba(212, 175, 55, 0.1); border: 2px solid #D4AF37; border-radius: 10px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #D4AF37; margin-top: 0;">Dear Seeker,</h3>
            <p style="line-height: 1.6; margin: 15px 0;">The ancient spirits have spoken! Your personalized coffee cup reading has been completed and is ready for your discovery.</p>
            <p style="line-height: 1.6; margin: 15px 0;">This reading was crafted specifically for you based on the patterns and energies revealed in your coffee cup photos.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/status/${orderId}" style="display: inline-block; background: linear-gradient(45deg, #D4AF37, #B8860B); color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Your Reading</a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #A8A8A8; font-size: 14px;">
            <p>Order ID: ${orderId}</p>
            <p>With mystical blessings,<br>The KahveYolu Team</p>
            <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} KahveYolu. All rights reserved.</p>
          </div>
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
