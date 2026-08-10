<<<<<<< HEAD
=======
import path from "path";

>>>>>>> 16b60b7223b54292e5de029a84d46750664b96e1
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

<<<<<<< HEAD
=======
  turbopack: {
    root: path.resolve(process.cwd(), "../.."),
  },

>>>>>>> 16b60b7223b54292e5de029a84d46750664b96e1
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
