# Netlify 部署指南

你的 Next.js 项目已经准备好部署到 Netlify。请按照以下步骤操作：

## 方法一：通过 Netlify CLI 部署（推荐）

1. **在本地安装 Netlify CLI**
   ```bash
   npm install -g netlify-cli@latest
   ```

2. **登录 Netlify**
   ```bash
   netlify login
   ```
   这将打开浏览器让你登录 Netlify 账户。

3. **部署项目**
   ```bash
   # 在项目根目录下执行
   netlify deploy --prod
   ```
   
   首次部署时，CLI 会询问你：
   - 是否创建新站点或链接到现有站点
   - 选择团队（如果你有多个团队）
   - 设置站点名称

## 方法二：通过 GitHub 部署

1. **将代码推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

2. **在 Netlify 上导入项目**
   - 访问 https://app.netlify.com
   - 点击 "Add new site" → "Import an existing project"
   - 选择 GitHub 并授权
   - 选择你的仓库
   - 构建设置会自动检测（构建命令：`npm run build`，发布目录：`.next`）
   - 点击 "Deploy site"

## 方法三：拖拽部署（快速测试）

1. **构建项目**（已完成）
   ```bash
   npm run build
   ```

2. **访问 Netlify Drop**
   - 访问 https://app.netlify.com/drop
   - 将 `.next` 文件夹拖拽到页面上
   - 等待上传完成

## 环境变量配置

如果你的项目需要环境变量，请在 Netlify 控制台中设置：
1. 进入站点设置
2. 选择 "Environment variables"
3. 添加所需的环境变量

## 自定义域名

部署成功后，你可以：
1. 在站点设置中添加自定义域名
2. 配置 DNS 记录
3. 启用 HTTPS（Netlify 自动提供免费 SSL 证书）

## 注意事项

- 这个项目使用了 Netlify Edge Functions，需要 Netlify Next Runtime v5
- 部署后，检查站点概览页面确认是否使用 v5 运行时
- 如果不是 v5，页面会提示你升级

## 项目特性

你的项目包含以下 Netlify 功能：
- Edge Functions（边缘函数）
- Image CDN（图片优化）
- Blob Store（数据存储）
- 服务端渲染和静态生成

部署成功后，所有这些功能都会自动工作！