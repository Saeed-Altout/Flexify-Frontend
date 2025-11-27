import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // SEO Optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rmisrftwsxvfyiaqzndh.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/service-images/**",
      },
      {
        protocol: "https",
        hostname: "rmisrftwsxvfyiaqzndh.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/avatars/**",
      },
      {
        protocol: "https",
        hostname: "rmisrftwsxvfyiaqzndh.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/testimonial-avatars/**",
      },
      {
        protocol: "https",
        hostname: "rmisrftwsxvfyiaqzndh.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/project-images/**",
      },
      {
        protocol: "https",
        hostname: "rmisrftwsxvfyiaqzndh.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/project-thumbnails/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Headers for SEO and Security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: "./messages/en.json",
  },
});
export default withNextIntl(nextConfig);
