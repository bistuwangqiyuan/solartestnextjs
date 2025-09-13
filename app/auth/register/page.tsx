'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    department: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 验证密码匹配
    if (formData.password !== formData.confirmPassword) {
      setError('密码不匹配');
      return;
    }

    // 验证密码强度
    if (formData.password.length < 8) {
      setError('密码至少需要8个字符');
      return;
    }

    setLoading(true);

    try {
      await auth.signUp(formData.email, formData.password, {
        fullName: formData.fullName,
        phone: formData.phone,
        department: formData.department,
      });

      // 注册成功，提示用户检查邮箱
      alert('注册成功！请检查您的邮箱以验证账户。');
      router.push('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || '注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">创建账户</h1>
          <p className="text-gray-400">注册新的光伏测试系统账户</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-gray-300">
              邮箱 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="fullName" className="text-gray-300">
              姓名
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="张三"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-300">
              密码 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="至少8个字符"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-300">
              确认密码 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="再次输入密码"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-gray-300">
              电话
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="13800138000"
            />
          </div>

          <div>
            <Label htmlFor="department" className="text-gray-300">
              部门
            </Label>
            <Input
              id="department"
              name="department"
              type="text"
              value={formData.department}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="研发部"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? '注册中...' : '注册'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            已有账户？{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300">
              立即登录
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}