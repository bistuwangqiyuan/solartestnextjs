'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { experimentService } from '@/lib/services/experiment'
import { dataService } from '@/lib/services/data'
import { Line } from 'react-chartjs-2'
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Activity, 
  Clock, 
  User, 
  Tag,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ExperimentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const experimentId = params.id as string
  
  const [experiment, setExperiment] = useState<any>(null)
  const [testData, setTestData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    if (experimentId) {
      loadExperimentDetails()
      loadTestData()
    }
  }, [experimentId])

  const loadExperimentDetails = async () => {
    try {
      const data = await experimentService.getExperimentFullDetails(experimentId)
      setExperiment(data)
    } catch (error) {
      console.error('Failed to load experiment details:', error)
      toast.error('加载实验详情失败')
    } finally {
      setLoading(false)
    }
  }

  const loadTestData = async () => {
    try {
      setDataLoading(true)
      const data = await dataService.getTestData(experimentId, { limit: 1000 })
      setTestData(data)
    } catch (error) {
      console.error('Failed to load test data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleExportExcel = async () => {
    try {
      await dataService.exportToExcel([experimentId])
      toast.success('导出成功')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('导出失败')
    }
  }

  const handleExportCSV = async () => {
    try {
      await dataService.exportToCSV([experimentId])
      toast.success('导出成功')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('导出失败')
    }
  }

  // 准备图表数据
  const chartData = {
    labels: testData.map(d => new Date(d.timestamp).toLocaleTimeString('zh-CN')),
    datasets: [
      {
        label: '电压 (V)',
        data: testData.map(d => d.voltage),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        yAxisID: 'y',
      },
      {
        label: '电流 (A)',
        data: testData.map(d => d.current),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        yAxisID: 'y1',
      },
      {
        label: '功率 (W)',
        data: testData.map(d => d.power),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        yAxisID: 'y2',
      }
    ],
  }

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
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F3F4F6',
        bodyColor: '#F3F4F6',
      },
    },
    scales: {
      x: {
        grid: {
          color: '#374151',
        },
        ticks: {
          color: '#9CA3AF',
          maxRotation: 45,
          minRotation: 45,
        },
      },
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
          text: '电压 (V)',
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
          text: '电流 (A)',
          color: '#9CA3AF',
        },
      },
      y2: {
        type: 'linear' as const,
        display: false,
      },
    },
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
      default:
        return <Activity className="h-5 w-5 text-blue-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待开始'
      case 'running': return '进行中'
      case 'completed': return '已完成'
      case 'cancelled': return '已取消'
      case 'failed': return '失败'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!experiment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">实验未找到</h2>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{experiment.name}</h1>
              <p className="text-muted-foreground mt-1">{experiment.description || '暂无描述'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportExcel}>
              <FileText className="h-4 w-4 mr-2" />
              导出Excel
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              导出CSV
            </Button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">状态</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(experiment.status)}
                    <span className="text-lg font-semibold">{getStatusText(experiment.status)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-muted-foreground opacity-50" />
                <div>
                  <p className="text-sm text-muted-foreground">持续时间</p>
                  <p className="text-lg font-semibold">
                    {experiment.results?.test_duration 
                      ? `${Math.floor(experiment.results.test_duration / 60)}分${Math.floor(experiment.results.test_duration % 60)}秒`
                      : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-muted-foreground opacity-50" />
                <div>
                  <p className="text-sm text-muted-foreground">数据点</p>
                  <p className="text-lg font-semibold">{experiment.data_points_count || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-muted-foreground opacity-50" />
                <div>
                  <p className="text-sm text-muted-foreground">创建人</p>
                  <p className="text-lg font-semibold">{experiment.creator?.full_name || experiment.creator?.email || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Summary */}
        {experiment.results && (
          <Card>
            <CardHeader>
              <CardTitle>实验结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">最大功率</p>
                  <p className="text-xl font-semibold text-industrial-accent">
                    {experiment.results.max_power?.toFixed(2) || 0} W
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">平均功率</p>
                  <p className="text-xl font-semibold">
                    {experiment.results.avg_power?.toFixed(2) || 0} W
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">最大电压</p>
                  <p className="text-xl font-semibold">
                    {experiment.results.max_voltage?.toFixed(2) || 0} V
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">最大电流</p>
                  <p className="text-xl font-semibold">
                    {experiment.results.max_current?.toFixed(2) || 0} A
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">平均效率</p>
                  <p className="text-xl font-semibold">
                    {experiment.results.avg_efficiency?.toFixed(1) || 0} %
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">填充因子</p>
                  <p className="text-xl font-semibold">
                    {experiment.results.fill_factor?.toFixed(3) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Chart */}
        <Card>
          <CardHeader>
            <CardTitle>数据曲线</CardTitle>
            <CardDescription>电压、电流、功率随时间变化</CardDescription>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="loading-spinner"></div>
              </div>
            ) : testData.length > 0 ? (
              <div className="h-96">
                <Line options={chartOptions} data={chartData} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-muted-foreground">
                暂无数据
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>实验参数</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-industrial-card p-4 rounded overflow-auto">
              {JSON.stringify(experiment.parameters, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {/* Alerts */}
        {experiment.recent_alerts && experiment.recent_alerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                相关告警
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {experiment.recent_alerts.map((alert: any) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-industrial-card rounded">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${
                        alert.type === 'critical' ? 'bg-red-400' :
                        alert.type === 'error' ? 'bg-orange-400' :
                        alert.type === 'warning' ? 'bg-yellow-400' :
                        'bg-blue-400'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.created_at).toLocaleString('zh-CN')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      alert.resolved_at ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {alert.resolved_at ? '已解决' : '待处理'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}