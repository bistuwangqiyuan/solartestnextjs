-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'observer' CHECK (role IN ('admin', 'operator', 'observer')),
    full_name TEXT,
    phone TEXT,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Create experiments table
CREATE TABLE public.experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    parameters JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'cancelled', 'failed')),
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    template_id UUID,
    tags TEXT[],
    results JSONB DEFAULT '{}'
);

-- Create test_data table
CREATE TABLE public.test_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID REFERENCES public.experiments(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    voltage DECIMAL(10, 4),
    current DECIMAL(10, 4),
    power DECIMAL(10, 4),
    temperature DECIMAL(10, 2),
    humidity DECIMAL(10, 2),
    irradiance DECIMAL(10, 2),
    efficiency DECIMAL(10, 2),
    fill_factor DECIMAL(10, 4),
    open_circuit_voltage DECIMAL(10, 4),
    short_circuit_current DECIMAL(10, 4),
    max_power_voltage DECIMAL(10, 4),
    max_power_current DECIMAL(10, 4),
    raw_data JSONB DEFAULT '{}'
);

-- Create devices table
CREATE TABLE public.devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('power_supply', 'electronic_load', 'multimeter', 'weather_station', 'solar_simulator')),
    manufacturer TEXT,
    model TEXT,
    serial_number TEXT UNIQUE,
    modbus_address INTEGER,
    connection_params JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'error', 'maintenance')),
    last_seen TIMESTAMP WITH TIME ZONE,
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    calibration_date DATE,
    next_calibration_date DATE
);

-- Create alerts table
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    experiment_id UUID REFERENCES public.experiments(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('error', 'warning', 'info', 'critical')),
    category TEXT NOT NULL CHECK (category IN ('device', 'measurement', 'system', 'safety')),
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    acknowledged_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Create experiment_templates table
CREATE TABLE public.experiment_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    parameters JSONB NOT NULL DEFAULT '{}',
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_public BOOLEAN DEFAULT false,
    category TEXT
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_settings table
CREATE TABLE public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_experiments_status ON public.experiments(status);
CREATE INDEX idx_experiments_created_by ON public.experiments(created_by);
CREATE INDEX idx_experiments_created_at ON public.experiments(created_at DESC);

CREATE INDEX idx_test_data_experiment_id ON public.test_data(experiment_id);
CREATE INDEX idx_test_data_timestamp ON public.test_data(timestamp DESC);

CREATE INDEX idx_devices_status ON public.devices(status);
CREATE INDEX idx_devices_type ON public.devices(type);

CREATE INDEX idx_alerts_device_id ON public.alerts(device_id);
CREATE INDEX idx_alerts_experiment_id ON public.alerts(experiment_id);
CREATE INDEX idx_alerts_type ON public.alerts(type);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at DESC);
CREATE INDEX idx_alerts_resolved_at ON public.alerts(resolved_at) WHERE resolved_at IS NULL;

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Create Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view all users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Only admins can update users" ON public.users
    FOR UPDATE USING (
        auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
    );

-- Experiments table policies
CREATE POLICY "All authenticated users can view experiments" ON public.experiments
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Operators and admins can create experiments" ON public.experiments
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'operator'))
    );

CREATE POLICY "Operators and admins can update experiments" ON public.experiments
    FOR UPDATE USING (
        auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'operator'))
    );

-- Test data table policies
CREATE POLICY "All authenticated users can view test data" ON public.test_data
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only system can insert test data" ON public.test_data
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
    );

-- Devices table policies
CREATE POLICY "All authenticated users can view devices" ON public.devices
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can manage devices" ON public.devices
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
    );

-- Alerts table policies
CREATE POLICY "All authenticated users can view alerts" ON public.alerts
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "System and admins can create alerts" ON public.alerts
    FOR INSERT WITH CHECK (
        auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
    );

CREATE POLICY "Operators and admins can update alerts" ON public.alerts
    FOR UPDATE USING (
        auth.uid() IN (SELECT id FROM public.users WHERE role IN ('admin', 'operator'))
    );

-- Audit logs table policies
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
    );

-- System settings table policies
CREATE POLICY "All authenticated users can view settings" ON public.system_settings
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update settings" ON public.system_settings
    FOR UPDATE USING (
        auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
    );

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_devices_updated_at
    BEFORE UPDATE ON public.devices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_experiment_templates_updated_at
    BEFORE UPDATE ON public.experiment_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Function to log user actions
CREATE OR REPLACE FUNCTION log_user_action()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, old_values, new_values)
    VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        CASE 
            WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD)
            ELSE NULL
        END,
        CASE 
            WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW)
            ELSE NULL
        END
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for important tables
CREATE TRIGGER audit_experiments
    AFTER INSERT OR UPDATE OR DELETE ON public.experiments
    FOR EACH ROW
    EXECUTE FUNCTION log_user_action();

CREATE TRIGGER audit_devices
    AFTER INSERT OR UPDATE OR DELETE ON public.devices
    FOR EACH ROW
    EXECUTE FUNCTION log_user_action();

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description) VALUES
    ('sampling_rate', '{"value": 1, "unit": "Hz"}', 'Data sampling frequency'),
    ('data_retention_days', '{"value": 365}', 'Days to retain test data'),
    ('alert_thresholds', '{"temperature_max": 85, "current_max": 50, "voltage_max": 1000}', 'Alert threshold values'),
    ('modbus_timeout', '{"value": 5000, "unit": "ms"}', 'Modbus communication timeout'),
    ('report_logo_url', '{"value": "/images/logo.png"}', 'Logo URL for reports'),
    ('maintenance_mode', '{"enabled": false}', 'System maintenance mode flag');

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role)
    VALUES (NEW.id, NEW.email, 'observer');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();