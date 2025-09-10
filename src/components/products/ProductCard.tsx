'use client'; // 【重点】客户端组件声明 - 表示这个组件在浏览器中运行，可以使用交互功能

/**
 * 【小白修改指南】ProductCard组件 - 产品卡片组件
 * 
 * 这个组件负责显示单个产品的信息，支持两种显示模式：
 * 1. 网格模式(grid) - 产品以卡片形式排列
 * 2. 列表模式(list) - 产品以横向列表形式显示
 * 
 * 【可以修改的内容】：
 * 1. 产品信息显示：
 *    - 产品名称：product.name
 *    - 产品描述：product.description
 *    - 产品图片：product.image
 *    - 产品分类：product.category
 * 
 * 2. 按钮文字：
 *    - "View Details" -> 改为你想要的文字，如"查看详情"
 *    - "Get Quote" -> 改为你想要的文字，如"获取报价"
 *    - "Quick View" -> 改为你想要的文字，如"快速查看"
 * 
 * 3. 状态文字：
 *    - "Available" -> 改为你想要的库存状态，如"有库存"
 *    - "Key Features:" -> 改为你想要的标题，如"主要特点："
 * 
 * 4. 颜色和样式：
 *    - 主色调：primary-600 (可在tailwind.config.js中修改)
 *    - 悬停效果：hover:bg-primary-700
 * 
 * 【组件作用】：
 * - 展示产品的基本信息（图片、名称、描述、规格）
 * - 提供产品操作按钮（查看详情、获取报价、收藏、分享）
 * - 支持悬停动画效果
 * - 响应式设计，适配不同屏幕尺寸
 */

// 【重点】React模块导入 - 引入所需的功能
import React, { useState } from 'react'; // React核心库和状态管理钩子
import Link from 'next/link'; // Next.js路由链接组件
import { motion } from 'framer-motion'; // 动画库，用于制作悬停动画
import { HiEye, HiHeart, HiShare } from 'react-icons/hi'; // Heroicons图标库
import { FaRuler, FaWeight, FaShieldAlt } from 'react-icons/fa'; // FontAwesome图标库

// 【重点】产品数据类型定义 - 定义产品对象的结构
// 这个接口告诉TypeScript产品对象应该包含哪些字段
interface Product {
  id?: string // 产品唯一标识
  _id?: string // MongoDB产品ID
  slug?: string // 产品URL路径（可选）
  name: string // 产品名称
  category: string // 产品分类
  image?: string // 主要产品图片（可选）
  images?: string[] // 产品图片数组（可选）
  description: string // 产品描述
  features: string[] // 产品特点列表
  specifications: { // 产品规格对象
    dimensions?: string // 尺寸（可选）
    weight?: string // 重量（可选）
    material?: string // 材质（可选）
    waterproof?: string // 防水等级（可选）
    [key: string]: string | undefined // 允许其他规格字段
  }
  applications?: string[] // 应用场景（可选）
  protectionRating?: string // 防护等级（可选）
}

// 产品卡片组件的属性类型定义
interface ProductCardProps {
  product: Product // 要显示的产品数据
  viewMode: 'grid' | 'list' // 显示模式：网格视图或列表视图
}

