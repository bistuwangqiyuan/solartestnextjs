# 光伏测试系统 (PV Testing System)

基于 Next.js 14 (App Router)、Tailwind CSS 和 Supabase 构建的光伏组件测试系统，用于太阳能电池板的自动化测试、数据采集、分析和监控。

## 项目概述

本系统提供完整的光伏组件测试解决方案，包括：
- 实时数据采集和监控
- Modbus设备通信
- 数据分析和可视化
- 实验管理和报告生成
- 用户认证和权限管理

## 技术栈

- **前端**: Next.js 14 (App Router), Tailwind CSS, React
- **后端**: Supabase (数据库、认证、实时数据)
- **部署**: Netlify
- **通信**: Modbus TCP/RTU
- **数据可视化**: Recharts, Chart.js

## Deploying to Netlify

This site requires [Netlify Next Runtime v5](https://docs.netlify.com/frameworks/next-js/overview/) for full functionality. That version is now being gradually rolled out to all Netlify accounts.

After deploying via the button below, please visit the **Site Overview** page for your new site to check whether it is already using the v5 runtime. If not, you'll be prompted to opt-in to to v5.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify-templates/next-platform-starter)

## Developing Locally

1. Clone this repository, then run `npm install` in its root directory.

2. For the starter to have full functionality locally (e.g. edge functions, blob store), please ensure you have an up-to-date version of Netlify CLI. Run:

```
npm install netlify-cli@latest -g
```

3. Link your local repository to the deployed Netlify site. This will ensure you're using the same runtime version for both local development and your deployed site.

```
netlify link
```

4. Then, run the Next.js development server via Netlify CLI:

```
netlify dev
```

If your browser doesn't navigate to the site automatically, visit [localhost:8888](http://localhost:8888).

## 项目结构

```
/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   ├── login/             # 登录页面
│   ├── dashboard/         # 仪表板
│   ├── data/              # 数据管理
│   ├── experiment/        # 实验管理
│   ├── monitor/           # 实时监控
│   ├── analysis/          # 数据分析
│   └── settings/          # 系统设置
├── components/            # React 组件
│   ├── layout/           # 布局组件
│   └── ui/               # UI 组件
├── lib/                   # 工具库
│   ├── auth.ts           # 认证功能
│   ├── store/            # 状态管理
│   └── utils.ts          # 工具函数
├── types/                 # TypeScript 类型定义
├── styles/                # 样式文件
├── tests/                 # 测试文件
└── docs/                  # 项目文档

```

## TASK 任务跟踪

### 待办任务
- [x] 部署到Netlify - 2025-01-13

### 已完成任务
- [x] 创建项目PRD文档 - 2025-01-13
- [x] 更新README文档 - 2025-01-13
- [x] 创建Supabase数据库结构设计 - 2025-01-13
- [x] 实现用户认证系统（登录/注册/权限管理） - 2025-01-13
- [x] 开发仪表板页面（实时数据展示） - 2025-01-13
- [x] 实现数据管理功能（CRUD操作） - 2025-01-13
- [x] 开发实验管理模块 - 2025-01-13
- [x] 实现Modbus通信功能（API接口） - 2025-01-13
- [x] 开发实时监控页面 - 2025-01-13
- [x] 实现数据分析和可视化功能 - 2025-01-13
- [x] 开发系统设置页面 - 2025-01-13
- [x] 编写单元测试 - 2025-01-13
- [x] 部署到Netlify并完成功能测试 - 2025-01-13
- [x] 去掉用户权限管理，开放公共访问 - 2025-01-13

### 开发中发现的任务
- [ ] 配置Supabase环境变量和初始化数据库
- [ ] 实现真实的Modbus通信后端服务（需要Node.js后端或Edge Function）
- [ ] 添加数据导入Excel文件功能
- [ ] 实现报告PDF生成功能
- [ ] 添加多语言支持（i18n）
- [ ] 实现邮件通知功能
- [ ] 添加数据备份和恢复功能
- [ ] 优化移动端响应式设计
- [ ] 添加更多图表类型和分析功能
- [ ] 实现用户操作日志记录
- [x] 修改analysis页面I-V/P-V特性曲线，将功率数据改为电压数据，电压值保持在20V左右 - 2025-01-13

## 开发规范

### 代码规范
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 和 Prettier 代码规范
- 使用 ES6+ 语法
- 组件使用 PascalCase 命名
- 函数和变量使用 camelCase 命名

### 目录规范
- 页面组件放在 `app/` 目录
- 可复用组件放在 `components/` 目录
- 工具函数放在 `lib/` 目录
- 类型定义放在 `types/` 目录
- 测试文件放在 `tests/` 目录，镜像源码结构

### Git 提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

## 环境变量

创建 `.env.local` 文件并配置以下环境变量：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Modbus 配置
MODBUS_HOST=192.168.1.100
MODBUS_PORT=502
```

## 许可证

MIT License
## 最终状态

全部完成