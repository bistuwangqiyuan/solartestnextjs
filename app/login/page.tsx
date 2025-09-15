'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth-store';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, error, isLoading, clearError, checkAuth, user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 自动检查认证状态，所有人都可以使用
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 如果用户已登录，重定向到仪表板
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="industrial-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">PV</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">光伏测试系统</h1>
            <p className="text-[var(--text-secondary)] mt-2">请登录以继续</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                邮箱地址
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                  className="industrial-input pl-10"
                  placeholder="user@example.com"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError();
                  }}
                  className="industrial-input pl-10"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-[var(--border)] bg-[var(--bg-primary)]" />
                <span className="ml-2 text-sm text-[var(--text-secondary)]">记住我</span>
              </label>
              <Link href="/auth/reset-password" className="text-sm text-[var(--primary)] hover:text-[var(--primary-light)]">
                忘记密码？
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full industrial-button primary"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  登录中...
                </span>
              ) : (
                '登录'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              还没有账号？
              <Link href="/auth/register" className="text-[var(--primary)] hover:text-[var(--primary-light)] ml-1">
                立即注册
              </Link>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-[var(--text-muted)]">
              测试账号：1404708595@qq.com / 13426086861@139.com
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              请联系管理员获取密码
            </p>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)] text-center mt-8">
          © 2025 光伏测试系统. 保留所有权利.
        </p>
      </div>
    </div>
  );
}