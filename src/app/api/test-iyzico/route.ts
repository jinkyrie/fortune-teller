import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    // Check if Iyzico credentials are configured
    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Iyzico credentials not configured',
        hasApiKey: !!process.env.IYZICO_API_KEY,
        hasSecretKey: !!process.env.IYZICO_SECRET_KEY
      });
    }

    // Test authentication signature generation
    const testPayload = 'test-payload';
    const randomKey = new Date().getTime() + Math.random().toString(36).substring(2, 15);
    const payload = randomKey + '/test' + testPayload;
    const hash = crypto.createHash('sha1').update(payload).digest('hex');
    const authorizationString = `apiKey:${process.env.IYZICO_API_KEY}&randomKey:${randomKey}&signature:${hash}`;
    const base64Auth = Buffer.from(authorizationString).toString('base64');

    return NextResponse.json({
      success: true,
      credentials: {
        hasApiKey: !!process.env.IYZICO_API_KEY,
        hasSecretKey: !!process.env.IYZICO_SECRET_KEY,
        apiKeyLength: process.env.IYZICO_API_KEY?.length || 0,
        secretKeyLength: process.env.IYZICO_SECRET_KEY?.length || 0
      },
      authentication: {
        randomKey,
        hash,
        authString: authorizationString,
        base64Auth,
        fullAuth: `IYZWSv2 ${base64Auth}`
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        sandboxMode: process.env.IYZICO_SANDBOX_MODE,
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL
      }
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}