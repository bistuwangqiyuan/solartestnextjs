-- Seed data for PV Testing System

-- Insert test users
-- Note: These users need to be created through Supabase Auth first
-- The passwords shown here are for display purposes only
INSERT INTO public.users (id, email, role, full_name, phone, department, is_active) VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin@test.com', 'admin', '测试管理员', '13800138000', '系统管理部', true),
    ('22222222-2222-2222-2222-222222222222', 'operator@test.com', 'operator', '测试操作员', '13800138001', '测试部', true),
    ('33333333-3333-3333-3333-333333333333', 'observer@test.com', 'observer', '测试观察员', '13800138002', '质量部', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample devices
INSERT INTO public.devices (id, name, type, manufacturer, model, serial_number, modbus_address, connection_params, status, calibration_date, next_calibration_date) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Main Power Supply', 'power_supply', 'Keysight', 'E36313A', 'PS-001', 1, '{"baudrate": 9600, "parity": "N", "stopbits": 1, "timeout": 1000}', 'offline', '2024-06-15', '2025-06-15'),
    ('b2c3d4e5-f678-90ab-cdef-123456789012', 'Electronic Load 1', 'electronic_load', 'Chroma', '63204A-150-400', 'EL-001', 2, '{"baudrate": 9600, "parity": "N", "stopbits": 1, "timeout": 1000}', 'offline', '2024-07-20', '2025-07-20'),
    ('c3d4e5f6-7890-abcd-ef12-345678901234', 'Digital Multimeter', 'multimeter', 'Keithley', 'DMM6500', 'DMM-001', 3, '{"baudrate": 115200, "parity": "N", "stopbits": 1, "timeout": 500}', 'offline', '2024-08-10', '2025-08-10'),
    ('d4e5f678-90ab-cdef-1234-567890123456', 'Weather Station', 'weather_station', 'Davis', 'Vantage Pro2', 'WS-001', 4, '{"baudrate": 19200, "parity": "N", "stopbits": 1, "timeout": 2000}', 'offline', '2024-05-05', '2025-05-05'),
    ('e5f67890-abcd-ef12-3456-789012345678', 'Solar Simulator', 'solar_simulator', 'Newport', 'Sol3A', 'SS-001', 5, '{"baudrate": 9600, "parity": "E", "stopbits": 1, "timeout": 1500}', 'offline', '2024-09-01', '2025-09-01');

-- Insert sample experiment templates
INSERT INTO public.experiment_templates (id, name, description, parameters, is_public, category) VALUES
    ('f6789012-bcde-f123-4567-890123456789', 'Standard I-V Curve Test', 'Standard test for measuring I-V characteristics of PV modules', '{"test_type": "iv_curve", "voltage_range": {"min": 0, "max": 50, "step": 0.5}, "current_limit": 10, "irradiance": 1000, "temperature": 25, "stabilization_time": 5}', true, 'Performance Test'),
    ('67890123-cdef-1234-5678-901234567890', 'Temperature Coefficient Test', 'Test to determine temperature coefficients of PV parameters', '{"test_type": "temp_coeff", "temperature_range": {"min": 15, "max": 75, "step": 5}, "irradiance": 1000, "stabilization_time": 300}', true, 'Performance Test'),
    ('78901234-def1-2345-6789-012345678901', 'Low Light Performance Test', 'Test PV module performance under various irradiance levels', '{"test_type": "low_light", "irradiance_levels": [200, 400, 600, 800, 1000], "temperature": 25, "stabilization_time": 60}', true, 'Performance Test'),
    ('89012345-ef12-3456-7890-123456789012', 'Thermal Cycling Test', 'Accelerated aging test with temperature cycling', '{"test_type": "thermal_cycle", "temp_high": 85, "temp_low": -40, "cycles": 200, "dwell_time": 600, "ramp_rate": 100}', true, 'Reliability Test'),
    ('90123456-f123-4567-8901-234567890123', 'Bypass Diode Test', 'Test bypass diode functionality and thermal behavior', '{"test_type": "bypass_diode", "reverse_current": 1.25, "test_duration": 3600, "temperature_monitoring": true}', true, 'Safety Test');

-- Insert sample experiments with real test data
INSERT INTO public.experiments (id, name, description, parameters, status, template_id, tags, created_by, started_at, ended_at) VALUES
    ('01234567-1234-5678-9012-345678901234', 'Module A - Initial Characterization', 'Initial performance test of Module A', '{"module_id": "MOD-A-001", "test_type": "iv_curve", "operator": "John Doe"}', 'completed', 'f6789012-bcde-f123-4567-890123456789', ARRAY['initial', 'module-a', 'performance'], '22222222-2222-2222-2222-222222222222', '2025-01-10 09:00:00+00', '2025-01-10 09:30:00+00'),
    ('12345678-2345-6789-0123-456789012345', 'Module B - Temperature Test', 'Temperature coefficient measurement for Module B', '{"module_id": "MOD-B-002", "test_type": "temp_coeff"}', 'completed', '67890123-cdef-1234-5678-901234567890', ARRAY['temperature', 'module-b', 'characterization'], '22222222-2222-2222-2222-222222222222', '2025-01-11 10:00:00+00', '2025-01-11 14:00:00+00'),
    ('23456789-3456-7890-1234-567890123456', 'Module C - Low Light Test', 'Low irradiance performance evaluation', '{"module_id": "MOD-C-003", "test_type": "low_light"}', 'running', '78901234-def1-2345-6789-012345678901', ARRAY['low-light', 'module-c', 'performance'], '11111111-1111-1111-1111-111111111111', '2025-01-13 08:00:00+00', NULL);

-- Insert realistic test data based on the Excel files in the data folder
-- Sample data for Module A I-V curve test
INSERT INTO public.test_data (experiment_id, timestamp, voltage, current, power, temperature, humidity, irradiance, efficiency, fill_factor, open_circuit_voltage, short_circuit_current, max_power_voltage, max_power_current) 
VALUES
    ('01234567-1234-5678-9012-345678901234', '2025-01-10 09:00:00+00', 0.00, 6.00, 0.00, 25.0, 45.0, 1000.0, 0.00, NULL, NULL, NULL, NULL, NULL),
    ('01234567-1234-5678-9012-345678901234', '2025-01-10 09:00:30+00', 2.50, 5.98, 14.95, 25.1, 45.0, 1000.0, 7.48, NULL, NULL, NULL, NULL, NULL),
    ('01234567-1234-5678-9012-345678901234', '2025-01-10 09:01:00+00', 5.00, 5.96, 29.80, 25.1, 45.0, 1000.0, 14.90, NULL, NULL, NULL, NULL, NULL),
    ('01234567-1234-5678-9012-345678901234', '2025-01-10 09:01:30+00', 7.50, 5.93, 44.48, 25.2, 45.0, 1000.0, 22.24, NULL, NULL, NULL, NULL, NULL),
    ('01234567-1234-5678-9012-345678901234', '2025-01-10 09:02:00+00', 10.00, 5.90, 59.00, 25.2, 45.0, 1000.0, 29.50, NULL, NULL, NULL, NULL, NULL),
    ('01234567-1234-5678-9012-345678901234', '2025-01-10 09:02:30+00', 12.50, 5.85, 73.13, 25.2, 45.0, 1000.0, 36.56, NULL, NULL, NULL, NULL, NULL),
    ('01234567-1234-5678-9012-345678901234', '2025-01-10 09:03:00+00', 15.00, 5.78, 86.70, 25.3, 45.0, 1000.0, 43.35, NULL, NULL, NULL, NULL, NULL),
    ('01234567-1234-5678-9012-345678901234', '2025-01-10 09:03:30+00', 17.50, 5.65, 98.88, 25.3, 45.0, 1000.0, 49.44, NULL, NULL, NULL, NULL, NULL),
    ('01234567-1234-5678-9012-345678901234', '2025-01-10 09:04:00+00', 19.99, 5.40, 107.95, 25.3, 45.0, 1000.0, 53.97, 0.75, 21.5, 6.0, 19.99, 5.40),
    ('01234567-1234-5678-9012-345678901234', '2025-01-10 09:04:30+00', 20.50, 4.80, 98.40, 25.4, 45.0, 1000.0, 49.20, NULL, NULL, NULL, NULL, NULL),
    ('01234567-1234-5678-9012-345678901234', '2025-01-10 09:05:00+00', 21.00, 3.50, 73.50, 25.4, 45.0, 1000.0, 36.75, NULL, NULL, NULL, NULL, NULL),
    ('01234567-1234-5678-9012-345678901234', '2025-01-10 09:05:30+00', 21.50, 0.50, 10.75, 25.4, 45.0, 1000.0, 5.38, NULL, NULL, NULL, NULL, NULL);

-- Sample data for Module B temperature test
INSERT INTO public.test_data (experiment_id, timestamp, voltage, current, power, temperature, humidity, irradiance, efficiency, max_power_voltage, max_power_current) 
VALUES
    ('12345678-2345-6789-0123-456789012345', '2025-01-11 10:00:00+00', 39.8, 9.02, 359.00, 15.0, 50.0, 1000.0, 17.95, 39.8, 9.02),
    ('12345678-2345-6789-0123-456789012345', '2025-01-11 10:30:00+00', 39.5, 9.05, 357.48, 20.0, 50.0, 1000.0, 17.87, 39.5, 9.05),
    ('12345678-2345-6789-0123-456789012345', '2025-01-11 11:00:00+00', 39.2, 9.08, 355.94, 25.0, 50.0, 1000.0, 17.80, 39.2, 9.08),
    ('12345678-2345-6789-0123-456789012345', '2025-01-11 11:30:00+00', 38.9, 9.10, 354.29, 30.0, 50.0, 1000.0, 17.71, 38.9, 9.10),
    ('12345678-2345-6789-0123-456789012345', '2025-01-11 12:00:00+00', 38.5, 9.12, 351.12, 35.0, 50.0, 1000.0, 17.56, 38.5, 9.12),
    ('12345678-2345-6789-0123-456789012345', '2025-01-11 12:30:00+00', 38.1, 9.14, 348.23, 40.0, 50.0, 1000.0, 17.41, 38.1, 9.14),
    ('12345678-2345-6789-0123-456789012345', '2025-01-11 13:00:00+00', 37.7, 9.15, 344.96, 45.0, 50.0, 1000.0, 17.25, 37.7, 9.15),
    ('12345678-2345-6789-0123-456789012345', '2025-01-11 13:30:00+00', 37.2, 9.16, 340.75, 50.0, 50.0, 1000.0, 17.04, 37.2, 9.16),
    ('12345678-2345-6789-0123-456789012345', '2025-01-11 14:00:00+00', 36.8, 9.17, 337.46, 55.0, 50.0, 1000.0, 16.87, 36.8, 9.17);

-- Insert sample alerts
INSERT INTO public.alerts (device_id, experiment_id, type, category, message, details, severity, created_at) VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', NULL, 'warning', 'device', 'Power supply communication timeout', '{"error_code": "MODBUS_TIMEOUT", "attempts": 3}', 3, '2025-01-12 14:30:00+00'),
    ('d4e5f678-90ab-cdef-1234-567890123456', NULL, 'info', 'device', 'Weather station calibration due soon', '{"next_calibration": "2025-05-05", "days_remaining": 112}', 2, '2025-01-13 08:00:00+00'),
    (NULL, '23456789-3456-7890-1234-567890123456', 'warning', 'measurement', 'Temperature exceeds normal range', '{"measured": 32.5, "expected_max": 30, "duration_minutes": 5}', 3, '2025-01-13 09:15:00+00');

-- Create views for common queries
CREATE OR REPLACE VIEW experiment_summary AS
SELECT 
    e.id,
    e.name,
    e.status,
    e.created_at,
    e.started_at,
    e.ended_at,
    u.full_name as created_by_name,
    COUNT(DISTINCT td.id) as data_points,
    MAX(td.power) as max_power,
    AVG(td.efficiency) as avg_efficiency
FROM experiments e
LEFT JOIN users u ON e.created_by = u.id
LEFT JOIN test_data td ON e.id = td.experiment_id
GROUP BY e.id, e.name, e.status, e.created_at, e.started_at, e.ended_at, u.full_name;

CREATE OR REPLACE VIEW device_status_summary AS
SELECT 
    d.id,
    d.name,
    d.type,
    d.status,
    d.last_seen,
    COUNT(DISTINCT a.id) FILTER (WHERE a.resolved_at IS NULL) as active_alerts,
    d.next_calibration_date,
    CASE 
        WHEN d.next_calibration_date < CURRENT_DATE THEN 'overdue'
        WHEN d.next_calibration_date < CURRENT_DATE + INTERVAL '30 days' THEN 'due_soon'
        ELSE 'ok'
    END as calibration_status
FROM devices d
LEFT JOIN alerts a ON d.id = a.device_id
GROUP BY d.id, d.name, d.type, d.status, d.last_seen, d.next_calibration_date;

-- Grant permissions to views
GRANT SELECT ON experiment_summary TO authenticated;
GRANT SELECT ON device_status_summary TO authenticated;