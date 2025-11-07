import type { NextConfig } from "next";

const getApiConfig: any = () => {
  if (process.env.NODE_ENV === 'production') {
    const apiUrl = new URL(process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000');
    return {
      protocol: apiUrl.protocol.replace(':', ''),
      hostname: apiUrl.hostname,
      port: apiUrl.port || (apiUrl.protocol === 'https:' ? '443' : '80'),
      pathname: '/uploads/**',
    };
  }

  return {
    protocol: 'http',
    hostname: 'localhost',
    port: '4000',
    pathname: '/uploads/**',
  };
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [getApiConfig()],
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;