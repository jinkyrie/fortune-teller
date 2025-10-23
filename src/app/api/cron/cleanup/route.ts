import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// This endpoint can be called by external cron services
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a legitimate cron service
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🧹 Starting automated cleanup via cron...');
    
    // Calculate date 2 weeks ago
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    console.log(`📅 Deleting images older than: ${twoWeeksAgo.toISOString()}`);

    // Find completed orders older than 2 weeks
    const oldOrders = await prisma.order.findMany({
      where: {
        orderStatus: 'completed',
        completedAt: {
          lt: twoWeeksAgo
        }
      },
      select: {
        id: true,
        photos: true,
        completedAt: true
      }
    });

    console.log(`📋 Found ${oldOrders.length} old completed orders`);

    if (oldOrders.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No old images to clean up',
        deletedCount: 0,
        processedOrders: 0
      });
    }

    let deletedCount = 0;
    let errorCount = 0;

    // Process each old order
    for (const order of oldOrders) {
      try {
        if (order.photos) {
          const photoUrls = JSON.parse(order.photos);
          
          // Delete each photo from Cloudinary
          for (const photoUrl of photoUrls) {
            try {
              const publicId = extractPublicId(photoUrl);
              if (publicId) {
                await cloudinary.uploader.destroy(publicId);
                deletedCount++;
                console.log(`🗑️  Deleted image: ${publicId}`);
              }
            } catch (photoError) {
              console.error(`❌ Error deleting photo ${photoUrl}:`, photoError);
              errorCount++;
            }
          }

          // Clear photos from database
          await prisma.order.update({
            where: { id: order.id },
            data: { photos: '[]' }
          });

          console.log(`✅ Cleared photos for order ${order.id}`);
        }
      } catch (orderError) {
        console.error(`❌ Error processing order ${order.id}:`, orderError);
        errorCount++;
      }
    }

    const result = {
      success: true,
      message: `Cleanup completed. Deleted ${deletedCount} images, ${errorCount} errors`,
      deletedCount,
      errorCount,
      processedOrders: oldOrders.length,
      timestamp: new Date().toISOString()
    };

    console.log('🎉 Cleanup completed:', result);
    return NextResponse.json(result);

  } catch (error) {
    console.error('💥 Cleanup error:', error);
    return NextResponse.json(
      { 
        error: 'Cleanup failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Helper function to extract public_id from Cloudinary URL
function extractPublicId(url: string): string | null {
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|gif|webp)$/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
