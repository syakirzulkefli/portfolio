import type { NextConfig } from "next";

const isCloudflarePages = !!process.env.CF_PAGES;

const nextConfig: NextConfig = {
  images: {
    unoptimized: isCloudflarePages,
  },
};

export default nextConfig;
