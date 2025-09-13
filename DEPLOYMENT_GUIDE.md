# 光伏测试系统部署指南

## 前置准备

### 1. Supabase 设置

1. 访问 [Supabase](https://supabase.com) 创建新项目
2. 记录以下信息：
   - Project URL
   - Anon Key
   - Service Role Key

3. 在 Supabase 项目中执行数据库初始化：
   - 进入 SQL Editor
   - 执行 `/supabase/migrations/001_initial_schema.sql` 中的所有SQL语句

### 2. 环境变量配置

1. 复制环境变量模板：
   ```bash
   cp .env.example .env.local
   ```

2. 填入实际的环境变量值：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase Anon Key
   SUPABASE_SERVICE_ROLE_KEY=你的Service Role Key
   ```

## 本地开发

1. 安装依赖：
   ```bash
   pnpm install
   ```

2. 启动开发服务器：
   ```bash
   pnpm dev
   ```

3. 访问 http://localhost:3000

## 部署到 Netlify

### 方法一：通过 Netlify CLI

1. 安装 Netlify CLI：
   ```bash
   npm install -g netlify-cli
   ```

2. 登录 Netlify：
   ```bash
   netlify login
   ```

3. 初始化项目：
   ```bash
   netlify init
   ```

4. 配置环境变量：
   ```bash
   netlify env:set NEXT_PUBLIC_SUPABASE_URL "你的值"
   netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "你的值"
   netlify env:set SUPABASE_SERVICE_ROLE_KEY "你的值"
   ```

5. 部署：
   ```bash
   # 构建项目
   pnpm build
   
   # 部署到Netlify
   netlify deploy --prod --dir=.next
   ```

### 方法二：通过 Git 集成

1. 将代码推送到 GitHub/GitLab/Bitbucket

2. 在 Netlify 控制台：
   - 点击 "New site from Git"
   - 选择你的仓库
   - 配置构建设置：
     - Build command: `pnpm build`
     - Publish directory: `.next`
   - 添加环境变量

3. 点击 "Deploy site"

### 方法三：手动部署

1. 构建项目：
   ```bash
   pnpm build
   ```

2. 访问 [Netlify Drop](https://app.netlify.com/drop)

3. 将 `.next` 文件夹拖拽到页面上

## 配置说明

### netlify.toml 配置

项目根目录的 `netlify.toml` 文件包含了 Netlify 的配置：

```toml
[build]
  command = "pnpm build"
  publish = ".next"

[build.environment]
  NEXT_TELEMETRY_DISABLED = "1"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[edge_functions]]
  path = "/api/*"
  function = "netlify/edge-functions/api"
```

### 性能优化

1. 启用缓存：
   - Next.js 自动处理静态资源缓存
   - Netlify 会自动启用 CDN

2. 图片优化：
   - 使用 Next.js Image 组件
   - Netlify 会自动优化图片

## 部署后检查

1. 访问部署的网站
2. 检查以下功能：
   - [ ] 登录功能正常
   - [ ] 数据库连接正常
   - [ ] 实时数据更新正常
   - [ ] 图表显示正常
   - [ ] API 调用正常

## 故障排除

### 常见问题

1. **环境变量未生效**
   - 确保在 Netlify 控制台正确设置了环境变量
   - 重新部署项目

2. **数据库连接失败**
   - 检查 Supabase URL 和 Key 是否正确
   - 确保 Supabase 项目正在运行

3. **构建失败**
   - 检查 Node.js 版本（需要 18.x 或更高）
   - 清除缓存后重试：`netlify build --clear`

4. **页面 404**
   - 确保 Next.js 配置正确
   - 检查路由配置

## 监控和维护

1. **性能监控**
   - 使用 Netlify Analytics
   - 配置 Web Vitals 监控

2. **错误追踪**
   - 集成 Sentry 或类似服务
   - 查看 Netlify Functions 日志

3. **定期维护**
   - 更新依赖包
   - 检查安全更新
   - 备份数据库

## 扩展功能

### 添加自定义域名

1. 在 Netlify 控制台进入 "Domain settings"
2. 添加自定义域名
3. 配置 DNS 记录

### 启用 HTTPS

Netlify 默认为所有站点提供免费的 SSL 证书。

### 配置重定向

在 `netlify.toml` 中添加重定向规则：

```toml
[[redirects]]
  from = "/old-path"
  to = "/new-path"
  status = 301
```

## 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [Netlify 文档](https://docs.netlify.com)
- [Supabase 文档](https://supabase.io/docs)
- [项目 GitHub](https://github.com/your-repo)