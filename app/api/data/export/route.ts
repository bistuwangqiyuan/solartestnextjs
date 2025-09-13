import { NextRequest, NextResponse } from 'next/server';
import { exportToCSV } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { data, filename } = await request.json();
    
    // 在实际应用中，这里应该从数据库获取数据
    // 并进行适当的权限检查
    
    // 生成CSV内容
    const csvContent = convertToCSV(data);
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

function convertToCSV(data: any[]): string {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      if (typeof value === 'string' && value.includes(',')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
}