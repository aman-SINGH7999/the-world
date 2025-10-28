import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", /* add other hosts if needed */],
  },
  // ...other config
};

export default nextConfig;
