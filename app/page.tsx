import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Activity, 
  BarChart3, 
  Database, 
  Gauge, 
  Monitor, 
  Settings,
  Zap,
  TrendingUp
} from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: <Gauge className="h-8 w-8" />,
      title: '实验控制',
      description: '基于Modbus RTU的精确控制，支持低压高电流和双电源切换测试',
      href: '/experiment',
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: '数据管理',
      description: '高频数据采集存储，支持多条件查询和批量导出',
      href: '/data',
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: '实时监控',
      description: '毫秒级数据刷新，多参数同步显示与异常告警',
      href: '/monitor',
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: '数据分析',
      description: '历史数据回放，趋势分析与统计报表生成',
      href: '/analysis',
    },
    {
      icon: <Monitor className="h-8 w-8" />,
      title: '大屏展示',
      description: '4K工业化监控大屏，多维度数据可视化',
      href: '/dashboard',
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: '系统设置',
      description: '设备配置、用户管理与系统参数设置',
      href: '/settings',
    },
  ]

  const stats = [
    { label: '今日测试', value: '128', trend: 12 },
    { label: '合格率', value: '98.5%', trend: 2.3 },
    { label: '在线设备', value: '8', trend: 0 },
    { label: '数据总量', value: '2.4M', trend: 15 },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gradient">
              光伏关断器测试系统
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              工业级电压电流测试与数据管理平台，基于Modbus RTU协议，提供高精度测试控制和实时数据分析
            </p>
            <div className="flex gap-4 justify-center pt-6">
              <Link href="/experiment">
                <Button size="lg" variant="industrial" className="gap-2">
                  <Zap className="h-5 w-5" />
                  开始测试
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="gap-2">
                  <Monitor className="h-5 w-5" />
                  数据大屏
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-industrial transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-industrial-accent mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`text-sm font-medium ${
                      stat.trend > 0 ? 'text-green-400' : stat.trend < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {stat.trend > 0 && '+'}
                      {stat.trend}%
                      <TrendingUp className="h-4 w-4 inline ml-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">核心功能模块</h2>
            <p className="text-muted-foreground">全方位的测试控制与数据管理解决方案</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <Card className="h-full hover:shadow-industrial hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                  <CardHeader>
                    <div className="h-16 w-16 rounded-full bg-industrial-accent/10 flex items-center justify-center text-industrial-accent mb-4 group-hover:bg-industrial-accent/20 transition-colors">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 border-t border-industrial-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">技术特性</h2>
            <p className="text-muted-foreground">采用现代化技术栈，确保系统稳定高效</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-industrial-accent">1000Hz</div>
              <p className="text-sm text-muted-foreground mt-2">最高采样率</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-industrial-accent">99.9%</div>
              <p className="text-sm text-muted-foreground mt-2">系统可用性</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-industrial-accent">&lt;100ms</div>
              <p className="text-sm text-muted-foreground mt-2">响应时间</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-industrial-accent">24/7</div>
              <p className="text-sm text-muted-foreground mt-2">持续运行</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}