import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: process.env.S3_URL!,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.S3_END_POINT!,
        port: "",
        pathname: "/c446497/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "liara.ir",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "console.liara.ir",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  allowedDevOrigins: ["192.168.1.101"],
};

export default nextConfig;
