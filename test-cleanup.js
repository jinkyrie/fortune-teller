#!/usr/bin/env node

/**
 * Test Cleanup Endpoint
 * Tests the automated cleanup system
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3001';
const CRON_SECRET = process.env.CRON_SECRET || 'test-secret';

async function testCleanup() {
  console.log('🧪 Testing automated cleanup endpoint...');
  console.log(`🌐 URL: ${BASE_URL}/api/cron/cleanup`);
  console.log(`🔑 Secret: ${CRON_SECRET}`);
  console.log('');

  try {
    const url = new URL(`${BASE_URL}/api/cron/cleanup`);
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch(url.toString(), options);
    const data = await response.json();

    if (response.ok) {
      console.log('✅ Cleanup test successful!');
      console.log('📊 Results:');
      console.log(`   Success: ${data.success}`);
      console.log(`   Message: ${data.message}`);
      console.log(`   Deleted: ${data.deletedCount || 0} images`);
      console.log(`   Processed: ${data.processedOrders || 0} orders`);
      console.log(`   Errors: ${data.errorCount || 0}`);
      console.log(`   Timestamp: ${data.timestamp}`);
    } else {
      console.log('❌ Cleanup test failed!');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('💥 Test error:', error.message);
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testCleanup();
}

module.exports = { testCleanup };
