'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataDisplay } from '@/components/ui/data-display'
import { 
  Activity,
  Zap,
  TrendingUp,
  AlertTriangle,
  Gauge
} from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function MonitorPage() {
  const [timeLabels, setTimeLabels] = useState<string[]>([])
  const [voltageData, setVoltageData] = useState<number[]>([])
  const [currentData, setCurrentData] = useState<number[]>([])
  const [powerData, setPowerData] = useState<number[]>([])

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('zh-CN')
      
      // Generate random data (replace with actual WebSocket data)
      const voltage = 19.5 + Math.random() * 1
      const current = 95 + Math.random() * 10
      const power = voltage * current

      setTimeLabels(prev => [...prev.slice(-29), timeStr])
      setVoltageData(prev => [...prev.slice(-29), voltage])
      setCurrentData(prev => [...prev.slice(-29), current])
      setPowerData(prev => [...prev.slice(-29), power])
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          font: {
            size: 12,
          },
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
          maxRotation: 0,
          autoSkipPadding: 20,
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

  const voltageChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: '电压 (V)',
        data: voltageData,
        borderColor: '#0D9488',
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const currentChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: '电流 (A)',
        data: currentData,
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const powerChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: '功率 (W)',
        data: powerData,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const currentValues = {
    voltage: voltageData[voltageData.length - 1] || 0,
    current: currentData[currentData.length - 1] || 0,
    power: powerData[powerData.length - 1] || 0,
    powerFactor: 0.98,
    temperature: 45.2,
    frequency: 50.01,
  }

  const alerts = [
    { id: 1, type: 'warning', message: '电流接近上限值', time: '10:23:45' },
    { id: 2, type: 'info', message: '温度轻微上升', time: '10:22:30' },
  ]

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">实时监控</h1>
            <p className="text-muted-foreground mt-1">系统运行状态与参数实时监测</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-muted-foreground">实时更新中</span>
          </div>
        </div>

        {/* Real-time Values */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <DataDisplay 
            label="电压" 
            value={currentValues.voltage.toFixed(2)} 
            unit="V" 
            trend="stable"
          />
          <DataDisplay 
            label="电流" 
            value={currentValues.current.toFixed(2)} 
            unit="A" 
            trend="up"
          />
          <DataDisplay 
            label="功率" 
            value={currentValues.power.toFixed(1)} 
            unit="W" 
            trend="up"
          />
          <DataDisplay 
            label="功率因数" 
            value={currentValues.powerFactor.toFixed(3)} 
          />
          <DataDisplay 
            label="温度" 
            value={currentValues.temperature.toFixed(1)} 
            unit="°C" 
            trend="up"
          />
          <DataDisplay 
            label="频率" 
            value={currentValues.frequency.toFixed(2)} 
            unit="Hz" 
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-industrial-accent" />
                电压趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line options={chartOptions} data={voltageChartData} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-400" />
                电流趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line options={chartOptions} data={currentChartData} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                功率趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line options={chartOptions} data={powerChartData} />
              </div>
            </CardContent>
          </Card>

          {/* Alerts Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                实时告警
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.type === 'warning' 
                        ? 'border-yellow-400/30 bg-yellow-400/10' 
                        : 'border-blue-400/30 bg-blue-400/10'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm">{alert.message}</p>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              系统状态
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">CPU使用率</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-industrial-border rounded-full overflow-hidden">
                    <div className="h-full bg-industrial-accent" style={{ width: '35%' }} />
                  </div>
                  <span className="text-sm font-mono">35%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">内存使用率</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-industrial-border rounded-full overflow-hidden">
                    <div className="h-full bg-industrial-accent" style={{ width: '62%' }} />
                  </div>
                  <span className="text-sm font-mono">62%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">磁盘使用率</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-industrial-border rounded-full overflow-hidden">
                    <div className="h-full bg-industrial-accent" style={{ width: '28%' }} />
                  </div>
                  <span className="text-sm font-mono">28%</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">网络延迟</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-industrial-border rounded-full overflow-hidden">
                    <div className="h-full bg-green-400" style={{ width: '15%' }} />
                  </div>
                  <span className="text-sm font-mono">15ms</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}