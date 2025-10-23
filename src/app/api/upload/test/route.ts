import { NextRequest, NextResponse } from 'next/server';

// Test upload endpoint for when Cloudinary is not configured
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Return a mock URL for testing
    const mockUrl = `https://via.placeholder.com/800x600/6B46C1/D4AF37?text=${encodeURIComponent(file.name)}`;
    
    return NextResponse.json({
      success: true,
      url: mockUrl,
      public_id: `test-${Date.now()}`,
      test_mode: true
    });
  } catch (error) {
    console.error('Error in test upload:', error);
    return NextResponse.json(
      { error: 'Test upload failed' },
      { status: 500 }
    );
  }
}
