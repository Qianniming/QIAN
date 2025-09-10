'use client' // 【重点】客户端组件声明 - 表示这个组件在浏览器中运行，可以使用交互功能

/**
 * 【小白修改指南】ProductsPageClient组件 - 产品页面主组件
 * 
 * 这个组件是产品页面的核心，负责展示所有产品并提供筛选、搜索、排序功能。
 * 
 * 【可以修改的内容】：
 * 1. 界面文字：
 *    - "Search products..." -> 改为你想要的搜索提示文字
 *    - "Sort by Name" -> 改为你想要的排序选项文字
 *    - "Loading products..." -> 改为你想要的加载提示文字
 * 
 * 2. 分类数据：
 *    - 修改categories数组中的分类信息
 *    - 调整count数字（表示该分类下有多少产品）
 *    - 添加或删除产品分类
 * 
 * 3. 显示设置：
 *    - 默认视图模式：'grid'（网格）或'list'（列表）
 *    - 默认排序方式：'name'（按名称）或'category'（按分类）
 * 
 * 【组件功能】：
 * - 产品搜索：用户可以输入关键词搜索产品
 * - 分类筛选：按产品分类筛选
 * - 视图切换：网格视图和列表视图切换
 * - 排序功能：按名称或分类排序
 * - 响应式设计：适配不同屏幕尺寸
 */

// 【重点】React模块导入 - 引入所需的功能
import React, { useState, useEffect, useCallback, useMemo } from 'react' // React核心功能和钩子
import { motion } from 'framer-motion' // 动画库，用于制作淡入淡出等动画效果
import { useSearchParams } from 'next/navigation' // Next.js路由参数获取
import ProductCard from '@/components/products/ProductCard' // 产品卡片组件
import ProductFilter from '@/components/products/ProductFilter' // 产品筛选器组件
import { Product as ApiProduct } from '@/lib/models' // 产品数据类型定义
import { clientCache } from '@/lib/cache' // 客户端缓存功能
import { HiViewGrid, HiViewList, HiSearch } from 'react-icons/hi' // Heroicons图标：网格视图、列表视图、搜索

// 【重点】分类数据类型定义 - 定义产品分类的结构
interface Category {
  id: string // 分类唯一标识
  name: string // 分类显示名称
  description: string // 分类描述
  count: number // 该分类下的产品数量
}

// 【重点】产品分类数据数组 - 定义所有可用的产品分类
// 【小白修改指南】要修改分类，直接编辑下面的数组：
// - id: 分类的唯一标识，用于程序内部识别
// - name: 分类的显示名称，用户看到的文字
// - description: 分类的描述信息
// - count: 该分类下有多少个产品（需要手动更新）
const categories: Category[] = [
  {
    id: 'all', // 【重要】"全部"分类，显示所有产品
    name: 'All Products', // 【可修改】分类名称
    description: 'Browse our complete range of protective cases', // 【可修改】分类描述
    count: 24 // 【可修改】总产品数量
  },
  {
    id: 'military', // 军用防护箱分类
    name: 'Military & Defense', // 【可修改】分类名称
    description: 'Rugged cases for military and defense applications', // 【可修改】分类描述
    count: 8 // 【可修改】该分类产品数量
  },
  {
    id: 'photography', // 摄影器材防护箱分类
    name: 'Photography & Video', // 【可修改】分类名称
    description: 'Professional cases for cameras and video equipment', // 【可修改】分类描述
    count: 6 // 【可修改】该分类产品数量
  },
  {
    id: 'electronics', // 电子设备防护箱分类
    name: 'Electronics & IT', // 【可修改】分类名称
    description: 'Protective cases for sensitive electronic equipment', // 【可修改】分类描述
    count: 5 // 【可修改】该分类产品数量
  },
  {
    id: 'medical', // 医疗设备防护箱分类
    name: 'Medical & Scientific', // 【可修改】分类名称
    description: 'Specialized cases for medical and scientific instruments', // 【可修改】分类描述
    count: 3 // 【可修改】该分类产品数量
  },
  {
    id: 'industrial', // 工业工具防护箱分类
    name: 'Industrial & Tools', // 【可修改】分类名称
    description: 'Heavy-duty cases for industrial tools and equipment', // 【可修改】分类描述
    count: 2 // 【可修改】该分类产品数量
  }
]

