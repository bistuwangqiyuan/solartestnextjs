import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type ExperimentTemplate = Database['public']['Tables']['experiment_templates']['Row'];
type Experiment = Database['public']['Tables']['experiments']['Row'];

export interface ExperimentConfig {
  name: string;
  description?: string;
  templateId?: string;
  parameters: any;
  tags?: string[];
}

export const experimentService = {
  // 获取实验模板列表
  async getTemplates() {
    const { data, error } = await supabase
      .from('experiment_templates')
      .select('*')
      .eq('is_public', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }

    return data || [];
  },

  // 获取单个模板详情
  async getTemplate(templateId: string) {
    const { data, error } = await supabase
      .from('experiment_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error) {
      console.error('Error fetching template:', error);
      throw error;
    }

    return data;
  },

  // 创建新实验
  async createExperiment(config: ExperimentConfig) {
    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('experiments')
      .insert({
        name: config.name,
        description: config.description,
        template_id: config.templateId,
        parameters: config.parameters,
        tags: config.tags,
        status: 'pending',
        created_by: userData.user?.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating experiment:', error);
      throw error;
    }

    return data;
  },

  // 启动实验
  async startExperiment(experimentId: string) {
    const { data, error } = await supabase
      .from('experiments')
      .update({
        status: 'running',
        started_at: new Date().toISOString()
      })
      .eq('id', experimentId)
      .select()
      .single();

    if (error) {
      console.error('Error starting experiment:', error);
      throw error;
    }

    // 创建初始告警检查
    await this.checkExperimentAlerts(experimentId);

    return data;
  },

  // 停止实验
  async stopExperiment(experimentId: string, status: 'completed' | 'cancelled' | 'failed' = 'completed') {
    const { data, error } = await supabase
      .from('experiments')
      .update({
        status,
        ended_at: new Date().toISOString()
      })
      .eq('id', experimentId)
      .select()
      .single();

    if (error) {
      console.error('Error stopping experiment:', error);
      throw error;
    }

    // 计算实验结果
    await this.calculateExperimentResults(experimentId);

    return data;
  },

  // 获取正在运行的实验
  async getRunningExperiments() {
    const { data, error } = await supabase
      .from('experiments')
      .select(`
        *,
        template:experiment_templates!template_id(name, category),
        test_data_count:test_data(count)
      `)
      .eq('status', 'running')
      .order('started_at', { ascending: false });

    if (error) {
      console.error('Error fetching running experiments:', error);
      throw error;
    }

    return data || [];
  },

  // 获取最近的实验
  async getRecentExperiments(limit = 10) {
    const { data, error } = await supabase
      .from('experiments')
      .select(`
        *,
        template:experiment_templates!template_id(name, category)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent experiments:', error);
      throw error;
    }

    return data || [];
  },

  // 保存实验数据点
  async saveTestData(experimentId: string, data: {
    voltage?: number;
    current?: number;
    power?: number;
    temperature?: number;
    humidity?: number;
    irradiance?: number;
    efficiency?: number;
    [key: string]: any;
  }) {
    // 计算派生值
    if (data.voltage !== undefined && data.current !== undefined) {
      data.power = data.voltage * data.current;
      
      // 简化的效率计算（实际应该基于光照强度和面积）
      if (data.irradiance && data.irradiance > 0) {
        // 假设1平方米的标准测试面积
        const inputPower = data.irradiance * 1; // W
        data.efficiency = (data.power / inputPower) * 100;
      }
    }

    const { error } = await supabase
      .from('test_data')
      .insert({
        experiment_id: experimentId,
        ...data,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving test data:', error);
      throw error;
    }

    // 检查告警条件
    await this.checkDataAlerts(experimentId, data);

    return true;
  },

  // 批量保存测试数据
  async saveTestDataBatch(experimentId: string, dataPoints: any[]) {
    const formattedData = dataPoints.map(point => ({
      experiment_id: experimentId,
      ...point,
      timestamp: point.timestamp || new Date().toISOString()
    }));

    const { error } = await supabase
      .from('test_data')
      .insert(formattedData);

    if (error) {
      console.error('Error saving test data batch:', error);
      throw error;
    }

    return true;
  },

  // 获取实验的实时数据（最新的N条）
  async getRealtimeData(experimentId: string, limit = 100) {
    const { data, error } = await supabase
      .from('test_data')
      .select('*')
      .eq('experiment_id', experimentId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching realtime data:', error);
      throw error;
    }

    return (data || []).reverse(); // 返回时间升序的数据
  },

  // 计算实验结果
  async calculateExperimentResults(experimentId: string) {
    // 获取所有测试数据
    const { data: testData, error } = await supabase
      .from('test_data')
      .select('*')
      .eq('experiment_id', experimentId)
      .order('timestamp', { ascending: true });

    if (error || !testData || testData.length === 0) {
      return null;
    }

    // 计算统计值
    const results = {
      total_data_points: testData.length,
      max_power: Math.max(...testData.map(d => d.power || 0)),
      avg_power: testData.reduce((sum, d) => sum + (d.power || 0), 0) / testData.length,
      max_voltage: Math.max(...testData.map(d => d.voltage || 0)),
      max_current: Math.max(...testData.map(d => d.current || 0)),
      avg_efficiency: testData.reduce((sum, d) => sum + (d.efficiency || 0), 0) / testData.length,
      max_temperature: Math.max(...testData.map(d => d.temperature || 0)),
      test_duration: testData.length > 0 
        ? (new Date(testData[testData.length - 1].timestamp).getTime() - new Date(testData[0].timestamp).getTime()) / 1000
        : 0,
      
      // IV曲线关键点
      open_circuit_voltage: testData.find(d => (d.current || 0) < 0.1)?.voltage || 0,
      short_circuit_current: testData.find(d => (d.voltage || 0) < 0.1)?.current || 0,
      
      // 最大功率点
      mpp: testData.reduce((max, d) => 
        (d.power || 0) > (max.power || 0) ? d : max, 
        { voltage: 0, current: 0, power: 0 }
      ),
      
      // 填充因子计算
      fill_factor: 0, // 将在下面计算
      
      passed: true // 基于某些条件判断是否通过
    };

    // 计算填充因子
    if (results.open_circuit_voltage > 0 && results.short_circuit_current > 0) {
      results.fill_factor = results.max_power / 
        (results.open_circuit_voltage * results.short_circuit_current);
    }

    // 更新实验结果
    await supabase
      .from('experiments')
      .update({ results })
      .eq('id', experimentId);

    return results;
  },

  // 检查数据告警
  async checkDataAlerts(experimentId: string, data: any) {
    const alerts = [];

    // 温度告警
    if (data.temperature > 85) {
      alerts.push({
        experiment_id: experimentId,
        type: 'critical' as const,
        category: 'safety' as const,
        message: `温度过高: ${data.temperature}°C`,
        severity: 5,
        details: { temperature: data.temperature, threshold: 85 }
      });
    } else if (data.temperature > 75) {
      alerts.push({
        experiment_id: experimentId,
        type: 'warning' as const,
        category: 'safety' as const,
        message: `温度偏高: ${data.temperature}°C`,
        severity: 3,
        details: { temperature: data.temperature, threshold: 75 }
      });
    }

    // 电流告警
    if (data.current > 150) {
      alerts.push({
        experiment_id: experimentId,
        type: 'critical' as const,
        category: 'safety' as const,
        message: `电流过高: ${data.current}A`,
        severity: 5,
        details: { current: data.current, threshold: 150 }
      });
    }

    // 电压告警
    if (data.voltage > 1000) {
      alerts.push({
        experiment_id: experimentId,
        type: 'critical' as const,
        category: 'safety' as const,
        message: `电压过高: ${data.voltage}V`,
        severity: 5,
        details: { voltage: data.voltage, threshold: 1000 }
      });
    }

    // 效率告警
    if (data.efficiency < 10 && data.efficiency > 0) {
      alerts.push({
        experiment_id: experimentId,
        type: 'warning' as const,
        category: 'measurement' as const,
        message: `效率异常低: ${data.efficiency.toFixed(2)}%`,
        severity: 2,
        details: { efficiency: data.efficiency, threshold: 10 }
      });
    }

    // 批量插入告警
    if (alerts.length > 0) {
      await supabase.from('alerts').insert(alerts);
    }

    return alerts;
  },

  // 检查实验告警
  async checkExperimentAlerts(experimentId: string) {
    // 检查设备状态等
    const { data: devices } = await supabase
      .from('devices')
      .select('*')
      .neq('status', 'online');

    const alerts = [];
    
    if (devices && devices.length > 0) {
      devices.forEach(device => {
        alerts.push({
          experiment_id: experimentId,
          device_id: device.id,
          type: 'warning' as const,
          category: 'device' as const,
          message: `设备 ${device.name} 未在线`,
          severity: 3,
          details: { device_status: device.status }
        });
      });
    }

    if (alerts.length > 0) {
      await supabase.from('alerts').insert(alerts);
    }

    return alerts;
  },

  // 创建实验模板
  async createTemplate(template: {
    name: string;
    description?: string;
    parameters: any;
    category?: string;
    is_public?: boolean;
  }) {
    const { data: userData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('experiment_templates')
      .insert({
        ...template,
        created_by: userData.user?.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating template:', error);
      throw error;
    }

    return data;
  },

  // 更新实验参数
  async updateExperimentParameters(experimentId: string, parameters: any) {
    const { data, error } = await supabase
      .from('experiments')
      .update({ parameters })
      .eq('id', experimentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating experiment parameters:', error);
      throw error;
    }

    return data;
  },

  // 获取实验详情（包含所有相关数据）
  async getExperimentFullDetails(experimentId: string) {
    const [experiment, testDataCount, alerts] = await Promise.all([
      supabase
        .from('experiments')
        .select(`
          *,
          template:experiment_templates!template_id(*),
          creator:users!created_by(full_name, email)
        `)
        .eq('id', experimentId)
        .single(),
      
      supabase
        .from('test_data')
        .select('*', { count: 'exact', head: true })
        .eq('experiment_id', experimentId),
      
      supabase
        .from('alerts')
        .select('*')
        .eq('experiment_id', experimentId)
        .order('created_at', { ascending: false })
        .limit(10)
    ]);

    if (experiment.error) {
      throw experiment.error;
    }

    return {
      ...experiment.data,
      data_points_count: testDataCount.count || 0,
      recent_alerts: alerts.data || []
    };
  }
};