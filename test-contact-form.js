// 联系表单API测试脚本 - 测试完整的邮件发送流程
require('dotenv').config({ path: '.env.local' });
const http = require('http');

// 测试数据
const testFormData = {
  name: '张三',
  email: '18756283766@163.com', // 使用相同的163邮箱进行自发自收测试
  phone: '+86 13800138000',
  country: '中国',
  company: '测试公司',
  productInterest: '防护箱',
  message: '这是一封来自联系表单的测试邮件，用于验证163邮箱自发自收功能是否正常工作。'
};

async function testContactForm() {
  console.log('🧪 联系表单API测试开始...\n');
  
  // 显示测试配置
  console.log('📋 测试配置:');
  console.log(`📧 测试邮箱: ${testFormData.email}`);
  console.log(`👤 测试用户: ${testFormData.name}`);
  console.log(`🏢 测试公司: ${testFormData.company}`);
  console.log(`📝 测试消息: ${testFormData.message.substring(0, 50)}...\n`);
  
  // 准备POST请求数据
  const postData = JSON.stringify(testFormData);
  
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/contact',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  return new Promise((resolve, reject) => {
    console.log('🚀 发送联系表单请求到 http://localhost:3000/api/contact');
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📊 响应状态码: ${res.statusCode}`);
        console.log(`📄 响应头: ${JSON.stringify(res.headers, null, 2)}`);
        
        try {
          const response = JSON.parse(data);
          console.log(`📨 响应内容: ${JSON.stringify(response, null, 2)}`);
          
          if (res.statusCode === 200 && response.success) {
            console.log('\n✅ 联系表单提交成功！');
            console.log('📧 管理员邮件: 已发送到 18756283766@163.com');
            console.log('📬 客户确认邮件: 已发送到 18756283766@163.com');
            console.log('💾 咨询记录: 已保存到数据库');
            console.log('\n🔍 请检查 18756283766@163.com 邮箱是否收到两封邮件:');
            console.log('   1. 管理员通知邮件（包含客户咨询详情）');
            console.log('   2. 客户确认邮件（感谢客户的咨询）');
            resolve(response);
          } else {
            console.log('\n❌ 联系表单提交失败');
            console.log(`错误信息: ${response.error || '未知错误'}`);
            reject(new Error(response.error || '表单提交失败'));
          }
        } catch (parseError) {
          console.log('\n❌ 响应解析失败');
          console.log(`原始响应: ${data}`);
          console.log(`解析错误: ${parseError.message}`);
          reject(parseError);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('\n❌ 请求发送失败');
      console.log(`错误信息: ${error.message}`);
      console.log('\n🔧 可能的解决方案:');
      console.log('1. 确保开发服务器正在运行: npm run dev');
      console.log('2. 检查端口3000是否被占用');
      console.log('3. 确认网络连接正常');
      reject(error);
    });
    
    // 发送POST数据
    req.write(postData);
    req.end();
  });
}

async function checkDevServer() {
  console.log('🔍 检查开发服务器状态...');
  
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/health',
    method: 'GET',
    timeout: 5000
  };
  
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ 开发服务器运行正常\n');
          resolve(true);
        } else {
          console.log(`❌ 开发服务器响应异常: ${res.statusCode}\n`);
          reject(new Error(`服务器状态码: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ 无法连接到开发服务器');
      console.log(`错误: ${error.message}`);
      console.log('\n💡 解决方案:');
      console.log('1. 启动开发服务器: npm run dev');
      console.log('2. 等待服务器完全启动后重试\n');
      reject(error);
    });
    
    req.on('timeout', () => {
      console.log('❌ 连接超时，服务器可能未启动\n');
      req.destroy();
      reject(new Error('连接超时'));
    });
    
    req.end();
  });
}

async function runTest() {
  try {
    // 检查开发服务器
    await checkDevServer();
    
    // 测试联系表单
    await testContactForm();
    
    console.log('\n🎉 所有测试完成！');
    console.log('\n📝 验证清单:');
    console.log('☐ 检查163邮箱收件箱是否收到管理员通知邮件');
    console.log('☐ 检查163邮箱收件箱是否收到客户确认邮件');
    console.log('☐ 确认邮件内容格式正确且完整');
    console.log('☐ 验证数据库中是否保存了咨询记录');
    
  } catch (error) {
    console.log('\n💥 测试失败');
    console.log(`错误: ${error.message}`);
    console.log('\n🔧 调试建议:');
    console.log('1. 检查 .env.local 中的163邮箱配置');
    console.log('2. 确认SMTP_PASS授权码正确');
    console.log('3. 运行单独的邮件测试: node test-163-mail.js');
    console.log('4. 检查开发服务器控制台的错误信息');
    process.exit(1);
  }
}

// 执行测试
runTest();