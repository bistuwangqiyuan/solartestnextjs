import { create } from 'zustand';
import { modbusService } from '@/lib/services/modbus';
import { supabase } from '@/lib/supabase';

interface ModbusDevice {
  id: string;
  name: string;
  type: string;
  host: string;
  port: number;
  unitId: number;
  isConnected: boolean;
  lastData?: any;
  lastUpdate?: Date;
  error?: string;
}

interface ModbusState {
  devices: ModbusDevice[];
  isPolling: boolean;
  pollingInterval: number;
  pollingTimer?: ReturnType<typeof setInterval>;
  
  // Actions
  loadDevices: () => Promise<void>;
  addDevice: (device: Omit<ModbusDevice, 'isConnected' | 'lastData' | 'lastUpdate'>) => void;
  removeDevice: (id: string) => void;
  updateDevice: (id: string, updates: Partial<ModbusDevice>) => void;
  connectDevice: (id: string) => Promise<boolean>;
  disconnectDevice: (id: string) => void;
  startPolling: () => void;
  stopPolling: () => void;
  readDeviceData: (id: string) => Promise<any>;
  readAllDevicesData: () => Promise<void>;
  updateDeviceInDatabase: (id: string, status: string, error?: string) => Promise<void>;
}

export const useModbusStore = create<ModbusState>((set, get) => ({
  devices: [],
  isPolling: false,
  pollingInterval: 1000, // 1 second

  loadDevices: async () => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('name');

      if (error) throw error;

      const devices: ModbusDevice[] = (data || []).map((device: any) => ({
        id: device.id,
        name: device.name,
        type: device.type,
        host: device.connection_params?.host || process.env.NEXT_PUBLIC_MODBUS_HOST || '192.168.1.100',
        port: device.connection_params?.port || parseInt(process.env.NEXT_PUBLIC_MODBUS_PORT || '502'),
        unitId: device.modbus_address || 1,
        isConnected: device.status === 'online',
        error: device.last_error || undefined
      }));

      set({ devices });
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  },

  addDevice: (device) => {
    set((state) => ({
      devices: [...state.devices, { ...device, isConnected: false }],
    }));
  },

  removeDevice: (id) => {
    set((state) => ({
      devices: state.devices.filter((d) => d.id !== id),
    }));
  },

  updateDevice: (id, updates) => {
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    }));
  },

  connectDevice: async (id) => {
    const device = get().devices.find((d) => d.id === id);
    if (!device) return false;

    try {
      const connected = await modbusService.testConnection({
        host: device.host,
        port: device.port,
        unitId: device.unitId,
      });

      get().updateDevice(id, { 
        isConnected: connected,
        error: connected ? undefined : 'Connection failed'
      });
      
      // 更新数据库中的设备状态
      await get().updateDeviceInDatabase(id, connected ? 'online' : 'offline', connected ? undefined : 'Connection failed');
      
      return connected;
    } catch (error) {
      console.error('Connection error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      get().updateDevice(id, { isConnected: false, error: errorMsg });
      await get().updateDeviceInDatabase(id, 'error', errorMsg);
      return false;
    }
  },

  disconnectDevice: (id) => {
    get().updateDevice(id, { isConnected: false });
    get().updateDeviceInDatabase(id, 'offline');
  },

  startPolling: () => {
    const { isPolling, pollingInterval } = get();
    if (isPolling) return;

    set({ isPolling: true });
    
    // 立即执行一次
    get().readAllDevicesData();
    
    // 设置定时器
    const timer = setInterval(() => {
      get().readAllDevicesData();
    }, pollingInterval);
    
    set({ pollingTimer: timer });
  },

  stopPolling: () => {
    const { pollingTimer } = get();
    if (pollingTimer) {
      clearInterval(pollingTimer);
    }
    set({ isPolling: false, pollingTimer: undefined });
  },

  readDeviceData: async (id) => {
    const device = get().devices.find((d) => d.id === id);
    if (!device || !device.isConnected) return null;

    try {
      let data = null;
      
      const config = {
        host: device.host,
        port: device.port,
        unitId: device.unitId,
      };

      switch (device.type) {
        case 'power_supply':
          data = await modbusService.readPowerSupplyData(config);
          break;
        case 'weather_station':
          data = await modbusService.readWeatherStationData(config);
          break;
        case 'electronic_load':
          // 读取电子负载数据
          const result = await modbusService.readHoldingRegisters(
            config,
            0x010A, // VOLTAGE_READ
            4 // 读取电压、电流
          );
          if (result.success && result.data) {
            data = {
              voltage: result.data[0] / 100,
              current: result.data[1] / 100,
              power: (result.data[0] / 100) * (result.data[1] / 100)
            };
          }
          break;
        case 'multimeter':
          // 读取万用表数据
          const mmResult = await modbusService.readHoldingRegisters(
            config,
            0x0200, // VOLTAGE_DC
            4 // 读取电压、电流
          );
          if (mmResult.success && mmResult.data) {
            data = {
              voltage: mmResult.data[0] / 100,
              current: mmResult.data[1] / 100,
              temperature: mmResult.data[3] / 10
            };
          }
          break;
      }

      if (data) {
        get().updateDevice(id, {
          lastData: data,
          lastUpdate: new Date(),
          error: undefined
        });
      }

      return data;
    } catch (error) {
      console.error('Read error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Read error';
      get().updateDevice(id, { error: errorMsg });
      return null;
    }
  },

  readAllDevicesData: async () => {
    const { devices } = get();
    const connectedDevices = devices.filter(d => d.isConnected);
    
    // 并行读取所有设备数据
    await Promise.all(
      connectedDevices.map(device => get().readDeviceData(device.id))
    );
  },

  updateDeviceInDatabase: async (id: string, status: string, error?: string) => {
    try {
      await (supabase as any)
        .from('devices')
        .update({
          status,
          last_seen: status === 'online' ? new Date().toISOString() : undefined,
          last_error: error,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
    } catch (err) {
      console.error('Failed to update device in database:', err);
    }
  }
}));