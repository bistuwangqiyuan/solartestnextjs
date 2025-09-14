import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    // 验证用户权限（如果Supabase不可用，跳过认证）
    try {
      const user = await auth.getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } catch (authError) {
      console.warn('Authentication skipped due to configuration:', authError);
    }

    // 获取请求参数
    const { startDate, endDate, experimentId } = await request.json();

    // 如果Supabase不可用，返回示例数据
    if (!supabase) {
      const sampleData = [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          voltage: 20.1,
          current: 5.2,
          power: 104.52,
          temperature: 25.3,
          irradiance: 1000,
          experiment_id: experimentId || 1
        }
      ];
      
      // 创建Excel工作簿
      const ws = XLSX.utils.json_to_sheet(sampleData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Test Data');

      // 生成Excel文件
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

      // 返回文件
      return new NextResponse(excelBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="pv_test_data_demo_${new Date().toISOString().split('T')[0]}.xlsx"`,
        },
      });
    }

    // 构建查询
    let query = supabase
      .from('test_data')
      .select('*')
      .order('timestamp', { ascending: true });

    if (startDate) {
      query = query.gte('timestamp', startDate);
    }
    if (endDate) {
      query = query.lte('timestamp', endDate);
    }
    if (experimentId) {
      query = query.eq('experiment_id', experimentId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 创建Excel工作簿
    const ws = XLSX.utils.json_to_sheet(data || []);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Test Data');

    // 生成Excel文件
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // 返回文件
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="pv_test_data_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}