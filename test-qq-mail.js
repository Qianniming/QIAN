// QQ邮箱SMTP连接测试脚本
require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testQQMail() {
    console.log('📧 QQ邮箱SMTP连接测试...\n');
    
    // 从环境变量读取配置
    const config = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_TO
    };
    
    console.log('📋 当前配置:');
    console.log(`SMTP服务器: ${config.host}`);
    console.log(`端口: ${config.port}`);
    console.log(`发件人: ${config.user}`);
    console.log(`收件人: ${config.to}`);
    console.log(`授权码长度: ${config.pass?.length || 0} 位\n`);
    
    // 检查配置是否完整
    if (!config.host || !config.user || !config.pass) {
        console.log('❌ 配置不完整，请检查 .env.local 文件');
        console.log('需要配置: SMTP_HOST, SMTP_USER, SMTP_PASS');
        return;
    }
    
    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: false, // 587端口使用STARTTLS
        auth: {
            user: config.user,
            pass: config.pass
        },
        tls: {
            rejectUnauthorized: false // 允许自签名证书
        }
    });
    
    try {
        // 测试连接
        console.log('🔗 测试SMTP连接...');
        await transporter.verify();
        console.log('✅ SMTP连接成功！\n');
        
        // 发送测试邮件
        console.log('📮 发送测试邮件...');
        const mailOptions = {
            from: `"NANUK网站" <${config.from}>`,
            to: config.to, // 现在发送给同一个QQ邮箱
            subject: '🧪 NANUK网站QQ邮箱测试邮件（自发自收）',
            html: `
                <h2>🎉 QQ邮箱配置成功！</h2>
                <p>这是一封来自NANUK网站的测试邮件。</p>
                <p><strong>📧 测试模式：</strong>自发自收（同一个QQ邮箱）</p>
                <ul>
                    <li><strong>发送时间：</strong>${new Date().toLocaleString('zh-CN')}</li>
                    <li><strong>SMTP服务器：</strong>${config.host}</li>
                    <li><strong>发件邮箱：</strong>${config.user}</li>
                    <li><strong>收件邮箱：</strong>${config.to}</li>
                </ul>
                <p>如果你收到这封邮件，说明QQ邮箱SMTP配置完全正确！</p>
                <p><strong>⚠️ 注意：</strong>自发自收的邮件可能会被QQ邮箱归类到垃圾邮件或自己发给自己的文件夹。</p>
                <hr>
                <p><small>此邮件由NANUK网站自动发送</small></p>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ 测试邮件发送成功！');
        console.log(`📧 邮件ID: ${result.messageId}`);
        console.log(`📬 请检查 ${config.to} 邮箱是否收到测试邮件\n`);
        
        console.log('🎉 QQ邮箱配置完全正确！');
        console.log('💡 现在可以进行Vercel部署了');
        
    } catch (error) {
        console.log('❌ 邮件测试失败:');
        console.error(error.message);
        
        console.log('\n🛠️ 常见问题排查:');
        console.log('1. 确认QQ邮箱SMTP服务已开启');
        console.log('2. 确认授权码正确（16位字符）');
        console.log('3. 确认用户名是完整邮箱地址');
        console.log('4. 重新生成QQ邮箱授权码');
    }
}

// 执行测试
testQQMail();