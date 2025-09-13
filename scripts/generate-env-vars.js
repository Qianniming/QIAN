// 🔐 环境变量生成助手
// 运行此脚本生成随机的安全密钥

const crypto = require('crypto');

console.log('🔐 NANUK项目环境变量生成助手\n');

// 生成NEXTAUTH_SECRET
const nextAuthSecret = crypto.randomBytes(32).toString('hex');
console.log('📋 复制以下环境变量到Vercel：\n');

console.log('🔑 安全配置：');
console.log(`NEXTAUTH_SECRET=${nextAuthSecret}`);
console.log('NEXTAUTH_URL=https://你的项目名.vercel.app');

console.log('\n🗄️ 数据库配置：');
console.log('MONGODB_URI=mongodb+srv://nanuk_user:你的密码@nanuk-cluster.xxxxx.mongodb.net/wellicases?retryWrites=true&w=majority');

console.log('\n📧 邮件配置：');
console.log('SMTP_HOST=smtp.gmail.com');
console.log('SMTP_PORT=587');
console.log('SMTP_USER=your-email@gmail.com');
console.log('SMTP_PASS=你的Gmail应用密码');
console.log('SMTP_FROM=your-email@gmail.com');
console.log('SMTP_TO=admin@well-li.com');

console.log('\n🌐 网站配置：');
console.log('NEXT_PUBLIC_SITE_URL=https://你的项目名.vercel.app');
console.log('NEXT_PUBLIC_COMPANY_NAME=WELL-LI Plastic Products Co., Ltd.');
console.log('NEXT_PUBLIC_COMPANY_EMAIL=contact@well-li.com');
console.log('NEXT_PUBLIC_COMPANY_PHONE=+86-xxx-xxxx-xxxx');
console.log('NEXT_PUBLIC_COMPANY_ADDRESS=公司地址');

console.log('\n✅ 请将上述配置复制到：');
console.log('   1. Vercel项目设置 → Environment Variables');
console.log('   2. 本地 .env.local 文件（用于开发测试）');

console.log('\n⚠️ 重要提醒：');
console.log('   • 替换所有占位符为实际值');
console.log('   • 不要将敏感信息提交到Git');
console.log('   • NEXTAUTH_SECRET已自动生成，直接使用');
console.log('   • MongoDB密码和Gmail应用密码需要你手动填入');