'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Settings,
  User,
  Shield,
  Database,
  Wifi,
  Save,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

export default function SettingsPage() {
  // Modbus Settings
  const [modbusPort, setModbusPort] = useState('/dev/ttyUSB0')
  const [baudRate, setBaudRate] = useState('9600')
  const [dataBits, setDataBits] = useState('8')
  const [stopBits, setStopBits] = useState('1')
  const [parity, setParity] = useState('none')
  
  // System Settings
  const [samplingRate, setSamplingRate] = useState('100')
  const [dataRetention, setDataRetention] = useState('90')
  const [autoBackup, setAutoBackup] = useState('daily')

  const handleSave = (section: string) => {
    console.log(`Saving ${section} settings...`)
    // TODO: Implement actual save functionality
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">系统设置</h1>
          <p className="text-muted-foreground mt-1">配置系统参数和设备连接</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Modbus Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Modbus通信设置
              </CardTitle>
              <CardDescription>配置Modbus RTU通信参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modbus-port">串口</Label>
                <Input
                  id="modbus-port"
                  value={modbusPort}
                  onChange={(e) => setModbusPort(e.target.value)}
                  placeholder="/dev/ttyUSB0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baud-rate">波特率</Label>
                  <Select value={baudRate} onValueChange={setBaudRate}>
                    <SelectTrigger id="baud-rate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9600">9600</SelectItem>
                      <SelectItem value="19200">19200</SelectItem>
                      <SelectItem value="38400">38400</SelectItem>
                      <SelectItem value="115200">115200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-bits">数据位</Label>
                  <Select value={dataBits} onValueChange={setDataBits}>
                    <SelectTrigger id="data-bits">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stop-bits">停止位</Label>
                  <Select value={stopBits} onValueChange={setStopBits}>
                    <SelectTrigger id="stop-bits">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parity">校验位</Label>
                  <Select value={parity} onValueChange={setParity}>
                    <SelectTrigger id="parity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">无</SelectItem>
                      <SelectItem value="even">偶校验</SelectItem>
                      <SelectItem value="odd">奇校验</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="industrial" 
                  onClick={() => handleSave('modbus')}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  保存设置
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  测试连接
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                系统参数
              </CardTitle>
              <CardDescription>配置系统运行参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sampling-rate">默认采样率</Label>
                <Select value={samplingRate} onValueChange={setSamplingRate}>
                  <SelectTrigger id="sampling-rate">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 Hz</SelectItem>
                    <SelectItem value="100">100 Hz</SelectItem>
                    <SelectItem value="1000">1000 Hz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-retention">数据保留期限</Label>
                <Select value={dataRetention} onValueChange={setDataRetention}>
                  <SelectTrigger id="data-retention">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30天</SelectItem>
                    <SelectItem value="90">90天</SelectItem>
                    <SelectItem value="180">180天</SelectItem>
                    <SelectItem value="365">1年</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="auto-backup">自动备份</Label>
                <Select value={autoBackup} onValueChange={setAutoBackup}>
                  <SelectTrigger id="auto-backup">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disabled">禁用</SelectItem>
                    <SelectItem value="daily">每日</SelectItem>
                    <SelectItem value="weekly">每周</SelectItem>
                    <SelectItem value="monthly">每月</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="industrial" 
                onClick={() => handleSave('system')}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                保存设置
              </Button>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                用户管理
              </CardTitle>
              <CardDescription>管理系统用户和权限</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* User List */}
                <div className="space-y-2">
                  {[
                    { name: '张工', username: 'zhangw', role: '管理员', status: '在线' },
                    { name: '李工', username: 'lig', role: '工程师', status: '离线' },
                    { name: '王工', username: 'wangg', role: '工程师', status: '在线' },
                  ].map((user) => (
                    <div
                      key={user.username}
                      className="flex items-center justify-between p-3 rounded-lg bg-industrial-card hover:bg-industrial-border/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-industrial-accent/20 flex items-center justify-center">
                          <User className="h-4 w-4 text-industrial-accent" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">@{user.username} · {user.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          user.status === '在线' ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                        <Button variant="ghost" size="sm">编辑</Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  添加用户
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Database Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                数据库状态
              </CardTitle>
              <CardDescription>监控数据库使用情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">数据库大小</span>
                    <span className="text-sm font-mono">2.4 GB</span>
                  </div>
                  <div className="w-full h-2 bg-industrial-border rounded-full overflow-hidden">
                    <div className="h-full bg-industrial-accent" style={{ width: '24%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground">已使用 24% (总容量 10 GB)</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">记录总数</p>
                    <p className="text-2xl font-bold text-industrial-accent">2.4M</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">平均查询时间</p>
                    <p className="text-2xl font-bold text-green-400">23ms</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1">
                    <Database className="h-4 w-4 mr-2" />
                    优化数据库
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    清理旧数据
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              系统信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">系统版本</p>
                <p className="font-mono">v1.0.0</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">运行时间</p>
                <p className="font-mono">15天 8小时</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">最后更新</p>
                <p className="font-mono">2025-01-09</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">许可证状态</p>
                <p className="font-mono text-green-400">有效</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}