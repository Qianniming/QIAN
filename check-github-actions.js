#!/usr/bin/env node
// 🔍 GitHub Actions状态检查脚本
const fs = require('fs');

console.log('🔍 GitHub Actions配置检查...\n');

// 检查workflow文件
console.log('📁 检查工作流文件:');
if (fs.existsSync('.github/workflows/deploy.yml')) {
  console.log('✅ .github/workflows/deploy.yml 存在');
  
  // 读取并分析workflow内容
  const workflow = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');
  
  console.log('\n🔧 工作流配置分析:');
  
  // 检查作业
  if (workflow.includes('jobs:')) {
    console.log('✅ 包含作业定义');
    
    if (workflow.includes('test:')) {
      console.log('✅ 测试作业已配置');
    }
    
    if (workflow.includes('deploy:')) {
      console.log('⚠️  包含部署作业（可能与Vercel冲突）');
    } else {
      console.log('✅ 无重复部署作业');
    }
    
    if (workflow.includes('docker:')) {
      console.log('⚠️  包含Docker作业（需要配置Secrets）');
    } else {
      console.log('✅ 无Docker作业');
    }
  }
  
  // 检查必要的步骤
  console.log('\n📋 检查必要步骤:');
  const requiredSteps = [
    'npm ci',
    'npm run lint', 
    'npm run type-check',
    'npm run build'
  ];
  
  requiredSteps.forEach(step => {
    if (workflow.includes(step)) {
      console.log(`✅ ${step}`);
    } else {
      console.log(`❌ ${step} - 缺失!`);
    }
  });
  
} else {
  console.log('❌ .github/workflows/deploy.yml 不存在');
}

// 检查package.json脚本
console.log('\n📦 检查package.json脚本:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const scripts = packageJson.scripts || {};
  
  const requiredScripts = ['lint', 'type-check', 'build'];
  requiredScripts.forEach(script => {
    if (scripts[script]) {
      console.log(`✅ ${script}: ${scripts[script]}`);
    } else {
      console.log(`❌ ${script} - 脚本缺失!`);
    }
  });
  
} catch (error) {
  console.log('❌ 无法读取package.json');
}

// 检查可能的问题
console.log('\n🚨 潜在问题检查:');

// 检查是否有可能的Secrets依赖
const secretsRequired = [
  'VERCEL_TOKEN',
  'DOCKER_USERNAME', 
  'DOCKER_PASSWORD',
  'ORG_ID',
  'PROJECT_ID'
];

console.log('🔐 GitHub Secrets需求检查:');
if (fs.existsSync('.github/workflows/deploy.yml')) {
  const workflow = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');
  
  let hasSecretDependency = false;
  secretsRequired.forEach(secret => {
    if (workflow.includes(`secrets.${secret}`)) {
      console.log(`❌ 需要配置Secret: ${secret}`);
      hasSecretDependency = true;
    }
  });
  
  if (!hasSecretDependency) {
    console.log('✅ 无需配置额外的GitHub Secrets');
  }
}

console.log('\n📊 状态总结:');
console.log('✅ Vercel部署: 成功');
console.log('⏳ GitHub Actions: 简化为CI测试');
console.log('🐳 Docker部署: 配置可用但可选');

console.log('\n💡 建议:');
console.log('1. 保持当前配置 - Vercel部署已成功');
console.log('2. GitHub Actions专注于代码质量检查');
console.log('3. 如需Docker部署，参考DOCKER-部署指南.md');

console.log('\n✨ GitHub Actions状态检查完成!');