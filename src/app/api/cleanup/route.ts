import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';

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
      return NextResponse.json(
        { error: 'Cloudinary not configured' },
        { status: 500 }
      );
    }

    // Calculate date 2 weeks ago
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    console.log(`Cleaning up images older than: ${twoWeeksAgo.toISOString()}`);

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

    console.log(`Found ${oldOrders.length} old completed orders`);

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
              // Extract public_id from Cloudinary URL
              const publicId = extractPublicId(photoUrl);
              if (publicId) {
                await cloudinary.uploader.destroy(publicId);
                deletedCount++;
                console.log(`Deleted image: ${publicId}`);
              }
            } catch (photoError) {
              console.error(`Error deleting photo ${photoUrl}:`, photoError);
              errorCount++;
            }
          }

          // Clear photos from database
          await prisma.order.update({
            where: { id: order.id },
            data: { photos: '[]' }
          });

          console.log(`Cleared photos for order ${order.id}`);
        }
      } catch (orderError) {
        console.error(`Error processing order ${order.id}:`, orderError);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleanup completed. Deleted ${deletedCount} images, ${errorCount} errors`,
      deletedCount,
      errorCount,
      processedOrders: oldOrders.length
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Cleanup failed' },
      { status: 500 }
    );
  }
}

// Helper function to extract public_id from Cloudinary URL
function extractPublicId(url: string): string | null {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|gif|webp)$/i);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// GET endpoint to check cleanup status
export async function GET() {
  try {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const oldOrders = await prisma.order.count({
      where: {
        orderStatus: 'completed',
        completedAt: {
          lt: twoWeeksAgo
        }
      }
    });

    return NextResponse.json({
      oldOrdersCount: oldOrders,
      cutoffDate: twoWeeksAgo.toISOString(),
      message: `Found ${oldOrders} completed orders older than 2 weeks`
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check cleanup status' },
      { status: 500 }
    );
  }
}
