'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function ResetPasswordPage() {
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
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await auth.resetPassword(email);
      setSuccess('重置密码链接已发送到您的邮箱，请检查邮件。');
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message || '发送重置邮件失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 验证密码匹配
    if (password !== confirmPassword) {
      setError('密码不匹配');
      return;
    }

    // 验证密码强度
    if (password.length < 8) {
      setError('密码至少需要8个字符');
      return;
    }

    setLoading(true);

    try {
      await auth.updatePassword(password);
      setSuccess('密码重置成功！正在跳转到登录页面...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Update password error:', err);
      setError(err.message || '重置密码失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {mode === 'request' ? '忘记密码' : '重置密码'}
          </h1>
          <p className="text-gray-400">
            {mode === 'request' 
              ? '输入您的邮箱地址，我们将发送重置链接'
              : '输入您的新密码'}
          </p>
        </div>

        {mode === 'request' ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-md text-sm">
                {success}
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-gray-300">
                邮箱地址
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="your@email.com"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? '发送中...' : '发送重置链接'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-md text-sm">
                {success}
              </div>
            )}

            <div>
              <Label htmlFor="password" className="text-gray-300">
                新密码
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="至少8个字符"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">
                确认新密码
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="再次输入密码"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? '重置中...' : '重置密码'}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            记起密码了？{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300">
              返回登录
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}