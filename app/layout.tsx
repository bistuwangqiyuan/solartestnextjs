import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/providers/toast-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';
import '../styles/industrial.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://pv-testing-system.netlify.app'),
  title: {
    default: '光伏测试系统 - 专业光伏组件性能测试与数据分析平台',
    template: '%s | 光伏测试系统',
  },
  description: '光伏测试系统是一套面向光伏组件性能测试与数据分析的专业化软件平台，支持实时监控、数据采集、性能分析和测试管理。采用Modbus TCP/RTU协议，提供完整的太阳能电池板测试解决方案。',
  keywords: [
    '光伏测试',
    '光伏组件测试',
    '太阳能电池板测试',
    'PV测试系统',
    '光伏性能分析',
    'I-V特性曲线',
    'Modbus协议',
    '数据采集系统',
    '光伏监控',
    '太阳能测试',
    '光伏效率分析',
    '电池板性能测试',
    '光伏数据分析',
    '太阳能组件检测',
  ],
  authors: [{ name: '光伏测试系统开发团队' }],
  creator: '光伏测试系统开发团队',
  publisher: '光伏测试系统',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://pv-testing-system.netlify.app',
    siteName: '光伏测试系统',
    title: '光伏测试系统 - 专业光伏组件性能测试与数据分析平台',
    description: '专业的光伏组件测试与数据分析平台，支持实时监控、数据采集、性能分析和测试管理。采用Modbus协议，提供完整的太阳能电池板测试解决方案。',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '光伏测试系统',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '光伏测试系统 - 专业光伏组件性能测试与数据分析平台',
    description: '专业的光伏组件测试与数据分析平台，支持实时监控、数据采集、性能分析和测试管理。',
    images: ['/images/twitter-image.jpg'],
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://pv-testing-system.netlify.app',
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '光伏测试系统',
    description: '专业的光伏组件测试与数据分析平台',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    author: {
      '@type': 'Organization',
      name: '光伏测试系统开发团队',
    },
  };

  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="grid-background"></div>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}