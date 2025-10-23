import { prisma } from './prisma';

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    // Simple query to test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection healthy');
    return true;
  } catch (error) {
    console.log('💥 Database health check failed:', error);
    return false;
  }
}

export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🔧 Initializing database...');
    
    // Check if tables exist by trying to query them
    await prisma.user.findFirst();
    await prisma.order.findFirst();
    
    console.log('✅ Database tables are ready');
  } catch (error) {
    console.log('⚠️ Database not ready, tables may need to be created');
    console.log('Error:', error);
  }
}
