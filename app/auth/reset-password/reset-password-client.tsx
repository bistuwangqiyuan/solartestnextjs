'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mode, setMode] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    // 检查是否有重置令牌（从邮件链接过来）
    const token = searchParams.get('token');
    if (token) {
      setMode('reset');
    }
  }, [searchParams]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await auth.resetPassword(email);
      setSuccess('重置密码邮件已发送，请查收您的邮箱');
      setEmail('');
    } catch (err: any) {
      setError(err.message || '发送重置邮件失败');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await auth.updatePassword(password);
      setSuccess('密码重置成功！');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || '密码重置失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--text)]">
            {mode === 'request' ? '重置密码' : '设置新密码'}
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-muted)]">
            {mode === 'request' ? (
              <>
                或{' '}
                <Link href="/login" className="font-medium text-[var(--primary)] hover:text-[var(--primary-dark)]">
                  返回登录
                </Link>
              </>
            ) : (
              '请输入您的新密码'
            )}
          </p>
        </div>

        <Card className="mt-8 p-6">
          {mode === 'request' ? (
            <form className="space-y-6" onSubmit={handleRequestReset}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                  {success}
                </div>
              )}

              <div>
                <Label htmlFor="email">邮箱地址</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  placeholder="请输入您的邮箱"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? '发送中...' : '发送重置邮件'}
                </Button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                  {success}
                </div>
              )}

              <div>
                <Label htmlFor="password">新密码</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="请输入新密码"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">确认新密码</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                  placeholder="请再次输入新密码"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? '重置中...' : '重置密码'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}