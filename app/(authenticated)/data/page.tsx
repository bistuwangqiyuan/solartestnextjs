'use client';

import { useState, useEffect } from 'react';
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

// 生成1242条关断器测试数据
const generateMockData = () => {
  const data = [];
  const testTypes = [
    '关断器测试-001', '关断器测试-002', '关断器测试-003', 
    '关断器测试-004', '关断器测试-005', '关断器测试-006',
    '关断器测试-007', '关断器测试-008', '关断器测试-009', '关断器测试-010'
  ];
  
  // 生成日期范围：从2005年5月1日到9月8日
  const startDate = new Date('2005-05-01');
  const endDate = new Date('2005-09-08');
  
  for (let i = 0; i < 1242; i++) {
    // 随机选择测试类型
    const testType = testTypes[Math.floor(Math.random() * testTypes.length)];
    
    // 生成随机日期
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const date = new Date(randomTime);
    
    // 生成测试参数
    const voltage = 15 + Math.random() * 35; // 15-50V
    const current = 1 + Math.random() * 12; // 1-13A
    const power = voltage * current;
    const temperature = 20 + Math.random() * 15; // 20-35°C
    const irradiance = 200 + Math.random() * 800; // 200-1000 W/m²
    const efficiency = 12 + Math.random() * 8; // 12-20%
    const dataPoints = 1000 + Math.floor(Math.random() * 5000); // 1000-6000个数据点
    
    data.push({
      id: (i + 1).toString(),
      experimentName: `${testType}-${String(i + 1).padStart(4, '0')}`,
      date,
      voltage: Math.round(voltage * 10) / 10,
      current: Math.round(current * 100) / 100,
      power: Math.round(power * 10) / 10,
      temperature: Math.round(temperature * 10) / 10,
      irradiance: Math.round(irradiance),
      efficiency: Math.round(efficiency * 10) / 10,
      dataPoints,
    });
  }
  
  // 按日期排序，最新的在前面
  return data.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const mockData = generateMockData();

export default function DataPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // 每页显示20条数据

  const filteredData = mockData.filter(item =>
    item.experimentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 计算分页数据
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // 重置到第一页当搜索条件改变时
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedData(currentData.map(item => item.id));
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
                    checked={selectedData.length === currentData.length && currentData.length > 0}
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
              {currentData.map((item) => (
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
          
          {currentData.length === 0 && (
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
            显示 {startIndex + 1}-{Math.min(endIndex, filteredData.length)} 条，共 {filteredData.length} 条
          </p>
          <div className="flex gap-2">
            <button 
              className="industrial-button" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              上一页
            </button>
            
            {/* 页码显示 */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`industrial-button ${currentPage === pageNum ? 'primary' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className="industrial-button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
