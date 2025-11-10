import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  webpack: (config) => {
    // Ignore Firebase Functions directory during Next.js build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/functions/**']
    };
    
    // Exclude functions directory from compilation
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      'firebase-functions': false,
      'firebase-admin': false
    };
    
    return config;
  }
};

export default nextConfig;
