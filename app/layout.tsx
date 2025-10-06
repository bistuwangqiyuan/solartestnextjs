import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/providers/toast-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';
import '../styles/industrial.css';

const inter = Inter({ 
  subsets: ['latin'], 
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://pv-testing-system.netlify.app'),
  title: {
    default: '光伏测试系统 - 专业光伏组件性能测试与数据分析平台 | PV Testing System',
    template: '%s | 光伏测试系统',
  },
  description: '光伏测试系统是一套面向光伏组件性能测试与数据分析的专业化软件平台，支持实时监控、数据采集、性能分析和测试管理。采用Modbus TCP/RTU协议，提供完整的太阳能电池板测试解决方案。具备I-V特性曲线绘制、最大功率点追踪、效率分析等核心功能。',
  keywords: [
    '光伏测试',
    '光伏组件测试',
    '太阳能电池板测试',
    'PV测试系统',
    '光伏性能分析',
    'I-V特性曲线',
    'P-V曲线',
    'Modbus协议',
    'Modbus TCP',
    'Modbus RTU',
    '数据采集系统',
    '光伏监控',
    '太阳能测试',
    '光伏效率分析',
    '电池板性能测试',
    '光伏数据分析',
    '太阳能组件检测',
    'MPPT测试',
    '光伏实验平台',
    '组件测试仪',
    '光伏检测设备',
    '太阳能发电测试',
    '光伏电站监控',
    '新能源测试',
  ],
  authors: [{ name: '光伏测试系统开发团队', url: 'https://pv-testing-system.netlify.app' }],
  creator: '光伏测试系统开发团队',
  publisher: '光伏测试系统',
  applicationName: '光伏测试系统',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
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
    description: '专业的光伏组件测试与数据分析平台，支持实时监控、数据采集、性能分析和测试管理。采用Modbus协议，提供完整的太阳能电池板测试解决方案。具备I-V特性曲线绘制、MPPT追踪、效率分析等核心功能。',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: '光伏测试系统 - 专业的光伏组件性能测试平台',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '光伏测试系统 - 专业光伏组件性能测试与数据分析平台',
    description: '专业的光伏组件测试与数据分析平台，支持实时监控、数据采集、性能分析和测试管理。采用Modbus协议提供完整解决方案。',
    images: ['/images/twitter-image.png'],
    creator: '@PVTestingSystem',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
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
    languages: {
      'zh-CN': 'https://pv-testing-system.netlify.app',
    },
  },
  category: 'technology',
  classification: 'Business Software, Testing Tools, Monitoring System',
  archives: ['https://pv-testing-system.netlify.app'],
  assets: ['https://pv-testing-system.netlify.app'],
  bookmarks: ['https://pv-testing-system.netlify.app'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: '光伏测试系统',
    statusBarStyle: 'black-translucent',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
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
    alternateName: 'PV Testing System',
    description: '专业的光伏组件测试与数据分析平台，支持实时监控、数据采集、性能分析和测试管理',
    url: 'https://pv-testing-system.netlify.app',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Testing & Monitoring Software',
    operatingSystem: 'Web Browser, Windows, macOS, Linux',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: '光伏测试系统开发团队',
      url: 'https://pv-testing-system.netlify.app',
    },
    creator: {
      '@type': 'Organization',
      name: '光伏测试系统开发团队',
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString(),
    inLanguage: 'zh-CN',
    keywords: '光伏测试,太阳能电池板,性能分析,Modbus,数据采集,I-V曲线',
    featureList: [
      '实时监控',
      '数据采集',
      'I-V特性曲线分析',
      'P-V曲线分析',
      'MPPT追踪',
      '性能报告生成',
      '历史数据管理',
      'Modbus TCP/RTU协议支持',
    ],
    screenshot: 'https://pv-testing-system.netlify.app/images/og-image.png',
  };

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '光伏测试系统',
    url: 'https://pv-testing-system.netlify.app',
    logo: 'https://pv-testing-system.netlify.app/favicon.svg',
    description: '专业的光伏组件测试与数据分析平台提供商',
    sameAs: [],
  };

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '光伏测试系统',
    url: 'https://pv-testing-system.netlify.app',
    description: '专业的光伏组件测试与数据分析平台',
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://pv-testing-system.netlify.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: 'https://pv-testing-system.netlify.app',
      },
    ],
  };

  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
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