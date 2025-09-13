// 新邮件配置测试脚本（163邮箱发送 → QQ邮箱接收）
require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testNewMailConfig() {
    console.log('📧 测试新邮件配置...\n');
    
    // 从环境变量读取配置
    const config = {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_TO
    };
    
    console.log('📋 当前邮件配置:');
    console.log(`📤 发送邮箱: ${config.from} (网易163邮箱)`);
    console.log(`📥 接收邮箱: ${config.to} (QQ邮箱)`);
    console.log(`🔐 SMTP服务器: ${config.host}:${config.port}`);
    console.log(`🔑 授权码: ${config.pass ? '✅ 已配置' : '❌ 未配置'}\n`);
    
    if (!config.host || !config.user || !config.pass || !config.to) {
        console.log('❌ 配置不完整，请检查 .env.local 文件');
        return;
    }
    
    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: true, // 163邮箱使用465端口的SSL
        auth: {
            user: config.user,
            pass: config.pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    
    try {
        console.log('🔗 测试SMTP连接...');
        await transporter.verify();
        console.log('✅ SMTP连接成功！\n');
        
        console.log('📮 发送测试邮件...');
        const mailOptions = {
            from: `"NANUK网站" <${config.from}>`,
            to: config.to,
            subject: '📧 NANUK网站新邮件配置测试成功！',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">🎉 新邮件配置测试成功！</h2>
                    
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #1f2937; margin-top: 0;">📧 邮件配置信息</h3>
                        <ul style="color: #374151;">
                            <li><strong>发送时间：</strong>${new Date().toLocaleString('zh-CN')}</li>
                            <li><strong>发送邮箱：</strong>${config.from} (网易163邮箱)</li>
                            <li><strong>接收邮箱：</strong>${config.to} (QQ邮箱)</li>
                            <li><strong>SMTP服务器：</strong>${config.host}:${config.port}</li>
                            <li><strong>配置模式：</strong>163发送 → QQ接收</li>
                        </ul>
                    </div>
                    
                    <div style="background: #ecfccb; border-left: 4px solid #65a30d; padding: 15px; margin: 20px 0;">
                        <h4 style="color: #365314; margin-top: 0;">✅ 配置状态</h4>
                        <p style="color: #4d7c0f;">新的邮件配置工作正常！网站联系表单将从163邮箱发送到QQ邮箱。</p>
                    </div>
                    
                    <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
                        <h4 style="color: #1e40af; margin-top: 0;">📝 配置详情</h4>
                        <ul style="color: #1d4ed8;">
                            <li><strong>发送方：</strong>18756283766@163.com (网易163邮箱SMTP)</li>
                            <li><strong>接收方：</strong>766282480@qq.com (QQ邮箱)</li>
                            <li><strong>优势：</strong>避免自发自收，邮件更不容易被误判为垃圾邮件</li>
                            <li><strong>使用场景：</strong>客户联系表单、询价邮件等</li>
                        </ul>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    
                    <p style="color: #6b7280; font-size: 14px; text-align: center;">
                        此邮件由NANUK网站自动生成<br>
                        测试时间：${new Date().toISOString()}
                    </p>
                </div>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('🎉 测试邮件发送成功！');
        console.log(`📧 邮件ID: ${result.messageId}`);
        console.log(`📬 请检查 ${config.to} 邮箱是否收到测试邮件\n`);
        
        console.log('✅ 新邮件配置验证完成！');
        console.log('🚀 现在可以更新Vercel环境变量并重新部署了');
        console.log('💡 记住：发送方163邮箱，接收方QQ邮箱');
        
    } catch (error) {
        console.log('❌ 邮件测试失败:');
        console.error(error.message);
        
        if (error.code === 'EAUTH') {
            console.log('\n🔐 可能的问题:');
            console.log('1. 163邮箱授权码过期，需要重新生成');
            console.log('2. 163邮箱SMTP服务被暂时限制');
            console.log('3. 网络连接问题');
        }
        
        console.log('\n🛠️ 解决方案:');
        console.log('1. 重新生成163邮箱授权码');
        console.log('2. 检查网络连接');
        console.log('3. 确认163邮箱SMTP服务正常');
    }
}

// 执行测试
testNewMailConfig().catch(console.error);