-- 创建测试用户的SQL脚本
-- 在Supabase SQL编辑器中运行此脚本

-- 注意：直接创建auth.users记录需要特殊权限
-- 推荐使用Supabase Dashboard的Authentication页面手动创建用户
-- 或使用上面的JavaScript脚本

-- 创建用户后，运行以下SQL来设置用户配置文件
-- 确保先在Authentication页面创建以下用户：
-- admin@test.com (密码: Test123456)
-- operator@test.com (密码: Test123456)
-- observer@test.com (密码: Test123456)

-- 然后运行以下SQL更新用户配置文件
DO $$
DECLARE
    admin_id uuid;
    operator_id uuid;
    observer_id uuid;
BEGIN
    -- 获取用户ID
    SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@test.com';
    SELECT id INTO operator_id FROM auth.users WHERE email = 'operator@test.com';
    SELECT id INTO observer_id FROM auth.users WHERE email = 'observer@test.com';
    
    -- 插入或更新用户配置文件
    IF admin_id IS NOT NULL THEN
        INSERT INTO public.users (id, email, role, full_name, phone, department, is_active)
        VALUES (admin_id, 'admin@test.com', 'admin', '测试管理员', '13800138000', '系统管理部', true)
        ON CONFLICT (id) DO UPDATE SET
            role = 'admin',
            full_name = '测试管理员',
            phone = '13800138000',
            department = '系统管理部',
            is_active = true;
        RAISE NOTICE '管理员账号配置完成';
    ELSE
        RAISE NOTICE '未找到管理员账号，请先创建 admin@test.com';
    END IF;
    
    IF operator_id IS NOT NULL THEN
        INSERT INTO public.users (id, email, role, full_name, phone, department, is_active)
        VALUES (operator_id, 'operator@test.com', 'operator', '测试操作员', '13800138001', '测试部', true)
        ON CONFLICT (id) DO UPDATE SET
            role = 'operator',
            full_name = '测试操作员',
            phone = '13800138001',
            department = '测试部',
            is_active = true;
        RAISE NOTICE '操作员账号配置完成';
    ELSE
        RAISE NOTICE '未找到操作员账号，请先创建 operator@test.com';
    END IF;
    
    IF observer_id IS NOT NULL THEN
        INSERT INTO public.users (id, email, role, full_name, phone, department, is_active)
        VALUES (observer_id, 'observer@test.com', 'observer', '测试观察员', '13800138002', '质量部', true)
        ON CONFLICT (id) DO UPDATE SET
            role = 'observer',
            full_name = '测试观察员',
            phone = '13800138002',
            department = '质量部',
            is_active = true;
        RAISE NOTICE '观察员账号配置完成';
    ELSE
        RAISE NOTICE '未找到观察员账号，请先创建 observer@test.com';
    END IF;
END $$;