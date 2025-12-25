import type { NextConfig } from "next";

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

  export default withBundleAnalyzer(nextConfig);
