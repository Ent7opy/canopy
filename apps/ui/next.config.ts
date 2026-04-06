import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enable static export for GitHub Pages
  basePath: process.env.NODE_ENV === "production" ? "/life-dashboard" : "",
  trailingSlash: true,
};

export default nextConfig;