// 【重点】产品卡片组件 - 用于展示单个产品的信息卡片
// 功能：支持网格和列表两种显示模式，包含产品图片、信息、规格和操作按钮
export default function ProductCard({ product, viewMode }: ProductCardProps) {
  // 状态管理
  const [isHovered, setIsHovered] = useState(false) // 记录鼠标是否悬停在卡片上
  const [isFavorited, setIsFavorited] = useState(false) // 记录产品是否被收藏

  // 【重点】安全的数据提取 - 防止数据缺失导致页面报错
  // 这些变量确保即使产品数据不完整，页面也能正常显示
  const productId = product.id || product._id || 'unknown' // 产品ID，多个备选方案
  const productSlug = product.slug || productId // 产品URL路径，优先使用slug，否则使用id
  const productImage = product.image || (product.images && product.images[0]) || '/images/products/default.svg' // 产品图片，有多个备选方案
  const safeDimensions = product.specifications?.dimensions || 'N/A' // 安全获取尺寸，缺失时显示"N/A"
  const safeWeight = product.specifications?.weight || 'N/A' // 安全获取重量
  const safeWaterproof = product.specifications?.waterproof || product.protectionRating || 'N/A' // 安全获取防护等级
  const safeFeatures = Array.isArray(product.features) ? product.features : [] // 确保特点是数组格式

  // 【重点】根据产品分类获取对应的徽章样式
  // 【小白修改指南】要修改分类徽章，可以：
  // 1. 修改徽章文字（text字段）
  // 2. 修改徽章颜色（color字段，使用Tailwind CSS颜色类）
  // 3. 添加新的分类case
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'military': // 军用级
        return { text: 'Military Grade', color: 'bg-gray-800 text-white' }
      case 'medical': // 医用级
        return { text: 'Medical Grade', color: 'bg-blue-600 text-white' }
      case 'industrial': // 工业级
        return { text: 'Heavy Duty', color: 'bg-orange-600 text-white' }
      case 'photography': // 摄影专用
        return { text: 'Professional', color: 'bg-purple-600 text-white' }
      case 'electronics': // 电子设备
        return { text: 'Electronics', color: 'bg-green-600 text-white' }
      default: // 默认
        return { text: 'Professional', color: 'bg-primary-500 text-white' }
    }
  }

  // 【重点】列表视图模式 - 产品以横向卡片形式展示
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Product image area */}
          <div className="md:w-1/3 relative overflow-hidden">
            <div 
              className="w-full h-64 md:h-full bg-gray-200 bg-cover bg-center transition-transform duration-300 hover:scale-105"
              style={{ backgroundImage: `url('${productImage}')` }}
            />
            
            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(product.category).color}`}>
                {getCategoryBadge(product.category).text}
              </span>
            </div>

            {/* Stock status */}
            <div className="absolute top-4 right-4">
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Available
              </span>
            </div>
          </div>

          {/* Product content area */}
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {/* Product category display */}
                  <span className="text-sm text-primary-600 font-medium capitalize">
                    {product.category.replace('-', ' ')} Cases
                  </span>
                </div>
                {/* Product name - clickable to details page */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 transition-colors duration-300">
                  <Link href={`/products/${productSlug}`}>
                    {product.name}
                  </Link>
                </h3>
              </div>
              
              {/* 右侧操作按钮 */}
              <div className="flex space-x-2">
                {/* 收藏按钮 */}
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    isFavorited ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <HiHeart className="h-5 w-5" />
                </button>
                {/* 分享按钮 */}
                <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-300">
                  <HiShare className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 产品描述 */}
            <p className="text-gray-600 mb-4 leading-relaxed">
              {product.description}
            </p>

            {/* 产品规格 - 三列网格显示 */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* 尺寸 */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaRuler className="h-4 w-4" />
                <span>{safeDimensions}</span>
              </div>
              {/* 重量 */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaWeight className="h-4 w-4" />
                <span>{safeWeight}</span>
              </div>
              {/* 防护等级 */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaShieldAlt className="h-4 w-4" />
                <span>{safeWaterproof}</span>
              </div>
            </div>

            {/* 产品特性展示 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {safeFeatures.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* 底部操作按钮区域 */}
            <div className="flex space-x-3">
              {/* 查看详情按钮 - 主要操作 */}
              <Link
                href={`/products/${productSlug}`}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                <HiEye className="h-4 w-4" />
                <span>View Details</span>
              </Link>
              {/* 获取报价按钮 - 次要操作 */}
              <Link
                href="/contact"
                className="flex-1 border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white text-center py-2 px-4 rounded-lg font-semibold transition-all duration-300"
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 【重点】网格视图模式 - 产品以卡片形式展示
  return (
    <motion.div
      className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }} // Framer Motion动画：悬停时向上移动5px
    >
      {/* 产品图片区域 */}
      <div className="relative overflow-hidden">
        <div 
          className="w-full h-64 bg-gray-200 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url('${productImage}')` }}
        />
        
        {/* 分类徽章 */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(product.category).color}`}>
            {getCategoryBadge(product.category).text}
          </span>
        </div>

        {/* 库存状态 */}
        <div className="absolute top-4 right-4">
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Available
          </span>
        </div>

        {/* 悬停覆盖层 - 显示快速操作按钮 */}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-3">
            {/* 快速查看按钮 */}
            <Link
              href={`/products/${productSlug}`}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-gray-100 transition-colors duration-300"
            >
              <HiEye className="h-4 w-4" />
              <span>View</span>
            </Link>
            {/* 收藏按钮 */}
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors duration-300 ${
                isFavorited 
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              <HiHeart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 产品信息区域 */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-primary-600 font-medium capitalize">
            {product.category.replace('-', ' ')} Cases
          </span>
        </div>
        
        {/* 产品名称 - 可点击跳转到详情页 */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
          <Link href={`/products/${productSlug}`}>
            {product.name}
          </Link>
        </h3>
        
        {/* 产品描述 */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* 产品规格 - 三列网格显示 */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          {/* 尺寸 */}
          <div className="flex items-center space-x-1 text-gray-500">
            <FaRuler className="h-3 w-3" />
            <span className="truncate">{safeDimensions}</span>
          </div>
          {/* 重量 */}
          <div className="flex items-center space-x-1 text-gray-500">
            <FaWeight className="h-3 w-3" />
            <span>{safeWeight}</span>
          </div>
          {/* 防护等级 */}
          <div className="flex items-center space-x-1 text-gray-500">
            <FaShieldAlt className="h-3 w-3" />
            <span>{safeWaterproof}</span>
          </div>
        </div>

        {/* 产品特性展示 */}
        <ul className="space-y-1 mb-6">
          {safeFeatures.slice(0, 3).map((feature, index) => (
            <li key={index} className="flex items-center text-xs text-gray-500">
              <div className="w-1 h-1 bg-primary-500 rounded-full mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {/* 底部操作按钮区域 */}
        <div className="flex space-x-2">
          {/* 查看详情按钮 - 主要操作 */}
          <Link
            href={`/products/${productSlug}`}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center py-2 px-3 rounded-lg font-semibold text-sm transition-colors duration-300"
          >
            View Details
          </Link>
          {/* 获取报价按钮 - 次要操作 */}
          <Link
            href="/contact"
            className="flex-1 border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white text-center py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </motion.div>
  )
}