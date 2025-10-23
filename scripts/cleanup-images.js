#!/usr/bin/env node

/**
 * Image Cleanup Script
 * Deletes images older than 2 weeks from Cloudinary
 * Run this script daily via cron job or scheduler
 */

const https = require('https');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function runCleanup() {
  try {
    console.log('🧹 Starting image cleanup...');
    console.log(`📅 Time: ${new Date().toISOString()}`);
    
    const response = await fetch(`${BASE_URL}/api/cleanup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Cleanup completed successfully!');
      console.log(`📊 Deleted ${result.deletedCount} images`);
      console.log(`📋 Processed ${result.processedOrders} orders`);
      if (result.errorCount > 0) {
        console.log(`⚠️  ${result.errorCount} errors occurred`);
      }
    } else {
      console.error('❌ Cleanup failed:', result.error);
    }
  } catch (error) {
    console.error('💥 Cleanup script error:', error.message);
    process.exit(1);
  }
}

// Run cleanup if this script is executed directly
if (require.main === module) {
  runCleanup();
}

module.exports = { runCleanup };
