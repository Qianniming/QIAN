/** @type {import('tailwindcss').Config} */
// Tailwind CSS 配置文件 - 定义样式系统和设计规范
module.exports = {
  // 内容扫描路径 - Tailwind会扫描这些文件中使用的CSS类
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Pages目录（如使用pages router）
    './components/**/*.{js,ts,jsx,tsx,mdx}', // 组件目录
    './app/**/*.{js,ts,jsx,tsx,mdx}', // App目录（Next.js 13+ App Router）
    './src/**/*.{js,ts,jsx,tsx,mdx}', // 源代码目录
  ],
  // 主题配置 - 扩展默认Tailwind设计系统
  theme: {
    extend: {
      // 🎨 自定义颜色系统 - 品牌色彩规范
      colors: {
        // 主色调 - 蓝色系（用于按钮、链接等主要元素）
        primary: {
          50: '#f0f9ff', // 最浅蓝色 - 背景色
          100: '#e0f2fe', // 浅蓝色 - 悬停背景
          500: '#0ea5e9', // 标准蓝色 - 主要按钮
          600: '#0284c7', // 深蓝色 - 按钮悬停
          700: '#0369a1', // 更深蓝色 - 按钮按下
          800: '#075985', // 深蓝色 - 文字
          900: '#0c4a6e', // 最深蓝色 - 标题
        },
        // 强调色 - 红色系（用于警告、错误等）
        accent: {
          500: '#ef4444', // 标准红色 - 错误提示
          600: '#dc2626', // 深红色 - 错误按钮
        },
        // 灰色系 - 中性色（用于文字、边框、背景等）
        gray: {
          50: '#f9fafb', // 最浅灰 - 页面背景
          100: '#f3f4f6', // 浅灰 - 卡片背景
          200: '#e5e7eb', // 边框灰
          300: '#d1d5db', // 分割线
          400: '#9ca3af', // 占位符文字
          500: '#6b7280', // 次要文字
          600: '#4b5563', // 普通文字
          700: '#374151', // 重要文字
          800: '#1f2937', // 标题文字
          900: '#111827', // 最深文字
        },
      },
      // 🔤 字体配置 - 定义网站字体栈
      fontFamily: {
        sans: ['Roboto', 'Open Sans', 'system-ui', 'sans-serif'], // 无衬线字体（主要字体）
      },
      // ✨ 动画配置 - 自定义动画效果
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out', // 淡入动画 - 页面加载
        'slide-up': 'slideUp 0.6s ease-out', // 上滑动画 - 元素进入
        'scale-in': 'scaleIn 0.3s ease-out', // 缩放动画 - 按钮交互
      },
      // 🎬 关键帧定义 - 动画的具体实现
      keyframes: {
        // 淡入效果 - 透明度从0到1
        fadeIn: {
          '0%': { opacity: '0' }, // 开始：完全透明
          '100%': { opacity: '1' }, // 结束：完全不透明
        },
        // 上滑效果 - 从下方滑入
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' }, // 开始：向下偏移20px，透明
          '100%': { transform: 'translateY(0)', opacity: '1' }, // 结束：回到原位，不透明
        },
        // 缩放效果 - 从小到正常大小
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' }, // 开始：95%大小，透明
          '100%': { transform: 'scale(1)', opacity: '1' }, // 结束：100%大小，不透明
        },
      },
      // 🌟 阴影配置 - 自定义阴影效果
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // 标准阴影 - 卡片、按钮
        'custom-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // 大阴影 - 弹窗、悬浮元素
      },
    },
  },
  // 插件配置 - 扩展Tailwind功能（当前为空）
  plugins: [],
}