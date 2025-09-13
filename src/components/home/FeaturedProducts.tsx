'use client' // 【重点】声明这是客户端组件，可以使用浏览器功能（如鼠标悬停、动画等）

// 导入React相关模块
import { useState } from 'react' // 用于管理组件状态（比如记录鼠标悬停在哪个产品上）
import { motion } from 'framer-motion' // 动画库，让产品卡片有淡入、移动等动画效果
import { useInView } from 'react-intersection-observer' // 检测元素是否进入用户视野，用于触发动画
import Link from 'next/link' // Next.js的链接组件，用于页面跳转
import { HiArrowRight, HiEye } from 'react-icons/hi' // 导入箭头和眼睛图标
import { FaRuler, FaWeight, FaShieldAlt } from 'react-icons/fa' // 导入尺寸、重量、防护等级图标

// 【重点】精选产品数据数组 - 这里定义了首页要展示的6个主打产品
// 【小白修改指南】要更换产品信息，直接修改下面的数据即可：
// - name: 产品名称
// - image: 产品图片路径（图片需要放在 public/images/products/ 文件夹下）
// - price: 价格（可以写具体价格或"联系询价"）
// - description: 产品描述
// - features: 产品特点列表
// - specs: 产品规格（尺寸、重量、防护等级）
// - badge: 产品标签（如"热销"、"新品"等）
const featuredProducts = [
  {
    id: 'nanuk-910-protective-case', // 产品唯一标识，用于页面跳转
    name: 'NANUK 910 Protective Case', // 【可修改】产品名称
    category: 'Small Cases', // 【可修改】产品分类
    image: '/images/products/military-case-1.svg', // 【可修改】产品图片路径
    price: 'Contact for Quote', // 【可修改】产品价格
    description: 'Ultra-lightweight and virtually unbreakable protective case for small equipment.', // 【可修改】产品描述
    features: [ // 【可修改】产品特点列表
      'Waterproof and dustproof (IP67)',
      'Impact resistant NK-7 resin shell',
      'PowerClaw superior latching system',
      'Automatic pressure relief valve'
    ],
    specs: { // 【可修改】产品规格
      dimensions: '35.1 × 29.5 × 15.2 cm', // 尺寸
      weight: '1.5 kg', // 重量
      protection: 'IP67' // 防护等级
    },
    badge: 'Best Seller' // 【可修改】产品标签
  },
  {
    id: 'nanuk-920-professional-case',
    name: 'NANUK 920 Professional Case',
    category: 'Medium Cases',
    image: '/images/products/industrial-case-1.svg',
    price: 'Contact for Quote',
    description: 'Medium-sized professional case with customizable foam interior for versatile equipment protection.',
    features: [
      'Waterproof and dustproof (IP67)',
      'Impact resistant NK-7 resin shell',
      'PowerClaw superior latching system',
      'Modular foam system'
    ],
    specs: {
      dimensions: '42.4 × 33.0 × 17.5 cm',
      weight: '2.2 kg',
      protection: 'IP67'
    },
    badge: 'Professional'
  },
  {
    id: 'wl-1200-medical-antimicrobial-case',
    name: 'WL-1200 Medical Antimicrobial Case',
    category: 'Medical Cases',
    image: '/images/products/wl-1200.svg',
    price: 'Contact for Quote',
    description: 'Specialized antimicrobial case designed for medical equipment with advanced sterilization features.',
    features: [
      'Antimicrobial Surface Coating',
      'Autoclave Compatible',
      'Medical-Grade Materials',
      'Precision Foam Inserts'
    ],
    specs: {
      dimensions: '30.5 × 20.3 × 10.2 cm',
      weight: '1.3 kg',
      protection: 'IP65'
    },
    badge: 'Medical Grade'
  },
  {
    id: 'wl-2800-industrial-heavy-duty-case',
    name: 'WL-2800 Industrial Heavy Duty Case',
    category: 'Industrial Cases',
    image: '/images/products/wl-2800.svg',
    price: 'Contact for Quote',
    description: 'Heavy-duty industrial case built for extreme environments and maximum equipment protection.',
    features: [
      'Extreme Impact Resistance',
      'Submersible Design (IP68)',
      'Reinforced Corner Protection',
      'Heavy-Duty Latching System'
    ],
    specs: {
      dimensions: '71.1 × 45.7 × 30.5 cm',
      weight: '5.7 kg',
      protection: 'IP68'
    },
    badge: 'Heavy Duty'
  },
  {
    id: 'wl-1600-studio-case',
    name: 'WL-1600 Studio Case',
    category: 'Photography Cases',
    image: '/images/products/wl-1600.svg',
    price: 'Contact for Quote',
    description: 'Professional studio case with customizable compartments for photography and video production equipment.',
    features: [
      'Modular Interior System',
      'Silent Wheels',
      'Professional Appearance',
      'Cable Management'
    ],
    specs: {
      dimensions: '40.6 × 30.5 × 20.3 cm',
      weight: '2.5 kg',
      protection: 'IP54'
    },
    badge: 'Studio'
  },
  {
    id: 'nanuk-925-custom-case',
    name: 'NANUK 925 Custom Case',
    category: 'Custom Cases',
    image: '/images/products/tool-case-1.svg',
    price: 'Contact for Quote',
    description: 'Fully customizable case solution designed to meet specific equipment protection requirements.',
    features: [
      'Fully customizable design',
      'Precision foam cutting',
      'Custom color options',
      'Specialized hardware'
    ],
    specs: {
      dimensions: 'Customizable',
      weight: 'Varies',
      protection: 'Up to IP68'
    },
    badge: 'Custom'
   }
 ]

