'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  Thermometer, 
  Sun, 
  AlertTriangle,
  TrendingUp,
  Database,
  Beaker
} from 'lucide-react';
import { DataDisplay } from '@/components/ui/data-display';
import { Card } from '@/components/ui/card';

// 模拟实时数据
function useRealtimeData() {
  const [data, setData] = useState({
    voltage: 38.5,
    current: 8.2,
    power: 315.7,
    temperature: 25.4,
    irradiance: 850,
    efficiency: 18.5,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        voltage: prev.voltage + (Math.random() - 0.5) * 0.5,
        current: prev.current + (Math.random() - 0.5) * 0.2,
        power: prev.voltage * prev.current,
        temperature: prev.temperature + (Math.random() - 0.5) * 0.3,
        irradiance: prev.irradiance + (Math.random() - 0.5) * 10,
        efficiency: 18.5 + (Math.random() - 0.5) * 0.5,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return data;
}

export default function DashboardPage() {
  const realtimeData = useRealtimeData();
  
  const systemStatus = {
    devicesOnline: 4,
    activeExperiments: 2,
    dataPointsToday: 12850,
    activeAlerts: 1,
  };

  const recentAlerts = [
    {
      id: '1',
      type: 'warning',
      message: '温度接近警告阈值',
      time: '10分钟前',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">仪表板</h1>
        <p className="text-[var(--text-secondary)] mt-1">系统运行状态概览</p>
      </div>

      {/* 实时数据展示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <DataDisplay
          label="电压"
          value={realtimeData.voltage.toFixed(1)}
          unit="V"
          icon={<Zap className="w-5 h-5" />}
          trend="up"
        />
        <DataDisplay
          label="电流"
          value={realtimeData.current.toFixed(2)}
          unit="A"
          icon={<Activity className="w-5 h-5" />}
          trend="stable"
        />
        <DataDisplay
          label="功率"
          value={realtimeData.power.toFixed(1)}
          unit="W"
          icon={<TrendingUp className="w-5 h-5" />}
          trend="up"
        />
        <DataDisplay
          label="温度"
          value={realtimeData.temperature.toFixed(1)}
          unit="°C"
          icon={<Thermometer className="w-5 h-5" />}
          trend="stable"
        />
        <DataDisplay
          label="光照强度"
          value={realtimeData.irradiance.toFixed(0)}
          unit="W/m²"
          icon={<Sun className="w-5 h-5" />}
          trend="up"
        />
        <DataDisplay
          label="效率"
          value={realtimeData.efficiency.toFixed(1)}
          unit="%"
          icon={<TrendingUp className="w-5 h-5" />}
          trend="stable"
        />
      </div>

      {/* 系统状态和告警 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 系统状态 */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">系统状态</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[var(--bg-primary)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">在线设备</p>
                      <p className="text-xl font-semibold text-[var(--text-primary)]">
                        {systemStatus.devicesOnline}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-[var(--bg-primary)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Beaker className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">活跃实验</p>
                      <p className="text-xl font-semibold text-[var(--text-primary)]">
                        {systemStatus.activeExperiments}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[var(--bg-primary)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Database className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">今日数据点</p>
                      <p className="text-xl font-semibold text-[var(--text-primary)]">
                        {systemStatus.dataPointsToday.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-[var(--bg-primary)] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">活跃告警</p>
                      <p className="text-xl font-semibold text-[var(--text-primary)]">
                        {systemStatus.activeAlerts}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 最近告警 */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">最近告警</h2>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-[var(--text-primary)]">{alert.message}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {recentAlerts.length === 0 && (
                <p className="text-sm text-[var(--text-muted)] text-center py-8">
                  暂无告警信息
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* 快速操作 */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">快速操作</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="industrial-button">
              <Beaker className="w-4 h-4" />
              新建实验
            </button>
            <button className="industrial-button">
              <Database className="w-4 h-4" />
              导出数据
            </button>
            <button className="industrial-button">
              <Activity className="w-4 h-4" />
              设备检查
            </button>
            <button className="industrial-button">
              <AlertTriangle className="w-4 h-4" />
              查看告警
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
