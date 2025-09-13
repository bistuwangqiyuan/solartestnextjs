-- 启用UUID扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建用户角色枚举
CREATE TYPE user_role AS ENUM ('admin', 'operator', 'observer');

-- 创建实验状态枚举
CREATE TYPE experiment_status AS ENUM ('pending', 'running', 'completed', 'cancelled');

-- 创建设备类型枚举
CREATE TYPE device_type AS ENUM ('power_supply', 'electronic_load', 'temperature_sensor', 'irradiance_sensor');

-- 创建设备状态枚举
CREATE TYPE device_status AS ENUM ('online', 'offline', 'error');

-- 创建告警类型枚举
CREATE TYPE alert_type AS ENUM ('device_offline', 'over_voltage', 'over_current', 'over_temperature', 'system_error');

-- 创建告警严重程度枚举
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- 用户表（扩展Supabase auth.users）
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'observer',
    full_name TEXT,
    avatar_url TEXT,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 实验表
CREATE TABLE public.experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    parameters JSONB NOT NULL,
    status experiment_status DEFAULT 'pending',
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 测试数据表（分区表，按月分区）
CREATE TABLE public.test_data (
    id UUID DEFAULT uuid_generate_v4(),
    experiment_id UUID REFERENCES public.experiments(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    voltage DECIMAL(10, 3), -- V
    current DECIMAL(10, 3), -- A
    power DECIMAL(10, 3), -- W
    temperature DECIMAL(10, 2), -- °C
    irradiance DECIMAL(10, 2), -- W/m²
    efficiency DECIMAL(5, 2), -- %
    raw_data JSONB, -- 存储原始数据
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- 创建初始分区（当前月份）
CREATE TABLE public.test_data_2025_01 PARTITION OF public.test_data
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- 设备表
CREATE TABLE public.devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    type device_type NOT NULL,
    modbus_address INTEGER NOT NULL,
    connection_params JSONB NOT NULL,
    status device_status DEFAULT 'offline',
    last_seen TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 告警表
CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
    experiment_id UUID REFERENCES public.experiments(id) ON DELETE SET NULL,
    type alert_type NOT NULL,
    message TEXT NOT NULL,
    severity alert_severity NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES public.user_profiles(id)
);

-- 分析报告表
CREATE TABLE public.analysis_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID REFERENCES public.experiments(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    data JSONB NOT NULL,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 系统设置表
CREATE TABLE public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_by UUID REFERENCES public.user_profiles(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_experiments_status ON public.experiments(status);
CREATE INDEX idx_experiments_created_by ON public.experiments(created_by);
CREATE INDEX idx_test_data_experiment_id ON public.test_data(experiment_id);
CREATE INDEX idx_test_data_timestamp ON public.test_data(timestamp DESC);
CREATE INDEX idx_devices_status ON public.devices(status);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at DESC);
CREATE INDEX idx_alerts_resolved_at ON public.alerts(resolved_at);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiments_updated_at BEFORE UPDATE ON public.experiments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON public.devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建自动分区函数
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS void AS $$
DECLARE
    start_date date;
    end_date date;
    partition_name text;
BEGIN
    start_date := date_trunc('month', CURRENT_DATE + interval '1 month');
    end_date := start_date + interval '1 month';
    partition_name := 'test_data_' || to_char(start_date, 'YYYY_MM');
    
    EXECUTE format('CREATE TABLE IF NOT EXISTS public.%I PARTITION OF public.test_data FOR VALUES FROM (%L) TO (%L)',
        partition_name, start_date, end_date);
END;
$$ LANGUAGE plpgsql;

-- 行级安全策略（RLS）
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 用户配置策略
CREATE POLICY "Users can view all profiles" ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- 实验策略
CREATE POLICY "All users can view experiments" ON public.experiments
    FOR SELECT USING (true);

CREATE POLICY "Operators and admins can create experiments" ON public.experiments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('operator', 'admin')
        )
    );

CREATE POLICY "Operators and admins can update experiments" ON public.experiments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('operator', 'admin')
        )
    );

-- 测试数据策略
CREATE POLICY "All users can view test data" ON public.test_data
    FOR SELECT USING (true);

CREATE POLICY "System can insert test data" ON public.test_data
    FOR INSERT WITH CHECK (true);

-- 设备策略
CREATE POLICY "All users can view devices" ON public.devices
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage devices" ON public.devices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 告警策略
CREATE POLICY "All users can view alerts" ON public.alerts
    FOR SELECT USING (true);

CREATE POLICY "System and admins can manage alerts" ON public.alerts
    FOR ALL USING (
        auth.uid() IS NULL OR EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 分析报告策略
CREATE POLICY "All users can view reports" ON public.analysis_reports
    FOR SELECT USING (true);

CREATE POLICY "Operators and admins can create reports" ON public.analysis_reports
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role IN ('operator', 'admin')
        )
    );

-- 系统设置策略
CREATE POLICY "All users can view settings" ON public.system_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 插入默认系统设置
INSERT INTO public.system_settings (key, value) VALUES
    ('general', '{"language": "zh-CN", "timezone": "Asia/Shanghai", "dateFormat": "YYYY-MM-DD"}'),
    ('dataCollection', '{"defaultSamplingRate": 1, "dataRetentionDays": 365, "autoExportEnabled": false}'),
    ('alerts', '{"emailNotifications": true, "alertThresholds": {"overVoltage": 50, "overCurrent": 20, "overTemperature": 85}}'),
    ('modbus', '{"defaultTimeout": 5000, "defaultRetries": 3}');
