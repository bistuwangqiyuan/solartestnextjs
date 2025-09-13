import { supabase } from '@/lib/supabase';
import type { DashboardData } from '@/types';

export const dashboardService = {
  // 获取仪表板数据
  async getDashboardData(): Promise<DashboardData> {
    try {
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
      throw error;
    }
  },

  // 获取当前测量数据（最新的一条）
  async getCurrentMeasurements() {
    const { data, error } = await supabase
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
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 获取在线设备数
    const { count: devicesOnline } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'online');

    // 获取活跃实验数
    const { count: activeExperiments } = await supabase
      .from('experiments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'running');

    // 获取今日数据点数
    const { count: dataPointsToday } = await supabase
      .from('test_data')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', todayStart.toISOString());

    // 获取活跃告警数
    const { count: activeAlerts } = await supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .is('resolved_at', null);

    // 获取设备总数
    const { count: totalDevices } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true });

    // 获取今日测试数
    const { count: testsToday } = await supabase
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
  },

  // 获取最近的告警
  async getRecentAlerts() {
    const { data, error } = await supabase
      .from('alerts')
      .select(`
        id,
        type,
        category,
        message,
        severity,
        created_at,
        device:devices(name)
      `)
      .is('resolved_at', null)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching recent alerts:', error);
      return [];
    }

    return data || [];
  },

  // 获取性能趋势（最近24小时）
  async getPerformanceTrend() {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('test_data')
      .select('timestamp, efficiency, power')
      .gte('timestamp', yesterday.toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching performance trend:', error);
      return [];
    }

    // 按小时聚合数据
    const hourlyData: Record<string, { efficiency: number[], power: number[] }> = {};
    
    (data || []).forEach(record => {
      const hour = new Date(record.timestamp).getHours();
      const key = `${hour}:00`;
      
      if (!hourlyData[key]) {
        hourlyData[key] = { efficiency: [], power: [] };
      }
      
      if (record.efficiency) hourlyData[key].efficiency.push(record.efficiency);
      if (record.power) hourlyData[key].power.push(record.power);
    });

    // 计算每小时平均值
    return Object.entries(hourlyData).map(([time, values]) => ({
      time,
      efficiency: values.efficiency.length > 0 
        ? values.efficiency.reduce((a, b) => a + b, 0) / values.efficiency.length 
        : 0,
      power: values.power.length > 0 
        ? values.power.reduce((a, b) => a + b, 0) / values.power.length 
        : 0
    }));
  },

  // 获取本周测试趋势
  async getWeeklyTrend() {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // 本周开始
    weekStart.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('experiments')
      .select('created_at')
      .gte('created_at', weekStart.toISOString());

    if (error) {
      console.error('Error fetching weekly trend:', error);
      return [];
    }

    // 按天统计
    const dailyCounts: Record<string, number> = {
      '周日': 0, '周一': 0, '周二': 0, '周三': 0, 
      '周四': 0, '周五': 0, '周六': 0
    };

    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    (data || []).forEach(record => {
      const day = new Date(record.created_at).getDay();
      dailyCounts[dayNames[day]]++;
    });

    return Object.entries(dailyCounts).map(([day, count]) => ({
      day,
      count
    }));
  },

  // 获取设备使用率
  async getDeviceUtilization() {
    // 获取所有设备
    const { data: devices, error: devicesError } = await supabase
      .from('devices')
      .select('id, name, status');

    if (devicesError) {
      console.error('Error fetching devices:', devicesError);
      return [];
    }

    // 获取最近24小时的实验数据
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const utilizationData = await Promise.all(
      (devices || []).map(async (device) => {
        // 计算设备在线时间（简化计算，实际应该基于日志）
        const onlineHours = device.status === 'online' ? 20 : 0; // 假设在线设备平均运行20小时
        const utilization = (onlineHours / 24) * 100;

        return {
          deviceName: device.name,
          utilization: Math.round(utilization)
        };
      })
    );

    return utilizationData;
  },

  // 获取测试类型分布
  async getTestTypeDistribution() {
    const { data: templates, error: templatesError } = await supabase
      .from('experiment_templates')
      .select('id, name, category');

    if (templatesError) {
      console.error('Error fetching templates:', templatesError);
      return [];
    }

    const { data: experiments, error: experimentsError } = await supabase
      .from('experiments')
      .select('template_id');

    if (experimentsError) {
      console.error('Error fetching experiments:', experimentsError);
      return [];
    }

    // 统计每个类别的使用次数
    const categoryCount: Record<string, number> = {};
    
    (experiments || []).forEach(exp => {
      const template = templates?.find(t => t.id === exp.template_id);
      if (template && template.category) {
        categoryCount[template.category] = (categoryCount[template.category] || 0) + 1;
      }
    });

    return Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count
    }));
  },

  // 获取正在运行的实验
  async getRunningExperiments() {
    const { data, error } = await supabase
      .from('experiments')
      .select(`
        id,
        name,
        status,
        started_at,
        parameters
      `)
      .eq('status', 'running')
      .order('started_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching running experiments:', error);
      return [];
    }

    return (data || []).map(exp => ({
      ...exp,
      duration: exp.started_at 
        ? Math.floor((new Date().getTime() - new Date(exp.started_at).getTime()) / 1000)
        : 0
    }));
  },

  // 获取今日测试合格率
  async getTodayPassRate() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const { data, error } = await supabase
      .from('experiments')
      .select('results')
      .gte('created_at', todayStart.toISOString())
      .eq('status', 'completed');

    if (error) {
      console.error('Error fetching pass rate:', error);
      return 0;
    }

    if (!data || data.length === 0) return 0;

    const passed = data.filter(exp => 
      exp.results && typeof exp.results === 'object' && 'passed' in exp.results && exp.results.passed
    ).length;

    return (passed / data.length) * 100;
  }
};