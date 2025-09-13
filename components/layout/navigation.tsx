'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Database, 
  FlaskConical, 
  Monitor, 
  BarChart3, 
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '仪表板', href: '/dashboard', icon: LayoutDashboard },
  { name: '数据管理', href: '/data', icon: Database },
  { name: '实验管理', href: '/experiment', icon: FlaskConical },
  { name: '实时监控', href: '/monitor', icon: Monitor },
  { name: '数据分析', href: '/analysis', icon: BarChart3 },
  { name: '系统设置', href: '/settings', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const { user, signOut } = useAuthStore();

  return (
    <nav className="bg-[var(--bg-secondary)] border-r border-[var(--border)]">
      <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--border)]">
        <Link href="/dashboard" className="flex items-center space-x-2 no-underline">
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">PV</span>
          </div>
          <span className="text-xl font-bold text-[var(--text-primary)]">光伏测试系统</span>
        </Link>
      </div>

      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-all no-underline',
                      isActive
                        ? 'bg-[var(--primary)] text-white'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-[var(--border)] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[var(--text-secondary)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {user?.email || '用户'}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {user?.role === 'admin' ? '管理员' : 
                   user?.role === 'operator' ? '操作员' : '观察员'}
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">退出登录</span>
          </button>
        </div>
      </div>
    </nav>
  );
}