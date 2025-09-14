import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 验证用户权限
    const user = await auth.getCurrentUser();
    if (!user || user.role === 'observer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deviceId } = await request.json();

    // 注意: 实际的Modbus断开连接需要在服务器端实现
    // 这里只是模拟断开连接成功的响应
    
    return NextResponse.json({
      success: true,
      message: 'Disconnected from Modbus device',
      deviceId,
    });
  } catch (error) {
    console.error('Modbus disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect from Modbus device' },
      { status: 500 }
    );
  }
}