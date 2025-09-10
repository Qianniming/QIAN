/** @type {import('next').NextConfig} */
// Next.js 配置文件 - 定义应用构建和运行时行为
const nextConfig = {
  // 🧪 实验性功能配置
  experimental: {
    // appDir 在 Next.js 14 中已默认启用，不需要显式配置
  },
  // 🐳 构建输出配置 - 独立模式（适用于Docker部署）
  output: 'standalone',
  // 🖼️ 图片优化配置
  images: {
    domains: ['localhost'], // 允许的外部图片域名
    unoptimized: true, // 禁用图片优化（适用于静态导出）
    formats: ['image/webp', 'image/avif'], // 支持的现代图片格式
  },
  // 🔧 环境变量配置 - 将服务端环境变量暴露给客户端
  env: {
    MONGODB_URI: process.env.MONGODB_URI, // 数据库连接字符串
    EMAIL_USER: process.env.EMAIL_USER, // 邮件发送用户
    EMAIL_PASS: process.env.EMAIL_PASS, // 邮件发送密码
    ADMIN_EMAIL: process.env.ADMIN_EMAIL, // 管理员邮箱
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000', // 网站URL（带默认值）
  },
  // ⚡ 性能优化配置
  compress: true, // 启用Gzip压缩
  trailingSlash: false, // 禁用URL尾部斜杠（SEO优化）
  poweredByHeader: false, // 移除X-Powered-By头（安全性）
  // 🛡️ 安全头配置 - 增强网站安全性
  async headers() {
    return [
      {
        source: '/(.*)', // 应用到所有路由
        headers: [
          {
            key: 'X-Frame-Options', // 防止点击劫持
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options', // 防止MIME类型嗅探
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy', // 控制Referrer信息
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control', // 启用DNS预取
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security', // 强制HTTPS（HSTS）
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig