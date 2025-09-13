// 测试数据库连接脚本
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// 读取 .env.local 文件
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('MONGODB_URI=') && !line.startsWith('#')) {
        return line.split('=')[1].trim();
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function testDatabaseConnection() {
  console.log('🔍 测试数据库连接...');
  
  const mongoUri = loadEnvFile();
  console.log('📋 环境变量检查:');
  console.log('  MONGODB_URI:', mongoUri ? '✅ 已设置' : '❌ 未设置');
  
  if (!mongoUri) {
    console.log('\n❌ 错误：未找到MONGODB_URI环境变量');
    console.log('📝 请按照以下步骤设置：');
    console.log('1. 完成MongoDB Atlas配置');
    console.log('2. 在.env.local文件中设置MONGODB_URI');
    return;
  }

  try {
    const client = new MongoClient(mongoUri);
    console.log('\n🔄 正在连接数据库...');
    
    await client.connect();
    console.log('✅ 数据库连接成功！');
    
    // 测试ping命令
    await client.db('admin').command({ ping: 1 });
    console.log('✅ 数据库响应正常');
    
    // 检查项目数据库
    const db = client.db('wellicases');
    const collections = await db.listCollections().toArray();
    console.log(`📊 数据库 'wellicases' 包含 ${collections.length} 个集合:`, 
      collections.map(c => c.name).join(', '));
    
    // 检查产品集合
    if (collections.find(c => c.name === 'products')) {
      const productCount = await db.collection('products').countDocuments();
      console.log(`📦 产品集合包含 ${productCount} 个产品`);
    }
    
    await client.close();
    console.log('\n🎉 数据库连接测试完成！');
    
  } catch (error) {
    console.log('\n❌ 数据库连接失败：');
    console.error('错误详情:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 解决方案：');
      console.log('1. 检查用户名和密码是否正确');
      console.log('2. 确保数据库用户有正确的权限');
    } else if (error.message.includes('timeout')) {
      console.log('\n🔧 解决方案：');
      console.log('1. 检查网络连接');
      console.log('2. 检查IP地址是否在MongoDB Atlas白名单中');
    }
  }
}

testDatabaseConnection();