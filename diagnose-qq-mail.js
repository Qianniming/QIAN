// QQ邮箱详细诊断脚本
require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function diagnoseQQMail() {
    console.log('🔍 QQ邮箱详细诊断...\n');
    
    const config = {
        host: 'smtp.qq.com',
        user: '76682480@qq.com',
        pass: 'hiaayhcafgdubeij'
    };
    
    console.log('📧 测试配置:');
    console.log(`邮箱: ${config.user}`);
    console.log(`授权码: ${config.pass}`);
    console.log(`授权码长度: ${config.pass.length} 位\n`);
    
    // 测试不同端口和配置
    const testConfigs = [
        {
            name: '587端口 + STARTTLS',
            config: {
                host: config.host,
                port: 587,
                secure: false,
                auth: { user: config.user, pass: config.pass },
                tls: { rejectUnauthorized: false }
            }
        },
        {
            name: '465端口 + SSL',
            config: {
                host: config.host,
                port: 465,
                secure: true,
                auth: { user: config.user, pass: config.pass },
                tls: { rejectUnauthorized: false }
            }
        },
        {
            name: '587端口 + 强制TLS',
            config: {
                host: config.host,
                port: 587,
                secure: false,
                requireTLS: true,
                auth: { user: config.user, pass: config.pass },
                tls: { rejectUnauthorized: false }
            }
        }
    ];
    
    for (const test of testConfigs) {
        console.log(`🧪 测试: ${test.name}`);
        try {
            const transporter = nodemailer.createTransport(test.config);
            await transporter.verify();
            console.log(`✅ ${test.name} - 连接成功！\n`);
            return test.config; // 返回成功的配置
        } catch (error) {
            console.log(`❌ ${test.name} - 失败: ${error.message}\n`);
        }
    }
    
    console.log('🚨 所有配置都失败了！');
    console.log('\n📋 请检查以下设置：');
    console.log('1. 登录QQ邮箱：https://mail.qq.com');
    console.log('2. 设置 → 账户 → POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务');
    console.log('3. 确认"SMTP服务"显示为"已开启"');
    console.log('4. 重新生成授权码（如果需要）');
    console.log('5. 检查是否有安全登录限制');
    
    console.log('\n💡 常见解决方案：');
    console.log('- 重新开启SMTP服务');
    console.log('- 重新生成授权码');
    console.log('- 等待5-10分钟后重试');
    console.log('- 确认QQ号码没有异常状态');
    
    return null;
}

diagnoseQQMail();