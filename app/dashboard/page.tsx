'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricCard } from '@/components/ui/data-display'
import { 
  Activity,
  Zap,
  TrendingUp,
  Users,
  Gauge,
  BarChart3,
  PieChart,
  Clock
} from 'lucide-react'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F3F4F6',
        bodyColor: '#F3F4F6',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: '#374151',
          drawBorder: false,
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
      y: {
        grid: {
          color: '#374151',
          drawBorder: false,
        },
        ticks: {
          color: '#9CA3AF',
        },
      },
    },
  }

  // Weekly trend data
  const weeklyTrendData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '测试数量',
        data: [145, 189, 156, 211, 198, 165, 178],
        borderColor: '#0D9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Device utilization data
  const deviceUtilizationData = {
    labels: ['设备1', '设备2', '设备3', '设备4', '设备5'],
    datasets: [
      {
        label: '使用率 (%)',
        data: [85, 72, 91, 67, 88],
        backgroundColor: 'rgba(13, 148, 136, 0.8)',
        borderColor: '#0D9488',
        borderWidth: 1,
      },
    ],
  }

  // Test type distribution
  const testTypeData = {
    labels: ['单低压高电流', '双电源切换', '其他'],
    datasets: [
      {
        data: [65, 30, 5],
        backgroundColor: [
          'rgba(13, 148, 136, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          '#0D9488',
          '#F59E0B',
          '#8B5CF6',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="min-h-screen p-6 bg-industrial-dark">
      {/* Header */}
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gradient">光伏测试系统数据中心</h1>
            <p className="text-muted-foreground mt-1">实时监控与数据分析大屏</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-mono text-industrial-accent">
              {currentTime.toLocaleTimeString('zh-CN')}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="今日测试数"
            value="178"
            subtitle="较昨日 +12.4%"
            icon={<Activity className="h-6 w-6" />}
            trend={{ value: 12.4, isPositive: true }}
          />
          <MetricCard
            title="本周合格率"
            value="98.5%"
            subtitle="目标: 98%"
            icon={<TrendingUp className="h-6 w-6" />}
            trend={{ value: 0.5, isPositive: true }}
          />
          <MetricCard
            title="在线设备"
            value="8/10"
            subtitle="设备利用率 80%"
            icon={<Gauge className="h-6 w-6" />}
          />
          <MetricCard
            title="活跃用户"
            value="24"
            subtitle="工程师: 18, 管理员: 6"
            icon={<Users className="h-6 w-6" />}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                本周测试趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line options={chartOptions} data={weeklyTrendData} />
              </div>
            </CardContent>
          </Card>

          {/* Test Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                测试类型分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Doughnut 
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        position: 'bottom' as const,
                        labels: {
                          color: '#9CA3AF',
                          padding: 20,
                        },
                      },
                    },
                  }} 
                  data={testTypeData} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Status and Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                设备使用率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar options={chartOptions} data={deviceUtilizationData} />
              </div>
            </CardContent>
          </Card>

          {/* Real-time Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                实时状态
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Running Experiments */}
                <div className="p-4 rounded-lg bg-industrial-card border border-industrial-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">正在进行的实验</span>
                    <span className="text-2xl font-bold text-industrial-accent">3</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>EXP-2024-178</span>
                      <span className="text-green-400">运行中 25:34</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>EXP-2024-179</span>
                      <span className="text-green-400">运行中 12:15</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>EXP-2024-180</span>
                      <span className="text-yellow-400">准备中</span>
                    </div>
                  </div>
                </div>

                {/* System Health */}
                <div className="p-4 rounded-lg bg-industrial-card border border-industrial-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">系统健康度</span>
                    <span className="text-2xl font-bold text-green-400">优秀</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">CPU温度</p>
                      <p className="text-sm font-mono">52°C</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">内存使用</p>
                      <p className="text-sm font-mono">4.2/16 GB</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">网络状态</p>
                      <p className="text-sm font-mono text-green-400">良好</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">数据库状态</p>
                      <p className="text-sm font-mono text-green-400">正常</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}