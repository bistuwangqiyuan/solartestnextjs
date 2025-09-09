'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Activity,
  BarChart3,
  Database,
  Gauge,
  Home,
  LogOut,
  Monitor,
  Settings,
  User,
  Zap
} from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth-store'

export function Navigation() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const navItems = [
    { href: '/', label: '首页', icon: Home },
    { href: '/experiment', label: '实验控制', icon: Gauge },
    { href: '/monitor', label: '实时监控', icon: Activity },
    { href: '/data', label: '数据管理', icon: Database },
    { href: '/analysis', label: '数据分析', icon: BarChart3 },
    { href: '/dashboard', label: '数据大屏', icon: Monitor },
    { href: '/settings', label: '系统设置', icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  // Don't show navigation on login page
  if (pathname === '/login') {
    return null
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-industrial-dark/95 backdrop-blur-md border-b border-industrial-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-industrial-accent/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-industrial-accent" />
              </div>
              <span className="text-lg font-semibold">光伏测试系统</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all',
                      isActive
                        ? 'bg-industrial-accent/20 text-industrial-accent'
                        : 'text-muted-foreground hover:text-foreground hover:bg-industrial-card'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.fullName || user.username}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-industrial-accent/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-industrial-accent" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="ml-2"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export function NavigationSpacer() {
  const pathname = usePathname()
  
  // Don't add spacer on login page
  if (pathname === '/login') {
    return null
  }
  
  return <div className="h-16" />
}