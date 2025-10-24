import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Production optimizations
  compress: true,
  // Skip source maps in production
  productionBrowserSourceMaps: false,
  // Optimize images
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
  },
  // Fix Permissions-Policy headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ]
      }
    ];
  },
  // Force clean builds
};

export default nextConfig;
