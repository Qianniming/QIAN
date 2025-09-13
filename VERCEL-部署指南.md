# 🚀 NANUK项目Vercel部署完整指南

## 📋 部署前准备清单

### ✅ 必需完成的项目
- [ ] MongoDB Atlas云数据库配置完成
- [ ] GitHub仓库已创建并推送代码
- [ ] Gmail邮箱应用密码已获取
- [ ] Vercel账户已注册
- [ ] 环境变量已准备

---

## 🗄️ 第一步：配置MongoDB Atlas数据库

### 1.1 创建MongoDB Atlas账户
1. 访问 [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. 注册免费账户
3. 验证邮箱

### 1.2 创建数据库集群
1. 创建新项目：`nanuk-website`
2. 选择免费层：**M0 Sandbox**
3. 选择区域：**AWS Singapore (ap-southeast-1)**
4. 集群名称：`nanuk-cluster`

### 1.3 配置数据库用户
```
用户名：nanuk_user
密码：点击自动生成（记录下来！）
权限：Read and write to any database
```

### 1.4 配置网络访问
```
选择：Allow access from anywhere (0.0.0.0/0)
（用于Vercel部署，生产环境建议配置具体IP）
```

### 1.5 获取连接字符串
```
格式：mongodb+srv://nanuk_user:密码@nanuk-cluster.xxxxx.mongodb.net/wellicases?retryWrites=true&w=majority
```

---

## 📧 第二步：配置Gmail邮件服务

### 2.1 开启两步验证
1. 登录Gmail账户
2. 进入账户设置 → 安全
3. 开启两步验证

### 2.2 生成应用密码
1. 在安全设置中找到"应用密码"
2. 选择应用：邮件
3. 选择设备：其他 (输入"NANUK Website")
4. 生成16位应用密码（记录下来！）

---

## 💾 第三步：准备GitHub仓库

### 3.1 初始化Git仓库
```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit: NANUK project setup"
```

### 3.2 创建GitHub仓库
1. 登录GitHub
2. 创建新仓库：`nanuk-website`
3. 设置为私有仓库（推荐）

### 3.3 推送代码
```bash
git remote add origin https://github.com/你的用户名/nanuk-website.git
git branch -M main
git push -u origin main
```

---

## 🌐 第四步：Vercel部署配置

### 4.1 注册Vercel账户
1. 访问 [https://vercel.com](https://vercel.com)
2. 使用GitHub账户登录

### 4.2 导入项目
1. 点击 "New Project"
2. 选择你的GitHub仓库：`nanuk-website`
3. Vercel会自动检测为Next.js项目

### 4.3 配置项目设置
```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

---

## 🔐 第五步：配置环境变量

在Vercel项目设置中添加以下环境变量：

### 数据库配置
```
MONGODB_URI=mongodb+srv://nanuk_user:你的密码@nanuk-cluster.xxxxx.mongodb.net/wellicases?retryWrites=true&w=majority
```

### 邮件配置
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=你的Gmail应用密码
SMTP_FROM=your-email@gmail.com
SMTP_TO=admin@well-li.com
```

### 安全配置
```
NEXTAUTH_SECRET=随机32位字符串（可用在线生成器）
NEXTAUTH_URL=https://你的项目名.vercel.app
```

### 网站配置
```
NEXT_PUBLIC_SITE_URL=https://你的项目名.vercel.app
NEXT_PUBLIC_COMPANY_NAME=WELL-LI Plastic Products Co., Ltd.
NEXT_PUBLIC_COMPANY_EMAIL=contact@well-li.com
NEXT_PUBLIC_COMPANY_PHONE=+86-xxx-xxxx-xxxx
NEXT_PUBLIC_COMPANY_ADDRESS=公司地址
```

---

## 🚀 第六步：执行部署

### 6.1 点击部署
1. 确认所有配置正确
2. 点击 "Deploy" 按钮
3. 等待构建完成（通常2-5分钟）

### 6.2 获取部署URL
部署成功后，你会获得：
```
https://你的项目名.vercel.app
```

---

## 🧪 第七步：部署后验证

### 7.1 功能测试清单
- [ ] 首页正常加载
- [ ] 产品页面显示产品列表
- [ ] 产品详情页正常显示
- [ ] 联系表单能够提交
- [ ] 关于我们页面正常
- [ ] 质量保证页面正常
- [ ] 多语言切换功能
- [ ] 移动端响应式正常

### 7.2 数据库验证
1. 访问 `/api/health` 接口
2. 检查返回状态是否为 `{"status": "ok"}`
3. 查看产品页面是否显示产品数据

### 7.3 邮件功能验证
1. 填写联系表单
2. 提交后检查邮箱是否收到邮件
3. 确认表单提示消息正确

---

## 🛠️ 常见问题解决

### 问题1：构建失败
```
Error: Module not found
```
**解决方案：**
- 检查依赖是否正确安装
- 确认所有import路径正确
- 运行 `npm run build` 本地测试

### 问题2：数据库连接失败
```
Error: MongooseError: Operation `products.find()` buffering timed out
```
**解决方案：**
- 检查MONGODB_URI环境变量
- 确认MongoDB Atlas网络访问配置
- 验证用户名密码正确

### 问题3：邮件发送失败
```
Error: Invalid login
```
**解决方案：**
- 确认Gmail应用密码正确
- 检查两步验证已开启
- 验证SMTP配置

### 问题4：环境变量不生效
**解决方案：**
- 确认在Vercel控制台中正确设置
- 重新部署项目
- 检查变量名称拼写

---

## 🔄 更新部署流程

### 代码更新
```bash
git add .
git commit -m "更新说明"
git push origin main
```

Vercel会自动检测GitHub推送并重新部署。

### 环境变量更新
1. 在Vercel控制台修改环境变量
2. 重新部署项目

---

## 📊 部署成功指标

### 性能指标目标
- **加载时间：** < 3秒
- **Lighthouse评分：** > 95
- **可用性：** 99.9%

### 监控工具
- Vercel Analytics（自动启用）
- Google Search Console（需要验证）
- Google Analytics（可选）

---

## 🎯 部署完成后的下一步

### 1. 域名配置（可选）
1. 购买自定义域名
2. 在Vercel中添加域名
3. 配置DNS记录

### 2. SEO优化
1. 提交站点地图到Google Search Console
2. 配置robots.txt
3. 优化页面标题和描述

### 3. 监控和维护
1. 设置Vercel通知
2. 定期检查网站状态
3. 更新依赖和安全补丁

---

## 📞 获得帮助

如果遇到问题：
1. 查看Vercel部署日志
2. 检查本指南的常见问题
3. 访问Vercel官方文档
4. 在聊天中描述具体错误，我会帮助解决

---

**🎉 祝贺！完成以上步骤后，你的NANUK网站就成功部署到云端了！**