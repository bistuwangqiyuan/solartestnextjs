import { create } from 'zustand'
import type { ModbusData, ModbusConfig } from '@/types'

interface ModbusState {
  config: ModbusConfig | null
  isConnected: boolean
  data: ModbusData | null
  error: string | null
  
  setConfig: (config: ModbusConfig) => void
  setConnectionStatus: (status: boolean) => void
  updateData: (data: ModbusData) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useModbusStore = create<ModbusState>((set) => ({
  config: null,
  isConnected: false,
  data: null,
  error: null,
  
  setConfig: (config) => set({ config }),
  
  setConnectionStatus: (status) => set({ isConnected: status }),
  
  updateData: (data) => set({ data, error: null }),
  
  setError: (error) => set({ error }),
  
  reset: () => set({
    config: null,
    isConnected: false,
    data: null,
    error: null,
  }),
}))