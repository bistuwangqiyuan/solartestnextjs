import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navigation, NavigationSpacer } from '@/components/layout/navigation'
import '../styles/industrial.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | 光伏测试系统',
    default: '光伏关断器负载电压电流测试与数据管理系统',
  },
  description: '工业级光伏测试与数据管理平台',
  keywords: ['光伏测试', 'Modbus RTU', '数据管理', '实时监控'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body className={`${inter.className} antialiased bg-industrial-dark text-foreground`}>
        <div className="relative min-h-screen">
          {/* Grid Pattern Background */}
          <div className="fixed inset-0 grid-pattern opacity-10" />
          
          {/* Noise Overlay */}
          <div className="fixed inset-0 noise-overlay" />
          
          {/* Navigation */}
          <Navigation />
          
          {/* Main Content */}
          <div className="relative z-10">
            <NavigationSpacer />
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}