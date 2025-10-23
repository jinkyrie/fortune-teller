// Simple database connection test
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    // Test basic connection
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection successful!');
    
    // Test if tables exist
    const userCount = await prisma.user.count();
    console.log('✅ User table exists, count:', userCount);
    
  } catch (error) {
    console.log('❌ Database connection failed:');
    console.log('Error:', error.message);
    console.log('Code:', error.code);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
