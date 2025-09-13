export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'operator' | 'observer'
          full_name: string | null
          phone: string | null
          department: string | null
          created_at: string
          updated_at: string
          last_login: string | null
          is_active: boolean
        }
        Insert: {
          id: string
          email: string
          role?: 'admin' | 'operator' | 'observer'
          full_name?: string | null
          phone?: string | null
          department?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'operator' | 'observer'
          full_name?: string | null
          phone?: string | null
          department?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          is_active?: boolean
        }
      }
      experiments: {
        Row: {
          id: string
          name: string
          description: string | null
          parameters: Json
          status: 'pending' | 'running' | 'completed' | 'cancelled' | 'failed'
          created_by: string | null
          created_at: string
          started_at: string | null
          ended_at: string | null
          template_id: string | null
          tags: string[] | null
          results: Json
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          parameters?: Json
          status?: 'pending' | 'running' | 'completed' | 'cancelled' | 'failed'
          created_by?: string | null
          created_at?: string
          started_at?: string | null
          ended_at?: string | null
          template_id?: string | null
          tags?: string[] | null
          results?: Json
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          parameters?: Json
          status?: 'pending' | 'running' | 'completed' | 'cancelled' | 'failed'
          created_by?: string | null
          created_at?: string
          started_at?: string | null
          ended_at?: string | null
          template_id?: string | null
          tags?: string[] | null
          results?: Json
        }
      }
      test_data: {
        Row: {
          id: string
          experiment_id: string | null
          timestamp: string
          voltage: number | null
          current: number | null
          power: number | null
          temperature: number | null
          humidity: number | null
          irradiance: number | null
          efficiency: number | null
          fill_factor: number | null
          open_circuit_voltage: number | null
          short_circuit_current: number | null
          max_power_voltage: number | null
          max_power_current: number | null
          raw_data: Json
        }
        Insert: {
          id?: string
          experiment_id?: string | null
          timestamp?: string
          voltage?: number | null
          current?: number | null
          power?: number | null
          temperature?: number | null
          humidity?: number | null
          irradiance?: number | null
          efficiency?: number | null
          fill_factor?: number | null
          open_circuit_voltage?: number | null
          short_circuit_current?: number | null
          max_power_voltage?: number | null
          max_power_current?: number | null
          raw_data?: Json
        }
        Update: {
          id?: string
          experiment_id?: string | null
          timestamp?: string
          voltage?: number | null
          current?: number | null
          power?: number | null
          temperature?: number | null
          humidity?: number | null
          irradiance?: number | null
          efficiency?: number | null
          fill_factor?: number | null
          open_circuit_voltage?: number | null
          short_circuit_current?: number | null
          max_power_voltage?: number | null
          max_power_current?: number | null
          raw_data?: Json
        }
      }
      devices: {
        Row: {
          id: string
          name: string
          type: 'power_supply' | 'electronic_load' | 'multimeter' | 'weather_station' | 'solar_simulator'
          manufacturer: string | null
          model: string | null
          serial_number: string | null
          modbus_address: number | null
          connection_params: Json
          status: 'online' | 'offline' | 'error' | 'maintenance'
          last_seen: string | null
          last_error: string | null
          created_at: string
          updated_at: string
          calibration_date: string | null
          next_calibration_date: string | null
        }
        Insert: {
          id?: string
          name: string
          type: 'power_supply' | 'electronic_load' | 'multimeter' | 'weather_station' | 'solar_simulator'
          manufacturer?: string | null
          model?: string | null
          serial_number?: string | null
          modbus_address?: number | null
          connection_params?: Json
          status?: 'online' | 'offline' | 'error' | 'maintenance'
          last_seen?: string | null
          last_error?: string | null
          created_at?: string
          updated_at?: string
          calibration_date?: string | null
          next_calibration_date?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: 'power_supply' | 'electronic_load' | 'multimeter' | 'weather_station' | 'solar_simulator'
          manufacturer?: string | null
          model?: string | null
          serial_number?: string | null
          modbus_address?: number | null
          connection_params?: Json
          status?: 'online' | 'offline' | 'error' | 'maintenance'
          last_seen?: string | null
          last_error?: string | null
          created_at?: string
          updated_at?: string
          calibration_date?: string | null
          next_calibration_date?: string | null
        }
      }
      alerts: {
        Row: {
          id: string
          device_id: string | null
          experiment_id: string | null
          type: 'error' | 'warning' | 'info' | 'critical'
          category: 'device' | 'measurement' | 'system' | 'safety'
          message: string
          details: Json
          severity: number
          created_at: string
          resolved_at: string | null
          resolved_by: string | null
          acknowledged_at: string | null
          acknowledged_by: string | null
        }
        Insert: {
          id?: string
          device_id?: string | null
          experiment_id?: string | null
          type: 'error' | 'warning' | 'info' | 'critical'
          category: 'device' | 'measurement' | 'system' | 'safety'
          message: string
          details?: Json
          severity: number
          created_at?: string
          resolved_at?: string | null
          resolved_by?: string | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
        }
        Update: {
          id?: string
          device_id?: string | null
          experiment_id?: string | null
          type?: 'error' | 'warning' | 'info' | 'critical'
          category?: 'device' | 'measurement' | 'system' | 'safety'
          message?: string
          details?: Json
          severity?: number
          created_at?: string
          resolved_at?: string | null
          resolved_by?: string | null
          acknowledged_at?: string | null
          acknowledged_by?: string | null
        }
      }
      experiment_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          parameters: Json
          created_by: string | null
          created_at: string
          updated_at: string
          is_public: boolean
          category: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          parameters?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
          is_public?: boolean
          category?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          parameters?: Json
          created_by?: string | null
          created_at?: string
          updated_at?: string
          is_public?: boolean
          category?: string | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      system_settings: {
        Row: {
          key: string
          value: Json
          description: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          key: string
          value: Json
          description?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          key?: string
          value?: Json
          description?: string | null
          updated_at?: string
          updated_by?: string | null
        }
      }
    }
    Views: {
      experiment_summary: {
        Row: {
          id: string | null
          name: string | null
          status: string | null
          created_at: string | null
          started_at: string | null
          ended_at: string | null
          created_by_name: string | null
          data_points: number | null
          max_power: number | null
          avg_efficiency: number | null
        }
      }
      device_status_summary: {
        Row: {
          id: string | null
          name: string | null
          type: string | null
          status: string | null
          last_seen: string | null
          active_alerts: number | null
          next_calibration_date: string | null
          calibration_status: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}