import axios from 'axios';

export interface ModbusConfig {
  host: string;
  port: number;
  unitId: number;
  timeout?: number;
  retries?: number;
}

export interface ModbusReadResult {
  success: boolean;
  data?: number[];
  error?: string;
}

export interface ModbusWriteResult {
  success: boolean;
  error?: string;
}

// Modbus功能码
export enum ModbusFunction {
  READ_COILS = 0x01,
  READ_DISCRETE_INPUTS = 0x02,
  READ_HOLDING_REGISTERS = 0x03,
  READ_INPUT_REGISTERS = 0x04,
  WRITE_SINGLE_COIL = 0x05,
  WRITE_SINGLE_REGISTER = 0x06,
  WRITE_MULTIPLE_COILS = 0x0F,
  WRITE_MULTIPLE_REGISTERS = 0x10,
}

// 设备寄存器映射
export const REGISTER_MAP = {
  // 电源设备寄存器
  POWER_SUPPLY: {
    VOLTAGE_SET: 0x0000,      // 电压设定值
    CURRENT_SET: 0x0002,      // 电流设定值
    VOLTAGE_READ: 0x0004,     // 电压读取值
    CURRENT_READ: 0x0006,     // 电流读取值
    POWER_READ: 0x0008,       // 功率读取值
    OUTPUT_ENABLE: 0x000A,    // 输出使能
    DEVICE_STATUS: 0x000C,    // 设备状态
    PROTECTION_STATUS: 0x000E, // 保护状态
  },
  
  // 电子负载寄存器
  ELECTRONIC_LOAD: {
    MODE: 0x0100,             // 工作模式 (CC/CV/CR/CP)
    CC_VALUE: 0x0102,         // 恒流值
    CV_VALUE: 0x0104,         // 恒压值
    CR_VALUE: 0x0106,         // 恒阻值
    CP_VALUE: 0x0108,         // 恒功率值
    VOLTAGE_READ: 0x010A,     // 电压读取
    CURRENT_READ: 0x010C,     // 电流读取
    POWER_READ: 0x010E,       // 功率读取
    INPUT_ENABLE: 0x0110,     // 输入使能
  },
  
  // 万用表寄存器
  MULTIMETER: {
    VOLTAGE_DC: 0x0200,       // 直流电压
    CURRENT_DC: 0x0202,       // 直流电流
    RESISTANCE: 0x0204,       // 电阻
    TEMPERATURE: 0x0206,      // 温度
    FUNCTION: 0x0208,         // 功能选择
  },
  
  // 气象站寄存器
  WEATHER_STATION: {
    TEMPERATURE: 0x0300,      // 环境温度
    HUMIDITY: 0x0302,         // 湿度
    IRRADIANCE: 0x0304,       // 光照强度
    WIND_SPEED: 0x0306,       // 风速
    WIND_DIRECTION: 0x0308,   // 风向
    PRESSURE: 0x030A,         // 气压
  },
  
  // 太阳模拟器寄存器
  SOLAR_SIMULATOR: {
    IRRADIANCE_SET: 0x0400,   // 光照强度设定
    IRRADIANCE_READ: 0x0402,  // 光照强度读取
    SPECTRUM_TYPE: 0x0404,    // 光谱类型
    LAMP_STATUS: 0x0406,      // 灯状态
    LAMP_HOURS: 0x0408,       // 灯使用时间
    SHUTTER_CONTROL: 0x040A,  // 快门控制
  }
};

