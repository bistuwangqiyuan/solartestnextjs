'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataDisplay } from '@/components/ui/data-display'
import { Button } from '@/components/ui/button'
import { 
  Activity,
  Zap,
  TrendingUp,
  AlertTriangle,
  Gauge,
  Thermometer,
  Droplets,
  Sun,
  Power,
  RefreshCw,
  Play,
  Pause
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
import { useModbusStore } from '@/lib/store/modbus-store'
import { experimentService } from '@/lib/services/experiment'
import { supabase } from '@/lib/supabase'

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

interface RealtimeData {
  timestamp: Date;
  voltage?: number;
  current?: number;
  power?: number;
  temperature?: number;
  humidity?: number;
  irradiance?: number;
  efficiency?: number;
}

export default function MonitorPage() {
  const { devices, loadDevices, startPolling, stopPolling, isPolling, connectDevice, readAllDevicesData } = useModbusStore()
  const [runningExperiments, setRunningExperiments] = useState<any[]>([])
  const [selectedExperiment, setSelectedExperiment] = useState<string>('')
  const [realtimeData, setRealtimeData] = useState<RealtimeData[]>([])
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const maxDataPoints = 60 // 保留最近60个数据点

  useEffect(() => {
    initializeMonitoring()
    return () => {
      if (isPolling) {
        stopPolling()
      }
    }
  }, [])

  useEffect(() => {
    if (autoRefresh && !isPolling) {
      startPolling()
    } else if (!autoRefresh && isPolling) {
      stopPolling()
    }
  }, [autoRefresh])

  useEffect(() => {
    if (selectedExperiment && autoRefresh) {
      const interval = setInterval(() => {
        loadRealtimeData()
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [selectedExperiment, autoRefresh])

  const initializeMonitoring = async () => {
    try {
      setLoading(true)
      await loadDevices()
      await loadRunningExperiments()
      await loadRecentAlerts()
      
      // 尝试连接所有设备
      for (const device of devices) {
        if (!device.isConnected) {
          await connectDevice(device.id)
        }
      }
      
      if (autoRefresh) {
        startPolling()
      }
    } catch (error) {
      console.error('Failed to initialize monitoring:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRunningExperiments = async () => {
    try {
      const experiments = await experimentService.getRunningExperiments()
      setRunningExperiments(experiments)
      if (experiments.length > 0 && !selectedExperiment) {
        setSelectedExperiment(experiments[0].id)
      }
    } catch (error) {
      console.error('Failed to load running experiments:', error)
    }
  }

  const loadRealtimeData = async () => {
    if (!selectedExperiment) return

    try {
      const data = await experimentService.getRealtimeData(selectedExperiment, 1)
      if (data && data.length > 0) {
        const newData: RealtimeData = {
          timestamp: new Date(data[0].timestamp),
          voltage: data[0].voltage || undefined,
          current: data[0].current || undefined,
          power: data[0].power || undefined,
          temperature: data[0].temperature || undefined,
          humidity: data[0].humidity || undefined,
          irradiance: data[0].irradiance || undefined,
          efficiency: data[0].efficiency || undefined,
        }
        
        setRealtimeData(prev => {
          const updated = [...prev, newData]
          return updated.slice(-maxDataPoints)
        })
      }
    } catch (error) {
      console.error('Failed to load realtime data:', error)
    }
  }

  const loadRecentAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .is('resolved_at', null)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setAlerts(data || [])
    } catch (error) {
      console.error('Failed to load alerts:', error)
    }
  }

  const handleRefreshDevices = async () => {
    await readAllDevicesData()
  }

  const handleToggleDevice = async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId)
    if (!device) return

    if (device.isConnected) {
      // 断开连接
      // 这里应该调用disconnectDevice，但为了演示，我们只是更新状态
      console.log('Disconnecting device:', deviceId)
    } else {
      // 连接设备
      await connectDevice(deviceId)
    }
  }

  // 准备图表数据
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

  const timeLabels = realtimeData.map(d => d.timestamp.toLocaleTimeString('zh-CN'))

  const voltageChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: '电压 (V)',
        data: realtimeData.map(d => d.voltage || 0),
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
        data: realtimeData.map(d => d.current || 0),
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
        data: realtimeData.map(d => d.power || 0),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const environmentChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: '温度 (°C)',
        data: realtimeData.map(d => d.temperature || 0),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: '湿度 (%)',
        data: realtimeData.map(d => d.humidity || 0),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
      },
    ],
  }

  const currentValues = realtimeData.length > 0 ? realtimeData[realtimeData.length - 1] : {
    timestamp: new Date(),
    voltage: 0,
    current: 0,
    power: 0,
    temperature: 0,
    humidity: 0,
    irradiance: 0,
    efficiency: 0,
  }

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-400/30 bg-red-400/10 text-red-400'
      case 'error': return 'border-orange-400/30 bg-orange-400/10 text-orange-400'
      case 'warning': return 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400'
      default: return 'border-blue-400/30 bg-blue-400/10 text-blue-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">实时监控</h1>
            <p className="text-muted-foreground mt-1">系统运行状态与参数实时监测</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">自动刷新</span>
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isPolling ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-muted-foreground">
                {isPolling ? '实时更新中' : '已暂停'}
              </span>
            </div>
          </div>
        </div>

        {/* Experiment Selector */}
        {runningExperiments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>选择实验</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <select
                  value={selectedExperiment}
                  onChange={(e) => setSelectedExperiment(e.target.value)}
                  className="flex-1 industrial-input"
                >
                  {runningExperiments.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      {exp.name} - {exp.template?.name || '未知模板'}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Real-time Values */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <DataDisplay 
            label="电压" 
            value={currentValues.voltage?.toFixed(2) || '0.00'} 
            unit="V" 
            icon={<Zap className="h-4 w-4" />}
          />
          <DataDisplay 
            label="电流" 
            value={currentValues.current?.toFixed(2) || '0.00'} 
            unit="A" 
            icon={<Activity className="h-4 w-4" />}
          />
          <DataDisplay 
            label="功率" 
            value={currentValues.power?.toFixed(1) || '0.0'} 
            unit="W" 
            icon={<Power className="h-4 w-4" />}
          />
          <DataDisplay 
            label="效率" 
            value={currentValues.efficiency?.toFixed(1) || '0.0'} 
            unit="%" 
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <DataDisplay 
            label="温度" 
            value={currentValues.temperature?.toFixed(1) || '0.0'} 
            unit="°C" 
            icon={<Thermometer className="h-4 w-4" />}
          />
          <DataDisplay 
            label="湿度" 
            value={currentValues.humidity?.toFixed(1) || '0.0'} 
            unit="%" 
            icon={<Droplets className="h-4 w-4" />}
          />
          <DataDisplay 
            label="光照强度" 
            value={currentValues.irradiance?.toFixed(0) || '0'} 
            unit="W/m²" 
            icon={<Sun className="h-4 w-4" />}
          />
          <DataDisplay 
            label="时间" 
            value={currentValues.timestamp.toLocaleTimeString('zh-CN')} 
          />
        </div>

        {/* Device Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                设备状态
              </span>
              <Button size="sm" variant="outline" onClick={handleRefreshDevices}>
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => (
                <div key={device.id} className="p-4 rounded-lg border border-industrial-border bg-industrial-card">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{device.name}</h4>
                    <Button
                      size="sm"
                      variant={device.isConnected ? "default" : "outline"}
                      onClick={() => handleToggleDevice(device.id)}
                    >
                      <Power className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">状态</span>
                      <span className={`flex items-center gap-1 ${
                        device.isConnected ? 'text-green-400' : 
                        device.error ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        <div className={`h-2 w-2 rounded-full ${
                          device.isConnected ? 'bg-green-400' : 
                          device.error ? 'bg-red-400' : 'bg-gray-400'
                        }`} />
                        {device.isConnected ? '在线' : device.error ? '错误' : '离线'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">类型</span>
                      <span>{device.type}</span>
                    </div>
                    {device.lastData && (
                      <>
                        {device.type === 'power_supply' && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">电压</span>
                              <span>{device.lastData.voltage?.toFixed(2)} V</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">电流</span>
                              <span>{device.lastData.current?.toFixed(2)} A</span>
                            </div>
                          </>
                        )}
                        {device.type === 'weather_station' && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">温度</span>
                              <span>{device.lastData.temperature?.toFixed(1)} °C</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">湿度</span>
                              <span>{device.lastData.humidity?.toFixed(1)} %</span>
                            </div>
                          </>
                        )}
                      </>
                    )}
                    {device.lastUpdate && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">更新时间</span>
                        <span className="text-xs">{new Date(device.lastUpdate).toLocaleTimeString('zh-CN')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-400" />
                环境参数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line 
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      y: {
                        type: 'linear' as const,
                        display: true,
                        position: 'left' as const,
                        grid: {
                          color: '#374151',
                        },
                        ticks: {
                          color: '#9CA3AF',
                        },
                        title: {
                          display: true,
                          text: '温度 (°C)',
                          color: '#9CA3AF',
                        },
                      },
                      y1: {
                        type: 'linear' as const,
                        display: true,
                        position: 'right' as const,
                        grid: {
                          drawOnChartArea: false,
                        },
                        ticks: {
                          color: '#9CA3AF',
                        },
                        title: {
                          display: true,
                          text: '湿度 (%)',
                          color: '#9CA3AF',
                        },
                      },
                    },
                  }} 
                  data={environmentChartData} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

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
              {alerts.length > 0 ? (
                alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${getAlertTypeColor(alert.type)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {alert.category} - 严重程度: {alert.severity}/5
                        </p>
                      </div>
                      <span className="text-xs opacity-75">
                        {new Date(alert.created_at).toLocaleString('zh-CN')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  暂无告警信息
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}