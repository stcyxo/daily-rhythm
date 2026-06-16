# Daily Rhythm - 部署指南

## 方式一：Vercel CLI 部署（推荐）

### 步骤 1：安装 Vercel CLI
打开终端运行：
\`\`\`bash
npm install -g vercel
\`\`\`

### 步骤 2：登录 Vercel
\`\`\`bash
vercel login
\`\`\`
按提示输入你的邮箱，完成邮箱验证。

### 步骤 3：部署项目
\`\`\`bash
cd daily-rhythm
vercel --yes
\`\`\`

### 步骤 4：访问你的应用
部署成功后会显示一个 `.vercel.app` 链接，例如：
- https://daily-rhythm-xxxx.vercel.app

### 步骤 5：设置为正式环境
\`\`\`bash
vercel --prod
\`\`\`

---

## 方式二：GitHub + Vercel Web（无需安装 CLI）

### 步骤 1：创建 GitHub 仓库
1. 访问 https://github.com
2. 点击右上角 "+" → "New repository"
3. 仓库名称：`daily-rhythm`
4. 选择 "Private" 或 "Public"
5. 点击 "Create repository"

### 步骤 2：推送代码到 GitHub
在终端运行：
\`\`\`bash
cd daily-rhythm

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Daily Rhythm app"

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/daily-rhythm.git

# 推送
git branch -M main
git push -u origin main
\`\`\`

### 步骤 3：连接到 Vercel
1. 访问 https://vercel.com
2. 点击 "Log in" 用 GitHub 账号登录
3. 点击 "Import Project"
4. 选择你刚创建的仓库
5. 点击 "Deploy"
6. 等待部署完成（约 30 秒）

### 步骤 4：获得永久链接
部署成功后会获得一个 `.vercel.app` 链接！

---

## 部署后的使用

### 手机访问
在任何设备的浏览器中打开你的 Vercel 链接即可使用。

### 固定到手机桌面（iOS）
1. 在 Safari 中打开链接
2. 点击分享按钮（方框+箭头）
3. 选择"添加到主屏幕"
4. 点击"添加"

### 固定到手机桌面（Android）
1. 在 Chrome 中打开链接
2. 点击右上角菜单（三个点）
3. 选择"添加到主屏幕"或"安装应用"

---

## 数据同步

部署到 Vercel 后，应用会使用浏览器的 LocalStorage 存储数据。
- 不同设备的数据**不自动同步**
- 同一设备不同浏览器的数据**不共享**

如果需要多设备同步数据，可以考虑：
1. 使用浏览器同步功能（如 Chrome 登录 Google 账号）
2. 或者未来可以接入云端数据库

---

## 故障排除

### 部署失败
- 检查 GitHub 仓库是否公开
- 检查 Vercel 权限是否正确

### 链接打不开
- 等待 1-2 分钟让 Vercel 完成部署
- 检查是否设置了正式环境

### 需要更新代码
1. 修改代码后重新部署
2. 或使用 `vercel --prod` 更新正式版本

---

## 下一步

部署完成后，你就可以：
- ✅ 在任何设备上访问你的自律助手
- ✅ 将应用添加到手机桌面
- ✅ 接收浏览器通知提醒
- ✅ 追踪每日/每周任务完成情况

祝你使用愉快！💪
