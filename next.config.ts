import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  transpilePackages: ['three'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
