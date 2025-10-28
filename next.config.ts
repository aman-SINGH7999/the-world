import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow all https domains
      },
      {
        protocol: "http",
        hostname: "**", // (optional) allow http too
      },
    ],
    // Optional: disable strict optimization if image URLs are unpredictable
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // ...other config
};

export default nextConfig;
