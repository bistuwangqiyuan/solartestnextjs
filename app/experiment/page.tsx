'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataDisplay } from '@/components/ui/data-display'
import { 
  Play, 
  Square, 
  AlertCircle, 
  Zap,
  Activity,
  Thermometer,
  Timer,
  Settings
} from 'lucide-react'

export default function ExperimentPage() {
  const [experimentType, setExperimentType] = useState('LOW_VOLTAGE_HIGH_CURRENT')
  const [isRunning, setIsRunning] = useState(false)
  
  // Low Voltage High Current Parameters
  const [voltage, setVoltage] = useState('20')
  const [current, setCurrent] = useState('100')
  const [duration, setDuration] = useState('60')
  const [samplingRate, setSamplingRate] = useState('100')
  
  // Dual Power Switch Parameters
  const [switchThreshold, setSwitchThreshold] = useState('10')
  const [switchDelay, setSwitchDelay] = useState('50')
  const [switchCount, setSwitchCount] = useState('10')
  
  // Real-time data (mock)
  const realtimeData = {
    voltage: 19.85,
    current: 98.7,
    power: 1958.595,
    powerFactor: 0.98,
    temperature: 45.2,
    status: 'RUNNING',
  }

  const handleStart = () => {
    setIsRunning(true)
    // TODO: Implement actual experiment start
  }

  const handleStop = () => {
    setIsRunning(false)
    // TODO: Implement actual experiment stop
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">实验控制中心</h1>
            <p className="text-muted-foreground mt-1">配置并执行电压电流测试实验</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-muted-foreground">
                {isRunning ? '实验进行中' : '实验已停止'}
              </span>
            </div>
          </div>
        </div>

        {/* Real-time Data Display */}
        {isRunning && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                实时数据
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <DataDisplay label="电压" value={realtimeData.voltage} unit="V" />
                <DataDisplay label="电流" value={realtimeData.current} unit="A" />
                <DataDisplay label="功率" value={realtimeData.power} unit="W" />
                <DataDisplay label="功率因数" value={realtimeData.powerFactor} />
                <DataDisplay label="温度" value={realtimeData.temperature} unit="°C" trend="up" />
                <DataDisplay label="状态" value={realtimeData.status} />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Experiment Configuration */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  实验配置
                </CardTitle>
                <CardDescription>选择实验类型并设置参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Experiment Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="experiment-type">实验类型</Label>
                  <Select
                    value={experimentType}
                    onValueChange={setExperimentType}
                    disabled={isRunning}
                  >
                    <SelectTrigger id="experiment-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW_VOLTAGE_HIGH_CURRENT">
                        单低压高电流测试
                      </SelectItem>
                      <SelectItem value="DUAL_POWER_SWITCH">
                        双电源切换实验
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Low Voltage High Current Parameters */}
                {experimentType === 'LOW_VOLTAGE_HIGH_CURRENT' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="voltage">电压设定 (V)</Label>
                        <Input
                          id="voltage"
                          type="number"
                          value={voltage}
                          onChange={(e) => setVoltage(e.target.value)}
                          min="1"
                          max="50"
                          step="0.01"
                          disabled={isRunning}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="current">电流设定 (A)</Label>
                        <Input
                          id="current"
                          type="number"
                          value={current}
                          onChange={(e) => setCurrent(e.target.value)}
                          min="0"
                          max="1000"
                          step="0.1"
                          disabled={isRunning}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">测试时长 (秒)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          min="1"
                          disabled={isRunning}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sampling-rate">采样频率 (Hz)</Label>
                        <Select
                          value={samplingRate}
                          onValueChange={setSamplingRate}
                          disabled={isRunning}
                        >
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
                    </div>
                  </div>
                )}

                {/* Dual Power Switch Parameters */}
                {experimentType === 'DUAL_POWER_SWITCH' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="switch-threshold">切换阈值 (V)</Label>
                        <Input
                          id="switch-threshold"
                          type="number"
                          value={switchThreshold}
                          onChange={(e) => setSwitchThreshold(e.target.value)}
                          min="0"
                          step="0.1"
                          disabled={isRunning}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="switch-delay">切换延时 (ms)</Label>
                        <Input
                          id="switch-delay"
                          type="number"
                          value={switchDelay}
                          onChange={(e) => setSwitchDelay(e.target.value)}
                          min="0"
                          disabled={isRunning}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="switch-count">切换次数</Label>
                      <Input
                        id="switch-count"
                        type="number"
                        value={switchCount}
                        onChange={(e) => setSwitchCount(e.target.value)}
                        min="1"
                        disabled={isRunning}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  快速控制
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isRunning ? (
                  <Button
                    onClick={handleStart}
                    className="w-full h-12 text-lg"
                    variant="industrial"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    启动实验
                  </Button>
                ) : (
                  <Button
                    onClick={handleStop}
                    className="w-full h-12 text-lg"
                    variant="destructive"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    停止实验
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={!isRunning}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  紧急停止
                </Button>
              </CardContent>
            </Card>

            {/* Status Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  设备状态
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Modbus连接</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    <span className="text-sm">已连接</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">设备温度</span>
                  <span className="text-sm">45.2°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">运行时长</span>
                  <span className="text-sm">02:34:56</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Experiments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  最近实验
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded hover:bg-industrial-card/50 cursor-pointer transition-colors"
                    >
                      <div className="text-sm">
                        <div className="font-medium">EXP-2024-{String(i).padStart(3, '0')}</div>
                        <div className="text-xs text-muted-foreground">低压高电流测试</div>
                      </div>
                      <div className="text-xs text-green-400">已完成</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}