import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pedklfcjgygiazzhpqtk.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wow.zamimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "warcraft.wiki.gg",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60,
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Enable production source maps for better debugging
  productionBrowserSourceMaps: true,
  // Enable compression
  compress: true,
};

export default nextConfig;
