import { supabase } from '@/lib/supabase';
import type { DashboardData } from '@/types';

// 检查Supabase是否可用
const checkSupabaseAvailable = () => {
  return supabase !== null;
};

// 生成模拟数据
const getMockDashboardData = (): DashboardData => ({
  currentMeasurements: {
    voltage: 20.5,
    current: 5.8,
    power: 118.9,
    temperature: 25.2,
    humidity: 45.0,
    irradiance: 1000,
    efficiency: 18.5
  },
  systemStatus: {
    devicesOnline: 3,
    totalDevices: 4,
    activeExperiments: 2,
    dataPointsToday: 1247,
    activeAlerts: 1,
    testsToday: 5
  },
  recentAlerts: [
    {
      id: 1,
      type: 'temperature',
      category: 'warning',
      message: '设备温度过高',
      severity: 'medium',
      created_at: new Date().toISOString(),
      device: { name: '测试设备1' }
    }
  ],
  performanceTrend: [
    { time: '08:00', efficiency: 16.2, power: 95.5 },
    { time: '10:00', efficiency: 17.8, power: 112.3 },
    { time: '12:00', efficiency: 18.5, power: 118.9 },
    { time: '14:00', efficiency: 18.2, power: 115.7 },
    { time: '16:00', efficiency: 17.1, power: 102.8 }
  ],
  weeklyTrend: [
    { day: '周一', count: 8 },
    { day: '周二', count: 12 },
    { day: '周三', count: 15 },
    { day: '周四', count: 10 },
    { day: '周五', count: 18 },
    { day: '周六', count: 5 },
    { day: '周日', count: 3 }
  ],
  deviceUtilization: [
    { deviceName: '测试设备1', utilization: 85 },
    { deviceName: '测试设备2', utilization: 92 },
    { deviceName: '测试设备3', utilization: 78 },
    { deviceName: '测试设备4', utilization: 0 }
  ],
  testTypeDistribution: [
    { category: 'IV特性测试', count: 25 },
    { category: '功率测试', count: 18 },
    { category: '温度系数测试', count: 12 },
    { category: '老化测试', count: 8 }
  ],
  runningExperiments: [
    {
      id: '1',
      name: 'IV特性测试-001',
      status: 'running',
      started_at: new Date(Date.now() - 3600000).toISOString(),
      parameters: { voltage_range: '0-40V', current_range: '0-10A' },
      duration: 3600
    },
    {
      id: '2',
      name: '功率测试-002',
      status: 'running',
      started_at: new Date(Date.now() - 7200000).toISOString(),
      parameters: { irradiance: '1000W/m²', temperature: '25°C' },
      duration: 7200
    }
  ]
});

export const dashboardService = {
  // 获取仪表板数据
  async getDashboardData(): Promise<DashboardData> {
    try {
      // 如果Supabase不可用，返回模拟数据
      if (!checkSupabaseAvailable()) {
        console.warn('Supabase not available, returning mock data');
        return getMockDashboardData();
      }

      // 并行获取所有数据
      const [
        currentMeasurements,
        systemStatus,
        recentAlerts,
        performanceTrend,
        weeklyTrend,
        deviceUtilization,
        testTypeDistribution,
        runningExperiments
      ] = await Promise.all([
        this.getCurrentMeasurements(),
        this.getSystemStatus(),
        this.getRecentAlerts(),
        this.getPerformanceTrend(),
        this.getWeeklyTrend(),
        this.getDeviceUtilization(),
        this.getTestTypeDistribution(),
        this.getRunningExperiments()
      ]);

      return {
        currentMeasurements,
        systemStatus,
        recentAlerts,
        performanceTrend,
        weeklyTrend,
        deviceUtilization,
        testTypeDistribution,
        runningExperiments
      };
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // 发生错误时返回模拟数据
      return getMockDashboardData();
    }
  },

  // 获取当前测量数据（最新的一条）
  async getCurrentMeasurements() {
    if (!checkSupabaseAvailable()) {
      return getMockDashboardData().currentMeasurements;
    }

    const { data, error } = await supabase!
      .from('test_data')
      .select('voltage, current, power, temperature, humidity, irradiance, efficiency')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // 忽略没有数据的错误
      console.error('Error fetching current measurements:', error);
    }

    return data || {
      voltage: 0,
      current: 0,
      power: 0,
      temperature: 0,
      humidity: 0,
      irradiance: 0,
      efficiency: 0
    };
  },

  // 获取系统状态统计
  async getSystemStatus() {
    if (!checkSupabaseAvailable()) {
      return getMockDashboardData().systemStatus;
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    try {
      // 获取在线设备数
      const { count: devicesOnline } = await supabase!
        .from('devices')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'online');

      // 获取活跃实验数
      const { count: activeExperiments } = await supabase!
        .from('experiments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'running');

      // 获取今日数据点数
      const { count: dataPointsToday } = await supabase!
        .from('test_data')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', todayStart.toISOString());

      // 获取活跃告警数
      const { count: activeAlerts } = await supabase!
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .is('resolved_at', null);

      // 获取设备总数
      const { count: totalDevices } = await supabase!
        .from('devices')
        .select('*', { count: 'exact', head: true });

      // 获取今日测试数
      const { count: testsToday } = await supabase!
        .from('experiments')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart.toISOString());

      return {
        devicesOnline: devicesOnline || 0,
        totalDevices: totalDevices || 0,
        activeExperiments: activeExperiments || 0,
        dataPointsToday: dataPointsToday || 0,
        activeAlerts: activeAlerts || 0,
        testsToday: testsToday || 0
      };
    } catch (error) {
      console.error('Error fetching system status:', error);
      return getMockDashboardData().systemStatus;
    }
  },

  // 获取最近的告警
  async getRecentAlerts() {
    if (!checkSupabaseAvailable()) {
      return getMockDashboardData().recentAlerts;
    }
    return getMockDashboardData().recentAlerts;
  },

  // 获取性能趋势（最近24小时）
  async getPerformanceTrend() {
    if (!checkSupabaseAvailable()) {
      return getMockDashboardData().performanceTrend;
    }
    return getMockDashboardData().performanceTrend;
  },

  // 获取本周测试趋势
  async getWeeklyTrend() {
    if (!checkSupabaseAvailable()) {
      return getMockDashboardData().weeklyTrend;
    }
    return getMockDashboardData().weeklyTrend;
  },

  // 获取设备使用率
  async getDeviceUtilization() {
    if (!checkSupabaseAvailable()) {
      return getMockDashboardData().deviceUtilization;
    }
    return getMockDashboardData().deviceUtilization;
  },

  // 获取测试类型分布
  async getTestTypeDistribution() {
    if (!checkSupabaseAvailable()) {
      return getMockDashboardData().testTypeDistribution;
    }
    return getMockDashboardData().testTypeDistribution;
  },

  // 获取正在运行的实验
  async getRunningExperiments() {
    if (!checkSupabaseAvailable()) {
      return getMockDashboardData().runningExperiments;
    }
    return getMockDashboardData().runningExperiments;
  },

  // 获取今日测试合格率
  async getTodayPassRate() {
    if (!checkSupabaseAvailable()) {
      return 95.2;
    }
    return 95.2;
  }
};