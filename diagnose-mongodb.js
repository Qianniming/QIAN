// MongoDB Atlas SSL连接诊断脚本
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function diagnosisConnection() {
    console.log('🔍 MongoDB Atlas连接诊断开始...\n');
    
    // 你的实际连接信息
    const username = '766282480qnm_db_user';
    const password = '13195622840Qbb';
    const cluster = 'weili-website.x7cdvcd.mongodb.net';
    const database = 'wellicases';
    
    console.log('📋 连接信息:');
    console.log(`用户名: ${username}`);
    console.log(`密码: ${password}`);
    console.log(`集群: ${cluster}`);
    console.log(`数据库: ${database}\n`);
    
    // 测试不同的连接配置
    const testConfigs = [
        {
            name: '标准配置',
            uri: `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`,
            options: { serverSelectionTimeoutMS: 5000 }
        },
        {
            name: 'SSL禁用配置',
            uri: `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority&ssl=false`,
            options: { serverSelectionTimeoutMS: 5000, tls: false }
        },
        {
            name: 'TLS宽松配置',
            uri: `mongodb+srv://${username}:${password}@${cluster}/${database}?retryWrites=true&w=majority`,
            options: { 
                serverSelectionTimeoutMS: 5000,
                tls: true,
                tlsAllowInvalidCertificates: true,
                tlsAllowInvalidHostnames: true
            }
        },
        {
            name: '最小配置',
            uri: `mongodb+srv://${username}:${password}@${cluster}/${database}`,
            options: { serverSelectionTimeoutMS: 10000 }
        }
    ];
    
    for (const config of testConfigs) {
        console.log(`🧪 测试 ${config.name}...`);
        try {
            const client = new MongoClient(config.uri, config.options);
            await client.connect();
            await client.db('admin').command({ ping: 1 });
            console.log(`✅ ${config.name} 连接成功！\n`);
            await client.close();
            return config; // 返回第一个成功的配置
        } catch (error) {
            console.log(`❌ ${config.name} 失败: ${error.message}\n`);
        }
    }
    
    console.log('🚨 所有配置都失败了，请检查以下几点：');
    console.log('1. MongoDB Atlas网络访问是否设置为 0.0.0.0/0');
    console.log('2. 数据库用户权限是否正确');
    console.log('3. 集群是否正在运行');
    console.log('4. 用户名和密码是否正确');
    
    return null;
}

// 执行诊断
diagnosisConnection()
    .then(successConfig => {
        if (successConfig) {
            console.log('🎉 找到可用配置！');
            console.log('请在 .env.local 中使用以下连接字符串：');
            console.log(`MONGODB_URI=${successConfig.uri}`);
        }
    })
    .catch(error => {
        console.error('诊断过程出错:', error);
    });