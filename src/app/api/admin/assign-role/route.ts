import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Admin assign-role endpoint is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('Assign role API called');
    
    const body = await request.json();
    console.log('Received body:', body);
    
    const { userId, role } = body;
    
    if (!userId || !role) {
      console.log('Missing userId or role');
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    console.log(`Attempting to assign role "${role}" to user ${userId}`);

    // Check if CLERK_SECRET_KEY is available
    if (!process.env.CLERK_SECRET_KEY) {
      console.error('CLERK_SECRET_KEY not found');
      return NextResponse.json(
        { error: 'CLERK_SECRET_KEY not configured' },
        { status: 500 }
      );
    }

    // Update user metadata with role using Clerk API
    const response = await fetch(
      `https://api.clerk.dev/v1/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_metadata: { role },
        }),
      }
    );

    console.log('Clerk API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update user metadata:", errorText);
      return NextResponse.json(
        { error: 'Failed to update user metadata', details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log(`Successfully assigned role "${role}" to user ${userId}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Role "${role}" assigned successfully`,
      user: result
    });

  } catch (error) {
    console.error('Error assigning role:', error);
    return NextResponse.json(
      { 
        error: 'Failed to assign role', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
