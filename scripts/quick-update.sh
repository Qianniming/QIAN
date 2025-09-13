#!/bin/bash
# 🚀 NANUK网站快速更新脚本

echo "🔄 开始网站更新流程..."

# 检查是否有未提交的更改
if [[ -n $(git status -s) ]]; then
    echo "📝 发现未提交的更改"
    
    # 显示更改的文件
    echo "📋 更改的文件："
    git status --short
    
    # 添加所有更改
    git add .
    
    # 获取提交信息
    echo "💬 请输入更新说明："
    read -r commit_message
    
    # 如果没有输入，使用默认信息
    if [[ -z "$commit_message" ]]; then
        commit_message="update: 网站内容更新 $(date +'%Y-%m-%d %H:%M')"
    fi
    
    # 提交更改
    git commit -m "$commit_message"
    
    # 推送到远程仓库
    echo "🚀 推送更新到GitHub..."
    git push origin main
    
    if [[ $? -eq 0 ]]; then
        echo "✅ 更新成功！"
        echo "🌐 网站将在2-3分钟内自动更新"
        echo "📱 可以访问 https://qian-ten.vercel.app/ 查看效果"
        echo "⏰ 建议等待几分钟后刷新页面"
    else
        echo "❌ 推送失败，请检查网络连接或权限"
    fi
else
    echo "ℹ️  没有发现需要更新的内容"
fi

echo "🎉 更新流程完成！"