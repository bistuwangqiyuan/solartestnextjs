# 设置测试账号

本文档说明如何在Supabase中创建和配置测试账号。

## 测试账号列表

| 角色 | 邮箱 | 密码 | 权限 |
|------|------|------|------|
| 管理员 | admin@test.com | Test123456 | 完全访问权限 |
| 操作员 | operator@test.com | Test123456 | 创建和管理实验 |
| 观察员 | observer@test.com | Test123456 | 仅查看数据 |

## 设置步骤

### 方法一：使用Supabase Dashboard（推荐）

1. 登录到你的Supabase项目Dashboard
2. 导航到 **Authentication** > **Users** 页面
3. 点击 **Add user** > **Create new user**
4. 为每个测试账号创建用户：
   - Email: 输入测试邮箱
   - Password: Test123456
   - 勾选 **Auto Confirm User**
5. 创建用户后，导航到 **SQL Editor**
6. 运行 `/supabase/create-test-users.sql` 中的SQL脚本来设置用户角色和配置

### 方法二：使用脚本（需要Service Role Key）

1. 设置环境变量：
   ```bash
   export NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. 安装依赖：
   ```bash
   npm install @supabase/supabase-js
   ```

3. 运行创建脚本：
   ```bash
   node scripts/create-test-users.js
   ```

### 方法三：使用Supabase CLI

1. 安装Supabase CLI：
   ```bash
   npm install -g supabase
   ```

2. 登录并链接项目：
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   ```

3. 运行seed脚本：
   ```bash
   supabase db push
   supabase db seed
   ```

## 验证测试账号

1. 访问登录页面
2. 使用测试账号登录
3. 验证不同角色的权限：
   - **管理员**：可以访问所有页面，包括用户管理和系统设置
   - **操作员**：可以创建实验、查看数据，但不能访问用户管理
   - **观察员**：只能查看数据和报告，不能创建或修改内容

## 注意事项

1. 测试账号仅用于开发和演示目的
2. 在生产环境中应该删除或禁用这些账号
3. 定期更新测试账号的密码
4. 不要在测试账号中存储敏感数据

## 故障排除

### 登录失败
- 确认用户已在Supabase Auth中创建
- 检查用户的邮箱是否已确认（email_confirmed = true）
- 确认用户在public.users表中有对应记录

### 权限问题
- 检查用户的role字段是否正确设置
- 确认RLS策略已正确配置
- 检查用户的is_active字段是否为true

### 数据库同步问题
- 运行 `supabase db reset` 重置数据库
- 重新运行migration和seed脚本
- 检查Supabase日志中的错误信息