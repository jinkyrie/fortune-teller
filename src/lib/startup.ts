import BackgroundServices from './background-services';

// Global variable to track if services are started
let servicesStarted = false;

export async function startBackgroundServices() {
  if (servicesStarted) {
    console.log('🔄 Background services already started');
    return;
  }

  try {
    console.log('🚀 Initializing background services...');
    
    const services = BackgroundServices.getInstance();
    await services.startAll();
    
    servicesStarted = true;
    console.log('✅ Background services initialized successfully');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('🛑 Received SIGINT, shutting down services...');
      await services.stopAll();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('🛑 Received SIGTERM, shutting down services...');
      await services.stopAll();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start background services:', error);
  }
}

// Auto-start services when this module is imported
if (typeof window === 'undefined') { // Only run on server side
  startBackgroundServices();
}
