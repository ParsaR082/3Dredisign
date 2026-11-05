import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  transpilePackages: ['three'],
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'three', '@react-three/drei', 'framer-motion'],
  },
  async redirects() {
    return [
      {
        source: '/about/',
        destination: '/about-us/',
        permanent: true,
      },
      {
        source: '/contact/',
        destination: '/contact-us/',
        permanent: true,
      },
      {
        source: '/services/web/',
        destination: '/web-design-urmia/',
        permanent: true,
      },
      {
        source: '/services/teaser/',
        destination: '/video-teaser-urmia/',
        permanent: true,
      },
      {
        source: '/services/video/',
        destination: '/video-teaser-urmia/',
        permanent: true,
      },
      {
        source: '/services/content/',
        destination: '/content-production-urmia/',
        permanent: true,
      },
      {
        source: '/services/billboard/',
        destination: '/billboard-urmia/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
