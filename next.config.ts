import type { NextConfig } from "next";

const isCloudflarePages = !!process.env.CF_PAGES;

const nextConfig: NextConfig = {
  images: {
    unoptimized: isCloudflarePages,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
    ],
  },
};

export default nextConfig;
