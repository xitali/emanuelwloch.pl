import previewRedirects from "./src/lib/project-preview-redirects.json";
import type { NextConfig } from "next";

const scriptSource =
  process.env.NODE_ENV === "development"
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

const contentSecurityPolicy = [
  "default-src 'self'",
  scriptSource,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https://i.ibb.co https://image2url.com https://*.r2.dev https://*.public.blob.vercel-storage.com",
  "font-src 'self'",
  "connect-src 'self' https://blob.vercel-storage.com https://*.blob.vercel-storage.com",
  "media-src 'self' https://*.public.blob.vercel-storage.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "kamera\\.emanuelwloch\\.pl" }],
        destination: "https://kamera-brama.tailcc6301.ts.net/",
        permanent: false,
      },
      ...previewRedirects.map(rule => ({ ...rule, permanent: true })),
      { source: "/opengraph-image.jpg", destination: "/og/strony-i-aplikacje-9dac8276.jpg", permanent: true },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'image2url.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-fa4842ac95b845ba9f2a3b9aa7bf24ae.r2.dev',
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      }
    ],
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
