'use client';

import { useState } from 'react';
import { 
  Search, 
  Download, 
  Upload, 
  Filter,
  MoreVertical,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

// 模拟数据
const mockData = [
  {
    id: '1',
    experimentName: '晶硅组件测试-001',
    date: new Date('2025-01-13T09:15:00'),
    voltage: 39.9,
    current: 9.02,
    power: 359.9,
    temperature: 25.3,
    irradiance: 1000,
    efficiency: 19.2,
    dataPoints: 3600,
  },
  {
    id: '2',
    experimentName: '薄膜组件测试-002',
    date: new Date('2025-01-13T14:30:00'),
    voltage: 20.2,
    current: 6.5,
    power: 131.3,
    temperature: 28.7,
    irradiance: 850,
    efficiency: 15.8,
    dataPoints: 2400,
  },
  {
    id: '3',
    experimentName: '双面组件测试-003',
    date: new Date('2025-01-12T10:00:00'),
    voltage: 45.5,
    current: 8.8,
    power: 400.4,
    temperature: 26.1,
    irradiance: 950,
    efficiency: 20.1,
    dataPoints: 4200,
  },
];

export default function DataPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedData, setSelectedData] = useState<string[]>([]);

  const filteredData = mockData.filter(item =>
    item.experimentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedData(filteredData.map(item => item.id));
    } else {
      setSelectedData([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedData(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">数据管理</h1>
        <p className="text-[var(--text-secondary)] mt-1">查看和管理测试数据</p>
      </div>

      {/* 工具栏 */}
      <Card>
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 items-center w-full md:w-auto">
              {/* 搜索框 */}
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="搜索实验名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="industrial-input pl-10"
                />
              </div>
              
              {/* 筛选按钮 */}
              <button className="industrial-button">
                <Filter className="w-4 h-4" />
                筛选
              </button>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button className="industrial-button">
                <Upload className="w-4 h-4" />
                导入
              </button>
              <button 
                className="industrial-button primary"
                disabled={selectedData.length === 0}
              >
                <Download className="w-4 h-4" />
                导出选中 ({selectedData.length})
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* 数据表格 */}
      <Card>
        <div className="overflow-x-auto">
          <table className="industrial-table">
            <thead>
              <tr>
                <th className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedData.length === filteredData.length && filteredData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-[var(--border)] bg-[var(--bg-primary)]"
                  />
                </th>
                <th>实验名称</th>
                <th>测试时间</th>
                <th>电压 (V)</th>
                <th>电流 (A)</th>
                <th>功率 (W)</th>
                <th>温度 (°C)</th>
                <th>光照 (W/m²)</th>
                <th>效率 (%)</th>
                <th>数据点</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedData.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded border-[var(--border)] bg-[var(--bg-primary)]"
                    />
                  </td>
                  <td className="font-medium">{item.experimentName}</td>
                  <td className="text-[var(--text-secondary)]">
                    {formatDate(item.date)}
                  </td>
                  <td>{item.voltage.toFixed(1)}</td>
                  <td>{item.current.toFixed(2)}</td>
                  <td>{item.power.toFixed(1)}</td>
                  <td>{item.temperature.toFixed(1)}</td>
                  <td>{item.irradiance}</td>
                  <td>
                    <span className="text-green-500 font-medium">
                      {item.efficiency.toFixed(1)}
                    </span>
                  </td>
                  <td>{item.dataPoints.toLocaleString()}</td>
                  <td>
                    <button className="p-1 hover:bg-[var(--bg-tertiary)] rounded">
                      <MoreVertical className="w-4 h-4 text-[var(--text-muted)]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <FileSpreadsheet className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
              <p className="text-[var(--text-muted)]">暂无数据</p>
            </div>
          )}
        </div>
      </Card>

      {/* 分页 */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--text-secondary)]">
            显示 1-{filteredData.length} 条，共 {filteredData.length} 条
          </p>
          <div className="flex gap-2">
            <button className="industrial-button" disabled>
              上一页
            </button>
            <button className="industrial-button primary">
              1
            </button>
            <button className="industrial-button">
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
