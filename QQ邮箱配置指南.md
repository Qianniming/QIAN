# 📧 QQ邮箱SMTP配置详细指南

## 🎯 为什么选择QQ邮箱？
- ✅ 国内访问稳定，无需翻墙
- ✅ 免费SMTP服务
- ✅ 发送速度快
- ✅ 配置简单

## 📋 第一步：开启QQ邮箱SMTP服务

### 1.1 登录QQ邮箱
访问：https://mail.qq.com
使用你的QQ号码和密码登录

### 1.2 进入设置
1. 点击页面右上角的"设置"按钮
2. 选择"账户"选项卡

### 1.3 开启SMTP服务
1. 找到"POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务"部分
2. 点击"SMTP服务"后面的"开启"按钮
3. 系统会要求验证身份：
   - 输入QQ密码
   - 通过手机短信验证

### 1.4 获取授权码
验证成功后，系统会显示一个**16位授权码**，格式类似：
```
abcdefghijklmnop
```
**⚠️ 重要：请立即复制并保存这个授权码！这就是你的SMTP密码**

## 🔧 第二步：QQ邮箱SMTP配置参数

```
SMTP服务器地址：smtp.qq.com
SMTP端口：587（推荐使用TLS）
加密方式：TLS/STARTTLS
用户名：你的完整QQ邮箱地址（如：123456789@qq.com）
密码：刚才获取的16位授权码（不是QQ密码！）
```

## 📝 第三步：配置示例

假设你的QQ邮箱是 `1234567890@qq.com`，授权码是 `abcdefghijklmnop`：

### 本地环境配置（.env.local）
```
SMTP_HOST=smtp.qq.com
SMTP_PORT=587
SMTP_USER=1234567890@qq.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM=1234567890@qq.com
SMTP_TO=admin@well-li.com
```

### Vercel环境配置
在Vercel项目设置中添加：
```
SMTP_HOST = smtp.qq.com
SMTP_PORT = 587
SMTP_USER = 1234567890@qq.com
SMTP_PASS = abcdefghijklmnop
SMTP_FROM = 1234567890@qq.com
SMTP_TO = admin@well-li.com
```

## ❓ 常见问题解决

### Q1: 提示"请先开启SMTP服务"
**解决**：按照上述步骤重新开启SMTP服务，确保看到"已开启"状态

### Q2: 提示"用户名或密码错误"
**解决**：
- 确认用户名是完整邮箱地址（包含@qq.com）
- 确认密码是16位授权码，不是QQ登录密码
- 重新生成授权码

### Q3: 提示"连接超时"
**解决**：
- 确认端口是587
- 检查网络连接
- 尝试使用465端口（SSL）

### Q4: 邮件发送失败
**解决**：
- 检查收件人邮箱地址是否正确
- 确认QQ邮箱没有被限制发送
- 查看QQ邮箱的发件箱是否有记录

## 🧪 第四步：测试邮件功能

完成配置后，你可以：
1. 在网站联系页面填写测试表单
2. 检查指定的接收邮箱是否收到邮件
3. 检查QQ邮箱发件箱是否有发送记录

## 📞 需要帮助？

如果配置过程中遇到问题：
1. 截图错误信息
2. 确认按步骤正确操作
3. 在聊天中告诉我具体错误，我会帮你解决

## ✅ 配置完成检查清单

- [ ] QQ邮箱SMTP服务已开启
- [ ] 16位授权码已获取并保存
- [ ] .env.local 文件已更新
- [ ] 邮箱地址和授权码已填入配置
- [ ] 准备好用于Vercel部署

---

**🎉 QQ邮箱配置比Gmail更简单，无需翻墙，非常适合国内项目使用！**