import { create } from 'zustand';
import type { Device, TestData } from '@/types';

interface ModbusState {
  devices: Device[];
  isConnected: boolean;
  currentData: Partial<TestData> | null;
  connectionError: string | null;
  
  // Actions
  connect: (device: Device) => Promise<void>;
  disconnect: () => void;
  updateDeviceStatus: (deviceId: string, status: Device['status']) => void;
  setCurrentData: (data: Partial<TestData>) => void;
  setConnectionError: (error: string | null) => void;
}

export const useModbusStore = create<ModbusState>((set, get) => ({
  devices: [],
  isConnected: false,
  currentData: null,
  connectionError: null,

  connect: async (device: Device) => {
    try {
      // 这里将通过API路由调用后端Modbus连接
      const response = await fetch('/api/modbus/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device.connectionParams),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to Modbus device');
      }

      set({ 
        isConnected: true, 
        connectionError: null 
      });

      // 更新设备状态
      get().updateDeviceStatus(device.id, 'online');
    } catch (error: any) {
      set({ 
        isConnected: false, 
        connectionError: error.message 
      });
      get().updateDeviceStatus(device.id, 'error');
      throw error;
    }
  },

  disconnect: () => {
    // 断开连接的逻辑
    fetch('/api/modbus/disconnect', { method: 'POST' });
    set({ 
      isConnected: false, 
      currentData: null,
      connectionError: null 
    });
  },

  updateDeviceStatus: (deviceId: string, status: Device['status']) => {
    set((state) => ({
      devices: state.devices.map((device) =>
        device.id === deviceId ? { ...device, status } : device
      ),
    }));
  },

  setCurrentData: (data: Partial<TestData>) => {
    set({ currentData: data });
  },

  setConnectionError: (error: string | null) => {
    set({ connectionError: error });
  },
}));