import { redirect } from 'next/navigation';

export default function Home() {
  // 去掉权限管理，直接跳转到仪表板
  redirect('/dashboard');
}