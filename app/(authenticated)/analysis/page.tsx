'use client';

import { useState } from 'react';
import { 
  FileText, 
  Download,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { 
  LineChart as RechartsLineChart, 
  Line,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from 'recharts';

// 关断器测试曲线数据 - 电流和电压保持相同下降趋势
const ivCurveData = Array.from({ length: 50 }, (_, i) => {
  const voltage = i * 0.8;
  // 模拟关断器测试：电流在关断前保持较高值，关断后快速下降
  let current;
  
  // 模拟真实的I-V特性曲线，确保电流和电压趋势一致
  if (voltage < 16) {
    // 关断前：电流保持较高水平，电压也保持较高水平
    current = 9.5 - (voltage / 16) * 0.5 + Math.random() * 0.2 - 0.1;
  } else if (voltage < 24) {
    // 关断区间：电流快速下降，电压也快速下降
    const progress = (voltage - 16) / 8;
    current = 9 - progress * 7.5 + Math.random() * 0.3 - 0.15;
  } else {
    // 关断后：电流稳定在较低水平，电压也稳定在较低水平
    current = 1.2 + Math.random() * 0.2 - 0.1;
  }
  
  const finalCurrent = Math.max(0.1, current); // 确保电流不会完全为0
  
  // 计算电压，确保电压值始终在20V左右
  let voltageValue;
  if (voltage < 16) {
    // 关断前：电压保持在20V左右，有轻微波动
    voltageValue = 20 + Math.random() * 0.4 - 0.2; // 19.8V - 20.2V
  } else if (voltage < 24) {
    // 关断区间：电压保持在20V左右，有轻微波动
    voltageValue = 20 + Math.random() * 0.4 - 0.2; // 19.8V - 20.2V
  } else {
    // 关断后：电压仍然保持在20V左右
    voltageValue = 20 + Math.random() * 0.4 - 0.2; // 19.8V - 20.2V
  }
  
  return {
    voltage,
    current: finalCurrent,
    voltageValue: Math.max(19.5, Math.min(20.5, voltageValue)) // 确保电压在19.5V-20.5V范围内
  };
});

// 关断器测试效率趋势数据 - 显示关断前后的效率变化
const efficiencyTrendData = [
  { date: '2005-08-01', efficiency: 19.2, temperature: 25, status: '正常' },
  { date: '2005-08-02', efficiency: 19.0, temperature: 24, status: '正常' },
  { date: '2005-08-03', efficiency: 19.1, temperature: 23, status: '正常' },
  { date: '2005-08-04', efficiency: 19.3, temperature: 26, status: '正常' },
  { date: '2005-08-05', efficiency: 19.0, temperature: 24, status: '正常' },
  { date: '2005-08-06', efficiency: 19.2, temperature: 22, status: '正常' },
  { date: '2025-01-13', efficiency: 2.1, temperature: 23, status: '关断后' }, // 关断后效率大幅下降
];

// 关断器测试类型分布 - 1242条数据
const moduleTypeData = [
  { name: '正常工况', value: 79.6, count: 989 }, // 989条
  { name: '耐压测试', value: 1.9, count: 24 },   // 24条
  { name: '泄露电流', value: 1.5, count: 18 },   // 18条
  { name: '异常工况', value: 17.0, count: 211 }, // 剩余211条
];

export default function AnalysisPage() {
  const [selectedAnalysis, setSelectedAnalysis] = useState('iv-curve');
  const [dateRange, setDateRange] = useState('week');

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">数据分析</h1>
          <p className="text-[var(--text-secondary)] mt-1">深入分析测试数据和生成报告</p>
        </div>
        <button className="industrial-button primary">
          <FileText className="w-4 h-4" />
          生成报告
        </button>
      </div>

      {/* 分析类型选择 */}
      <Card>
        <div className="p-4">
          <div className="flex flex-wrap gap-3">
            <button
              className={`industrial-button ${selectedAnalysis === 'iv-curve' ? 'primary' : ''}`}
              onClick={() => setSelectedAnalysis('iv-curve')}
            >
              <LineChart className="w-4 h-4" />
              I-V/P-V曲线
            </button>
            <button
              className={`industrial-button ${selectedAnalysis === 'efficiency' ? 'primary' : ''}`}
              onClick={() => setSelectedAnalysis('efficiency')}
            >
              <TrendingUp className="w-4 h-4" />
              效率分析
            </button>
            <button
              className={`industrial-button ${selectedAnalysis === 'distribution' ? 'primary' : ''}`}
              onClick={() => setSelectedAnalysis('distribution')}
            >
              <PieChart className="w-4 h-4" />
              数据分布
            </button>
            <button
              className={`industrial-button ${selectedAnalysis === 'comparison' ? 'primary' : ''}`}
              onClick={() => setSelectedAnalysis('comparison')}
            >
              <BarChart3 className="w-4 h-4" />
              对比分析
            </button>
          </div>
        </div>
      </Card>

      {/* I-V/P-V曲线分析 */}
      {selectedAnalysis === 'iv-curve' && (
        <>
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">I-V / P-V 特性曲线</h2>
                <button className="industrial-button">
                  <Download className="w-4 h-4" />
                  导出数据
                </button>
              </div>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={ivCurveData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="voltage" 
                      stroke="var(--text-muted)"
                      label={{ value: '电压 (V)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="var(--text-muted)"
                      label={{ value: '电流 (A)', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="var(--text-muted)"
                      label={{ value: '电压 (V)', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="current"
                      stroke="var(--chart-1)"
                      name="电流"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="voltageValue"
                      stroke="var(--chart-3)"
                      name="电压"
                      strokeWidth={2}
                      dot={false}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
              
              {/* 关键参数 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--border)]">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">关断前电压</p>
                  <p className="text-xl font-semibold text-[var(--text-primary)]">20.1 V</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">关断前电流</p>
                  <p className="text-xl font-semibold text-[var(--text-primary)]">9.12 A</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">关断后电流</p>
                  <p className="text-xl font-semibold text-red-500">1.2 A</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">关断时间</p>
                  <p className="text-xl font-semibold text-[var(--text-primary)]">0.4s</p>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* 效率分析 */}
      {selectedAnalysis === 'efficiency' && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">效率趋势分析</h2>
              <div className="flex gap-3">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="industrial-input py-1 px-3"
                >
                  <option value="week">最近一周</option>
                  <option value="month">最近一月</option>
                  <option value="year">最近一年</option>
                </select>
                <button className="industrial-button">
                  <Download className="w-4 h-4" />
                  导出
                </button>
              </div>
            </div>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={efficiencyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-muted)"
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="var(--text-muted)"
                    domain={[0, 20]}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="var(--text-muted)"
                    domain={[20, 30]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="efficiency"
                    stroke="var(--chart-2)"
                    name="效率 (%)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--chart-2)' }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="temperature"
                    stroke="var(--chart-4)"
                    name="温度 (°C)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            
            {/* 统计信息 */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[var(--border)]">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">平均效率</p>
                <p className="text-xl font-semibold text-[var(--text-primary)]">15.1%</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">最高效率</p>
                <p className="text-xl font-semibold text-green-500">19.3%</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">关断后效率</p>
                <p className="text-xl font-semibold text-red-500">2.1%</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 数据分布 */}
      {selectedAnalysis === 'distribution' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                关断器测试类型分布
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moduleTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" />
                    <YAxis stroke="var(--text-muted)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="var(--chart-1)" name="百分比 (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                测试数量统计
              </h2>
              <div className="space-y-4">
                {moduleTypeData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: `var(--chart-${index + 1})` }}
                      />
                      <span className="text-[var(--text-primary)]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[var(--text-secondary)]">
                        {item.count} 次测试
                      </span>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {item.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 对比分析 */}
      {selectedAnalysis === 'comparison' && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">电流下降曲线对比分析</h2>
              <button className="industrial-button">
                <Download className="w-4 h-4" />
                导出对比数据
              </button>
            </div>
            
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={[
                  // 第一条曲线：15A在0.8秒内下降到1A左右
                  ...Array.from({ length: 40 }, (_, i) => {
                    const time = i * 0.02; // 0.02秒间隔
                    let current;
                    if (time < 0.8) {
                      // 0.8秒内从15A下降到1A
                      const progress = time / 0.8;
                      current = 15 - progress * 14 + Math.random() * 0.2 - 0.1;
                    } else {
                      // 0.8秒后稳定在1A左右
                      current = 1 + Math.random() * 0.2 - 0.1;
                    }
                    return {
                      time,
                      curve1: Math.max(0, current),
                      curve2: null
                    };
                  }),
                  // 第二条曲线：30A在0.98秒内下降到1A左右
                  ...Array.from({ length: 50 }, (_, i) => {
                    const time = i * 0.02; // 0.02秒间隔
                    let current;
                    if (time < 0.98) {
                      // 0.98秒内从30A下降到1A
                      const progress = time / 0.98;
                      current = 30 - progress * 29 + Math.random() * 0.3 - 0.15;
                    } else {
                      // 0.98秒后稳定在1A左右
                      current = 1 + Math.random() * 0.2 - 0.1;
                    }
                    return {
                      time,
                      curve1: null,
                      curve2: Math.max(0, current)
                    };
                  })
                ].filter(item => item.curve1 !== null || item.curve2 !== null)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="var(--text-muted)"
                    label={{ value: '时间 (秒)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    stroke="var(--text-muted)"
                    label={{ value: '电流 (A)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="curve1"
                    stroke="#3b82f6"
                    name="测试曲线1 (15A→1A)"
                    strokeWidth={3}
                    dot={false}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="curve2"
                    stroke="#ef4444"
                    name="测试曲线2 (30A→1A)"
                    strokeWidth={3}
                    dot={false}
                    connectNulls={false}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            
            {/* 对比分析结果 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--border)]">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">曲线1初始电流</p>
                <p className="text-xl font-semibold text-blue-500">15.0 A</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">曲线1关断时间</p>
                <p className="text-xl font-semibold text-blue-500">0.8s</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">曲线2初始电流</p>
                <p className="text-xl font-semibold text-red-500">30.0 A</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">曲线2关断时间</p>
                <p className="text-xl font-semibold text-red-500">0.98s</p>
              </div>
            </div>

            {/* 分析结论 */}
            <div className="mt-6 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">分析结论</h3>
              <div className="space-y-2 text-[var(--text-secondary)]">
                <p>• <strong className="text-[var(--text-primary)]">关断性能对比：</strong>曲线1关断时间更短(0.8s vs 0.98s)，响应更快</p>
                <p>• <strong className="text-[var(--text-primary)]">电流下降趋势：</strong>两条曲线都表现出良好的线性下降特性</p>
                <p>• <strong className="text-[var(--text-primary)]">最终稳定值：</strong>两条曲线最终都稳定在1A左右，符合预期</p>
                <p>• <strong className="text-[var(--text-primary)]">性能评估：</strong>曲线1在高电流下表现更优，关断效率更高</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
