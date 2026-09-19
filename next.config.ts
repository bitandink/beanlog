import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/writings/:path*",
        destination: "https://bitandink.vercel.app/",
        permanent: true,
      },
      {
        source: "/studio/:path*",
        destination: "https://bitandink.github.io/portfolio-2026/",
        permanent: true,
      },
      {
        source: "/portfolio/:path*",
        destination: "https://bitandink.github.io/portfolio-2026/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
