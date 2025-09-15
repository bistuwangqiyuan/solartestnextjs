'use client';

import { useState, useEffect } from 'react';
import { 
  Save,
  Globe,
  Bell,
  Database,
  Network,
  Shield,
  Users,
  AlertCircle,
  Palette
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Theme, themes, applyTheme, getStoredTheme } from '@/lib/theme';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');

  useEffect(() => {
    setCurrentTheme(getStoredTheme());
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  const tabs = [
    { id: 'general', name: '常规设置', icon: Globe },
    { id: 'theme', name: '主题设置', icon: Palette },
    { id: 'data', name: '数据采集', icon: Database },
    { id: 'alerts', name: '告警设置', icon: Bell },
    { id: 'modbus', name: 'Modbus配置', icon: Network },
    { id: 'users', name: '用户管理', icon: Users },
    { id: 'security', name: '安全设置', icon: Shield },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">系统设置</h1>
          <p className="text-[var(--text-secondary)] mt-1">配置系统参数和管理选项</p>
        </div>
        <button 
          className="industrial-button primary"
          onClick={handleSave}
        >
          <Save className="w-4 h-4" />
          保存更改
        </button>
      </div>

      {/* 保存成功提示 */}
      {saved && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-500">设置已成功保存</p>
        </div>
      )}

      <div className="flex gap-6">
        {/* 侧边栏 */}
        <Card className="w-64 h-fit">
          <div className="p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* 设置内容 */}
        <Card className="flex-1">
          <div className="p-6">
            {/* 常规设置 */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">常规设置</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      系统语言
                    </label>
                    <select className="industrial-input">
                      <option value="zh-CN">简体中文</option>
                      <option value="en-US">English</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      时区
                    </label>
                    <select className="industrial-input">
                      <option value="Asia/Shanghai">中国标准时间 (UTC+8)</option>
                      <option value="UTC">协调世界时 (UTC)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      日期格式
                    </label>
                    <select className="industrial-input">
                      <option value="YYYY-MM-DD">2025-01-13</option>
                      <option value="DD/MM/YYYY">13/01/2025</option>
                      <option value="MM/DD/YYYY">01/13/2025</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 主题设置 */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">主题设置</h2>
                <p className="text-[var(--text-secondary)]">选择您喜欢的界面主题颜色</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(themes).map(([themeKey, theme]) => (
                    <div
                      key={themeKey}
                      className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        currentTheme === themeKey
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                          : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                      }`}
                      onClick={() => handleThemeChange(themeKey as Theme)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-[var(--text-primary)]">
                          {theme.name}
                        </h3>
                        {currentTheme === themeKey && (
                          <div className="w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-[var(--text-secondary)] mb-4">
                        {theme.description}
                      </p>
                      
                      {/* 主题预览 */}
                      <div className="space-y-2">
                        <div 
                          className="h-3 rounded"
                          style={{ backgroundColor: theme.css['--primary'] }}
                        />
                        <div className="flex gap-1">
                          <div 
                            className="h-2 rounded flex-1"
                            style={{ backgroundColor: theme.css['--chart-1'] }}
                          />
                          <div 
                            className="h-2 rounded flex-1"
                            style={{ backgroundColor: theme.css['--chart-2'] }}
                          />
                          <div 
                            className="h-2 rounded flex-1"
                            style={{ backgroundColor: theme.css['--chart-3'] }}
                          />
                          <div 
                            className="h-2 rounded flex-1"
                            style={{ backgroundColor: theme.css['--chart-4'] }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border)]">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">主题说明</h3>
                  <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                    <p>• <strong className="text-[var(--text-primary)]">黑色主题：</strong>默认深色工业风格，适合长时间使用，减少眼部疲劳</p>
                    <p>• <strong className="text-[var(--text-primary)]">白色主题：</strong>明亮简洁的浅色界面，适合明亮环境使用</p>
                    <p>• <strong className="text-[var(--text-primary)]">蓝色主题：</strong>专业的蓝色工业主题，突出科技感和专业性</p>
                  </div>
                </div>
              </div>
            )}

            {/* 数据采集设置 */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">数据采集设置</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      默认采样率
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        defaultValue={1} 
                        min={0.1} 
                        max={10} 
                        step={0.1}
                        className="industrial-input w-32"
                      />
                      <span className="text-[var(--text-secondary)]">Hz</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      数据保留时间
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        defaultValue={365} 
                        min={30} 
                        max={3650}
                        className="industrial-input w-32"
                      />
                      <span className="text-[var(--text-secondary)]">天</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="rounded border-[var(--border)] bg-[var(--bg-primary)]"
                      />
                      <span className="text-sm font-medium text-[var(--text-secondary)]">
                        启用自动数据导出
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 告警设置 */}
            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">告警设置</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 mb-4">
                      <input 
                        type="checkbox" 
                        defaultChecked
                        className="rounded border-[var(--border)] bg-[var(--bg-primary)]"
                      />
                      <span className="text-sm font-medium text-[var(--text-secondary)]">
                        启用邮件通知
                      </span>
                    </label>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">
                      告警阈值
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-secondary)]">过压告警</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            defaultValue={50} 
                            className="industrial-input w-24 py-1"
                          />
                          <span className="text-[var(--text-secondary)]">V</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-secondary)]">过流告警</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            defaultValue={20} 
                            className="industrial-input w-24 py-1"
                          />
                          <span className="text-[var(--text-secondary)]">A</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--text-secondary)]">过温告警</span>
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            defaultValue={85} 
                            className="industrial-input w-24 py-1"
                          />
                          <span className="text-[var(--text-secondary)]">°C</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modbus配置 */}
            {activeTab === 'modbus' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Modbus配置</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      默认超时时间
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        defaultValue={5000} 
                        min={1000} 
                        max={30000}
                        step={1000}
                        className="industrial-input w-32"
                      />
                      <span className="text-[var(--text-secondary)]">毫秒</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      默认重试次数
                    </label>
                    <input 
                      type="number" 
                      defaultValue={3} 
                      min={0} 
                      max={10}
                      className="industrial-input w-32"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">
                      设备地址映射
                    </h3>
                    <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                      <code className="text-sm text-[var(--text-secondary)]">
                        {`{
  "power_supply": 1,
  "electronic_load": 2,
  "temperature_sensor": 10,
  "irradiance_sensor": 11
}`}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
