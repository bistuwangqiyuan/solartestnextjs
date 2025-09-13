import type { Handler } from '@netlify/functions';

// 注意：在实际部署中，您需要安装并使用真实的Modbus库，如 'modbus-serial'
// 这里我们提供一个模拟实现

interface ModbusRequest {
  action: 'read' | 'write' | 'test';
  config: {
    host: string;
    port: number;
    unitId: number;
  };
  address?: number;
  quantity?: number;
  value?: number;
  values?: number[];
}

// 模拟数据生成
function generateMockData(address: number, quantity: number): number[] {
  const data: number[] = [];
  
  for (let i = 0; i < quantity; i++) {
    const currentAddress = address + i;
    
    // 根据地址范围生成不同的模拟数据
    if (currentAddress >= 0x0004 && currentAddress <= 0x0005) {
      // 电压 (19-21V)
      data.push(Math.floor((19 + Math.random() * 2) * 100));
    } else if (currentAddress >= 0x0006 && currentAddress <= 0x0007) {
      // 电流 (95-105A)
      data.push(Math.floor((95 + Math.random() * 10) * 100));
    } else if (currentAddress >= 0x0008 && currentAddress <= 0x0009) {
      // 功率 (1900-2100W)
      data.push(Math.floor((1900 + Math.random() * 200) * 10));
    } else if (currentAddress >= 0x0300 && currentAddress <= 0x0301) {
      // 温度 (20-30°C)
      data.push(Math.floor((20 + Math.random() * 10) * 10));
    } else if (currentAddress >= 0x0302 && currentAddress <= 0x0303) {
      // 湿度 (40-60%)
      data.push(Math.floor((40 + Math.random() * 20) * 10));
    } else if (currentAddress >= 0x0304 && currentAddress <= 0x0305) {
      // 光照强度 (800-1200 W/m²)
      data.push(Math.floor(800 + Math.random() * 400));
    } else {
      // 默认值
      data.push(0);
    }
  }
  
  return data;
}

export const handler: Handler = async (event) => {
  // 只允许POST请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const request: ModbusRequest = JSON.parse(event.body || '{}');

    // 验证请求
    if (!request.action || !request.config) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request' }),
      };
    }

    // 模拟Modbus操作
    switch (request.action) {
      case 'read':
        if (request.address === undefined || request.quantity === undefined) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing address or quantity' }),
          };
        }

        // 模拟读取延迟
        await new Promise(resolve => setTimeout(resolve, 100));

        const data = generateMockData(request.address, request.quantity);
        
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            data,
          }),
        };

      case 'write':
        if (request.address === undefined || (request.value === undefined && !request.values)) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing address or value' }),
          };
        }

        // 模拟写入延迟
        await new Promise(resolve => setTimeout(resolve, 50));

        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
          }),
        };

      case 'test':
        // 模拟连接测试
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // 随机模拟连接成功或失败
        const isConnected = Math.random() > 0.1; // 90%成功率
        
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: isConnected,
            message: isConnected ? 'Connection successful' : 'Connection failed',
          }),
        };

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' }),
        };
    }
  } catch (error) {
    console.error('Modbus function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

/* 
实际部署时的真实Modbus实现示例（需要安装 modbus-serial 包）：

import ModbusRTU from 'modbus-serial';

const client = new ModbusRTU();

async function connectModbus(config: any) {
  await client.connectTCP(config.host, { port: config.port });
  client.setID(config.unitId);
  client.setTimeout(config.timeout || 5000);
}

async function readRegisters(address: number, quantity: number) {
  const result = await client.readHoldingRegisters(address, quantity);
  return result.data;
}

async function writeRegister(address: number, value: number) {
  await client.writeRegister(address, value);
}

// 在handler中使用这些函数替代模拟实现
*/