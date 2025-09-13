'use client';

import { useState } from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  Square,
  Clock,
  CheckCircle,
  XCircle,
  Settings
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

// 模拟实验数据
const mockExperiments = [
  {
    id: '1',
    name: '标准测试条件下的IV曲线测量',
    description: '在STC条件下测量光伏组件的IV特性曲线',
    status: 'running' as const,
    progress: 65,
    startTime: new Date('2025-01-13T14:30:00'),
    estimatedEnd: new Date('2025-01-13T16:30:00'),
    parameters: {
      irradiance: 1000,
      temperature: 25,
      voltageRange: { min: 0, max: 50 },
      currentRange: { min: 0, max: 10 },
    },
  },
  {
    id: '2',
    name: '温度系数测试',
    description: '测量不同温度下的组件性能参数',
    status: 'pending' as const,
    progress: 0,
    parameters: {
      irradiance: 1000,
      temperatureRange: { min: 15, max: 65 },
      step: 5,
    },
  },
  {
    id: '3',
    name: '低辐照度性能测试',
    description: '测试组件在200-1000W/m²范围内的性能表现',
    status: 'completed' as const,
    progress: 100,
    startTime: new Date('2025-01-12T09:00:00'),
    endTime: new Date('2025-01-12T14:30:00'),
    parameters: {
      irradianceRange: { min: 200, max: 1000 },
      temperature: 25,
      step: 100,
    },
  },
];

export default function ExperimentPage() {
  const [showNewExperiment, setShowNewExperiment] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-[var(--text-muted)]" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running':
        return '进行中';
      case 'pending':
        return '等待中';
      case 'completed':
        return '已完成';
      case 'cancelled':
        return '已取消';
      default:
        return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">实验管理</h1>
          <p className="text-[var(--text-secondary)] mt-1">创建和管理测试实验</p>
        </div>
        <button 
          className="industrial-button primary"
          onClick={() => setShowNewExperiment(true)}
        >
          <Plus className="w-4 h-4" />
          新建实验
        </button>
      </div>

      {/* 实验列表 */}
      <div className="grid gap-4">
        {mockExperiments.map((experiment) => (
          <Card key={experiment.id}>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(experiment.status)}
                    <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                      {experiment.name}
                    </h3>
                    <span className={`status-indicator ${experiment.status === 'running' ? 'online' : experiment.status === 'completed' ? 'online' : 'offline'}`}>
                      {getStatusText(experiment.status)}
                    </span>
                  </div>
                  
                  <p className="text-[var(--text-secondary)] mb-4">
                    {experiment.description}
                  </p>
                  
                  {/* 进度条 */}
                  {experiment.status === 'running' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--text-secondary)]">进度</span>
                        <span className="text-sm font-medium text-[var(--primary)]">
                          {experiment.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-[var(--bg-primary)] rounded-full h-2">
                        <div 
                          className="bg-[var(--primary)] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${experiment.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* 时间信息 */}
                  <div className="flex gap-6 text-sm text-[var(--text-secondary)]">
                    {experiment.startTime && (
                      <div>
                        <span className="mr-1">开始时间:</span>
                        <span className="text-[var(--text-primary)]">
                          {formatDate(experiment.startTime)}
                        </span>
                      </div>
                    )}
                    {experiment.estimatedEnd && experiment.status === 'running' && (
                      <div>
                        <span className="mr-1">预计结束:</span>
                        <span className="text-[var(--text-primary)]">
                          {formatDate(experiment.estimatedEnd)}
                        </span>
                      </div>
                    )}
                    {experiment.endTime && (
                      <div>
                        <span className="mr-1">结束时间:</span>
                        <span className="text-[var(--text-primary)]">
                          {formatDate(experiment.endTime)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex gap-2 ml-4">
                  {experiment.status === 'pending' && (
                    <button className="industrial-button primary">
                      <Play className="w-4 h-4" />
                      开始
                    </button>
                  )}
                  {experiment.status === 'running' && (
                    <>
                      <button className="industrial-button">
                        <Pause className="w-4 h-4" />
                        暂停
                      </button>
                      <button className="industrial-button">
                        <Square className="w-4 h-4" />
                        停止
                      </button>
                    </>
                  )}
                  <button className="industrial-button">
                    <Settings className="w-4 h-4" />
                    配置
                  </button>
                </div>
              </div>
              
              {/* 参数展示 */}
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                  实验参数
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {Object.entries(experiment.parameters).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-[var(--text-muted)]">{key}:</span>
                      <span className="ml-1 text-[var(--text-primary)]">
                        {typeof value === 'object' ? JSON.stringify(value) : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 新建实验对话框 */}
      {showNewExperiment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                新建实验
              </h2>
              {/* 这里可以添加实验配置表单 */}
              <div className="flex gap-3 justify-end mt-6">
                <button 
                  className="industrial-button"
                  onClick={() => setShowNewExperiment(false)}
                >
                  取消
                </button>
                <button className="industrial-button primary">
                  创建实验
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
