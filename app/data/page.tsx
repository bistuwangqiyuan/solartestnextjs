'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Download, 
  FileText, 
  Filter, 
  Search,
  Calendar,
  Database,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Upload,
  Trash2,
  Eye,
  CheckSquare
} from 'lucide-react'
import { formatDate, getExperimentStatusColor, getExperimentStatusBgColor } from '@/lib/utils'
import { dataService, type ExperimentData } from '@/lib/services/data'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DataPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [experimentType, setExperimentType] = useState('all')
  const [experimentStatus, setExperimentStatus] = useState('all')
  const [dateRange, setDateRange] = useState('7days')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedExperiments, setSelectedExperiments] = useState<string[]>([])
  const [experiments, setExperiments] = useState<ExperimentData[]>([])
  const [totalExperiments, setTotalExperiments] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState({
    totalExperiments: 0,
    totalDataPoints: 0,
    avgDuration: 0,
    successRate: 0
  })
  const [importModalOpen, setImportModalOpen] = useState(false)

  useEffect(() => {
    loadExperiments()
    loadStatistics()
  }, [currentPage, experimentType, experimentStatus, dateRange])

  const loadExperiments = async () => {
    try {
      setLoading(true)
      
      // 计算日期范围
      let dateFilter;
      if (dateRange !== 'all') {
        const end = new Date()
        const start = new Date()
        if (dateRange === 'today') {
          start.setHours(0, 0, 0, 0)
        } else if (dateRange === '7days') {
          start.setDate(start.getDate() - 7)
        } else if (dateRange === '30days') {
          start.setDate(start.getDate() - 30)
        }
        dateFilter = { start, end }
      }

      const result = await dataService.getExperiments({
        search: searchTerm,
        type: experimentType,
        status: experimentStatus,
        dateRange: dateFilter,
        page: currentPage,
        pageSize: 10
      })

      setExperiments(result.data)
      setTotalExperiments(result.total)
    } catch (error) {
      console.error('Failed to load experiments:', error)
      toast.error('加载数据失败')
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const stats = await dataService.getDataStatistics()
      setStatistics(stats)
    } catch (error) {
      console.error('Failed to load statistics:', error)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadExperiments()
  }

  const handleExportExcel = async () => {
    if (selectedExperiments.length === 0) {
      toast.error('请选择要导出的实验')
      return
    }

    try {
      await dataService.exportToExcel(selectedExperiments)
      toast.success('导出成功')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('导出失败')
    }
  }

  const handleExportCSV = async () => {
    if (selectedExperiments.length === 0) {
      toast.error('请选择要导出的实验')
      return
    }

    try {
      await dataService.exportToCSV(selectedExperiments)
      toast.success('导出成功')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('导出失败')
    }
  }

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const result = await dataService.importFromExcel(file)
      if (result.success) {
        toast.success(result.message)
        loadExperiments()
        loadStatistics()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Import failed:', error)
      toast.error('导入失败')
    }

    // 清空input
    event.target.value = ''
    setImportModalOpen(false)
  }

  const handleDeleteExperiments = async () => {
    if (selectedExperiments.length === 0) {
      toast.error('请选择要删除的实验')
      return
    }

    if (!confirm(`确定要删除 ${selectedExperiments.length} 个实验吗？此操作不可恢复。`)) {
      return
    }

    try {
      await dataService.deleteExperiments(selectedExperiments)
      toast.success('删除成功')
      setSelectedExperiments([])
      loadExperiments()
      loadStatistics()
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('删除失败')
    }
  }

  const handleViewDetails = (experimentId: string) => {
    router.push(`/experiment/${experimentId}`)
  }

  const toggleSelectExperiment = (experimentId: string) => {
    setSelectedExperiments(prev => {
      if (prev.includes(experimentId)) {
        return prev.filter(id => id !== experimentId)
      } else {
        return [...prev, experimentId]
      }
    })
  }

  const toggleSelectAll = () => {
    if (selectedExperiments.length === experiments.length) {
      setSelectedExperiments([])
    } else {
      setSelectedExperiments(experiments.map(exp => exp.id))
    }
  }

  const getExperimentTypeName = (exp: ExperimentData) => {
    return exp.template?.category || exp.parameters?.test_type || '未分类'
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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">数据管理</h1>
            <p className="text-muted-foreground mt-1">查询、分析和导出实验数据</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="file"
              id="import-file"
              accept=".xlsx,.xls"
              onChange={handleImportExcel}
              className="hidden"
            />
            <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              导入Excel
            </Button>
            <Button variant="outline" onClick={handleExportExcel} disabled={selectedExperiments.length === 0}>
              <FileText className="h-4 w-4 mr-2" />
              导出Excel
            </Button>
            <Button variant="outline" onClick={handleExportCSV} disabled={selectedExperiments.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              导出CSV
            </Button>
            {selectedExperiments.length > 0 && (
              <Button variant="destructive" onClick={handleDeleteExperiments}>
                <Trash2 className="h-4 w-4 mr-2" />
                删除 ({selectedExperiments.length})
              </Button>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总实验数</p>
                  <p className="text-2xl font-bold text-industrial-accent">
                    {statistics.totalExperiments.toLocaleString()}
                  </p>
                </div>
                <Database className="h-8 w-8 text-industrial-accent/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">数据总量</p>
                  <p className="text-2xl font-bold text-industrial-accent">
                    {statistics.totalDataPoints >= 1000000 
                      ? `${(statistics.totalDataPoints / 1000000).toFixed(1)}M`
                      : statistics.totalDataPoints >= 1000
                      ? `${(statistics.totalDataPoints / 1000).toFixed(1)}K`
                      : statistics.totalDataPoints.toString()
                    }
                  </p>
                </div>
                <Database className="h-8 w-8 text-industrial-accent/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">平均时长</p>
                  <p className="text-2xl font-bold text-industrial-accent">{statistics.avgDuration}分钟</p>
                </div>
                <Calendar className="h-8 w-8 text-industrial-accent/20" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">成功率</p>
                  <p className="text-2xl font-bold text-green-400">{statistics.successRate}%</p>
                </div>
                <Database className="h-8 w-8 text-green-400/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              数据筛选
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">搜索</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="实验ID、名称..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">实验类型</Label>
                <Select value={experimentType} onValueChange={setExperimentType}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="Performance Test">性能测试</SelectItem>
                    <SelectItem value="Reliability Test">可靠性测试</SelectItem>
                    <SelectItem value="Safety Test">安全测试</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">状态</Label>
                <Select value={experimentStatus} onValueChange={setExperimentStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">待开始</SelectItem>
                    <SelectItem value="running">进行中</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                    <SelectItem value="cancelled">已取消</SelectItem>
                    <SelectItem value="failed">失败</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-range">时间范围</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger id="date-range">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">今天</SelectItem>
                    <SelectItem value="7days">最近7天</SelectItem>
                    <SelectItem value="30days">最近30天</SelectItem>
                    <SelectItem value="all">全部</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full" variant="industrial" onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  查询
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>实验数据列表</CardTitle>
            <CardDescription>共找到 {totalExperiments} 条记录</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-industrial-border">
                        <th className="text-left p-4">
                          <input
                            type="checkbox"
                            checked={selectedExperiments.length === experiments.length && experiments.length > 0}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">实验ID</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">名称</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">类型</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">创建时间</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">状态</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">创建人</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {experiments.map((exp) => (
                        <tr key={exp.id} className="border-b border-industrial-border hover:bg-industrial-card/50 transition-colors">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedExperiments.includes(exp.id)}
                              onChange={() => toggleSelectExperiment(exp.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-sm">{exp.id.substring(0, 8)}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-medium">{exp.name}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{getExperimentTypeName(exp)}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{formatDate(new Date(exp.created_at))}</span>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${getExperimentStatusColor(exp.status)} ${getExperimentStatusBgColor(exp.status)}`}>
                              {getStatusText(exp.status)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{exp.creator?.full_name || exp.creator?.email || '-'}</span>
                          </td>
                          <td className="p-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(exp.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {experiments.length === 0 && (
                        <tr>
                          <td colSpan={8} className="text-center p-8 text-muted-foreground">
                            暂无数据
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    显示第 {Math.min((currentPage - 1) * 10 + 1, totalExperiments)} - {Math.min(currentPage * 10, totalExperiments)} 条，共 {totalExperiments} 条
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm px-3">
                      第 {currentPage} 页，共 {Math.ceil(totalExperiments / 10)} 页
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= Math.ceil(totalExperiments / 10)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}