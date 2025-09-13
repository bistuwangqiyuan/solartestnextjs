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
  Clock,
  AlertCircle,
  Thermometer,
  Sun,
  Droplets
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
import { dashboardService } from '@/lib/services/dashboard'
import type { DashboardData } from '@/types'

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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    loadDashboardData()
    const refreshInterval = setInterval(loadDashboardData, 30000) // 每30秒刷新一次
    return () => clearInterval(refreshInterval)
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await dashboardService.getDashboardData()
      setDashboardData(data)
      setError(null)
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err)
      setError('数据加载失败')
    } finally {
      setLoading(false)
    }
  }

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

  // 准备图表数据
  const weeklyTrendData = dashboardData?.weeklyTrend ? {
    labels: dashboardData.weeklyTrend.map(item => item.day),
    datasets: [
      {
        label: '测试数量',
        data: dashboardData.weeklyTrend.map(item => item.count),
        borderColor: '#0D9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  } : null

  const deviceUtilizationData = dashboardData?.deviceUtilization ? {
    labels: dashboardData.deviceUtilization.map(item => item.deviceName),
    datasets: [
      {
        label: '使用率 (%)',
        data: dashboardData.deviceUtilization.map(item => item.utilization),
        backgroundColor: 'rgba(13, 148, 136, 0.8)',
        borderColor: '#0D9488',
        borderWidth: 1,
      },
    ],
  } : null

  const testTypeData = dashboardData?.testTypeDistribution ? {
    labels: dashboardData.testTypeDistribution.map(item => item.category),
    datasets: [
      {
        data: dashboardData.testTypeDistribution.map(item => item.count),
        backgroundColor: [
          'rgba(13, 148, 136, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          '#0D9488',
          '#F59E0B',
          '#8B5CF6',
          '#EF4444',
          '#3B82F6',
        ],
        borderWidth: 1,
      },
    ],
  } : null

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
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

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="今日测试数"
            value={dashboardData?.systemStatus.testsToday.toString() || '0'}
            subtitle={`活跃实验: ${dashboardData?.systemStatus.activeExperiments || 0}`}
            icon={<Activity className="h-6 w-6" />}
          />
          <MetricCard
            title="数据采集点"
            value={dashboardData?.systemStatus.dataPointsToday.toString() || '0'}
            subtitle="今日采集"
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <MetricCard
            title="在线设备"
            value={`${dashboardData?.systemStatus.devicesOnline || 0}/${dashboardData?.systemStatus.totalDevices || 0}`}
            subtitle={`设备利用率 ${dashboardData?.systemStatus.totalDevices ? 
              Math.round((dashboardData.systemStatus.devicesOnline / dashboardData.systemStatus.totalDevices) * 100) : 0}%`}
            icon={<Gauge className="h-6 w-6" />}
          />
          <MetricCard
            title="活跃告警"
            value={dashboardData?.systemStatus.activeAlerts.toString() || '0'}
            subtitle="需要处理"
            icon={<AlertCircle className="h-6 w-6" />}
            trend={dashboardData?.systemStatus.activeAlerts ? { value: dashboardData.systemStatus.activeAlerts, isPositive: false } : undefined}
          />
        </div>

        {/* Current Measurements */}
        {dashboardData?.currentMeasurements && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">电压</p>
                    <p className="text-2xl font-bold text-industrial-accent">
                      {dashboardData.currentMeasurements.voltage.toFixed(2)} V
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">电流</p>
                    <p className="text-2xl font-bold text-industrial-accent">
                      {dashboardData.currentMeasurements.current.toFixed(2)} A
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">功率</p>
                    <p className="text-2xl font-bold text-industrial-accent">
                      {dashboardData.currentMeasurements.power.toFixed(2)} W
                    </p>
                  </div>
                  <Gauge className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">温度</p>
                    <p className="text-2xl font-bold text-industrial-accent">
                      {dashboardData.currentMeasurements.temperature.toFixed(1)} °C
                    </p>
                  </div>
                  <Thermometer className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">光照强度</p>
                    <p className="text-2xl font-bold text-industrial-accent">
                      {dashboardData.currentMeasurements.irradiance.toFixed(0)} W/m²
                    </p>
                  </div>
                  <Sun className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">效率</p>
                    <p className="text-2xl font-bold text-industrial-accent">
                      {dashboardData.currentMeasurements.efficiency.toFixed(1)} %
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Trend */}
          {weeklyTrendData && (
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
          )}

          {/* Test Type Distribution */}
          {testTypeData && (
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
          )}
        </div>

        {/* Device Status and Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Utilization */}
          {deviceUtilizationData && (
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
          )}

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
                    <span className="text-2xl font-bold text-industrial-accent">
                      {dashboardData?.runningExperiments?.length || 0}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {dashboardData?.runningExperiments?.slice(0, 3).map((exp) => (
                      <div key={exp.id} className="flex items-center justify-between text-sm">
                        <span className="truncate flex-1">{exp.name}</span>
                        <span className="text-green-400 ml-2">
                          运行中 {formatDuration(exp.duration)}
                        </span>
                      </div>
                    ))}
                    {!dashboardData?.runningExperiments?.length && (
                      <div className="text-sm text-muted-foreground">暂无运行中的实验</div>
                    )}
                  </div>
                </div>

                {/* Recent Alerts */}
                <div className="p-4 rounded-lg bg-industrial-card border border-industrial-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">最近告警</span>
                    <span className="text-2xl font-bold text-yellow-400">
                      {dashboardData?.recentAlerts?.length || 0}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {dashboardData?.recentAlerts?.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className={`text-${
                            alert.type === 'critical' ? 'red' : 
                            alert.type === 'error' ? 'orange' : 
                            alert.type === 'warning' ? 'yellow' : 'blue'
                          }-400`}>
                            {alert.message}
                          </span>
                        </div>
                      </div>
                    ))}
                    {!dashboardData?.recentAlerts?.length && (
                      <div className="text-sm text-green-400">系统运行正常，无告警</div>
                    )}
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