/**
 * Configuration file for iyzico payment integration
 * Handles sandbox vs production environment settings
 */

const config = {
  // Environment detection
  isProduction: process.env.NODE_ENV === 'production',
  isSandbox: process.env.IYZICO_SANDBOX_MODE === 'true' || process.env.NODE_ENV !== 'production',
  
  // Iyzico API endpoints
  iyzico: {
    sandbox: {
      baseUrl: 'https://sandbox-api.iyzipay.com',
      checkoutForm: 'https://sandbox-api.iyzipay.com/payment/iyzipos/checkoutform/initialize',
      payment: 'https://sandbox-api.iyzipay.com/payment/auth'
    },
    production: {
      baseUrl: 'https://api.iyzipay.com',
      checkoutForm: 'https://api.iyzipay.com/payment/iyzipos/checkoutform/initialize',
      payment: 'https://api.iyzipay.com/payment/auth'
    }
  },
  
  // Payment settings
  payment: {
    currency: 'TRY',
    locale: 'tr',
    installment: '1',
    paymentChannel: 'WEB',
    paymentGroup: 'PRODUCT',
    enabledInstallments: ['2', '3', '6', '9']
  },
  
  // Security settings
  security: {
    timeout: 30000, // 30 seconds
    maxRetries: 3
  }
};

/**
 * Get the appropriate iyzico configuration based on environment
 */
function getIyzicoConfig() {
  return config.isSandbox ? config.iyzico.sandbox : config.iyzico.production;
}

/**
 * Get current environment info
 */
function getEnvironmentInfo() {
  return {
    isProduction: config.isProduction,
    isSandbox: config.isSandbox,
    baseUrl: getIyzicoConfig().baseUrl,
    environment: process.env.NODE_ENV || 'development'
  };
}

module.exports = {
  config,
  getIyzicoConfig,
  getEnvironmentInfo
};
