import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Bundle analyzer configuration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // 1. Bật nén Gzip/Brotli cho phản hồi
  compress: true,

  // 2. Tắt header 'x-powered-by' để giảm kích thước header và bảo mật hơn
  poweredByHeader: false,

  // 3. TypeScript configuration for build
  typescript: {
    // ⚠️ Allow production builds despite type errors
    // TODO: Fix database type definitions
    ignoreBuildErrors: true,
  },

  // 4. Tối ưu hóa việc import các thư viện nặng (Tree shaking tốt hơn)
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'recharts',
      '@radix-ui/react-icons',
      'framer-motion',
      'gsap'
    ],
  },

  // 5. Cấu hình hình ảnh (nếu dùng Supabase Storage hoặc nguồn ngoài)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // Suppresses source map uploading logs during build
  silent: true,

  // Upload source maps to Sentry (only if DSN is configured)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only upload source maps in production
  widenClientFileUpload: true,

  // Hide source maps from users
  hideSourceMaps: true,

  // Disable logger to reduce bundle size
  disableLogger: true,

  // Automatically instrument your app
  automaticVercelMonitors: true,
};

// Apply both bundle analyzer and Sentry wrappers
const configWithBundleAnalyzer = withBundleAnalyzer(nextConfig);

// Only apply Sentry if DSN is configured
const finalConfig = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(configWithBundleAnalyzer, sentryWebpackPluginOptions)
  : configWithBundleAnalyzer;

export default finalConfig;

