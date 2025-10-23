import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CleanupService {
  private static instance: CleanupService;
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): CleanupService {
    if (!CleanupService.instance) {
      CleanupService.instance = new CleanupService();
    }
    return CleanupService.instance;
  }

  async start(daysOld: number = 14, intervalHours: number = 24) {
    if (this.isRunning) {
      console.log('🧹 Cleanup service is already running');
      return;
    }

    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.log('⚠️ DATABASE_URL not found, skipping cleanup service');
      return;
    }

    console.log('🔍 DATABASE_URL found:', process.env.DATABASE_URL.substring(0, 20) + '...');

    console.log(`🚀 Starting automated cleanup service...`);
    console.log(`📅 Will delete images older than ${daysOld} days`);
    console.log(`⏰ Running every ${intervalHours} hours`);

    this.isRunning = true;

    // Run immediately on start
    await this.runCleanup(daysOld);

    // Schedule recurring cleanup
    const intervalMs = intervalHours * 60 * 60 * 1000; // Convert hours to milliseconds
    this.intervalId = setInterval(async () => {
      await this.runCleanup(daysOld);
    }, intervalMs);

    console.log('✅ Cleanup service started successfully');
  }

  async stop() {
    if (!this.isRunning) {
      console.log('🧹 Cleanup service is not running');
      return;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.isRunning = false;
    console.log('🛑 Cleanup service stopped');
  }

  private async runCleanup(daysOld: number) {
    try {
      console.log(`🧹 Running automated cleanup at ${new Date().toISOString()}`);

      // Check if database is available
      if (!process.env.DATABASE_URL) {
        console.log('⚠️ DATABASE_URL not set, skipping cleanup');
        return;
      }

      // Calculate cutoff date
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      console.log(`📅 Deleting images older than: ${cutoffDate.toISOString()}`);

      // Find completed orders older than cutoff
      const oldOrders = await prisma.order.findMany({
        where: {
          orderStatus: 'completed',
          completedAt: {
            lt: cutoffDate
          }
        },
        select: {
          id: true,
          photos: true,
          completedAt: true
        }
      }).catch((error) => {
        console.log('💥 Database connection error:', error.message);
        return [];
      });

      console.log(`📋 Found ${oldOrders.length} old completed orders`);

      if (oldOrders.length === 0) {
        console.log('✨ No old images to clean up');
        return;
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
                const publicId = this.extractPublicId(photoUrl);
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

      console.log(`🎉 Cleanup completed! Deleted ${deletedCount} images, ${errorCount} errors`);

    } catch (error) {
      console.error('💥 Cleanup service error:', error);
      // Don't throw error to prevent build failure
    }
  }

  private extractPublicId(url: string): string | null {
    try {
      // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.jpg
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|gif|webp)$/i);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      hasInterval: this.intervalId !== null
    };
  }
}
