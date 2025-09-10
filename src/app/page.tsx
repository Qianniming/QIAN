// 【重点】这是网站的首页文件 - 用户访问网站时看到的第一个页面
// 导入Next.js的元数据类型，用于SEO优化（搜索引擎优化）
import type { Metadata } from 'next'
// 导入首页的各个组件模块
import Hero from '@/components/home/Hero' // 英雄区域组件（页面顶部的大图和标题）
import BrandValues from '@/components/home/BrandValues' // 品牌价值观组件（展示公司优势）
import FeaturedProducts from '@/components/home/FeaturedProducts' // 特色产品组件（展示主推产品）
import CallToAction from '@/components/home/CallToAction' // 行动号召组件（引导用户联系或购买）

// 【重点】【修改入口】网站SEO元数据配置 - 这些信息会显示在搜索引擎结果中
// 相当于网站的"名片"，告诉搜索引擎和社交媒体这个网站是做什么的
export const metadata: Metadata = {
  title: 'Professional Protective Cases Manufacturer', // 【修改入口】网站标题，显示在浏览器标签页
  // 【修改入口】网站描述，显示在搜索结果下方，要简洁有吸引力
  description: 'WELL-LI Cases - Leading manufacturer of high-quality protective cases, safety cases, and custom solutions. Waterproof, dustproof, and impact-resistant cases for professionals worldwide.',
  // 【修改入口】关键词，帮助搜索引擎理解网站内容（用逗号分隔）
  keywords: 'protective cases, safety cases, waterproof cases, tool cases, equipment cases, custom cases, manufacturer, WELL-LI',
  // 社交媒体分享时显示的信息（比如微信、Facebook分享）
  openGraph: {
    title: 'WELL-LI Cases - Professional Protective Cases Manufacturer', // 【修改入口】分享时的标题
    description: 'Leading manufacturer of high-quality protective cases, safety cases, and custom solutions for professionals worldwide.', // 【修改入口】分享时的描述
    images: ['/images/hero-cases.jpg'], // 【修改入口】分享时显示的图片路径
  },
}

// 【重点】首页主组件函数 - 这是首页的"骨架"，决定页面的整体结构
export default function Home() {
  return (
    // 页面容器：最小高度为整个屏幕高度
    <div className="min-h-screen">
      {/* 【重点】页面组件按顺序排列，从上到下显示 */}
      <Hero /> {/* 英雄区域：页面顶部的大图、标题和介绍文字 */}
      <BrandValues /> {/* 品牌价值：展示公司的核心优势和特点 */}
      <FeaturedProducts /> {/* 特色产品：展示主推的产品列表 */}
      <CallToAction /> {/* 行动号召：引导用户联系我们或了解更多 */}
    </div>
  )
}

/**
 * 【重点】【小白修改指南】
 * 
 * 1. 修改网站标题和描述：
 *    - 找到 metadata 对象中的 title 和 description
 *    - 改成你自己公司的名称和业务描述
 *    - keywords 改成与你业务相关的关键词
 * 
 * 2. 修改分享图片：
 *    - openGraph.images 数组中的图片路径
 *    - 图片要放在 public/images/ 文件夹中
 * 
 * 3. 调整页面结构：
 *    - 如果不需要某个组件，可以删除对应的行
 *    - 如果要调整顺序，可以移动组件的位置
 *    - 每个组件的具体内容在 src/components/home/ 文件夹中
 * 
 * 4. 这个文件的作用：
 *    - 定义首页的整体布局和SEO信息
 *    - 组合各个组件形成完整的首页
 *    - 设置搜索引擎优化的元数据
 */