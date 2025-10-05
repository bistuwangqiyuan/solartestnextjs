import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '登录',
  description: '登录光伏测试系统，访问专业的光伏组件测试与数据分析平台。支持实时监控、数据采集、性能分析和测试管理。',
  openGraph: {
    title: '登录 | 光伏测试系统',
    description: '登录光伏测试系统，访问专业的光伏组件测试与数据分析平台。',
  },
  alternates: {
    canonical: '/login',
  },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}