export const modbusService = {
  // 模拟Modbus通信的API端点（实际应该是真实的Modbus网关）
  apiEndpoint: process.env.NEXT_PUBLIC_MODBUS_API || '/api/modbus',

  // 读取保持寄存器
  async readHoldingRegisters(
    config: ModbusConfig,
    startAddress: number,
    quantity: number
  ): Promise<ModbusReadResult> {
    try {
      // 调用Netlify Function进行Modbus通信
      const response = await axios.post('/.netlify/functions/modbus', {
        action: 'read',
        config,
        address: startAddress,
        quantity
      });

      return response.data;
    } catch (error) {
      console.error('Modbus read error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // 写入单个寄存器
  async writeSingleRegister(
    config: ModbusConfig,
    address: number,
    value: number
  ): Promise<ModbusWriteResult> {
    try {
      const response = await axios.post('/.netlify/functions/modbus', {
        action: 'write',
        config,
        address,
        value
      });

      return response.data;
    } catch (error) {
      console.error('Modbus write error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // 写入多个寄存器
  async writeMultipleRegisters(
    config: ModbusConfig,
    startAddress: number,
    values: number[]
  ): Promise<ModbusWriteResult> {
    try {
      const response = await axios.post('/.netlify/functions/modbus', {
        action: 'write',
        config,
        address: startAddress,
        values
      });

      return response.data;
    } catch (error) {
      console.error('Modbus write error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // 生成模拟数据
  generateMockData(startAddress: number, quantity: number): number[] {
    const data: number[] = [];
    
    for (let i = 0; i < quantity; i++) {
      const addr = startAddress + i * 2;
      
      // 根据寄存器地址生成相应的模拟数据
      if (addr >= REGISTER_MAP.POWER_SUPPLY.VOLTAGE_READ && 
          addr <= REGISTER_MAP.POWER_SUPPLY.VOLTAGE_READ + 1) {
        // 电压读取值 (19-21V)
        data.push(Math.floor((19 + Math.random() * 2) * 100));
      } else if (addr >= REGISTER_MAP.POWER_SUPPLY.CURRENT_READ && 
                 addr <= REGISTER_MAP.POWER_SUPPLY.CURRENT_READ + 1) {
        // 电流读取值 (95-105A)
        data.push(Math.floor((95 + Math.random() * 10) * 100));
      } else if (addr >= REGISTER_MAP.POWER_SUPPLY.POWER_READ && 
                 addr <= REGISTER_MAP.POWER_SUPPLY.POWER_READ + 1) {
        // 功率读取值 (1900-2100W)
        data.push(Math.floor((1900 + Math.random() * 200) * 10));
      } else if (addr >= REGISTER_MAP.WEATHER_STATION.TEMPERATURE && 
                 addr <= REGISTER_MAP.WEATHER_STATION.TEMPERATURE + 1) {
        // 温度 (20-30°C)
        data.push(Math.floor((20 + Math.random() * 10) * 10));
      } else if (addr >= REGISTER_MAP.WEATHER_STATION.HUMIDITY && 
                 addr <= REGISTER_MAP.WEATHER_STATION.HUMIDITY + 1) {
        // 湿度 (40-60%)
        data.push(Math.floor((40 + Math.random() * 20) * 10));
      } else if (addr >= REGISTER_MAP.WEATHER_STATION.IRRADIANCE && 
                 addr <= REGISTER_MAP.WEATHER_STATION.IRRADIANCE + 1) {
        // 光照强度 (800-1200 W/m²)
        data.push(Math.floor(800 + Math.random() * 400));
      } else {
        // 默认值
        data.push(0);
      }
    }
    
    return data;
  },

  // 读取电源数据
  async readPowerSupplyData(config: ModbusConfig) {
    const result = await this.readHoldingRegisters(
      config,
      REGISTER_MAP.POWER_SUPPLY.VOLTAGE_READ,
      6 // 读取电压、电流、功率共6个寄存器
    );

    if (result.success && result.data) {
      return {
        voltage: result.data[0] / 100,      // 转换为实际电压值
        current: result.data[1] / 100,      // 转换为实际电流值
        power: result.data[2] / 10,         // 转换为实际功率值
      };
    }

    return null;
  },

  // 读取气象站数据
  async readWeatherStationData(config: ModbusConfig) {
    const result = await this.readHoldingRegisters(
      config,
      REGISTER_MAP.WEATHER_STATION.TEMPERATURE,
      6 // 读取温度、湿度、光照强度共6个寄存器
    );

    if (result.success && result.data) {
      return {
        temperature: result.data[0] / 10,   // 转换为实际温度值
        humidity: result.data[1] / 10,      // 转换为实际湿度值
        irradiance: result.data[2],         // 光照强度直接使用
      };
    }

    return null;
  },

  // 设置电源输出
  async setPowerSupplyOutput(config: ModbusConfig, voltage: number, current: number) {
    // 写入电压设定值
    const voltageResult = await this.writeSingleRegister(
      config,
      REGISTER_MAP.POWER_SUPPLY.VOLTAGE_SET,
      Math.floor(voltage * 100)
    );

    if (!voltageResult.success) {
      return voltageResult;
    }

    // 写入电流设定值
    const currentResult = await this.writeSingleRegister(
      config,
      REGISTER_MAP.POWER_SUPPLY.CURRENT_SET,
      Math.floor(current * 100)
    );

    return currentResult;
  },

  // 使能/禁用电源输出
  async setPowerSupplyEnable(config: ModbusConfig, enable: boolean) {
    return await this.writeSingleRegister(
      config,
      REGISTER_MAP.POWER_SUPPLY.OUTPUT_ENABLE,
      enable ? 1 : 0
    );
  },

  // 批量读取所有设备数据
  async readAllDevicesData(devices: Array<{ id: string; config: ModbusConfig; type: string }>) {
    const results: Record<string, any> = {};

    for (const device of devices) {
      try {
        switch (device.type) {
          case 'power_supply':
            results[device.id] = await this.readPowerSupplyData(device.config);
            break;
          case 'weather_station':
            results[device.id] = await this.readWeatherStationData(device.config);
            break;
          // 可以添加更多设备类型
        }
      } catch (error) {
        console.error(`Failed to read device ${device.id}:`, error);
        results[device.id] = null;
      }
    }

    return results;
  },

  // 测试Modbus连接
  async testConnection(config: ModbusConfig): Promise<boolean> {
    try {
      const response = await axios.post('/.netlify/functions/modbus', {
        action: 'test',
        config
      });
      return response.data.success;
    } catch (error) {
      return false;
    }
  },

  // 将16位寄存器值转换为32位浮点数
  registersToFloat32(highRegister: number, lowRegister: number): number {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint16(0, highRegister, false);
    view.setUint16(2, lowRegister, false);
    return view.getFloat32(0, false);
  },

  // 将32位浮点数转换为16位寄存器值
  float32ToRegisters(value: number): [number, number] {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, value, false);
    return [view.getUint16(0, false), view.getUint16(2, false)];
  }
};