// 【重点】产品页面主组件 - 负责整个产品页面的逻辑和渲染
export default function ProductsPageClient() {
  // 【重点】获取URL参数 - 用于支持分享链接和书签功能
  const searchParams = useSearchParams()
  
  // 【重点】组件状态管理 - 记录页面的各种状态
  const [products, setProducts] = useState<ApiProduct[]>([]) // 存储从API获取的产品列表
  const [selectedCategory, setSelectedCategory] = useState('all') // 当前选中的分类，默认为"全部"
  const [searchTerm, setSearchTerm] = useState('') // 用户输入的搜索关键词
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid') // 显示模式：网格或列表，默认为网格
  const [sortBy, setSortBy] = useState('name') // 排序方式：按名称或分类，默认按名称
  const [loading, setLoading] = useState(true) // 是否正在加载数据

  // 【重点】产品数据获取函数 - 从API获取产品数据并实现缓存优化
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true) // 开始加载，显示加载状态
      
      // 【重点】缓存机制 - 先检查是否有缓存数据，避免重复请求
      const cacheKey = `products-${selectedCategory}-${searchTerm}-${sortBy}` // 根据筛选条件生成缓存键
      const cachedData = clientCache.get(cacheKey) // 尝试从缓存获取数据
      
      // 如果有缓存数据，直接使用缓存，提高页面响应速度
      if (cachedData && (cachedData as any).products) {
        // 【重点】数据格式转换 - 将API数据转换为组件需要的格式
        const transformedProducts = (cachedData as any).products.map((product: any) => ({
          ...product, // 保留原有数据
          specifications: { // 规格数据标准化
            dimensions: product.specifications?.['External Dimensions'] || 'N/A', // 外部尺寸
            weight: product.specifications?.['Weight'] || 'N/A', // 重量
            material: product.specifications?.['Material'] || 'N/A', // 材质
            waterproof: product.specifications?.['Protection Rating'] || 'N/A' // 防护等级
          }
        }))
        setProducts(transformedProducts) // 更新产品列表状态
        setLoading(false) // 结束加载状态
        return // 直接返回，不需要发送API请求
      }
      
      // 【重点】API数据获取 - 从服务器获取最新的产品数据
      const response = await fetch('/api/products') // 发送GET请求到产品API
      if (response.ok) { // 检查请求是否成功
        const data = await response.json() // 解析JSON响应
        
        // 【重点】缓存新数据 - 将获取的数据存入缓存，5分钟有效期
        clientCache.set(cacheKey, data, 5 * 60 * 1000) // 缓存5分钟
        
        // 【重点】数据格式转换 - 统一规格字段格式
        const transformedProducts = data.products.map((product: any) => ({
          ...product, // 保留原有数据
          specifications: { // 规格数据标准化
            dimensions: product.specifications?.['External Dimensions'] || 'N/A', // 外部尺寸
            weight: product.specifications?.['Weight'] || 'N/A', // 重量
            material: product.specifications?.['Material'] || 'N/A', // 材质
            waterproof: product.specifications?.['Protection Rating'] || 'N/A' // 防护等级
          }
        }))
        setProducts(transformedProducts) // 更新产品列表状态
      }
    } catch (error) {
      console.error('Failed to fetch products:', error) // 记录错误信息
    } finally {
      setLoading(false) // 无论成功失败都结束加载状态
    }
  }, [selectedCategory, searchTerm, sortBy]) // 依赖项：当分类、搜索词或排序方式改变时重新获取数据

  // 【重点】数据获取副作用 - 当依赖项改变时自动重新获取产品数据
  useEffect(() => {
    fetchProducts() // 调用数据获取函数
  }, [fetchProducts]) // 依赖fetchProducts函数

  // 【重点】URL参数处理 - 从URL参数中获取分类信息，支持直接链接访问
  useEffect(() => {
    const category = searchParams.get('category') || 'all' // 获取URL中的category参数，默认为'all'
    setSelectedCategory(category) // 更新选中的分类状态
  }, [searchParams]) // 依赖URL参数

  // 【重点】产品筛选和排序逻辑 - 使用useMemo优化性能，避免不必要的重新计算
  const filteredProducts = useMemo(() => {
    let filtered = products // 从所有产品开始筛选

    // 【重点】按分类筛选 - 如果选择了特定分类，只显示该分类的产品
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // 【重点】按搜索词筛选 - 在产品名称、描述和特性中搜索关键词
    if (searchTerm) {
      const term = searchTerm.toLowerCase() // 转换为小写以实现不区分大小写的搜索
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) || // 在产品名称中搜索
        product.description.toLowerCase().includes(term) || // 在产品描述中搜索
        (Array.isArray(product.features) && product.features.some(feature => 
          feature.toLowerCase().includes(term) // 在产品特性列表中搜索
        ))
      )
    }

    // 【重点】产品排序 - 根据用户选择的排序方式对产品进行排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name) // 按产品名称字母顺序排序
        case 'category':
          return a.category.localeCompare(b.category) // 按分类名称字母顺序排序
        default:
          return 0 // 保持原有顺序
      }
    })

    return filtered // 返回筛选和排序后的产品列表
  }, [products, selectedCategory, searchTerm, sortBy]) // 依赖项：当产品列表、选中分类、搜索词或排序方式改变时重新计算

  return (
    // 页面主容器
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* 英雄区域 */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 sm:py-16">
        {/* 响应式容器 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} // 动画初始状态
            animate={{ opacity: 1, y: 0 }} // 动画结束状态
            transition={{ duration: 0.6 }} // 动画持续时间
            className="text-center">
            {/* 【可修改】响应式标题，不同屏幕尺寸显示不同大小 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Our <span className="text-primary-400">Products</span>
            </h1>
            {/* 【可修改】副标题描述文字 */}
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              Discover our comprehensive range of protective cases designed for professionals 
              across various industries worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 【重点】主要内容容器 - 响应式布局，垂直内边距 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 【重点】布局容器 - 移动端垂直排列，桌面端水平排列 */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* 【重点】侧边栏筛选器 - 桌面端占1/4宽度，移动端全宽 */}
          <div className="lg:w-1/4">
            {/* 【重点】粘性定位 - 桌面端滚动时筛选器固定在顶部 */}
            <div className="lg:sticky lg:top-24">
              <ProductFilter
                categories={categories} // 传入分类数据
                selectedCategory={selectedCategory} // 传入当前选中的分类
                onCategoryChange={setSelectedCategory} // 传入分类改变的回调函数
              />
            </div>
          </div>

          {/* 【重点】主要内容区域 - 桌面端占3/4宽度，包含搜索、控制和产品列表 */}
          <div className="lg:w-3/4">
            {/* 【重点】搜索和控制区域 - 包含搜索框、排序选择和视图模式切换 */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
              {/* 垂直排列，间距4 */}
              <div className="flex flex-col gap-4">
                {/* 【重点】搜索框 - 支持在产品名称和描述中搜索 */}
                <div className="relative w-full">
                  {/* 搜索图标，绝对定位在输入框左侧 */}
                  <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search products..." // 【可修改】搜索框占位符文字
                    value={searchTerm} // 绑定搜索词状态
                    onChange={(e) => setSearchTerm(e.target.value)} // 【重点】搜索词改变时更新状态
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" // 全宽输入框，左侧留出图标空间
                  />
                </div>

                {/* 【重点】控制区域 - 包含排序和视图模式选择 */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
                  {/* 【重点】排序选择器 - 用户可以选择按名称或分类排序 */}
                  <select
                    value={sortBy} // 绑定排序方式状态
                    onChange={(e) => setSortBy(e.target.value)} // 【重点】排序方式改变时更新状态
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm">
                    <option value="name">Sort by Name</option>
                    <option value="category">Sort by Category</option>
                  </select>

                  {/* 【重点】视图模式切换 - 网格视图和列表视图切换 */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden w-fit">
                    <button
                      onClick={() => setViewMode('grid')} // 【重点】切换到网格视图
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                      aria-label="Grid view">
                      <HiViewGrid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')} // 【重点】切换到列表视图
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                      aria-label="List view">
                      <HiViewList className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 【重点】结果统计 - 显示当前筛选结果的数量信息 */}
              <div className="mt-3 sm:mt-4 text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
                {selectedCategory !== 'all' && (
                  <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0">
                    in <span className="font-medium">{categories.find(c => c.id === selectedCategory)?.name}</span>
                  </span>
                )}
              </div>
            </div>

            {/* 【重点】产品列表/网格 - 根据加载状态和筛选结果显示不同内容 */}
            {loading ? (
              // 【重点】加载状态 - 显示加载动画和提示文字
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              // 【重点】有产品时显示产品列表
              <motion.div
                initial={{ opacity: 0 }} // 动画初始状态：透明
                animate={{ opacity: 1 }} // 动画结束状态：完全显示
                transition={{ duration: 0.6 }} // 动画持续时间
                className={viewMode === 'grid' // 【重点】根据视图模式动态切换布局
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8' // 网格布局：响应式列数
                  : 'space-y-4 sm:space-y-6' // 列表布局：垂直间距
                }
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={String(product.id || product._id || index)} // 使用产品ID作为唯一键
                    initial={{ opacity: 0, y: 20 }} // 动画初始状态：透明且向下偏移
                    animate={{ opacity: 1, y: 0 }} // 动画结束状态：完全显示且回到原位
                    transition={{ duration: 0.6, delay: index * 0.1 }} // 【重点】错开动画：每个产品延迟0.1秒，形成波浪效果
                  >
                    <ProductCard product={product as any} viewMode={viewMode} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // 【重点】无产品时显示空状态
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <HiSearch className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or browse all products.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('') // 清空搜索词
                    setSelectedCategory('all') // 重置分类为全部
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}