import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  turbopack: {
    root: path.resolve(process.cwd(), "../.."),
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "azzunique-fintech-node.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "framerusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
