// User and Auth Types
export interface User {
  id: string
  username: string
  role: 'ADMIN' | 'ENGINEER' | 'VIEWER'
  fullName?: string
  email?: string
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AuthPayload {
  user: User
  token: string
}

// Experiment Types
export type ExperimentType = 'LOW_VOLTAGE_HIGH_CURRENT' | 'DUAL_POWER_SWITCH' | 'CUSTOM'
export type ExperimentStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export interface Experiment {
  id: string
  type: ExperimentType
  startTime: Date
  endTime?: Date
  status: ExperimentStatus
  operatorId: string
  operator?: User
  deviceId: string
  parameters: ExperimentParameters
  result?: string
  createdAt: Date
  updatedAt: Date
  data?: ExperimentData[]
}

export interface ExperimentParameters {
  // Low Voltage High Current Test Parameters
  voltage?: number // V
  current?: number // A
  duration?: number // seconds
  samplingRate?: number // Hz
  
  // Dual Power Switch Parameters
  switchThreshold?: number
  switchDelay?: number // ms
  switchCount?: number
  switchInterval?: number // seconds
  
  // Common Parameters
  temperature?: number // °C
  notes?: string
}

export interface ExperimentData {
  id: string
  experimentId: string
  timestamp: Date
  voltage?: number
  current?: number
  power?: number
  powerFactor?: number
  temperature?: number
  deviceStatus?: string
  createdAt: Date
}

// Modbus Types
export interface ModbusConfig {
  port: string
  baudRate: number
  dataBits: number
  stopBits: number
  parity: 'none' | 'even' | 'odd'
  slaveId: number
  timeout: number
}

export interface ModbusRegister {
  address: number
  name: string
  type: 'holding' | 'input' | 'coil' | 'discrete'
  dataType: 'uint16' | 'int16' | 'uint32' | 'int32' | 'float32' | 'boolean'
  scale?: number
  unit?: string
  description?: string
}

export interface ModbusData {
  registers: Record<string, number | boolean>
  timestamp: Date
  status: 'connected' | 'disconnected' | 'error'
  error?: string
}

// Real-time Data Types
export interface RealtimeData {
  voltage: number
  current: number
  power: number
  powerFactor: number
  temperature: number
  timestamp: Date
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
    tension?: number
    fill?: boolean
  }[]
}

// System Types
export interface SystemStatus {
  modbusConnected: boolean
  databaseConnected: boolean
  activeExperiments: number
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  uptime: number
}

export interface AuditLog {
  id: string
  userId: string
  user?: User
  action: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// WebSocket Event Types
export interface WebSocketEvents {
  // Client to Server
  'experiment:start': (params: ExperimentParameters) => void
  'experiment:stop': (experimentId: string) => void
  'modbus:connect': (config: ModbusConfig) => void
  'modbus:disconnect': () => void
  'modbus:write': (register: string, value: number | boolean) => void
  
  // Server to Client
  'realtime:data': (data: RealtimeData) => void
  'experiment:status': (status: ExperimentStatus, experimentId: string) => void
  'modbus:status': (connected: boolean, error?: string) => void
  'system:status': (status: SystemStatus) => void
  'error': (error: string) => void
}

// Dashboard Statistics Types
export interface DashboardStats {
  todayExperiments: number
  weekExperiments: number
  monthExperiments: number
  successRate: number
  averageDuration: number
  totalDataPoints: number
  activeDevices: number
  systemUptime: number
}

export interface DeviceStats {
  deviceId: string
  name: string
  status: 'online' | 'offline' | 'error'
  lastSeen: Date
  totalExperiments: number
  successRate: number
  averageVoltage: number
  averageCurrent: number
  averagePower: number
}