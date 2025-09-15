'use client';

import { useState } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Filter,
  Search,
  Bell,
  X
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AlertsPage() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 模拟告警数据
  const alerts = [
    {
      id: '1',
      type: 'warning',
      severity: 'high',
      title: '温度接近警告阈值',
      message: '设备温度已达到82°C，接近85°C的警告阈值',
      device: '温度传感器-001',
      timestamp: '2025-01-13 14:30:25',
      status: 'active',
      resolved: false
    },
    {
      id: '2',
      type: 'error',
      severity: 'critical',
      title: '设备连接断开',
      message: 'Modbus设备连接已断开，请检查网络连接',
      device: '电源模块-002',
      timestamp: '2025-01-13 13:45:12',
      status: 'active',
      resolved: false
    },
    {
      id: '3',
      type: 'info',
      severity: 'low',
      title: '数据采集完成',
      message: '实验数据采集已完成，共采集12850个数据点',
      device: '数据采集器-001',
      timestamp: '2025-01-13 12:15:30',
      status: 'resolved',
      resolved: true
    },
    {
      id: '4',
      type: 'warning',
      severity: 'medium',
      title: '电压波动异常',
      message: '检测到电压在短时间内波动超过5%',
      device: '电压监测器-001',
      timestamp: '2025-01-13 11:20:45',
      status: 'active',
      resolved: false
    },
    {
      id: '5',
      type: 'error',
      severity: 'high',
      title: '电流超限',
      message: '电流值超过20A的安全阈值',
      device: '电流传感器-001',
      timestamp: '2025-01-13 10:30:15',
      status: 'resolved',
      resolved: true
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5" />;
      case 'high': return <AlertCircle className="w-5 h-5" />;
      case 'medium': return <Clock className="w-5 h-5" />;
      case 'low': return <Bell className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.status === filter;
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.device.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">告警管理</h1>
          <p className="text-[var(--text-secondary)] mt-1">系统告警监控和处理</p>
        </div>
        <button className="industrial-button primary">
          <Bell className="w-4 h-4" />
          告警设置
        </button>
      </div>

      {/* 告警统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">活跃告警</p>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  {activeAlerts.length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">已解决</p>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  {resolvedAlerts.length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">高优先级</p>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  {alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">今日告警</p>
                <p className="text-2xl font-semibold text-[var(--text-primary)]">
                  {alerts.length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="搜索告警..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="industrial-input pl-10 w-full"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className={`industrial-button ${filter === 'all' ? 'primary' : ''}`}
                onClick={() => setFilter('all')}
              >
                全部 ({alerts.length})
              </button>
              <button
                className={`industrial-button ${filter === 'active' ? 'primary' : ''}`}
                onClick={() => setFilter('active')}
              >
                活跃 ({activeAlerts.length})
              </button>
              <button
                className={`industrial-button ${filter === 'resolved' ? 'primary' : ''}`}
                onClick={() => setFilter('resolved')}
              >
                已解决 ({resolvedAlerts.length})
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 告警列表 */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">告警列表</h2>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  alert.resolved 
                    ? 'bg-[var(--bg-primary)] border-[var(--border)] opacity-75'
                    : `bg-[var(--bg-secondary)] ${getSeverityColor(alert.severity)}`
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[var(--text-primary)]">
                          {alert.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        {alert.resolved && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                            已解决
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--text-secondary)] text-sm mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                        <span>设备: {alert.device}</span>
                        <span>时间: {alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!alert.resolved && (
                      <button className="industrial-button">
                        <CheckCircle className="w-4 h-4" />
                        解决
                      </button>
                    )}
                    <button className="industrial-button">
                      <X className="w-4 h-4" />
                      忽略
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                <p className="text-[var(--text-secondary)]">没有找到匹配的告警</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
