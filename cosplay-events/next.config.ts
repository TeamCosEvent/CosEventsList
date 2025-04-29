import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "example.com", // If your images are stored here
      },
      {
        protocol: "https",
        hostname: "your-other-image-source.com", // Add any other sources if needed
      },
    ],
  },
};

export default nextConfig;
