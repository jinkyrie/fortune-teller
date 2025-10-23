import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      // Fallback to test mode if Cloudinary not configured
      console.log('Cloudinary not configured, using test mode');
      return NextResponse.json(
        { 
          error: 'Cloudinary not configured. Using test mode.',
          test_mode: true,
          url: 'https://via.placeholder.com/800x600/6B46C1/D4AF37?text=Test+Image',
          public_id: `test-${Date.now()}`
        },
        { status: 200 }
      );
    }

    // Check if using placeholder values
    if (process.env.CLOUDINARY_CLOUD_NAME === 'your-cloud-name' || 
        process.env.CLOUDINARY_API_KEY === 'your-api-key' || 
        process.env.CLOUDINARY_API_SECRET === 'your-api-secret') {
      // Return test mode for placeholder values
      console.log('Cloudinary using placeholder values, using test mode');
      return NextResponse.json(
        { 
          error: 'Cloudinary using placeholder values. Using test mode.',
          test_mode: true,
          url: 'https://via.placeholder.com/800x600/6B46C1/D4AF37?text=Test+Image',
          public_id: `test-${Date.now()}`
        },
        { status: 200 }
      );
    }

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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'kahveyolu-readings',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    if (!(result as any)?.secure_url) {
      throw new Error('No URL returned from Cloudinary');
    }

    return NextResponse.json({
      success: true,
      url: (result as any).secure_url,
      public_id: (result as any).public_id
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

