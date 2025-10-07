'use client';

import { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronRight, 
  ChevronDown,
  LayoutDashboard,
  Database,
  FlaskConical,
  Monitor,
  BarChart3,
  Settings,
  AlertTriangle,
  User,
  LogOut,
  Search,
  Download,
  Upload,
  Filter,
  MoreVertical,
  Calendar,
  FileSpreadsheet,
  Activity,
  Zap,
  Thermometer,
  Sun,
  TrendingUp,
  Beaker,
  Play,
  Pause,
  Square,
  Eye,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface HelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
}

export default function HelpPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const helpSections: HelpSection[] = useMemo(() => [
    {
      id: 'overview',
      title: '系统概述',
      icon: HelpCircle,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-500 mb-2">欢迎使用光伏测试系统</h3>
            <p className="text-[var(--text-primary)]">
              这是一个专业的太阳能电池板测试系统，用于自动化测试、数据采集、分析和监控光伏组件的性能。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
              <h4 className="font-semibold text-[var(--text-primary)] mb-2">主要功能</h4>
              <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                <li>• 实时数据监控和显示</li>
                <li>• 实验管理和参数配置</li>
                <li>• 数据采集和分析</li>
                <li>• 设备连接和状态监控</li>
                <li>• 报告生成和导出</li>
              </ul>
            </div>
            
            <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
              <h4 className="font-semibold text-[var(--text-primary)] mb-2">技术特点</h4>
              <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                <li>• 支持Modbus TCP/RTU协议</li>
                <li>• 实时数据刷新（≥1Hz）</li>
                <li>• 工业级UI设计</li>
                <li>• 响应式界面设计</li>
                <li>• 多用户权限管理</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'navigation',
      title: '导航和界面布局',
      icon: LayoutDashboard,
      content: (
        <div className="space-y-6">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">左侧导航栏</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg">
                <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PV</span>
                </div>
                <span className="font-medium text-[var(--text-primary)]">光伏测试系统</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] ml-11">
                系统Logo和标题，点击可返回仪表板首页
              </p>
            </div>
            
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-[var(--text-primary)]">导航菜单项：</h4>
              {[
                { name: '仪表板', icon: LayoutDashboard, href: '/dashboard', desc: '系统运行状态概览和关键指标' },
                { name: '数据管理', icon: Database, href: '/data', desc: '查看、搜索、导出测试数据' },
                { name: '实验管理', icon: FlaskConical, href: '/experiment', desc: '创建和管理测试实验' },
                { name: '实时监控', icon: Monitor, href: '/monitor', desc: '实时监控设备状态和数据曲线' },
                { name: '数据分析', icon: BarChart3, href: '/analysis', desc: '历史数据分析和报告生成' },
                { name: '系统设置', icon: Settings, href: '/settings', desc: '设备配置和系统参数设置' }
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3 p-2 bg-[var(--bg-primary)] rounded">
                  <item.icon className="w-5 h-5 text-[var(--text-secondary)]" />
                  <div>
                    <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
                    <p className="text-xs text-[var(--text-muted)]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">用户信息区域</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg">
                <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">用户邮箱</p>
                  <p className="text-xs text-[var(--text-muted)]">角色：管理员/操作员/观察员</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-[var(--bg-primary)] rounded">
                <LogOut className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">退出登录</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] ml-6">
                点击退出登录按钮安全退出系统
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: '仪表板使用指南',
      icon: LayoutDashboard,
      content: (
        <div className="space-y-6">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">实时数据显示区域</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: '电压', unit: 'V', icon: Zap, desc: '当前光伏组件输出电压' },
                { label: '电流', unit: 'A', icon: Activity, desc: '当前光伏组件输出电流' },
                { label: '功率', unit: 'W', icon: TrendingUp, desc: '当前输出功率（电压×电流）' },
                { label: '温度', unit: '°C', icon: Thermometer, desc: '环境温度或组件温度' },
                { label: '光照强度', unit: 'W/m²', icon: Sun, desc: '太阳辐射强度' },
                { label: '效率', unit: '%', icon: TrendingUp, desc: '光伏转换效率' }
              ].map((item) => (
                <div key={item.label} className="bg-[var(--bg-primary)] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">{item.label}</span>
                  </div>
                  <div className="text-lg font-bold text-[var(--text-primary)]">--.{item.unit}</div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-3">
              <Info className="w-4 h-4 inline mr-1" />
              数据每2秒自动刷新一次，趋势箭头表示数据变化方向
            </p>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">系统状态卡片</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '在线设备', icon: Activity, color: 'green', desc: '当前连接的设备数量' },
                { label: '活跃实验', icon: Beaker, color: 'blue', desc: '正在进行的实验数量' },
                { label: '今日数据点', icon: Database, color: 'purple', desc: '今天采集的数据点总数' },
                { label: '活跃告警', icon: AlertTriangle, color: 'orange', desc: '需要关注的告警数量' }
              ].map((item) => (
                <div key={item.label} className="bg-[var(--bg-primary)] rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-${item.color}-500/10 rounded-lg flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 text-${item.color}-500`} />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">{item.label}</p>
                      <p className="text-xl font-semibold text-[var(--text-primary)]">--</p>
                    </div>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">快速操作按钮</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: '新建实验', icon: Beaker, desc: '创建新的测试实验' },
                { name: '导出数据', icon: Database, desc: '导出测试数据到Excel' },
                { name: '设备检查', icon: Activity, desc: '检查设备连接状态' },
                { name: '查看告警', icon: AlertTriangle, desc: '查看系统告警信息' }
              ].map((item) => (
                <div key={item.name} className="bg-[var(--bg-primary)] rounded-lg p-3 text-center">
                  <item.icon className="w-6 h-6 text-[var(--text-secondary)] mx-auto mb-2" />
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.name}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'data-management',
      title: '数据管理功能详解',
      icon: Database,
      content: (
        <div className="space-y-6">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">工具栏功能</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg">
                <Search className="w-5 h-5 text-[var(--text-secondary)]" />
                <div>
                  <span className="font-medium text-[var(--text-primary)]">搜索框</span>
                  <p className="text-sm text-[var(--text-secondary)]">输入实验名称进行搜索，支持模糊匹配</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg">
                <Filter className="w-5 h-5 text-[var(--text-secondary)]" />
                <div>
                  <span className="font-medium text-[var(--text-primary)]">筛选按钮</span>
                  <p className="text-sm text-[var(--text-secondary)]">按日期、参数范围等条件筛选数据</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg">
                <Upload className="w-5 h-5 text-[var(--text-secondary)]" />
                <div>
                  <span className="font-medium text-[var(--text-primary)]">导入按钮</span>
                  <p className="text-sm text-[var(--text-secondary)]">导入Excel或CSV格式的测试数据</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg">
                <Download className="w-5 h-5 text-[var(--text-secondary)]" />
                <div>
                  <span className="font-medium text-[var(--text-primary)]">导出按钮</span>
                  <p className="text-sm text-[var(--text-secondary)]">导出选中的数据到Excel或CSV文件</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">数据表格说明</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left p-2 text-sm font-medium text-[var(--text-primary)]">列名</th>
                    <th className="text-left p-2 text-sm font-medium text-[var(--text-primary)]">说明</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: '复选框', desc: '选择单条或多条数据进行批量操作' },
                    { name: '实验名称', desc: '测试实验的唯一标识名称' },
                    { name: '测试时间', desc: '实验开始的时间戳' },
                    { name: '电压 (V)', desc: '测试时的电压值' },
                    { name: '电流 (A)', desc: '测试时的电流值' },
                    { name: '功率 (W)', desc: '计算得出的功率值' },
                    { name: '温度 (°C)', desc: '测试时的环境温度' },
                    { name: '光照 (W/m²)', desc: '测试时的光照强度' },
                    { name: '效率 (%)', desc: '光伏转换效率百分比' },
                    { name: '数据点', desc: '该实验采集的数据点总数' },
                    { name: '操作', desc: '更多操作选项（查看详情、编辑、删除等）' }
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-[var(--border)]">
                      <td className="p-2 text-sm text-[var(--text-primary)] font-medium">{row.name}</td>
                      <td className="p-2 text-sm text-[var(--text-secondary)]">{row.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">分页控制</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg">
                <span className="text-sm text-[var(--text-secondary)]">显示 1-20 条，共 1242 条</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                显示当前页的数据范围和总数据量
              </p>
              
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded text-sm">上一页</button>
                <button className="px-3 py-1 bg-[var(--primary)] text-white rounded text-sm">1</button>
                <button className="px-3 py-1 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded text-sm">2</button>
                <button className="px-3 py-1 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded text-sm">下一页</button>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                点击页码或上一页/下一页按钮进行翻页
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'experiment',
      title: '实验管理操作指南',
      icon: FlaskConical,
      content: (
        <div className="space-y-6">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">创建新实验</h3>
            <div className="space-y-3">
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">步骤1：填写基本信息</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 实验名称：输入有意义的实验名称</li>
                  <li>• 实验描述：详细描述实验目的和内容</li>
                  <li>• 测试类型：选择关断器测试或其他类型</li>
                </ul>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">步骤2：配置测试参数</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 电压范围：设置测试电压的上下限</li>
                  <li>• 电流范围：设置测试电流的上下限</li>
                  <li>• 采样频率：设置数据采集频率（Hz）</li>
                  <li>• 测试时长：设置实验持续时间</li>
                </ul>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">步骤3：选择设备</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 从可用设备列表中选择测试设备</li>
                  <li>• 确认设备连接状态为&ldquo;在线&rdquo;</li>
                  <li>• 检查设备参数配置是否正确</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">实验控制按钮</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: '开始实验', icon: Play, color: 'green', desc: '启动实验，开始数据采集' },
                { name: '暂停实验', icon: Pause, color: 'yellow', desc: '暂停数据采集，可恢复' },
                { name: '停止实验', icon: Square, color: 'red', desc: '结束实验，保存数据' }
              ].map((item) => (
                <div key={item.name} className="bg-[var(--bg-primary)] rounded-lg p-3 text-center">
                  <div className={`w-8 h-8 bg-${item.color}-500/10 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <item.icon className={`w-4 h-4 text-${item.color}-500`} />
                  </div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.name}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">实验状态说明</h3>
            <div className="space-y-2">
              {[
                { status: '准备中', color: 'blue', desc: '实验已创建，等待开始' },
                { status: '进行中', color: 'green', desc: '实验正在运行，数据采集中' },
                { status: '已暂停', color: 'yellow', desc: '实验暂停，可恢复或停止' },
                { status: '已完成', color: 'gray', desc: '实验正常结束，数据已保存' },
                { status: '已取消', color: 'red', desc: '实验被取消，数据可能不完整' }
              ].map((item) => (
                <div key={item.status} className="flex items-center gap-3 p-2 bg-[var(--bg-primary)] rounded">
                  <div className={`w-3 h-3 bg-${item.color}-500 rounded-full`}></div>
                  <span className="font-medium text-[var(--text-primary)]">{item.status}</span>
                  <span className="text-sm text-[var(--text-secondary)]">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'monitor',
      title: '实时监控功能说明',
      icon: Monitor,
      content: (
        <div className="space-y-6">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">设备连接状态</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-[var(--text-primary)]">设备在线</span>
                <span className="text-sm text-[var(--text-secondary)]">设备正常连接，可进行数据采集</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-[var(--text-primary)]">设备离线</span>
                <span className="text-sm text-[var(--text-secondary)]">设备连接断开，需要检查连接</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-[var(--text-primary)]">连接异常</span>
                <span className="text-sm text-[var(--text-secondary)]">连接不稳定，数据可能丢失</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">实时数据曲线</h3>
            <div className="space-y-3">
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">I-V特性曲线</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  显示电流-电压关系曲线，横轴为电压(V)，纵轴为电流(A)
                </p>
                <div className="mt-2 h-32 bg-[var(--bg-secondary)] rounded flex items-center justify-center">
                  <span className="text-[var(--text-muted)]">I-V曲线图</span>
                </div>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">P-V特性曲线</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  显示功率-电压关系曲线，横轴为电压(V)，纵轴为功率(W)
                </p>
                <div className="mt-2 h-32 bg-[var(--bg-secondary)] rounded flex items-center justify-center">
                  <span className="text-[var(--text-muted)]">P-V曲线图</span>
                </div>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">时间序列数据</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  显示各参数随时间的变化趋势，支持多参数同时显示
                </p>
                <div className="mt-2 h-32 bg-[var(--bg-secondary)] rounded flex items-center justify-center">
                  <span className="text-[var(--text-muted)]">时间序列图</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">参数调整控制</h3>
            <div className="space-y-3">
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">实时参数调整</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 电压调节：调整输出电压范围</li>
                  <li>• 电流限制：设置最大输出电流</li>
                  <li>• 采样频率：调整数据采集频率</li>
                  <li>• 刷新间隔：设置图表刷新时间</li>
                </ul>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">告警配置</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 电压告警：设置电压上下限阈值</li>
                  <li>• 电流告警：设置电流上下限阈值</li>
                  <li>• 温度告警：设置温度上限阈值</li>
                  <li>• 效率告警：设置效率下限阈值</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'analysis',
      title: '数据分析功能详解',
      icon: BarChart3,
      content: (
        <div className="space-y-6">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">历史数据查询</h3>
            <div className="space-y-3">
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">查询条件设置</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 时间范围：选择开始和结束日期</li>
                  <li>• 实验类型：筛选特定类型的实验</li>
                  <li>• 设备选择：选择特定设备的数据</li>
                  <li>• 参数范围：设置电压、电流等参数范围</li>
                </ul>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">数据展示选项</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 表格视图：以表格形式显示详细数据</li>
                  <li>• 图表视图：以图表形式显示趋势</li>
                  <li>• 统计视图：显示统计摘要信息</li>
                  <li>• 对比视图：对比多个实验的结果</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">分析图表类型</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: '趋势分析', desc: '显示参数随时间的变化趋势' },
                { name: '效率分析', desc: '分析光伏转换效率的变化' },
                { name: '对比分析', desc: '对比不同实验或设备的结果' },
                { name: '统计分析', desc: '显示数据的统计分布情况' },
                { name: '相关性分析', desc: '分析各参数之间的相关性' },
                { name: '异常检测', desc: '识别数据中的异常值' }
              ].map((item) => (
                <div key={item.name} className="bg-[var(--bg-primary)] rounded-lg p-3">
                  <h4 className="font-medium text-[var(--text-primary)] mb-1">{item.name}</h4>
                  <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">报告生成功能</h3>
            <div className="space-y-3">
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">报告类型</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 测试报告：单次实验的详细测试结果</li>
                  <li>• 分析报告：多组数据的综合分析结果</li>
                  <li>• 统计报告：数据的统计分析报告</li>
                  <li>• 自定义报告：用户自定义的报告模板</li>
                </ul>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">导出格式</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• PDF格式：适合打印和存档</li>
                  <li>• Excel格式：包含详细数据和图表</li>
                  <li>• Word格式：适合编辑和修改</li>
                  <li>• HTML格式：适合网页展示</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      title: '系统设置配置指南',
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">设备配置</h3>
            <div className="space-y-3">
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">Modbus连接参数</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• IP地址：设备的网络IP地址</li>
                  <li>• 端口号：Modbus TCP端口（默认502）</li>
                  <li>• 设备ID：Modbus设备标识符</li>
                  <li>• 超时时间：连接超时设置（毫秒）</li>
                  <li>• 重试次数：连接失败时的重试次数</li>
                </ul>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">设备地址映射</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 电压寄存器：存储电压值的寄存器地址</li>
                  <li>• 电流寄存器：存储电流值的寄存器地址</li>
                  <li>• 功率寄存器：存储功率值的寄存器地址</li>
                  <li>• 温度寄存器：存储温度值的寄存器地址</li>
                  <li>• 状态寄存器：存储设备状态的寄存器地址</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">系统参数设置</h3>
            <div className="space-y-3">
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">数据采集设置</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 采样频率：数据采集频率（1-100Hz）</li>
                  <li>• 数据保存间隔：数据保存到数据库的间隔</li>
                  <li>• 缓存大小：内存中缓存的数据量</li>
                  <li>• 数据压缩：是否启用数据压缩</li>
                </ul>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">告警阈值设置</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 电压上限/下限：电压告警阈值</li>
                  <li>• 电流上限/下限：电流告警阈值</li>
                  <li>• 温度上限：温度告警阈值</li>
                  <li>• 效率下限：效率告警阈值</li>
                  <li>• 告警延迟：告警触发前的延迟时间</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">用户管理</h3>
            <div className="space-y-3">
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">用户角色权限</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 管理员：拥有所有功能权限</li>
                  <li>• 操作员：可进行实验和数据管理</li>
                  <li>• 观察员：只能查看数据，不能修改</li>
                </ul>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">用户操作</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 添加用户：创建新的系统用户</li>
                  <li>• 编辑用户：修改用户信息和权限</li>
                  <li>• 删除用户：删除不需要的用户账户</li>
                  <li>• 重置密码：重置用户登录密码</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: '常见问题解决',
      icon: AlertTriangle,
      content: (
        <div className="space-y-6">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">连接问题</h3>
            <div className="space-y-3">
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">设备无法连接</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 检查网络连接是否正常</li>
                  <li>• 确认设备IP地址和端口号正确</li>
                  <li>• 检查防火墙设置是否阻止连接</li>
                  <li>• 确认设备电源和网络指示灯状态</li>
                </ul>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">数据采集异常</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 检查Modbus寄存器地址是否正确</li>
                  <li>• 确认设备支持的数据类型</li>
                  <li>• 检查采样频率设置是否合理</li>
                  <li>• 查看系统日志中的错误信息</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">数据问题</h3>
            <div className="space-y-3">
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">数据显示异常</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 检查数据单位换算是否正确</li>
                  <li>• 确认数据范围是否合理</li>
                  <li>• 检查数据精度设置</li>
                  <li>• 验证设备校准参数</li>
                </ul>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">数据丢失</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 检查数据库连接状态</li>
                  <li>• 确认数据保存策略设置</li>
                  <li>• 检查磁盘空间是否充足</li>
                  <li>• 查看数据备份是否正常</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">性能问题</h3>
            <div className="space-y-3">
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">系统响应缓慢</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 检查网络带宽是否充足</li>
                  <li>• 减少同时连接设备数量</li>
                  <li>• 降低数据采集频率</li>
                  <li>• 清理历史数据释放空间</li>
                </ul>
              </div>
              
              <div className="bg-[var(--bg-primary)] rounded-lg p-3">
                <h4 className="font-medium text-[var(--text-primary)] mb-2">内存使用过高</h4>
                <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                  <li>• 调整数据缓存大小</li>
                  <li>• 启用数据压缩功能</li>
                  <li>• 定期重启系统服务</li>
                  <li>• 监控系统资源使用情况</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ], []);

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">帮助文档</h1>
        <p className="text-[var(--text-secondary)] mt-1">详细的使用说明和操作指南</p>
      </div>

      {/* 帮助内容 */}
      <div className="space-y-4">
        {helpSections.map((section) => {
          const isExpanded = expandedSections.includes(section.id);
          const Icon = section.icon;
          
          return (
            <Card key={section.id}>
              <div className="p-4">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-[var(--primary)]" />
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                      {section.title}
                    </h2>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-[var(--text-secondary)]" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)]">
                    {section.content}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
