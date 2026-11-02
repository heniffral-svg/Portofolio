import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the Z.ai preview sandbox domain to access the Next.js dev server
  // without raising the cross-origin dev warning.
  allowedDevOrigins: [
    "*.space-z.ai",
    "*.chatglm.cn",
    "localhost",
    "127.0.0.1",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