// 动画配置 - 控制产品卡片的出现效果
// containerVariants: 整个产品网格的动画（所有卡片一起淡入）
const containerVariants = {
  hidden: { opacity: 0 }, // 初始状态：完全透明
  visible: {
    opacity: 1, // 最终状态：完全显示
    transition: {
      staggerChildren: 0.1 // 子元素（每个产品卡片）依次出现，间隔0.1秒
    }
  }
}

// itemVariants: 单个产品卡片的动画（从下方滑入并淡入）
const itemVariants = {
  hidden: { opacity: 0, y: 30 }, // 初始状态：透明且向下偏移30像素
  visible: {
    opacity: 1, // 最终状态：完全显示
    y: 0, // 最终位置：正常位置
    transition: {
      duration: 0.6, // 动画持续0.6秒
      ease: 'easeOut' // 缓动效果：先快后慢
    }
  }
}

// 【重点】精选产品展示组件 - 首页的核心产品展示区域
// 功能：展示6个主打产品，包含产品图片、信息、规格和操作按钮
export default function FeaturedProducts() {
  // 状态管理：记录鼠标悬停在哪个产品上（用于显示"查看详情"按钮）
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  
  // 视野检测：当这个组件进入用户视野时触发动画
  const [ref, inView] = useInView({
    triggerOnce: true, // 只触发一次动画
    threshold: 0.1 // 当10%的内容可见时就触发
  })

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 区域标题 - 带动画效果的标题和描述 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} // 初始状态：透明且向下偏移
          animate={inView ? { opacity: 1, y: 0 } : {}} // 进入视野时：显示并回到正常位置
          transition={{ duration: 0.6 }} // 动画持续0.6秒
          className="text-center mb-16" // 居中对齐，底部间距16
          ref={ref} // 绑定视野检测
        >
          {/* 【可修改】主标题 */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured <span className="text-primary-600">Products</span>
          </h2>
          {/* 【可修改】副标题描述 */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our most popular protective cases, trusted by professionals worldwide 
            for their superior quality and reliability.
          </p>
        </motion.div>

        {/* 产品网格 - 响应式布局展示所有产品 */}
        <motion.div
          variants={containerVariants} // 使用容器动画配置
          initial="hidden" // 初始状态：隐藏
          animate={inView ? "visible" : "hidden"} // 根据是否在视野中决定动画状态
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" // 响应式网格：手机1列，平板2列，电脑3列
        >
          {/* 遍历所有产品，为每个产品生成一个卡片 */}
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id} // React要求的唯一标识
              variants={itemVariants} // 使用单个卡片的动画配置
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 card-hover" // 卡片样式：白色背景、圆角、阴影、悬停效果
              onMouseEnter={() => setHoveredProduct(Number(product.id))} // 鼠标进入时记录当前产品ID
              onMouseLeave={() => setHoveredProduct(null)} // 鼠标离开时清除记录
            >
              {/* 产品图片区域 */}
              <div className="relative overflow-hidden"> {/* 相对定位，用于放置徽章和悬停层 */}
                {/* 产品主图 */}
                <div 
                  className="w-full h-64 bg-gray-200 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" // 固定高度，背景图片覆盖，悬停时放大
                  style={{ backgroundImage: `url('${product.image}')` }} // 【重点】产品图片路径
                />
                
                {/* 产品徽章（如"热销"、"新品"等） */}
                <div className="absolute top-4 left-4"> {/* 绝对定位在左上角 */}
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    product.badge === 'Best Seller' ? 'bg-accent-500 text-white' : // 热销：橙色
                    product.badge === 'New' ? 'bg-green-500 text-white' : // 新品：绿色
                    product.badge === 'Military Grade' ? 'bg-gray-800 text-white' : // 军用级：深灰
                    'bg-primary-500 text-white' // 默认：主色调
                  }`}>
                    {product.badge} {/* 【可修改】徽章文字 */}
                  </span>
                </div>

                {/* 鼠标悬停时显示的遮罩层和"查看详情"按钮 */}
                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
                  hoveredProduct === Number(product.id) ? 'opacity-100' : 'opacity-0' // 只有悬停的产品才显示
                }`}>
                  <Link
                    href={`/products/${product.id}`} // 跳转到产品详情页
                    className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors duration-300"
                  >
                    <HiEye className="h-5 w-5" /> {/* 眼睛图标 */}
                    <span>View Details</span> {/* 【可修改】按钮文字 */}
                  </Link>
                </div>
              </div>

              {/* 产品信息区域 */}
              <div className="p-6"> {/* 内边距6 */}
                {/* 产品分类和价格 */}
                <div className="flex items-center justify-between mb-2"> {/* 左右对齐布局 */}
                  <span className="text-sm text-primary-600 font-medium">{product.category}</span> {/* 产品分类 */}
                  <span className="text-sm text-gray-500 font-semibold">{product.price}</span> {/* 产品价格 */}
                </div>
                
                {/* 产品名称 */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                  {product.name} {/* 【重点】产品名称，悬停时变色 */}
                </h3>
                
                {/* 产品描述 */}
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {product.description} {/* 【重点】产品描述文字 */}
                </p>

                {/* 产品规格 - 三列网格显示尺寸、重量、防护等级 */}
                <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
                  {/* 尺寸 */}
                  <div className="flex items-center space-x-1 text-gray-500">
                    <FaRuler className="h-3 w-3" /> {/* 尺子图标 */}
                    <span>{product.specs.dimensions}</span>
                  </div>
                  {/* 重量 */}
                  <div className="flex items-center space-x-1 text-gray-500">
                    <FaWeight className="h-3 w-3" /> {/* 重量图标 */}
                    <span>{product.specs.weight}</span>
                  </div>
                  {/* 防护等级 */}
                  <div className="flex items-center space-x-1 text-gray-500">
                    <FaShieldAlt className="h-3 w-3" /> {/* 盾牌图标 */}
                    <span>{product.specs.protection}</span>
                  </div>
                </div>

                {/* 产品特点列表 - 只显示前3个特点 */}
                <ul className="space-y-1 mb-6">
                  {product.features.slice(0, 3).map((feature, index) => ( // 只取前3个特点
                    <li key={index} className="flex items-center text-xs text-gray-500">
                      <div className="w-1 h-1 bg-primary-500 rounded-full mr-2 flex-shrink-0" /> {/* 小圆点 */}
                      {feature} {/* 特点描述 */}
                    </li>
                  ))}
                </ul>

                {/* 操作按钮 - 查看详情和获取报价 */}
                <div className="flex space-x-3"> {/* 两个按钮并排 */}
                  {/* 查看详情按钮 - 主要按钮 */}
                  <Link
                    href={`/products/${product.id}`} // 跳转到产品详情页
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-300"
                  >
                    View Details {/* 【可修改】按钮文字 */}
                  </Link>
                  {/* 获取报价按钮 - 次要按钮 */}
                  <Link
                    href="/contact" // 跳转到联系页面
                    className="flex-1 border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white text-center py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300"
                  >
                    Get Quote {/* 【可修改】按钮文字 */}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 查看所有产品按钮 - 页面底部的主要行动号召 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} // 初始状态：透明且向下偏移
          animate={inView ? { opacity: 1, y: 0 } : {}} // 进入视野时显示
          transition={{ duration: 0.6, delay: 0.8 }} // 延迟0.8秒后开始动画
          className="text-center mt-12" // 居中对齐，顶部间距12
        >
          <Link
            href="/products" // 【重点】跳转到产品列表页
            className="group inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 btn-hover"
          >
            <span>View All Products</span> {/* 【可修改】按钮文字 */}
            <HiArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" /> {/* 箭头图标，悬停时向右移动 */}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}