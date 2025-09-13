'use client';

import { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Settings2,
  Maximize2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';

// 生成模拟数据
function generateMockData() {
  const now = new Date();
  const data = [];
  
  for (let i = 30; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 2000);
    data.push({
      time: time.toLocaleTimeString('zh-CN'),
      voltage: 38 + Math.random() * 2,
      current: 8 + Math.random() * 0.5,
      power: (38 + Math.random() * 2) * (8 + Math.random() * 0.5),
      temperature: 25 + Math.random() * 2,
    });
  }
  
  return data;
}

// 设备模拟数据
const mockDevices = [
  { id: '1', name: '电源设备-01', type: 'power_supply', status: 'online' },
  { id: '2', name: '电子负载-01', type: 'electronic_load', status: 'online' },
  { id: '3', name: '温度传感器-01', type: 'temperature_sensor', status: 'online' },
  { id: '4', name: '光照传感器-01', type: 'irradiance_sensor', status: 'offline' },
];

export default function MonitorPage() {
  const [data, setData] = useState(generateMockData());
  const [selectedParam, setSelectedParam] = useState('all');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // 模拟实时数据更新
  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)];
        const lastTime = new Date();
        newData.push({
          time: lastTime.toLocaleTimeString('zh-CN'),
          voltage: 38 + Math.random() * 2,
          current: 8 + Math.random() * 0.5,
          power: (38 + Math.random() * 2) * (8 + Math.random() * 0.5),
          temperature: 25 + Math.random() * 2,
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和控制 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">实时监控</h1>
          <p className="text-[var(--text-secondary)] mt-1">设备状态和数据实时监控</p>
        </div>
        <div className="flex gap-3">
          <button
            className={`industrial-button ${isAutoRefresh ? 'primary' : ''}`}
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 ${isAutoRefresh ? 'animate-spin' : ''}`} />
            {isAutoRefresh ? '自动刷新' : '已暂停'}
          </button>
          <button className="industrial-button">
            <Settings2 className="w-4 h-4" />
            监控设置
          </button>
        </div>
      </div>

      {/* 设备状态 */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">设备状态</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockDevices.map((device) => (
              <div
                key={device.id}
                className="p-4 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-[var(--text-primary)]">{device.name}</h3>
                  {device.status === 'online' ? (
                    <Wifi className="w-5 h-5 text-green-500" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  类型: {device.type === 'power_supply' ? '电源' : 
                        device.type === 'electronic_load' ? '电子负载' :
                        device.type === 'temperature_sensor' ? '温度传感器' : '光照传感器'}
                </p>
                <div className="mt-2">
                  <span className={`status-indicator ${device.status}`}>
                    {device.status === 'online' ? '在线' : '离线'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 实时数据图表 */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">实时数据曲线</h2>
            <div className="flex gap-2">
              <select
                value={selectedParam}
                onChange={(e) => setSelectedParam(e.target.value)}
                className="industrial-input py-1 px-3"
              >
                <option value="all">全部参数</option>
                <option value="voltage">电压</option>
                <option value="current">电流</option>
                <option value="power">功率</option>
                <option value="temperature">温度</option>
              </select>
              <button className="industrial-button p-2">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="time" 
                  stroke="var(--text-muted)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="var(--text-muted)"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                
                {(selectedParam === 'all' || selectedParam === 'voltage') && (
                  <Line
                    type="monotone"
                    dataKey="voltage"
                    stroke="var(--chart-1)"
                    name="电压 (V)"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {(selectedParam === 'all' || selectedParam === 'current') && (
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="var(--chart-2)"
                    name="电流 (A)"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {(selectedParam === 'all' || selectedParam === 'power') && (
                  <Line
                    type="monotone"
                    dataKey="power"
                    stroke="var(--chart-3)"
                    name="功率 (W)"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {(selectedParam === 'all' || selectedParam === 'temperature') && (
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="var(--chart-4)"
                    name="温度 (°C)"
                    strokeWidth={2}
                    dot={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* 实时数据值 */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">当前测量值</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">电压</p>
              <p className="text-3xl font-bold text-[var(--primary)]">
                {data[data.length - 1]?.voltage.toFixed(1)} V
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">电流</p>
              <p className="text-3xl font-bold text-[var(--chart-2)]">
                {data[data.length - 1]?.current.toFixed(2)} A
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">功率</p>
              <p className="text-3xl font-bold text-[var(--chart-3)]">
                {data[data.length - 1]?.power.toFixed(1)} W
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">温度</p>
              <p className="text-3xl font-bold text-[var(--chart-4)]">
                {data[data.length - 1]?.temperature.toFixed(1)} °C
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}