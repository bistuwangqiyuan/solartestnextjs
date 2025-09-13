import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';

export interface ExperimentData {
  id: string;
  name: string;
  type?: string;
  status: string;
  created_at: string;
  started_at: string | null;
  ended_at: string | null;
  created_by: string | null;
  parameters: any;
  results: any;
  tags: string[] | null;
  data_points?: number;
  creator?: {
    full_name: string | null;
    email: string;
  };
  template?: {
    name: string;
    category: string | null;
  };
}

export interface TestDataPoint {
  id: string;
  experiment_id: string;
  timestamp: string;
  voltage: number | null;
  current: number | null;
  power: number | null;
  temperature: number | null;
  humidity: number | null;
  irradiance: number | null;
  efficiency: number | null;
  fill_factor: number | null;
  open_circuit_voltage: number | null;
  short_circuit_current: number | null;
  max_power_voltage: number | null;
  max_power_current: number | null;
}

export const dataService = {
  // 获取实验列表
  async getExperiments(filters?: {
    search?: string;
    type?: string;
    status?: string;
    dateRange?: { start: Date; end: Date };
    page?: number;
    pageSize?: number;
  }) {
    let query = supabase
      .from('experiments')
      .select(`
        *,
        creator:users!created_by(full_name, email),
        template:experiment_templates!template_id(name, category),
        _count:test_data(count)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // 应用筛选条件
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('template.category', filters.type);
    }

    if (filters?.dateRange) {
      query = query
        .gte('created_at', filters.dateRange.start.toISOString())
        .lte('created_at', filters.dateRange.end.toISOString());
    }

    // 分页
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    query = query.range(start, end);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching experiments:', error);
      throw error;
    }

    return {
      data: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  },

  // 获取实验详情
  async getExperimentDetails(experimentId: string) {
    const { data, error } = await supabase
      .from('experiments')
      .select(`
        *,
        creator:users!created_by(full_name, email),
        template:experiment_templates!template_id(name, category, parameters)
      `)
      .eq('id', experimentId)
      .single();

    if (error) {
      console.error('Error fetching experiment details:', error);
      throw error;
    }

    return data;
  },

  // 获取实验数据点
  async getTestData(experimentId: string, options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
  }) {
    let query = supabase
      .from('test_data')
      .select('*')
      .eq('experiment_id', experimentId);

    // 排序
    const orderBy = options?.orderBy || 'timestamp';
    const order = options?.order || 'asc';
    query = query.order(orderBy, { ascending: order === 'asc' });

    // 分页
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 100) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching test data:', error);
      throw error;
    }

    return data || [];
  },

  // 导出实验数据到Excel
  async exportToExcel(experimentIds: string[]) {
    try {
      // 获取实验信息
      const { data: experiments } = await supabase
        .from('experiments')
        .select(`
          *,
          creator:users!created_by(full_name, email),
          template:experiment_templates!template_id(name, category)
        `)
        .in('id', experimentIds);

      if (!experiments || experiments.length === 0) {
        throw new Error('No experiments found');
      }

      // 创建工作簿
      const wb = XLSX.utils.book_new();

      // 实验概览表
      const overviewData = experiments.map(exp => ({
        '实验ID': exp.id,
        '实验名称': exp.name,
        '类型': exp.template?.category || '-',
        '状态': exp.status,
        '创建人': exp.creator?.full_name || exp.creator?.email || '-',
        '创建时间': new Date(exp.created_at).toLocaleString('zh-CN'),
        '开始时间': exp.started_at ? new Date(exp.started_at).toLocaleString('zh-CN') : '-',
        '结束时间': exp.ended_at ? new Date(exp.ended_at).toLocaleString('zh-CN') : '-',
        '参数': JSON.stringify(exp.parameters)
      }));

      const wsOverview = XLSX.utils.json_to_sheet(overviewData);
      XLSX.utils.book_append_sheet(wb, wsOverview, '实验概览');

      // 为每个实验创建数据表
      for (const exp of experiments) {
        const testData = await this.getTestData(exp.id);
        
        if (testData.length > 0) {
          const sheetData = testData.map(data => ({
            '时间戳': new Date(data.timestamp).toLocaleString('zh-CN'),
            '电压(V)': data.voltage || 0,
            '电流(A)': data.current || 0,
            '功率(W)': data.power || 0,
            '温度(°C)': data.temperature || 0,
            '湿度(%)': data.humidity || 0,
            '光照强度(W/m²)': data.irradiance || 0,
            '效率(%)': data.efficiency || 0,
            '填充因子': data.fill_factor || 0,
            '开路电压(V)': data.open_circuit_voltage || 0,
            '短路电流(A)': data.short_circuit_current || 0,
            '最大功率电压(V)': data.max_power_voltage || 0,
            '最大功率电流(A)': data.max_power_current || 0
          }));

          const ws = XLSX.utils.json_to_sheet(sheetData);
          // 限制sheet名称长度
          const sheetName = exp.name.length > 30 ? exp.name.substring(0, 27) + '...' : exp.name;
          XLSX.utils.book_append_sheet(wb, ws, sheetName);
        }
      }

      // 生成文件
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
      
      // 转换为Blob
      const s2ab = (s: string) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      };

      const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
      
      // 下载文件
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `实验数据_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      throw error;
    }
  },

  // 导出到CSV
  async exportToCSV(experimentIds: string[]) {
    try {
      const allData: any[] = [];

      for (const expId of experimentIds) {
        const experiment = await this.getExperimentDetails(expId);
        const testData = await this.getTestData(expId);

        testData.forEach(data => {
          allData.push({
            experiment_id: experiment.id,
            experiment_name: experiment.name,
            timestamp: data.timestamp,
            voltage: data.voltage || 0,
            current: data.current || 0,
            power: data.power || 0,
            temperature: data.temperature || 0,
            humidity: data.humidity || 0,
            irradiance: data.irradiance || 0,
            efficiency: data.efficiency || 0
          });
        });
      }

      // 创建CSV内容
      const headers = Object.keys(allData[0]).join(',');
      const rows = allData.map(row => Object.values(row).join(','));
      const csv = [headers, ...rows].join('\n');

      // 下载文件
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `实验数据_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  },

  // 导入Excel数据
  async importFromExcel(file: File): Promise<{ success: boolean; message: string; imported?: number }> {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      let totalImported = 0;

      // 处理每个工作表
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // 跳过概览表
        if (sheetName === '实验概览') continue;

        // 查找或创建实验
        let experimentId: string | null = null;
        
        // 尝试从数据中提取实验信息
        if (jsonData.length > 0) {
          // 创建新实验
          const { data: newExp, error: expError } = await supabase
            .from('experiments')
            .insert({
              name: sheetName,
              description: `从Excel导入 - ${new Date().toLocaleString('zh-CN')}`,
              status: 'completed',
              parameters: {}
            })
            .select()
            .single();

          if (expError) {
            console.error('Error creating experiment:', expError);
            continue;
          }

          experimentId = newExp.id;

          // 导入测试数据
          const testDataToInsert = jsonData.map((row: any) => ({
            experiment_id: experimentId,
            timestamp: row['时间戳'] || new Date().toISOString(),
            voltage: parseFloat(row['电压(V)']) || null,
            current: parseFloat(row['电流(A)']) || null,
            power: parseFloat(row['功率(W)']) || null,
            temperature: parseFloat(row['温度(°C)']) || null,
            humidity: parseFloat(row['湿度(%)']) || null,
            irradiance: parseFloat(row['光照强度(W/m²)']) || null,
            efficiency: parseFloat(row['效率(%)']) || null,
            fill_factor: parseFloat(row['填充因子']) || null,
            open_circuit_voltage: parseFloat(row['开路电压(V)']) || null,
            short_circuit_current: parseFloat(row['短路电流(A)']) || null,
            max_power_voltage: parseFloat(row['最大功率电压(V)']) || null,
            max_power_current: parseFloat(row['最大功率电流(A)']) || null
          }));

          const { error: dataError } = await supabase
            .from('test_data')
            .insert(testDataToInsert);

          if (dataError) {
            console.error('Error inserting test data:', dataError);
            continue;
          }

          totalImported += testDataToInsert.length;
        }
      }

      return {
        success: true,
        message: `成功导入 ${totalImported} 条数据`,
        imported: totalImported
      };
    } catch (error) {
      console.error('Error importing Excel:', error);
      return {
        success: false,
        message: '导入失败：' + (error as Error).message
      };
    }
  },

  // 获取数据统计
  async getDataStatistics() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const [
      totalExperiments,
      totalDataPoints,
      completedExperiments,
      todayExperiments
    ] = await Promise.all([
      supabase.from('experiments').select('*', { count: 'exact', head: true }),
      supabase.from('test_data').select('*', { count: 'exact', head: true }),
      supabase.from('experiments').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('experiments').select('*', { count: 'exact', head: true }).gte('created_at', todayStart.toISOString())
    ]);

    // 计算平均实验时长
    const { data: durationData } = await supabase
      .from('experiments')
      .select('started_at, ended_at')
      .not('started_at', 'is', null)
      .not('ended_at', 'is', null)
      .eq('status', 'completed');

    let avgDuration = 0;
    if (durationData && durationData.length > 0) {
      const totalDuration = durationData.reduce((sum, exp) => {
        const duration = new Date(exp.ended_at!).getTime() - new Date(exp.started_at!).getTime();
        return sum + duration;
      }, 0);
      avgDuration = totalDuration / durationData.length / 1000 / 60; // 转换为分钟
    }

    const successRate = totalExperiments.count 
      ? ((completedExperiments.count || 0) / totalExperiments.count * 100).toFixed(1)
      : '0';

    return {
      totalExperiments: totalExperiments.count || 0,
      totalDataPoints: totalDataPoints.count || 0,
      avgDuration: Math.round(avgDuration),
      successRate: parseFloat(successRate),
      todayExperiments: todayExperiments.count || 0
    };
  },

  // 批量删除实验
  async deleteExperiments(experimentIds: string[]) {
    try {
      // 先删除相关的测试数据
      await supabase
        .from('test_data')
        .delete()
        .in('experiment_id', experimentIds);

      // 再删除实验
      const { error } = await supabase
        .from('experiments')
        .delete()
        .in('id', experimentIds);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting experiments:', error);
      throw error;
    }
  }
};