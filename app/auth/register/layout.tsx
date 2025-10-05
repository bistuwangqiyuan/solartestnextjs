import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '注册账号',
  description: '注册光伏测试系统账号，开始使用专业的光伏组件测试与数据分析功能。',
  openGraph: {
    title: '注册账号 | 光伏测试系统',
    description: '注册光伏测试系统账号，开始使用专业的光伏组件测试与数据分析功能。',
  },
  alternates: {
    canonical: '/auth/register',
  },
};

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}

