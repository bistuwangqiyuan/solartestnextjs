'use client'

import { useState, useEffect } from 'react'
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
  Settings,
  Save,
  FileText,
  Plus
} from 'lucide-react'
import { experimentService } from '@/lib/services/experiment'
import { useAuthStore } from '@/lib/store/auth-store'
import { useModbusStore } from '@/lib/store/modbus-store'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function ExperimentPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { devices, loadDevices, startPolling, stopPolling, readAllDevicesData } = useModbusStore()
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [experimentName, setExperimentName] = useState('')
  const [experimentDescription, setExperimentDescription] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [currentExperimentId, setCurrentExperimentId] = useState<string | null>(null)
  const [recentExperiments, setRecentExperiments] = useState<any[]>([])
  const [runningExperiments, setRunningExperiments] = useState<any[]>([])
  const [realtimeData, setRealtimeData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  // Low Voltage High Current Parameters
  const [voltage, setVoltage] = useState('20')
  const [current, setCurrent] = useState('100')
  const [duration, setDuration] = useState('60')
  const [samplingRate, setSamplingRate] = useState('100')
  
  // Dual Power Switch Parameters
  const [switchThreshold, setSwitchThreshold] = useState('10')
  const [switchDelay, setSwitchDelay] = useState('50')
  const [switchCount, setSwitchCount] = useState('10')
  
  // Temperature coefficient test parameters
  const [tempRange, setTempRange] = useState({ min: '15', max: '75', step: '5' })
  const [irradiance, setIrradiance] = useState('1000')
  
  // Low light test parameters
  const [irradianceLevels, setIrradianceLevels] = useState('200,400,600,800,1000')
  const [testTemperature, setTestTemperature] = useState('25')

  useEffect(() => {
    loadTemplates()
    loadRecentExperiments()
    loadRunningExperiments()
    loadDevices()
  }, [])

  useEffect(() => {
    if (isRunning && currentExperimentId) {
      const interval = setInterval(() => {
        generateRealtimeData()
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isRunning, currentExperimentId])

  const loadTemplates = async () => {
    try {
      const data = await experimentService.getTemplates()
      setTemplates(data)
      if (data.length > 0) {
        setSelectedTemplate(data[0].id)
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  const loadRecentExperiments = async () => {
    try {
      const data = await experimentService.getRecentExperiments(5)
      setRecentExperiments(data)
    } catch (error) {
      console.error('Failed to load recent experiments:', error)
    }
  }

  const loadRunningExperiments = async () => {
    try {
      const data = await experimentService.getRunningExperiments()
      setRunningExperiments(data)
    } catch (error) {
      console.error('Failed to load running experiments:', error)
    }
  }

  const generateRealtimeData = async () => {
    if (!currentExperimentId) return

    const template = templates.find(t => t.id === selectedTemplate)
    const testType = template?.parameters?.test_type || 'iv_curve'

    // 尝试从Modbus设备读取真实数据
    let modbusData: any = {}
    
    // 读取所有设备数据
    await readAllDevicesData()
    
    // 收集各设备的数据
    devices.forEach(device => {
      if (device.lastData) {
        if (device.type === 'power_supply') {
          modbusData.voltage = device.lastData.voltage
          modbusData.current = device.lastData.current
          modbusData.power = device.lastData.power
        } else if (device.type === 'weather_station') {
          modbusData.temperature = device.lastData.temperature
          modbusData.humidity = device.lastData.humidity
          modbusData.irradiance = device.lastData.irradiance
        }
      }
    })

    // 如果没有Modbus数据，使用模拟数据
    let data: any = {
      timestamp: new Date().toISOString(),
      temperature: modbusData.temperature || (25 + Math.random() * 5),
      humidity: modbusData.humidity || (45 + Math.random() * 10),
      irradiance: modbusData.irradiance || (parseFloat(irradiance) + (Math.random() - 0.5) * 50)
    }

    if (testType === 'iv_curve') {
      const v = modbusData.voltage || (parseFloat(voltage) + (Math.random() - 0.5) * 2)
      const i = modbusData.current || (parseFloat(current) + (Math.random() - 0.5) * 5)
      data = {
        ...data,
        voltage: v,
        current: i,
        power: modbusData.power || (v * i),
        efficiency: (v * i) / (data.irradiance * 1) * 100
      }
    } else if (testType === 'bypass_diode') {
      data = {
        ...data,
        reverse_current: 1.25 + (Math.random() - 0.5) * 0.1,
        diode_temperature: 65 + Math.random() * 10,
        forward_voltage: 0.7 + (Math.random() - 0.5) * 0.05
      }
    }

    setRealtimeData(data)

    // 保存数据到数据库
    try {
      await experimentService.saveTestData(currentExperimentId, data)
    } catch (error) {
      console.error('Failed to save test data:', error)
    }
  }

  const handleStart = async () => {
    if (!experimentName.trim()) {
      toast.error('请输入实验名称')
      return
    }

    if (!user) {
      toast.error('请先登录')
      return
    }

    if (user.role === 'observer') {
      toast.error('观察员无法启动实验')
      return
    }

    setLoading(true)
    try {
      // 获取当前参数
      const parameters = getExperimentParameters()

      // 创建实验
      const experiment = await experimentService.createExperiment({
        name: experimentName,
        description: experimentDescription,
        templateId: selectedTemplate,
        parameters,
        tags: [templates.find(t => t.id === selectedTemplate)?.category || 'test']
      })

      // 启动实验
      await experimentService.startExperiment(experiment.id)
      
      setCurrentExperimentId(experiment.id)
      setIsRunning(true)
      
      // 启动Modbus数据轮询
      startPolling()
      
      toast.success('实验已启动')
      
      // 刷新运行中的实验列表
      loadRunningExperiments()
    } catch (error) {
      console.error('Failed to start experiment:', error)
      toast.error('启动实验失败')
    } finally {
      setLoading(false)
    }
  }

  const handleStop = async () => {
    if (!currentExperimentId) return

    setLoading(true)
    try {
      await experimentService.stopExperiment(currentExperimentId, 'completed')
      setIsRunning(false)
      setCurrentExperimentId(null)
      
      // 停止Modbus数据轮询
      stopPolling()
      
      toast.success('实验已停止')
      
      // 清空实验名称供下次使用
      setExperimentName('')
      setExperimentDescription('')
      
      // 刷新列表
      loadRecentExperiments()
      loadRunningExperiments()
    } catch (error) {
      console.error('Failed to stop experiment:', error)
      toast.error('停止实验失败')
    } finally {
      setLoading(false)
    }
  }

  const handleEmergencyStop = async () => {
    if (!currentExperimentId) return

    if (!confirm('确定要紧急停止实验吗？')) return

    setLoading(true)
    try {
      await experimentService.stopExperiment(currentExperimentId, 'cancelled')
      setIsRunning(false)
      setCurrentExperimentId(null)
      toast.success('实验已紧急停止')
      
      loadRecentExperiments()
      loadRunningExperiments()
    } catch (error) {
      console.error('Failed to emergency stop:', error)
      toast.error('紧急停止失败')
    } finally {
      setLoading(false)
    }
  }

  const getExperimentParameters = () => {
    const template = templates.find(t => t.id === selectedTemplate)
    const baseParams = template?.parameters || {}
    
    const testType = baseParams.test_type || 'iv_curve'
    
    if (testType === 'iv_curve') {
      return {
        ...baseParams,
        voltage_range: { min: 0, max: parseFloat(voltage), step: 0.5 },
        current_limit: parseFloat(current),
        duration: parseInt(duration),
        sampling_rate: parseInt(samplingRate),
        irradiance: parseFloat(irradiance)
      }
    } else if (testType === 'temp_coeff') {
      return {
        ...baseParams,
        temperature_range: {
          min: parseFloat(tempRange.min),
          max: parseFloat(tempRange.max),
          step: parseFloat(tempRange.step)
        },
        irradiance: parseFloat(irradiance)
      }
    } else if (testType === 'low_light') {
      return {
        ...baseParams,
        irradiance_levels: irradianceLevels.split(',').map(v => parseFloat(v.trim())),
        temperature: parseFloat(testTemperature)
      }
    } else if (testType === 'bypass_diode') {
      return {
        ...baseParams,
        reverse_current: 1.25,
        test_duration: 3600,
        temperature_monitoring: true
      }
    }
    
    return baseParams
  }

  const handleViewExperiment = (experimentId: string) => {
    router.push(`/experiment/${experimentId}`)
  }

  const getTemplateCategory = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    return template?.category || '未分类'
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
                {realtimeData?.voltage !== undefined && (
                  <DataDisplay label="电压" value={realtimeData.voltage.toFixed(2)} unit="V" />
                )}
                {realtimeData?.current !== undefined && (
                  <DataDisplay label="电流" value={realtimeData.current.toFixed(2)} unit="A" />
                )}
                {realtimeData?.power !== undefined && (
                  <DataDisplay label="功率" value={realtimeData.power.toFixed(2)} unit="W" />
                )}
                {realtimeData?.temperature !== undefined && (
                  <DataDisplay label="温度" value={realtimeData.temperature.toFixed(1)} unit="°C" />
                )}
                {realtimeData?.irradiance !== undefined && (
                  <DataDisplay label="光照强度" value={realtimeData.irradiance.toFixed(0)} unit="W/m²" />
                )}
                {realtimeData?.efficiency !== undefined && (
                  <DataDisplay label="效率" value={realtimeData.efficiency.toFixed(1)} unit="%" />
                )}
              </div>
              
              {/* 额外的数据显示 */}
              {realtimeData?.diode_temperature !== undefined && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <DataDisplay label="二极管温度" value={realtimeData.diode_temperature.toFixed(1)} unit="°C" />
                  <DataDisplay label="反向电流" value={realtimeData.reverse_current.toFixed(3)} unit="A" />
                  <DataDisplay label="正向电压" value={realtimeData.forward_voltage.toFixed(3)} unit="V" />
                </div>
              )}
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
                {/* Experiment Name */}
                <div className="space-y-2">
                  <Label htmlFor="experiment-name">实验名称</Label>
                  <Input
                    id="experiment-name"
                    value={experimentName}
                    onChange={(e) => setExperimentName(e.target.value)}
                    placeholder="输入实验名称"
                    disabled={isRunning}
                  />
                </div>

                {/* Experiment Description */}
                <div className="space-y-2">
                  <Label htmlFor="experiment-description">实验描述</Label>
                  <Input
                    id="experiment-description"
                    value={experimentDescription}
                    onChange={(e) => setExperimentDescription(e.target.value)}
                    placeholder="可选的实验描述"
                    disabled={isRunning}
                  />
                </div>

                {/* Template Selection */}
                <div className="space-y-2">
                  <Label htmlFor="template">实验模板</Label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={setSelectedTemplate}
                    disabled={isRunning}
                  >
                    <SelectTrigger id="template">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} ({template.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic Parameters based on Template */}
                {selectedTemplate && templates.find(t => t.id === selectedTemplate)?.parameters?.test_type === 'iv_curve' && (
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

                {/* Temperature Coefficient Test Parameters */}
                {selectedTemplate && templates.find(t => t.id === selectedTemplate)?.parameters?.test_type === 'temp_coeff' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="temp-min">最低温度 (°C)</Label>
                        <Input
                          id="temp-min"
                          type="number"
                          value={tempRange.min}
                          onChange={(e) => setTempRange({...tempRange, min: e.target.value})}
                          disabled={isRunning}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="temp-max">最高温度 (°C)</Label>
                        <Input
                          id="temp-max"
                          type="number"
                          value={tempRange.max}
                          onChange={(e) => setTempRange({...tempRange, max: e.target.value})}
                          disabled={isRunning}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="temp-step">温度步长 (°C)</Label>
                        <Input
                          id="temp-step"
                          type="number"
                          value={tempRange.step}
                          onChange={(e) => setTempRange({...tempRange, step: e.target.value})}
                          disabled={isRunning}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="irradiance">光照强度 (W/m²)</Label>
                      <Input
                        id="irradiance"
                        type="number"
                        value={irradiance}
                        onChange={(e) => setIrradiance(e.target.value)}
                        disabled={isRunning}
                      />
                    </div>
                  </div>
                )}

                {/* Low Light Performance Test Parameters */}
                {selectedTemplate && templates.find(t => t.id === selectedTemplate)?.parameters?.test_type === 'low_light' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="irradiance-levels">光照强度级别 (W/m²)</Label>
                      <Input
                        id="irradiance-levels"
                        value={irradianceLevels}
                        onChange={(e) => setIrradianceLevels(e.target.value)}
                        placeholder="例如: 200,400,600,800,1000"
                        disabled={isRunning}
                      />
                      <p className="text-xs text-muted-foreground">用逗号分隔多个值</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="test-temperature">测试温度 (°C)</Label>
                      <Input
                        id="test-temperature"
                        type="number"
                        value={testTemperature}
                        onChange={(e) => setTestTemperature(e.target.value)}
                        disabled={isRunning}
                      />
                    </div>
                  </div>
                )}

                {/* Bypass Diode Test Parameters */}
                {selectedTemplate && templates.find(t => t.id === selectedTemplate)?.parameters?.test_type === 'bypass_diode' && (
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
                  disabled={!isRunning || loading}
                  onClick={handleEmergencyStop}
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
                {devices.map((device) => (
                  <div key={device.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{device.name}</span>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          device.isConnected ? 'bg-green-400' : 
                          device.error ? 'bg-red-400' : 'bg-gray-400'
                        }`} />
                        <span className="text-xs">
                          {device.isConnected ? '在线' : 
                           device.error ? '错误' : '离线'}
                        </span>
                      </div>
                    </div>
                    {device.lastData && (
                      <div className="pl-4 text-xs text-muted-foreground">
                        {device.type === 'power_supply' && (
                          <div>V: {device.lastData.voltage?.toFixed(2)}V, I: {device.lastData.current?.toFixed(2)}A</div>
                        )}
                        {device.type === 'weather_station' && (
                          <div>T: {device.lastData.temperature?.toFixed(1)}°C, H: {device.lastData.humidity?.toFixed(1)}%</div>
                        )}
                        {device.lastUpdate && (
                          <div>更新: {new Date(device.lastUpdate).toLocaleTimeString('zh-CN')}</div>
                        )}
                      </div>
                    )}
                    {device.error && (
                      <div className="pl-4 text-xs text-red-400">{device.error}</div>
                    )}
                  </div>
                ))}
                {devices.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center">暂无设备</div>
                )}
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
                  {recentExperiments.length > 0 ? (
                    recentExperiments.map((exp) => (
                      <div
                        key={exp.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-industrial-card/50 cursor-pointer transition-colors"
                        onClick={() => handleViewExperiment(exp.id)}
                      >
                        <div className="text-sm flex-1">
                          <div className="font-medium truncate">{exp.name}</div>
                          <div className="text-xs text-muted-foreground">{getTemplateCategory(exp.template_id)}</div>
                        </div>
                        <div className={`text-xs ${
                          exp.status === 'completed' ? 'text-green-400' :
                          exp.status === 'running' ? 'text-blue-400' :
                          exp.status === 'cancelled' ? 'text-yellow-400' :
                          exp.status === 'failed' ? 'text-red-400' :
                          'text-gray-400'
                        }`}>
                          {exp.status === 'completed' ? '已完成' :
                           exp.status === 'running' ? '进行中' :
                           exp.status === 'cancelled' ? '已取消' :
                           exp.status === 'failed' ? '失败' :
                           '待开始'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      暂无实验记录
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}