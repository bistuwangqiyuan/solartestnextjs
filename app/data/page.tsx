'use client'

import { useState } from 'react'
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
  ChevronRight
} from 'lucide-react'
import { formatDate, getExperimentStatusColor, getExperimentStatusBgColor } from '@/lib/utils'

export default function DataPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [experimentType, setExperimentType] = useState('all')
  const [dateRange, setDateRange] = useState('7days')
  const [currentPage, setCurrentPage] = useState(1)

  // Mock data - replace with actual API call
  const experiments = [
    {
      id: 'EXP-2024-001',
      type: 'LOW_VOLTAGE_HIGH_CURRENT',
      startTime: new Date('2024-01-09T10:00:00'),
      endTime: new Date('2024-01-09T10:30:00'),
      status: 'COMPLETED',
      operator: '张工',
      avgVoltage: 19.85,
      avgCurrent: 98.7,
      maxPower: 1985.5,
      dataPoints: 18000,
    },
    {
      id: 'EXP-2024-002',
      type: 'DUAL_POWER_SWITCH',
      startTime: new Date('2024-01-09T11:00:00'),
      endTime: new Date('2024-01-09T11:15:00'),
      status: 'COMPLETED',
      operator: '李工',
      switchCount: 10,
      successRate: 100,
      avgSwitchTime: 48.5,
      dataPoints: 9000,
    },
    {
      id: 'EXP-2024-003',
      type: 'LOW_VOLTAGE_HIGH_CURRENT',
      startTime: new Date('2024-01-09T14:00:00'),
      endTime: null,
      status: 'RUNNING',
      operator: '王工',
      avgVoltage: 20.12,
      avgCurrent: 102.3,
      maxPower: 2058.8,
      dataPoints: 5400,
    },
  ]

  const handleExport = (format: string) => {
    console.log(`Exporting data in ${format} format`)
    // TODO: Implement actual export functionality
  }

  const handleViewDetails = (experimentId: string) => {
    console.log(`Viewing details for ${experimentId}`)
    // TODO: Navigate to experiment details page
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
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <FileText className="h-4 w-4 mr-2" />
              导出Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              导出CSV
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总实验数</p>
                  <p className="text-2xl font-bold text-industrial-accent">1,234</p>
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
                  <p className="text-2xl font-bold text-industrial-accent">2.4M</p>
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
                  <p className="text-2xl font-bold text-industrial-accent">28分钟</p>
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
                  <p className="text-2xl font-bold text-green-400">98.5%</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">搜索</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="实验ID、操作员..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    <SelectItem value="LOW_VOLTAGE_HIGH_CURRENT">单低压高电流</SelectItem>
                    <SelectItem value="DUAL_POWER_SWITCH">双电源切换</SelectItem>
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
                    <SelectItem value="custom">自定义</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button className="w-full" variant="industrial">
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
            <CardDescription>共找到 {experiments.length} 条记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-industrial-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">实验ID</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">类型</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">开始时间</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">状态</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">操作员</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">数据点</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {experiments.map((exp) => (
                    <tr key={exp.id} className="border-b border-industrial-border hover:bg-industrial-card/50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-sm">{exp.id}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">
                          {exp.type === 'LOW_VOLTAGE_HIGH_CURRENT' ? '单低压高电流' : '双电源切换'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{formatDate(exp.startTime)}</span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getExperimentStatusColor(exp.status)} ${getExperimentStatusBgColor(exp.status)}`}>
                          {exp.status === 'COMPLETED' ? '已完成' : exp.status === 'RUNNING' ? '进行中' : exp.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm">{exp.operator}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-mono">{exp.dataPoints.toLocaleString()}</span>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(exp.id)}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                显示第 {(currentPage - 1) * 10 + 1} - {currentPage * 10} 条，共 234 条
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
                <span className="text-sm px-3">第 {currentPage} 页</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}