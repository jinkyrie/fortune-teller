import { CleanupService } from './cleanup-service';

class BackgroundServices {
  private static instance: BackgroundServices;
  private cleanupService: CleanupService;

  private constructor() {
    this.cleanupService = CleanupService.getInstance();
  }

  static getInstance(): BackgroundServices {
    if (!BackgroundServices.instance) {
      BackgroundServices.instance = new BackgroundServices();
    }
    return BackgroundServices.instance;
  }

  async startAll() {
    console.log('🚀 Starting all background services...');

    try {
      // Start image cleanup service
      // Runs every 24 hours, deletes images older than 14 days
      await this.cleanupService.start(14, 24);
      
      console.log('✅ All background services started successfully');
    } catch (error) {
      console.error('❌ Error starting background services:', error);
    }
  }

  async stopAll() {
    console.log('🛑 Stopping all background services...');

    try {
      await this.cleanupService.stop();
      console.log('✅ All background services stopped');
    } catch (error) {
      console.error('❌ Error stopping background services:', error);
    }
  }

  getStatus() {
    return {
      cleanup: this.cleanupService.getStatus()
    };
  }
}

export default BackgroundServices;
