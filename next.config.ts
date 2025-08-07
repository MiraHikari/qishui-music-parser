import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // ignore lint
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
