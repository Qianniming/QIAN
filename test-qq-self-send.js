// QQ邮箱自发自收模式测试脚本 (76682480@qq.com → 76682480@qq.com)
require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testQQSelfSend() {
    console.log('🔄 QQ邮箱自发自收模式测试...\n');
    
    // 特殊配置：发送方和接收方相同
    const selfSendConfig = {
        host: 'smtp.qq.com',
        port: 587,
        user: '76682480@qq.com',
        pass: process.env.SMTP_PASS,
        from: '76682480@qq.com',
        to: '76682480@qq.com'
    };
    
    console.log('📋 自发自收配置:');
    console.log(`📧 发送邮箱: ${selfSendConfig.from}`);
    console.log(`📬 接收邮箱: ${selfSendConfig.to}`);
    console.log(`🔐 授权码: ${selfSendConfig.pass ? '✅ 已配置' : '❌ 未配置'}`);
    console.log(`🔄 模式: 自发自收（同一QQ邮箱）\n`);
    
    if (!selfSendConfig.pass) {
        console.log('❌ 请先在 .env.local 文件中配置 SMTP_PASS');
        return;
    }
    
    // 创建专用传输器
    const transporter = nodemailer.createTransport({
        host: selfSendConfig.host,
        port: selfSendConfig.port,
        secure: false,
        auth: {
            user: selfSendConfig.user,
            pass: selfSendConfig.pass
        },
        tls: {
            rejectUnauthorized: false,
            ciphers: 'SSLv3'
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000
    });
    
    try {
        console.log('🔗 测试SMTP连接...');
        await transporter.verify();
        console.log('✅ SMTP连接成功！\n');
        
        console.log('📮 发送自发自收测试邮件...');
        const mailOptions = {
            from: `"NANUK网站测试" <${selfSendConfig.from}>`,
            to: selfSendConfig.to,
            subject: '🔄 NANUK网站自发自收测试成功！',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">🎉 QQ邮箱自发自收测试成功！</h2>
                    
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #1f2937; margin-top: 0;">📧 邮件配置信息</h3>
                        <ul style="color: #374151;">
                            <li><strong>发送时间：</strong>${new Date().toLocaleString('zh-CN')}</li>
                            <li><strong>发送邮箱：</strong>${selfSendConfig.from}</li>
                            <li><strong>接收邮箱：</strong>${selfSendConfig.to}</li>
                            <li><strong>SMTP服务器：</strong>${selfSendConfig.host}:${selfSendConfig.port}</li>
                            <li><strong>测试模式：</strong>自发自收</li>
                        </ul>
                    </div>
                    
                    <div style="background: #ecfccb; border-left: 4px solid #65a30d; padding: 15px; margin: 20px 0;">
                        <h4 style="color: #365314; margin-top: 0;">✅ 配置状态</h4>
                        <p style="color: #4d7c0f;">您的QQ邮箱SMTP配置完全正确！现在网站的联系表单将能够正常发送邮件。</p>
                    </div>
                    
                    <div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 15px; margin: 20px 0;">
                        <h4 style="color: #92400e; margin-top: 0;">💡 注意事项</h4>
                        <ul style="color: #a16207;">
                            <li>自发自收的邮件可能被QQ邮箱归类到"我发给我"文件夹</li>
                            <li>建议检查垃圾邮件箱</li>
                            <li>线上环境的邮件功能将更加稳定</li>
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
        console.log('🎉 自发自收测试邮件发送成功！');
        console.log(`📧 邮件ID: ${result.messageId}`);
        console.log(`📬 请检查 ${selfSendConfig.to} 的收件箱（可能在"我发给我"文件夹）\n`);
        
        console.log('✅ QQ邮箱自发自收配置验证完成！');
        console.log('🚀 现在可以更新Vercel环境变量并部署了');
        console.log(`💡 记住在Vercel中设置 SMTP_TO=${selfSendConfig.to}`);
        
    } catch (error) {
        console.log('❌ 自发自收测试失败:');
        console.error(error.message);
        
        if (error.code === 'EAUTH') {
            console.log('\n🔐 授权问题排查:');
            console.log('1. 重新生成QQ邮箱授权码');
            console.log('2. 确认SMTP服务已开启');
            console.log('3. 等待5-10分钟后重试');
        }
        
        console.log('\n🛠️ 其他解决方案:');
        console.log('1. 检查网络连接');
        console.log('2. 暂时禁用防火墙/杀毒软件');
        console.log('3. 在Vercel线上环境测试（可能本地网络限制）');
    }
}

// 执行自发自收测试
testQQSelfSend().catch(console.error);