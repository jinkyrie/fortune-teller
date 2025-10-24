import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      IYZICO_API_KEY: process.env.IYZICO_API_KEY ? 'Set' : 'Missing',
      IYZICO_SECRET_KEY: process.env.IYZICO_SECRET_KEY ? 'Set' : 'Missing',
      IYZICO_SANDBOX_MODE: process.env.IYZICO_SANDBOX_MODE,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
    };

    console.log('🔍 Environment Check:', envCheck);

    return NextResponse.json({
      success: true,
      message: 'Environment variables check',
      environment: envCheck
    });
  } catch (error) {
    console.error('❌ Environment check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
