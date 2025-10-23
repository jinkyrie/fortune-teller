const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Check if any admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists! Only one admin is allowed.');
      console.log('Existing admin email:', existingAdmin.email);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@kahveyolu.com',
        password: hashedPassword,
        fullName: 'KahveYolu Admin',
        role: 'admin'
      }
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@kahveyolu.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('Note: Only one admin user is allowed for security.');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
