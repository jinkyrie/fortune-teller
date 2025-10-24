// Environment variable validation for deployment
export function validateEnvironment() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY'
  ];

  const optionalEnvVars = [
    'IYZICO_API_KEY',
    'IYZICO_SECRET_KEY',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'RESEND_API_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  const missingOptional = optionalEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing required environment variables: ${missingVars.join(', ')}`);
    console.warn('Please set these variables in your deployment environment');
  }

  if (missingOptional.length > 0) {
    console.info(`ℹ️ Optional environment variables not set: ${missingOptional.join(', ')}`);
    console.info('These are needed for full functionality (payments, image uploads, emails)');
  }

  // Check if Iyzico is configured
  if (process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY) {
    console.info('✅ Iyzico payment gateway configured');
    if (process.env.IYZICO_SANDBOX_MODE === 'true') {
      console.info('🧪 Iyzico sandbox mode enabled');
    }
  }

  return missingVars.length === 0;
}

// Check environment on import
if (typeof window === 'undefined') {
  validateEnvironment();
}
