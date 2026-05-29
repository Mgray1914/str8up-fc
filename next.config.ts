import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'x402-fetch': false,
    };
    return config;
  },
};
export default nextConfig;
