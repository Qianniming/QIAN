// 🚀 NANUK项目快速启动检查器
const fs = require('fs');
const path = require('path');

console.log('🚀 NANUK项目快速启动检查\n');

// 检查必需文件
const requiredFiles = [
    '.env.local',
    'package.json',
    'next.config.js',
    'src/app/layout.tsx',
    'src/lib/mongodb.ts'
];

console.log('📋 检查必需文件...');
let allFilesExist = true;

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ 缺少 ${file}`);
        allFilesExist = false;
    }
});

// 检查环境变量
console.log('\n🔐 检查环境变量配置...');
if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    
    const requiredEnvVars = [
        'MONGODB_URI',
        'SMTP_HOST',
        'SMTP_USER',
        'SMTP_PASS',
        'NEXTAUTH_SECRET'
    ];
    
    let allEnvVarsSet = true;
    requiredEnvVars.forEach(envVar => {
        if (envContent.includes(`${envVar}=`) && !envContent.includes(`${envVar}=your_`)) {
            console.log(`✅ ${envVar} 已配置`);
        } else {
            console.log(`❌ ${envVar} 未配置或使用默认值`);
            allEnvVarsSet = false;
        }
    });
    
    if (allEnvVarsSet) {
        console.log('\n✅ 所有环境变量已正确配置');
    } else {
        console.log('\n⚠️ 请完成环境变量配置');
        console.log('💡 参考 .env.local.example 文件');
    }
} else {
    console.log('❌ .env.local 文件不存在');
    console.log('💡 复制 .env.local.example 为 .env.local 并配置');
    allFilesExist = false;
}

// 总结
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
    console.log('🎉 项目配置完整！可以开始开发或部署');
    console.log('\n📝 下一步操作：');
    console.log('   开发：npm run dev');
    console.log('   构建：npm run build');
    console.log('   部署：推送到GitHub → 配置Vercel');
} else {
    console.log('⚠️ 项目配置不完整，请完成缺失的配置');
    console.log('\n📝 需要完成：');
    console.log('   1. 配置 .env.local 文件');
    console.log('   2. 确保所有必需文件存在');
    console.log('   3. 运行 npm install 安装依赖');
}

console.log('\n📚 有用的命令：');
console.log('   npm run deploy:env    - 生成环境变量模板');
console.log('   npm run deploy:check  - 部署前检查');
console.log('   npm run db:init       - 初始化数据库');
console.log('   npm run type-check    - TypeScript类型检查');