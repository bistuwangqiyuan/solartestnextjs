import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/components/providers/toast-provider';
import './globals.css';
import '../styles/industrial.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '光伏测试系统',
  description: '专业的光伏组件测试与数据分析平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="grid-background"></div>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}