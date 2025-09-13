import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 实现断开连接的逻辑
    
    return NextResponse.json({
      success: true,
      message: 'Disconnected from Modbus device',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to disconnect' },
      { status: 500 }
    );
  }
}