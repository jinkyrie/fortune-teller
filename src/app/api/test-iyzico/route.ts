import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const hasApiKey = !!process.env.IYZICO_API_KEY;
    const hasSecretKey = !!process.env.IYZICO_SECRET_KEY;
    const sandboxMode = process.env.IYZICO_SANDBOX_MODE === 'true';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    return NextResponse.json({
      success: true,
      environment: {
        hasApiKey,
        hasSecretKey,
        sandboxMode,
        baseUrl,
        apiKeyPrefix: process.env.IYZICO_API_KEY?.substring(0, 10) + '...',
        secretKeyPrefix: process.env.IYZICO_SECRET_KEY?.substring(0, 10) + '...'
      },
      endpoints: {
        sandbox: 'https://sandbox-api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize',
        production: 'https://api.iyzipay.com/v2/payment/iyzipos/checkoutform/initialize'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}