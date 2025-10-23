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
  // Force clean builds
  experimental: {
    forceSwcTransforms: true,
  },
};

export default nextConfig;
