// 网易163邮箱SMTP连接测试脚本 (18756283766@163.com)
require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function test163Mail() {
    console.log('📧 网易163邮箱SMTP连接测试...\n');
    
    // 163邮箱自发自收配置
    const config = {
        host: 'smtp.163.com',
        port: 465,
        user: '18756283766@163.com',
        pass: process.env.SMTP_PASS,
        from: '18756283766@163.com',
        to: '18756283766@163.com'
    };
    
    console.log('📋 163邮箱自发自收配置:');
    console.log(`📧 发送邮箱: ${config.from}`);
    console.log(`📬 接收邮箱: ${config.to}`);
    console.log(`🔐 授权码: ${config.pass ? '✅ 已配置' : '❌ 未配置'}`);
    console.log(`🏢 SMTP服务器: ${config.host}:${config.port}`);
    console.log(`🔄 模式: 自发自收（同一网易163邮箱）\n`);
    
    if (!config.pass || config.pass === '请输入163邮箱授权码') {
        console.log('❌ 请先配置163邮箱授权码:');
        console.log('1. 登录 https://mail.163.com');
        console.log('2. 设置 → POP3/SMTP/IMAP → 开启SMTP服务');
        console.log('3. 获取客户端授权密码（16位授权码）');
        console.log('4. 在 .env.local 文件中设置 SMTP_PASS=你的授权码');
        return;
    }
    
    // 创建163邮箱传输器
    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: true, // 465端口使用SSL
        auth: {
            user: config.user,
            pass: config.pass
        },
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000
    });
    
    try {
        console.log('🔗 测试163邮箱SMTP连接...');
        await transporter.verify();
        console.log('✅ 163邮箱SMTP连接成功！\n');
        
        console.log('📮 发送163邮箱自发自收测试邮件...');
        const mailOptions = {
            from: `"NANUK网站" <${config.from}>`,
            to: config.to,
            subject: '🎉 网易163邮箱自发自收测试成功！',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #d97706;">🎉 网易163邮箱配置成功！</h2>
                    
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #1f2937; margin-top: 0;">📧 邮件配置信息</h3>
                        <ul style="color: #374151;">
                            <li><strong>发送时间：</strong>${new Date().toLocaleString('zh-CN')}</li>
                            <li><strong>发送邮箱：</strong>${config.from}</li>
                            <li><strong>接收邮箱：</strong>${config.to}</li>
                            <li><strong>SMTP服务器：</strong>${config.host}:${config.port}</li>
                            <li><strong>测试模式：</strong>自发自收</li>
                            <li><strong>邮箱类型：</strong>网易163邮箱</li>
                        </ul>
                    </div>
                    
                    <div style="background: #ecfccb; border-left: 4px solid #65a30d; padding: 15px; margin: 20px 0;">
                        <h4 style="color: #365314; margin-top: 0;">✅ 配置状态</h4>
                        <p style="color: #4d7c0f;">您的网易163邮箱SMTP配置完全正确！现在网站的联系表单将能够正常发送邮件。</p>
                    </div>
                    
                    <div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 15px; margin: 20px 0;">
                        <h4 style="color: #92400e; margin-top: 0;">📋 163邮箱特点</h4>
                        <ul style="color: #a16207;">
                            <li>国内访问速度快，稳定性好</li>
                            <li>自发自收邮件通常直接进入收件箱</li>
                            <li>支持SSL加密，安全性高</li>
                            <li>适合中国用户使用</li>
                        </ul>
                    </div>
                    
                    <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
                        <h4 style="color: #1e40af; margin-top: 0;">🔄 迁移完成</h4>
                        <p style="color: #1d4ed8;">已成功从QQ邮箱迁移到网易163邮箱，保持自发自收配置模式。</p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    
                    <p style="color: #6b7280; font-size: 14px; text-align: center;">
                        此邮件由NANUK网站自动生成<br>
                        网易163邮箱测试 - ${new Date().toISOString()}
                    </p>
                </div>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('🎉 163邮箱自发自收测试邮件发送成功！');
        console.log(`📧 邮件ID: ${result.messageId}`);
        console.log(`📬 请检查 ${config.to} 的收件箱\n`);
        
        console.log('✅ 网易163邮箱自发自收配置验证完成！');
        console.log('🚀 现在可以更新Vercel环境变量并部署了');
        console.log(`💡 记住在Vercel中设置所有163邮箱相关环境变量`);
        
    } catch (error) {
        console.log('❌ 163邮箱测试失败:');
        console.error(error.message);
        
        if (error.code === 'EAUTH') {
            console.log('\n🔐 163邮箱授权问题排查:');
            console.log('1. 确认163邮箱SMTP服务已开启');
            console.log('2. 确认授权码正确（16位字符）');
            console.log('3. 重新生成163邮箱授权码');
            console.log('4. 检查邮箱是否有异常状态');
        } else if (error.code === 'ECONNECTION') {
            console.log('\n🔗 连接问题排查:');
            console.log('1. 检查网络连接');
            console.log('2. 尝试使用端口25（如果465不可用）');
            console.log('3. 检查防火墙设置');
        }
        
        console.log('\n💡 建议操作:');
        console.log('1. 重新配置163邮箱SMTP服务');
        console.log('2. 在Vercel线上环境测试（可能本地网络限制）');
        console.log('3. 查看网易163邮箱配置指南.txt获取详细帮助');
    }
}

// 执行163邮箱测试
test163Mail().catch(console.error);