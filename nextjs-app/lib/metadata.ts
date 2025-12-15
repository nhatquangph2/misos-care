/**
 * Metadata Utilities for SEO
 * Generate dynamic metadata for different pages
 */

import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://misos-care.vercel.app';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'MisosCare - Khám phá tính cách và sức khỏe tinh thần',
    template: '%s | MisosCare',
  },
  description: 'Ứng dụng đánh giá tính cách và sức khỏe tinh thần toàn diện với Miso. Làm test MBTI, Big Five, PHQ-9, GAD-7 và nhận tư vấn cá nhân hóa.',
  keywords: [
    'tâm lý',
    'sức khỏe tinh thần',
    'tính cách',
    'MBTI',
    'Big Five',
    'PHQ-9',
    'GAD-7',
    'DASS-21',
    'trầm cảm',
    'lo âu',
    'stress',
    'tư vấn tâm lý'
  ],
  authors: [{ name: 'MisosCare Team' }],
  creator: 'MisosCare',
  publisher: 'MisosCare',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: baseUrl,
    title: 'MisosCare - Khám phá tính cách và sức khỏe tinh thần',
    description: 'Ứng dụng đánh giá tính cách và sức khỏe tinh thần toàn diện với Miso',
    siteName: 'MisosCare',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'MisosCare - Miso the Dolphin',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MisosCare - Khám phá tính cách và sức khỏe tinh thần',
    description: 'Ứng dụng đánh giá tính cách và sức khỏe tinh thần toàn diện với Miso',
    images: ['/api/og'],
    creator: '@misoscare',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

/**
 * Generate metadata for test result pages
 */
export function generateTestResultMetadata(params: {
  testType: string;
  testName: string;
  result?: string;
  score?: number;
  description?: string;
}): Metadata {
  const { testType, testName, result, score, description } = params;

  let title = `Kết quả ${testName}`;
  let desc = description || `Xem kết quả chi tiết bài test ${testName} của bạn`;

  if (result) {
    title = `Tôi thuộc nhóm ${result} - ${testName}`;
    desc = `Khám phá tính cách ${result} và nhận tư vấn cá nhân hóa từ MisosCare`;
  }

  if (score !== undefined) {
    title = `Điểm ${testName}: ${score}`;
    desc = `Xem phân tích chi tiết điểm ${score} trong bài test ${testName}`;
  }

  const ogImageUrl = `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(desc)}&type=${testType}`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [ogImageUrl],
    },
  };
}

/**
 * Generate metadata for profile page
 */
export function generateProfileMetadata(userName?: string): Metadata {
  const title = userName ? `Hồ sơ của ${userName}` : 'Hồ sơ của tôi';
  const description = 'Quản lý tính cách, theo dõi sức khỏe tinh thần và nhận đề xuất cá nhân hóa';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ['/api/og?title=' + encodeURIComponent(title)],
    },
  };
}

/**
 * Generate metadata for test pages
 */
export function generateTestMetadata(testName: string, testDescription: string): Metadata {
  return {
    title: `Làm test ${testName}`,
    description: testDescription,
    openGraph: {
      title: `Làm test ${testName} - MisosCare`,
      description: testDescription,
      images: ['/api/og?title=' + encodeURIComponent(testName) + '&type=test'],
    },
  };
}
