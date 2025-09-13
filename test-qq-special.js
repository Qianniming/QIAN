// QQ邮箱特殊配置测试脚本
require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function testQQSpecial() {
    console.log('🔍 QQ邮箱特殊配置测试...\n');
    
    const config = {
        host: 'smtp.qq.com',
        user: '76682480@qq.com',
        pass: 'hiaayhcafgdubeij'
    };
    
    console.log('📧 测试配置:');
    console.log(`邮箱: ${config.user}`);
    console.log(`授权码: ${config.pass}`);
    console.log(`自发自收模式: ${config.user} → ${config.user}\n`);
    
    // 尝试QQ邮箱的特殊配置
    const specialConfigs = [
        {
            name: 'QQ邮箱标准配置 + 额外选项',
            config: {
                host: 'smtp.qq.com',
                port: 587,
                secure: false,
                auth: {
                    user: config.user,
                    pass: config.pass
                },
                tls: {
                    rejectUnauthorized: false,
                    servername: 'smtp.qq.com',
                    ciphers: 'SSLv3'
                },
                connectionTimeout: 60000,
                greetingTimeout: 30000,
                socketTimeout: 60000
            }
        },
        {
            name: 'QQ邮箱465端口SSL',
            config: {
                host: 'smtp.qq.com',
                port: 465,
                secure: true,
                auth: {
                    user: config.user,
                    pass: config.pass
                },
                tls: {
                    rejectUnauthorized: false,
                    servername: 'smtp.qq.com'
                }
            }
        },
        {
            name: 'QQ邮箱587端口 + 强制TLS',
            config: {
                host: 'smtp.qq.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: config.user,
                    pass: config.pass
                },
                tls: {
                    rejectUnauthorized: false,
                    ciphers: 'HIGH:MEDIUM:!aNULL:!eNULL:@STRENGTH:!DH:!kEDH'
                }
            }
        }
    ];
    
    for (const test of specialConfigs) {
        console.log(`🧪 测试: ${test.name}`);
        try {
            const transporter = nodemailer.createTransport(test.config);
            
            // 验证连接
            await transporter.verify();
            console.log(`✅ ${test.name} - SMTP连接成功！`);
            
            // 尝试发送邮件
            console.log('📮 尝试发送测试邮件...');
            const mailOptions = {
                from: `"NANUK网站测试" <${config.user}>`,
                to: config.user,
                subject: '🧪 QQ邮箱自发自收测试',
                html: `
                    <h2>🎉 QQ邮箱配置成功！</h2>
                    <p>测试时间：${new Date().toLocaleString('zh-CN')}</p>
                    <p>配置方案：${test.name}</p>
                    <p>发件人：${config.user}</p>
                    <p>收件人：${config.user}</p>
                    <p><strong>注意：</strong>自发自收的邮件可能在"已发送"文件夹中查看。</p>
                `
            };
            
            const result = await transporter.sendMail(mailOptions);
            console.log(`✅ 邮件发送成功！`);
            console.log(`📧 邮件ID: ${result.messageId}`);
            console.log(`💡 请检查QQ邮箱的"已发送"或"收件箱"文件夹\n`);
            
            return test.config; // 返回成功的配置
            
        } catch (error) {
            console.log(`❌ ${test.name} - 失败: ${error.message}\n`);
        }
    }
    
    console.log('🚨 所有配置都失败了！');
    console.log('\n💡 QQ邮箱自发自收问题解决建议：');
    console.log('1. 检查QQ邮箱是否开启了"客户端授权密码"功能');
    console.log('2. 确认SMTP/POP3/IMAP服务都已开启');
    console.log('3. 尝试登录QQ邮箱网页版，查看是否有安全提醒');
    console.log('4. 考虑使用不同的收件邮箱（如添加一个备用邮箱）');
    console.log('5. 检查QQ账户安全等级设置');
    
    return null;
}

// 执行测试
testQQSpecial()
    .then(successConfig => {
        if (successConfig) {
            console.log('\n🎉 找到可用配置！');
            console.log('可以更新项目配置使用此方案。');
        } else {
            console.log('\n💭 建议：');
            console.log('1. 联系QQ邮箱客服确认账户状态');
            console.log('2. 或者使用其他邮箱服务（如163邮箱）');
            console.log('3. 在Vercel线上环境中再次测试（有时本地和线上环境不同）');
        }
    })
    .catch(error => {
        console.error('测试过程出错:', error);
    });