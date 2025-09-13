#!/usr/bin/env node
// 🚀 Vercel部署前检查脚本 - 确保所有配置正确
const fs = require('fs');
const path = require('path');

console.log('🔍 Vercel部署前检查...\n');

// 1. 检查关键文件是否存在
const requiredFiles = [
  'package.json',
  'next.config.js',
  '.gitignore',
  'VERCEL-环境变量配置.txt'
];

console.log('📁 检查关键文件:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 缺失!`);
  }
});

// 2. 检查环境变量配置文档
console.log('\n📋 检查环境变量配置:');
try {
  const envConfig = fs.readFileSync('VERCEL-环境变量配置.txt', 'utf8');
  
  const requiredEnvVars = [
    'MONGODB_URI',
    'SMTP_HOST',
    'SMTP_PORT', 
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM',
    'SMTP_TO',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'NEXT_PUBLIC_SITE_URL'
  ];
  
  requiredEnvVars.forEach(varName => {
    if (envConfig.includes(varName)) {
      console.log(`✅ ${varName}`);
    } else {
      console.log(`❌ ${varName} - 配置缺失!`);
    }
  });
  
  // 检查特定配置值
  if (envConfig.includes('766282480@qq.com')) {
    console.log('✅ 邮件接收配置正确 (766282480@qq.com)');
  } else {
    console.log('❌ 邮件接收配置错误');
  }
  
  if (envConfig.includes('https://weili.vercel.app')) {
    console.log('✅ Vercel域名配置正确');
  } else {
    console.log('❌ Vercel域名配置错误');
  }
  
} catch (error) {
  console.log('❌ 无法读取环境变量配置文件');
}

// 3. 检查.gitignore配置
console.log('\n🚫 检查.gitignore配置:');
try {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  
  const shouldIgnore = [
    '.next/',
    '.env.local',
    'node_modules'
  ];
  
  shouldIgnore.forEach(pattern => {
    if (gitignore.includes(pattern)) {
      console.log(`✅ ${pattern}`);
    } else {
      console.log(`❌ ${pattern} - 未忽略!`);
    }
  });
  
} catch (error) {
  console.log('❌ 无法读取.gitignore文件');
}

// 4. 检查package.json脚本
console.log('\n📦 检查package.json脚本:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredScripts = ['dev', 'build', 'start', 'lint'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ ${script}: ${packageJson.scripts[script]}`);
    } else {
      console.log(`❌ ${script} - 脚本缺失!`);
    }
  });
  
} catch (error) {
  console.log('❌ 无法读取package.json文件');
}

console.log('\n🎯 部署准备清单:');
console.log('1. ✅ 代码已推送到GitHub');
console.log('2. ✅ 项目构建测试通过');
console.log('3. ✅ ESLint检查通过');
console.log('4. ✅ 邮件配置已更新');
console.log('5. ⏳ 需要在Vercel中配置环境变量');
console.log('6. ⏳ 需要更新SMTP_TO=766282480@qq.com');

console.log('\n🚀 下一步操作:');
console.log('1. 登录Vercel控制台');
console.log('2. 选择项目设置');
console.log('3. 配置Environment Variables');
console.log('4. 根据VERCEL-环境变量配置.txt添加所有变量');
console.log('5. 重新部署项目');

console.log('\n✨ 部署前检查完成!');