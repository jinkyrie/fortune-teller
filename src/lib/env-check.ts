// Environment variable validation for deployment
export function validateEnvironment() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Please set these variables in your deployment environment');
  }

  return missingVars.length === 0;
}

// Check environment on import
if (typeof window === 'undefined') {
  validateEnvironment();
}
