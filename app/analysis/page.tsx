'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { 
  BarChart3,
  LineChart,
  TrendingUp,
  FileText,
  Calendar,
  Download
} from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
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

export default function AnalysisPage() {
  const [timeRange, setTimeRange] = useState('7days')
  const [analysisType, setAnalysisType] = useState('trend')

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

  // Voltage trend analysis
  const voltageTrendData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
    datasets: [
      {
        label: '平均电压',
        data: [19.8, 19.9, 20.1, 19.7, 19.8, 20.0, 19.9],
        borderColor: '#0D9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: '最大电压',
        data: [20.5, 20.8, 21.2, 20.4, 20.6, 20.9, 20.7],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  // Success rate comparison
  const successRateData = {
    labels: ['设备1', '设备2', '设备3', '设备4', '设备5', '设备6'],
    datasets: [
      {
        label: '本月成功率',
        data: [98.5, 97.2, 99.1, 96.8, 98.9, 97.5],
        backgroundColor: 'rgba(13, 148, 136, 0.8)',
      },
      {
        label: '上月成功率',
        data: [97.8, 96.5, 98.7, 97.1, 98.2, 96.9],
        backgroundColor: 'rgba(13, 148, 136, 0.4)',
      },
    ],
  }

  // Power distribution analysis
  const powerDistributionData = {
    labels: ['0-500W', '500-1000W', '1000-1500W', '1500-2000W', '2000W+'],
    datasets: [
      {
        label: '测试次数分布',
        data: [145, 289, 456, 678, 234],
        backgroundColor: [
          'rgba(13, 148, 136, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
      },
    ],
  }

  const generateReport = () => {
    console.log('Generating analysis report...')
    // TODO: Implement report generation
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">数据分析</h1>
            <p className="text-muted-foreground mt-1">深度分析测试数据，生成专业报告</p>
          </div>
          <Button variant="industrial" onClick={generateReport}>
            <FileText className="h-4 w-4 mr-2" />
            生成分析报告
          </Button>
        </div>

        {/* Analysis Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              分析参数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time-range">时间范围</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger id="time-range">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">今天</SelectItem>
                    <SelectItem value="7days">最近7天</SelectItem>
                    <SelectItem value="30days">最近30天</SelectItem>
                    <SelectItem value="90days">最近90天</SelectItem>
                    <SelectItem value="year">今年</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="analysis-type">分析类型</Label>
                <Select value={analysisType} onValueChange={setAnalysisType}>
                  <SelectTrigger id="analysis-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trend">趋势分析</SelectItem>
                    <SelectItem value="comparison">对比分析</SelectItem>
                    <SelectItem value="distribution">分布分析</SelectItem>
                    <SelectItem value="correlation">相关性分析</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  自定义时间
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voltage Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                电压趋势分析
              </CardTitle>
              <CardDescription>月度平均电压与最大电压变化趋势</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line options={chartOptions} data={voltageTrendData} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-industrial-card">
                  <p className="text-sm text-muted-foreground">平均值</p>
                  <p className="text-xl font-bold text-industrial-accent">19.9V</p>
                  <p className="text-xs text-muted-foreground">标准差: ±0.15V</p>
                </div>
                <div className="p-3 rounded-lg bg-industrial-card">
                  <p className="text-sm text-muted-foreground">稳定性</p>
                  <p className="text-xl font-bold text-green-400">98.7%</p>
                  <p className="text-xs text-muted-foreground">优于目标值</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Rate Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                设备成功率对比
              </CardTitle>
              <CardDescription>各设备本月与上月测试成功率对比</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar options={chartOptions} data={successRateData} />
              </div>
              <div className="mt-4 p-3 rounded-lg bg-industrial-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">整体提升</p>
                    <p className="text-xl font-bold text-green-400">+0.8%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">最佳设备</p>
                    <p className="text-xl font-bold text-industrial-accent">设备3</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Power Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                功率分布分析
              </CardTitle>
              <CardDescription>测试功率区间分布统计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar 
                  options={{
                    ...chartOptions,
                    indexAxis: 'y' as const,
                  }} 
                  data={powerDistributionData} 
                />
              </div>
              <div className="mt-6 grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">最常见功率区间</p>
                  <p className="text-lg font-bold text-industrial-accent">1500-2000W</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">平均功率</p>
                  <p className="text-lg font-bold text-industrial-accent">1456W</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">峰值功率</p>
                  <p className="text-lg font-bold text-orange-400">2358W</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">功率因数</p>
                  <p className="text-lg font-bold text-green-400">0.98</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Summary */}
        <Card>
          <CardHeader>
            <CardTitle>分析结论</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-green-400 mt-2" />
              <div>
                <p className="font-medium">电压稳定性优秀</p>
                <p className="text-sm text-muted-foreground">
                  过去7个月的电压波动保持在±0.5V范围内，稳定性达到98.7%，超出预期目标。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-industrial-accent mt-2" />
              <div>
                <p className="font-medium">设备性能持续提升</p>
                <p className="text-sm text-muted-foreground">
                  所有设备的测试成功率较上月均有提升，平均提升0.8%，其中设备3表现最佳。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-yellow-400 mt-2" />
              <div>
                <p className="font-medium">功率分布需要优化</p>
                <p className="text-sm text-muted-foreground">
                  当前功率主要集中在1500-2000W区间，建议增加其他功率区间的测试覆盖。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}