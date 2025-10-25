import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  try {
    console.log('🧪 Testing iyzico authentication...');
    
    // Check credentials
    if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Missing iyzico credentials',
        hasApiKey: !!process.env.IYZICO_API_KEY,
        hasSecretKey: !!process.env.IYZICO_SECRET_KEY
      });
    }

    // Test authentication signature generation
    const testPayload = JSON.stringify({ test: 'data' });
    const randomKey = new Date().getTime() + Math.random().toString(36).substring(2, 15);
    const uriPath = '/payment/iyzipos/checkoutform/initialize';
    const payload = randomKey + uriPath + testPayload;
    
    console.log('🔐 Generating test signature...');
    console.log('Payload:', payload);
    
    const hash = crypto.createHmac('sha1', process.env.IYZICO_SECRET_KEY!).update(payload).digest('hex');
    const authorizationString = `apiKey:${process.env.IYZICO_API_KEY}&randomKey:${randomKey}&signature:${hash}`;
    const base64Auth = Buffer.from(authorizationString).toString('base64');
    const fullAuth = `IYZWSv2 ${base64Auth}`;

    console.log('✅ Authentication test successful');

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
        fullAuth
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        sandboxMode: process.env.IYZICO_SANDBOX_MODE,
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL
      }
    });
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}
