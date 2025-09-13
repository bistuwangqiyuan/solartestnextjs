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

// IV曲线数据
const ivCurveData = Array.from({ length: 50 }, (_, i) => {
  const voltage = i * 0.8;
  const current = Math.max(0, 9 - voltage * 0.18 - Math.random() * 0.2);
  return {
    voltage,
    current,
    power: voltage * current
  };
});

// 效率趋势数据
const efficiencyTrendData = [
  { date: '2025-01-07', efficiency: 18.5, temperature: 25 },
  { date: '2025-01-08', efficiency: 18.8, temperature: 24 },
  { date: '2025-01-09', efficiency: 19.0, temperature: 23 },
  { date: '2025-01-10', efficiency: 18.6, temperature: 26 },
  { date: '2025-01-11', efficiency: 18.9, temperature: 24 },
  { date: '2025-01-12', efficiency: 19.2, temperature: 22 },
  { date: '2025-01-13', efficiency: 19.1, temperature: 23 },
];

// 组件类型分布
const moduleTypeData = [
  { name: '单晶硅', value: 45, count: 180 },
  { name: '多晶硅', value: 30, count: 120 },
  { name: '薄膜', value: 15, count: 60 },
  { name: '其他', value: 10, count: 40 },
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
                  <LineChart data={ivCurveData}>
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
                      label={{ value: '功率 (W)', angle: 90, position: 'insideRight' }}
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
                      dataKey="power"
                      stroke="var(--chart-3)"
                      name="功率"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* 关键参数 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--border)]">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">开路电压 (Voc)</p>
                  <p className="text-xl font-semibold text-[var(--text-primary)]">39.8 V</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">短路电流 (Isc)</p>
                  <p className="text-xl font-semibold text-[var(--text-primary)]">9.12 A</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">最大功率 (Pmax)</p>
                  <p className="text-xl font-semibold text-[var(--text-primary)]">320.5 W</p>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">填充因子 (FF)</p>
                  <p className="text-xl font-semibold text-[var(--text-primary)]">0.78</p>
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
                <LineChart data={efficiencyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-muted)"
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="var(--text-muted)"
                    domain={[18, 20]}
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
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* 统计信息 */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[var(--border)]">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">平均效率</p>
                <p className="text-xl font-semibold text-[var(--text-primary)]">18.9%</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">最高效率</p>
                <p className="text-xl font-semibold text-green-500">19.2%</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">最低效率</p>
                <p className="text-xl font-semibold text-orange-500">18.5%</p>
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
                组件类型分布
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
    </div>
  );
}