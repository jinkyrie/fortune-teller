import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    hasIyzicoApiKey: !!process.env.IYZICO_API_KEY,
    hasIyzicoSecretKey: !!process.env.IYZICO_SECRET_KEY,
    sandboxMode: process.env.IYZICO_SANDBOX_MODE === 'true'
  });
}
