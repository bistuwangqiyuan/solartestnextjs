'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Zap, Lock, User, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      // Mock login - accept any username/password for demo
      if (username && password) {
        const mockUser = {
          id: '1',
          username,
          role: 'ADMIN' as const,
          fullName: '系统管理员',
          email: `${username}@pv-test.com`,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        const mockToken = 'mock-jwt-token-' + Date.now()
        
        login(mockUser, mockToken)
        router.push('/')
      } else {
        setError('请输入用户名和密码')
      }
    } catch (err) {
      setError('登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-5" />
      <div className="absolute inset-0 noise-overlay" />
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-industrial-accent/10 mb-4">
            <Zap className="h-8 w-8 text-industrial-accent" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">光伏测试系统</h1>
          <p className="text-muted-foreground mt-2">请登录以继续</p>
        </div>

        <Card className="shadow-industrial">
          <CardHeader>
            <CardTitle>用户登录</CardTitle>
            <CardDescription>输入您的账户信息以访问系统</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="请输入用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                variant="industrial"
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                测试账户：任意用户名和密码
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 光伏测试系统. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}