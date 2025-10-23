import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface EmailData {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export interface ReadingCompleteData {
  fullName: string;
  readingContent: string;
  orderId: string;
}

export interface QueuePositionData {
  fullName: string;
  position: number;
  estimatedWaitTime: number;
  orderId: string;
}

export interface OrderConfirmationData {
  fullName: string;
  orderId: string;
  queuePosition?: number;
  estimatedWaitTime?: number;
}

/**
 * Send email using Resend
 */
export async function sendEmail({ to, subject, template, data }: EmailData): Promise<void> {
  if (!resend) {
    console.log('Email not sent - Resend API key not configured');
    console.log('Email would be sent to:', to);
    console.log('Subject:', subject);
    console.log('Template:', template);
    console.log('Data:', data);
    return;
  }

  const html = generateEmailTemplate(template, data);

  await resend.emails.send({
    from: 'KahveYolu <noreply@kahveyolu.com>',
    to: [to],
    subject,
    html,
  });
}

/**
 * Generate email template based on type
 */
function generateEmailTemplate(template: string, data: Record<string, any>): string {
  const baseStyles = `
    <style>
      body { font-family: 'Georgia', serif; background: linear-gradient(135deg, #0B0C10 0%, #1a1a2e 100%); color: #F8F6F0; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { text-align: center; margin-bottom: 30px; }
      .logo { color: #D4AF37; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
      .mystical-border { border: 2px solid #D4AF37; border-radius: 10px; padding: 20px; margin: 20px 0; }
      .content { line-height: 1.6; margin: 20px 0; }
      .highlight { color: #D4AF37; font-weight: bold; }
      .footer { text-align: center; margin-top: 30px; color: #A8A8A8; font-size: 14px; }
      .button { display: inline-block; background: linear-gradient(45deg, #D4AF37, #B8860B); color: #000; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 0; }
    </style>
  `;

  switch (template) {
    case 'reading-complete':
      return generateReadingCompleteTemplate(data as ReadingCompleteData, baseStyles);
    
    case 'queue-position':
      return generateQueuePositionTemplate(data as QueuePositionData, baseStyles);
    
    case 'order-confirmation':
      return generateOrderConfirmationTemplate(data as OrderConfirmationData, baseStyles);
    
    case 'daily-limit-reached':
      return generateDailyLimitTemplate(data, baseStyles);
    
    default:
      return generateDefaultTemplate(data, baseStyles);
  }
}

/**
 * Generate reading completion email template
 */
function generateReadingCompleteTemplate(data: ReadingCompleteData, baseStyles: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Fortune Reading is Ready!</title>
      ${baseStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🔮 KahveYolu</div>
          <h1 style="color: #D4AF37; margin: 0;">Your Mystical Reading Awaits</h1>
        </div>
        
        <div class="mystical-border">
          <h2 style="color: #F8F6F0; margin-top: 0;">Dear ${data.fullName},</h2>
          <p class="content">The ancient spirits have spoken! Your personalized coffee cup reading is now ready for your discovery.</p>
          
          <div style="background: rgba(212, 175, 55, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #D4AF37; margin-top: 0;">Your Mystical Reading:</h3>
            <div style="white-space: pre-wrap; font-style: italic; line-height: 1.8;">${data.readingContent}</div>
          </div>
          
          <p class="content">This reading was crafted specifically for you based on the patterns and energies revealed in your coffee cup photos.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button">View in Dashboard</a>
        </div>
        
        <div class="footer">
          <p>Order ID: ${data.orderId}</p>
          <p>With mystical blessings,<br>The KahveYolu Team</p>
          <p style="font-size: 12px; color: #666;">© ${new Date().getFullYear()} KahveYolu. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate queue position email template
 */
function generateQueuePositionTemplate(data: QueuePositionData, baseStyles: string): string {
  const waitTimeHours = Math.floor(data.estimatedWaitTime / 60);
  const waitTimeMinutes = data.estimatedWaitTime % 60;
  const waitTimeText = waitTimeHours > 0 
    ? `${waitTimeHours} hour${waitTimeHours > 1 ? 's' : ''} and ${waitTimeMinutes} minute${waitTimeMinutes !== 1 ? 's' : ''}`
    : `${waitTimeMinutes} minute${waitTimeMinutes !== 1 ? 's' : ''}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Your Reading is in Queue</title>
      ${baseStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">☕ KahveYolu</div>
          <h1 style="color: #D4AF37; margin: 0;">Your Reading is in Queue</h1>
        </div>
        
        <div class="mystical-border">
          <h2 style="color: #F8F6F0; margin-top: 0;">Dear ${data.fullName},</h2>
          <p class="content">Your coffee cup reading has been added to our mystical queue. Our fortune teller will begin working on your reading soon.</p>
          
          <div style="background: rgba(212, 175, 55, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #D4AF37; margin-top: 0;">Queue Information</h3>
            <p style="font-size: 18px; margin: 10px 0;"><span class="highlight">Position:</span> #${data.position}</p>
            <p style="font-size: 18px; margin: 10px 0;"><span class="highlight">Estimated Wait:</span> ${waitTimeText}</p>
          </div>
          
          <p class="content">We'll notify you as soon as your reading is ready. Thank you for your patience as we prepare your mystical insights.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button">Check Status</a>
        </div>
        
        <div class="footer">
          <p>Order ID: ${data.orderId}</p>
          <p>With mystical blessings,<br>The KahveYolu Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate order confirmation email template
 */
function generateOrderConfirmationTemplate(data: OrderConfirmationData, baseStyles: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      ${baseStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">✨ KahveYolu</div>
          <h1 style="color: #D4AF37; margin: 0;">Order Confirmed</h1>
        </div>
        
        <div class="mystical-border">
          <h2 style="color: #F8F6F0; margin-top: 0;">Dear ${data.fullName},</h2>
          <p class="content">Your coffee cup reading order has been confirmed and is being prepared by our master fortune teller.</p>
          
          ${data.queuePosition ? `
          <div style="background: rgba(212, 175, 55, 0.1); padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #D4AF37; margin-top: 0;">Queue Status</h3>
            <p style="font-size: 18px; margin: 10px 0;"><span class="highlight">Position:</span> #${data.queuePosition}</p>
            <p style="font-size: 18px; margin: 10px 0;"><span class="highlight">Estimated Wait:</span> ${data.estimatedWaitTime} minutes</p>
          </div>
          ` : ''}
          
          <p class="content">You'll receive an email notification as soon as your reading is ready.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button">View Order</a>
        </div>
        
        <div class="footer">
          <p>Order ID: ${data.orderId}</p>
          <p>With mystical blessings,<br>The KahveYolu Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate daily limit reached email template
 */
function generateDailyLimitTemplate(data: any, baseStyles: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Daily Limit Reached</title>
      ${baseStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">⏰ KahveYolu</div>
          <h1 style="color: #D4AF37; margin: 0;">Daily Limit Reached</h1>
        </div>
        
        <div class="mystical-border">
          <h2 style="color: #F8F6F0; margin-top: 0;">Dear Seeker,</h2>
          <p class="content">We've reached our daily limit for coffee cup readings. Our fortune teller can only provide a limited number of readings each day to ensure the highest quality of mystical insights.</p>
          
          <p class="content">Please try again tomorrow when we'll be ready to serve you with fresh mystical energy.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}" class="button">Return Home</a>
        </div>
        
        <div class="footer">
          <p>With mystical blessings,<br>The KahveYolu Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate default email template
 */
function generateDefaultTemplate(data: Record<string, any>, baseStyles: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>KahveYolu Notification</title>
      ${baseStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🔮 KahveYolu</div>
        </div>
        
        <div class="mystical-border">
          <div class="content">
            ${JSON.stringify(data, null, 2)}
          </div>
        </div>
        
        <div class="footer">
          <p>With mystical blessings,<br>The KahveYolu Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
