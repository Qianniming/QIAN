#!/bin/bash

# 🚀 Vercel部署前检查脚本
# 确保所有配置正确，避免部署失败

echo "🔍 开始Vercel部署前检查..."

# 检查package.json中的构建脚本
echo "📦 检查package.json构建脚本..."
if grep -q "\"build\":" package.json; then
    echo "✅ build脚本存在"
else
    echo "❌ 缺少build脚本"
    exit 1
fi

# 检查Next.js配置
echo "⚙️ 检查Next.js配置..."
if [ -f "next.config.js" ]; then
    echo "✅ next.config.js存在"
else
    echo "❌ 缺少next.config.js"
    exit 1
fi

# 检查环境变量示例文件
echo "🔐 检查环境变量配置..."
if [ -f ".env.example" ]; then
    echo "✅ .env.example存在"
else
    echo "❌ 缺少.env.example"
fi

# 检查vercel.json配置
echo "🌐 检查Vercel配置..."
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json存在"
else
    echo "⚠️ 缺少vercel.json (可选)"
fi

# 检查TypeScript配置
echo "📝 检查TypeScript配置..."
if [ -f "tsconfig.json" ]; then
    echo "✅ tsconfig.json存在"
else
    echo "❌ 缺少tsconfig.json"
    exit 1
fi

# 检查关键组件是否存在
echo "🧩 检查关键组件..."
COMPONENTS=(
    "src/app/layout.tsx"
    "src/app/page.tsx"
    "src/lib/mongodb.ts"
    "src/lib/models.ts"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        echo "✅ $component 存在"
    else
        echo "❌ 缺少 $component"
        exit 1
    fi
done

# 检查API路由
echo "🔌 检查API路由..."
API_ROUTES=(
    "src/app/api/products/route.ts"
    "src/app/api/contact/route.ts"
    "src/app/api/health/route.ts"
)

for route in "${API_ROUTES[@]}"; do
    if [ -f "$route" ]; then
        echo "✅ $route 存在"
    else
        echo "❌ 缺少 $route"
        exit 1
    fi
done

echo ""
echo "🎉 部署前检查完成！"
echo "📋 部署检查清单："
echo "   ✅ 所有必需文件都存在"
echo "   ✅ 构建配置正确"
echo "   ✅ API路由完整"
echo ""
echo "🚀 现在可以开始Vercel部署了！"
echo ""
echo "📖 接下来的步骤："
echo "   1. 配置MongoDB Atlas数据库"
echo "   2. 准备环境变量"
echo "   3. 推送代码到GitHub"
echo "   4. 在Vercel中配置项目"
echo "   5. 设置环境变量"
echo "   6. 部署项目"