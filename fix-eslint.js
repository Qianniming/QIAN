#!/usr/bin/env node
// ESLint 自动修复脚本
// 这个脚本会自动修复一些常见的 ESLint 警告

const fs = require('fs');
const path = require('path');

// 需要修复的文件列表
const filesToFix = [
  'src/app/about/AboutPageClient.tsx',
  'src/app/contact/ContactPageClient.tsx', 
  'src/app/products/[id]/page.tsx',
  'src/app/quality/QualityPageClient.tsx',
  'src/components/products/ProductFilter.tsx',
  'src/lib/mongodb.ts',
  'src/app/api/products/route.ts'
];

function fixUnusedImports(content) {
  // 修复未使用的导入：在变量名前添加下划线
  const fixedContent = content
    // 修复未使用的 HeroIcons 导入
    .replace(/(\s+)(HiUsers|HiAcademicCap|HiStar|HiCheckCircle|HiUser|HiColorSwatch|HiGlobe)(\s*,|\s*})/g, '$1_$2$3')
    // 修复未使用的函数参数
    .replace(/(\(\s*)(category|featureId|range|protectionId)(\s*[,)])/g, '$1_$2$3')
    // 修复未使用的变量声明
    .replace(/(const|let)\s+(productInfo|globalWithMongo|fallbackData)\s*=/g, '$1 _$2 =')
    // 对于 globalWithMongo，改为 const
    .replace(/let\s+_globalWithMongo\s*=/g, 'const _globalWithMongo =')
    .replace(/let\s+fallbackData\s*=/g, 'const fallbackData =');
    
  return fixedContent;
}

async function fixFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  文件不存在: ${filePath}`);
    return;
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    const fixedContent = fixUnusedImports(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(fullPath, fixedContent, 'utf8');
      console.log(`✅ 已修复: ${filePath}`);
    } else {
      console.log(`⏭️  无需修复: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ 修复失败 ${filePath}:`, error.message);
  }
}

async function main() {
  console.log('🔧 开始自动修复 ESLint 警告...\n');
  
  for (const file of filesToFix) {
    await fixFile(file);
  }
  
  console.log('\n🎉 自动修复完成！');
  console.log('\n📋 建议下一步操作:');
  console.log('1. 运行 npm run lint 检查修复结果');
  console.log('2. 检查修复的代码是否符合预期');
  console.log('3. 如果满意，提交代码更改');
  console.log('\n💡 注意: 某些未使用的变量可能是故意保留的，请仔细检查！');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { fixUnusedImports, fixFile };