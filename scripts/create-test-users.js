/**
 * 创建测试用户的脚本
 * 需要在Supabase Dashboard中运行或使用Supabase CLI
 * 
 * 注意：这个脚本需要SERVICE_ROLE_KEY权限
 */

const { createClient } = require('@supabase/supabase-js');

// 请替换为你的Supabase URL和SERVICE_ROLE_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testUsers = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'admin@test.com',
    password: 'Test123456',
    user_metadata: {
      full_name: '测试管理员',
      role: 'admin'
    }
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'operator@test.com',
    password: 'Test123456',
    user_metadata: {
      full_name: '测试操作员',
      role: 'operator'
    }
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'observer@test.com',
    password: 'Test123456',
    user_metadata: {
      full_name: '测试观察员',
      role: 'observer'
    }
  }
];

async function createTestUsers() {
  console.log('开始创建测试用户...');

  for (const user of testUsers) {
    try {
      // 创建用户
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: user.user_metadata
      });

      if (error) {
        console.error(`创建用户 ${user.email} 失败:`, error.message);
      } else {
        console.log(`成功创建用户: ${user.email}`);
        
        // 更新用户ID（如果需要特定ID）
        // 注意：这可能需要直接操作数据库
        if (data.user && user.id) {
          const { error: updateError } = await supabase
            .from('auth.users')
            .update({ id: user.id })
            .eq('email', user.email);
          
          if (updateError) {
            console.error(`更新用户ID失败:`, updateError.message);
          }
        }
      }
    } catch (error) {
      console.error(`处理用户 ${user.email} 时出错:`, error);
    }
  }

  console.log('测试用户创建完成！');
}

// 运行脚本
createTestUsers().catch(console.error);