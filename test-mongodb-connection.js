// 测试MongoDB连接的简化脚本
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function testConnection() {
    console.log('🔍 测试MongoDB连接...');
    
    // 原始连接字符串
    const originalUri = process.env.MONGODB_URI;
    console.log('原始连接字符串:', originalUri?.substring(0, 50) + '...');
    
    // URL编码密码版本
    const encodedPassword = encodeURIComponent('13195622840Qbb');
    const encodedUri = `mongodb+srv://766282480qnm_db_user:${encodedPassword}@weili-website.x7cdvcd.mongodb.net/wellicases?retryWrites=true&w=majority&appName=WEILI-website&ssl=true&authSource=admin`;
    
    console.log('编码后连接字符串:', encodedUri.substring(0, 50) + '...');
    
    // 测试连接选项
    const options = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
        maxPoolSize: 1,
        tls: true,
        authSource: 'admin'
    };
    
    // 测试原始连接
    console.log('\n🧪 测试原始连接字符串...');
    try {
        const client1 = new MongoClient(originalUri, options);
        await client1.connect();
        await client1.db('admin').command({ ping: 1 });
        console.log('✅ 原始连接成功！');
        await client1.close();
    } catch (error) {
        console.log('❌ 原始连接失败:', error.message);
    }
    
    // 测试编码后连接
    console.log('\n🧪 测试URL编码后连接字符串...');
    try {
        const client2 = new MongoClient(encodedUri, options);
        await client2.connect();
        await client2.db('admin').command({ ping: 1 });
        console.log('✅ 编码后连接成功！');
        await client2.close();
    } catch (error) {
        console.log('❌ 编码后连接失败:', error.message);
    }
    
    // 测试简化连接
    console.log('\n🧪 测试简化连接字符串...');
    const simpleUri = `mongodb+srv://766282480qnm_db_user:${encodedPassword}@weili-website.x7cdvcd.mongodb.net/wellicases`;
    try {
        const client3 = new MongoClient(simpleUri, { serverSelectionTimeoutMS: 5000 });
        await client3.connect();
        await client3.db('admin').command({ ping: 1 });
        console.log('✅ 简化连接成功！');
        await client3.close();
    } catch (error) {
        console.log('❌ 简化连接失败:', error.message);
    }
}

testConnection();