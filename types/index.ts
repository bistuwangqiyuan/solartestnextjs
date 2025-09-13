// 用户相关类型
export type UserRole = 'admin' | 'operator' | 'observer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  phone?: string;
  department?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

// 实验相关类型
export interface Experiment {
  id: string;
  name: string;
  description?: string;
  parameters: ExperimentParameters;
  status: 'pending' | 'running' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}

export interface ExperimentParameters {
  voltageRange: { min: number; max: number };
  currentRange: { min: number; max: number };
  temperatureRange: { min: number; max: number };
  irradianceLevel: number;
  samplingRate: number;
  duration: number; // 分钟
}

// 测试数据类型
export interface TestData {
  id: string;
  experimentId: string;
  timestamp: Date;
  voltage: number; // V
  current: number; // A
  power: number; // W
  temperature: number; // °C
  irradiance: number; // W/m²
  efficiency: number; // %
}

// 设备相关类型
export interface Device {
  id: string;
  name: string;
  type: 'power_supply' | 'electronic_load' | 'temperature_sensor' | 'irradiance_sensor';
  modbusAddress: number;
  connectionParams: ModbusConnectionParams;
  status: 'online' | 'offline' | 'error';
  lastSeen?: Date;
}

export interface ModbusConnectionParams {
  host: string;
  port: number;
  unitId: number;
  timeout?: number;
  retries?: number;
}

// 告警类型
export interface Alert {
  id: string;
  deviceId?: string;
  type: 'device_offline' | 'over_voltage' | 'over_current' | 'over_temperature' | 'system_error';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  resolvedAt?: Date;
}

// 仪表板数据类型
export interface DashboardData {
  currentMeasurements: {
    voltage: number;
    current: number;
    power: number;
    temperature: number;
    humidity?: number;
    irradiance: number;
    efficiency: number;
  };
  systemStatus: {
    devicesOnline: number;
    totalDevices: number;
    activeExperiments: number;
    dataPointsToday: number;
    activeAlerts: number;
    testsToday: number;
  };
  recentAlerts: any[];
  performanceTrend: {
    time: string;
    efficiency: number;
    power: number;
  }[];
  weeklyTrend?: {
    day: string;
    count: number;
  }[];
  deviceUtilization?: {
    deviceName: string;
    utilization: number;
  }[];
  testTypeDistribution?: {
    category: string;
    count: number;
  }[];
  runningExperiments?: {
    id: string;
    name: string;
    status: string;
    started_at: string;
    duration: number;
    parameters: any;
  }[];
}

// 分析报告类型
export interface AnalysisReport {
  id: string;
  experimentId: string;
  type: 'iv_curve' | 'pv_curve' | 'efficiency' | 'temperature_effect' | 'custom';
  title: string;
  data: any; // 根据报告类型不同，数据结构也不同
  createdAt: Date;
  createdBy: string;
}

// IV曲线数据点
export interface IVPoint {
  voltage: number;
  current: number;
}

// PV曲线数据点
export interface PVPoint {
  voltage: number;
  power: number;
}

// 系统设置类型
export interface SystemSettings {
  general: {
    language: 'zh-CN' | 'en-US';
    timezone: string;
    dateFormat: string;
  };
  dataCollection: {
    defaultSamplingRate: number; // Hz
    dataRetentionDays: number;
    autoExportEnabled: boolean;
  };
  alerts: {
    emailNotifications: boolean;
    alertThresholds: {
      overVoltage: number;
      overCurrent: number;
      overTemperature: number;
    };
  };
  modbus: {
    defaultTimeout: number;
    defaultRetries: number;
  };
}