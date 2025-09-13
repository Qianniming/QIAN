'use client' // 【重点】客户端组件声明 - 表示这个组件在浏览器中运行，可以使用交互功能

// 【重点】React模块导入 - 引入所需的功能
import { motion } from 'framer-motion' // 动画库，用于制作滑动动画
import { HiFilter, HiX } from 'react-icons/hi' // Heroicons图标库：过滤器和关闭图标
import { useState } from 'react' // React状态管理钩子

/**
 * 【小白修改指南】ProductFilter组件 - 产品筛选器组件
 * 
 * 这个组件负责产品页面的筛选功能，帮助用户快速找到想要的产品。
 * 
 * 【可以修改的内容】：
 * 1. 价格范围选项：
 *    - 修改priceRanges数组中的label文字
 *    - 添加或删除价格范围选项
 * 
 * 2. 产品特性选项：
 *    - 修改features数组中的label文字
 *    - 调整count数字（表示有多少产品具有该特性）
 *    - 添加或删除特性选项
 * 
 * 3. 防护等级选项：
 *    - 修改protectionRatings数组中的label文字
 *    - 调整count数字
 *    - 添加或删除防护等级选项
 * 
 * 4. 界面文字：
 *    - "Filters" -> 改为你想要的文字，如"筛选"
 *    - "Clear All" -> 改为你想要的文字，如"清除所有"
 *    - "Categories" -> 改为你想要的文字，如"分类"
 * 
 * 【组件作用】：
 * - 提供产品分类筛选
 * - 提供价格范围筛选
 * - 提供产品特性筛选
 * - 提供防护等级筛选
 * - 支持移动端和桌面端不同的显示方式
 */

// 分类数据类型定义
interface Category {
  id: string // 分类唯一标识
  name: string // 分类名称
  count: number // 该分类下的产品数量
}

// 组件属性类型定义
interface ProductFilterProps {
  categories: Category[] // 分类列表
  selectedCategory: string // 当前选中的分类
  onCategoryChange: (_category: string) => void // 分类改变时的回调函数
}

// 【重点】价格范围选项 - 【可修改】这里定义了价格筛选的选项
const priceRanges = [
  { id: 'all', label: 'All Prices' }, // 【可修改】"All Prices" -> "所有价格"
  { id: 'budget', label: 'Budget Friendly' }, // 【可修改】"Budget Friendly" -> "经济实惠"
  { id: 'mid', label: 'Mid Range' }, // 【可修改】"Mid Range" -> "中等价位"
  { id: 'premium', label: 'Premium' }, // 【可修改】"Premium" -> "高端产品"
]

// 【重点】产品特性选项 - 【可修改】这里定义了产品特性筛选的选项
const features = [
  { id: 'waterproof', label: 'Waterproof', count: 12 }, // 【可修改】防水特性
  { id: 'shockproof', label: 'Shock Resistant', count: 15 }, // 【可修改】抗震特性
  { id: 'lightweight', label: 'Lightweight', count: 8 }, // 【可修改】轻量化特性
  { id: 'custom', label: 'Custom Foam', count: 10 }, // 【可修改】定制泡沫特性
  { id: 'tsa', label: 'TSA Approved', count: 6 }, // 【可修改】TSA认证特性
  { id: 'military', label: 'Military Grade', count: 4 }, // 【可修改】军用级别特性
]

// 【重点】防护等级选项 - 【可修改】这里定义了防护等级筛选的选项
const protectionRatings = [
  { id: 'ip54', label: 'IP54', count: 3 }, // 【可修改】IP54防护等级
  { id: 'ip65', label: 'IP65', count: 5 }, // 【可修改】IP65防护等级
  { id: 'ip66', label: 'IP66', count: 4 }, // 【可修改】IP66防护等级
  { id: 'ip67', label: 'IP67', count: 6 }, // 【可修改】IP67防护等级
  { id: 'ip68', label: 'IP68', count: 2 }, // 【可修改】IP68防护等级
  { id: 'milstd', label: 'MIL-STD', count: 3 }, // 【可修改】军用标准防护等级
]

// 【重点】产品筛选器主组件 - 负责管理所有筛选功能
export default function ProductFilter({ categories, selectedCategory, onCategoryChange }: ProductFilterProps) {
  // 【重点】组件状态管理 - 记录用户的筛选选择
  const [isOpen, setIsOpen] = useState(false) // 移动端筛选面板是否打开
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]) // 已选择的产品特性
  const [selectedPriceRange, setSelectedPriceRange] = useState('all') // 已选择的价格范围
  const [selectedProtection, setSelectedProtection] = useState<string[]>([]) // 已选择的防护等级

  // 【重点】特性筛选切换函数 - 处理用户点击特性选项
  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId) // 如果已选择，则取消选择
        : [...prev, featureId] // 如果未选择，则添加到选择列表
    )
  }

  // 【重点】防护等级筛选切换函数 - 处理用户点击防护等级选项
  const toggleProtection = (protectionId: string) => {
    setSelectedProtection(prev => 
      prev.includes(protectionId) 
        ? prev.filter(id => id !== protectionId) // 如果已选择，则取消选择
        : [...prev, protectionId] // 如果未选择，则添加到选择列表
    )
  }

  // 【重点】清除所有筛选条件函数 - 重置所有筛选选项到默认状态
  const clearAllFilters = () => {
    onCategoryChange('all') // 重置分类为"全部"
    setSelectedFeatures([]) // 清空特性选择
    setSelectedPriceRange('all') // 重置价格范围为"全部"
    setSelectedProtection([]) // 清空防护等级选择
  }

  // 【重点】检查是否有激活的筛选条件 - 用于显示"清除所有"按钮和筛选数量
  const hasActiveFilters = selectedCategory !== 'all' || selectedFeatures.length > 0 || selectedPriceRange !== 'all' || selectedProtection.length > 0

  return (
    <>
      {/* 【重点】移动端筛选按钮 - 小屏幕设备上显示的筛选触发按钮 */}
      <div className="lg:hidden mb-4 sm:mb-6">
        <button
          onClick={() => setIsOpen(true)} // 点击打开移动端筛选面板
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors duration-300 text-sm sm:text-base"
        >
          <HiFilter className="h-4 w-4 sm:h-5 sm:w-5" /> {/* 筛选图标 */}
          <span>Filters</span> {/* 【可修改】按钮文字 */}
          {/* 【重点】筛选数量徽章 - 显示当前激活的筛选条件数量 */}
          {hasActiveFilters && (
            <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
              {/* 计算所有激活筛选条件的总数 */}
              {[selectedCategory !== 'all' ? 1 : 0, selectedFeatures.length, selectedPriceRange !== 'all' ? 1 : 0, selectedProtection.length].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </button>
      </div>

      {/* 【重点】移动端筛选覆盖层 - 从左侧滑出的全屏筛选面板 */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
          {/* 【重点】动画筛选面板 - 使用framer-motion实现滑动动画 */}
          <motion.div
            initial={{ x: '-100%' }} // 初始位置：完全隐藏在左侧
            animate={{ x: 0 }} // 动画目标：滑动到正常位置
            exit={{ x: '-100%' }} // 退出动画：滑动回左侧隐藏
            className="bg-white h-full w-full max-w-sm overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()} // 阻止点击面板内容时关闭面板
          >
            <div className="p-4 sm:p-6">
              {/* 【重点】筛选面板头部 - 包含标题和关闭按钮，固定在顶部 */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 bg-white pb-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold">Filters</h3> {/* 【可修改】面板标题 */}
                <button
                  onClick={() => setIsOpen(false)} // 点击关闭筛选面板
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300 -mr-2"
                >
                  <HiX className="h-6 w-6" /> {/* 关闭图标 */}
                </button>
              </div>
              {/* 【重点】筛选内容组件 - 包含所有筛选选项 */}
              <FilterContent
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
                selectedFeatures={selectedFeatures}
                toggleFeature={toggleFeature}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={setSelectedPriceRange}
                selectedProtection={selectedProtection}
                toggleProtection={toggleProtection}
                clearAllFilters={clearAllFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* 【重点】桌面端筛选侧边栏 - 大屏幕设备上显示的固定筛选面板 */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* 【重点】筛选面板头部 - 包含标题和清除按钮 */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Filters</h3> {/* 【可修改】面板标题 */}
            {/* 【重点】清除所有筛选按钮 - 只在有激活筛选时显示 */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters} // 点击清除所有筛选条件
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Clear All {/* 【可修改】按钮文字 */}
              </button>
            )}
          </div>
          {/* 【重点】筛选内容组件 - 包含所有筛选选项 */}
          <FilterContent
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            selectedFeatures={selectedFeatures}
            toggleFeature={toggleFeature}
            selectedPriceRange={selectedPriceRange}
            setSelectedPriceRange={setSelectedPriceRange}
            selectedProtection={selectedProtection}
            toggleProtection={toggleProtection}
            clearAllFilters={clearAllFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </div>
    </>
  )
}

// 【重点】筛选内容组件的属性类型定义 - 定义所有筛选功能需要的数据和函数
interface FilterContentProps {
  categories: Category[] // 产品分类列表
  selectedCategory: string // 当前选中的分类ID
  onCategoryChange: (_category: string) => void // 分类改变时的回调函数
  selectedFeatures: string[] // 已选择的产品特性列表
  toggleFeature: (_featureId: string) => void // 切换特性选择的函数
  selectedPriceRange: string // 当前选中的价格范围
  setSelectedPriceRange: (_range: string) => void // 设置价格范围的函数
  selectedProtection: string[] // 已选择的防护等级列表
  toggleProtection: (_protectionId: string) => void // 切换防护等级选择的函数
  clearAllFilters: () => void // 清除所有筛选条件的函数
  hasActiveFilters: boolean // 是否有激活的筛选条件
}

// 【重点】筛选内容组件 - 包含所有具体的筛选选项界面
function FilterContent({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedFeatures,
  toggleFeature,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedProtection,
  toggleProtection,
  clearAllFilters,
  hasActiveFilters
}: FilterContentProps) {
  return (
    <div className="space-y-6 sm:space-y-8"> {/* 各筛选模块之间的间距，响应式设计 */}
      {/* 【重点】分类筛选模块 - 让用户选择产品分类 */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Categories</h4> {/* 【可修改】分类标题 */}
        <div className="space-y-2"> {/* 分类按钮之间的间距 */}
          {/* 【重点】遍历所有分类生成按钮 - 为每个分类创建一个选择按钮 */}
          {categories.map((category) => (
            <button
              key={category.id} // 使用分类ID作为唯一标识
              onClick={() => onCategoryChange(category.id)} // 点击选择该分类
              className={`w-full text-left px-3 py-3 sm:py-2 rounded-lg transition-all duration-300 flex items-center justify-between touch-manipulation ${
                selectedCategory === category.id
                  ? 'bg-primary-100 text-primary-700 font-medium' // 选中状态样式：蓝色背景和文字
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' // 未选中状态样式：灰色文字，悬停时变色
              }`}
            >
              <span className="text-sm sm:text-base">{category.name}</span> {/* 显示分类名称 */}
              {/* 【重点】产品数量徽章 - 显示该分类下有多少产品 */}
              <span className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-primary-200 text-primary-800' // 选中状态的徽章样式
                  : 'bg-gray-200 text-gray-600' // 未选中状态的徽章样式
              }`}>
                {category.count} {/* 显示产品数量 */}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 【重点】价格范围筛选模块 - 让用户按价格筛选产品 */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Price Range</h4> {/* 【可修改】价格筛选标题 */}
        <div className="space-y-2"> {/* 价格选项之间的间距 */}
          {/* 【重点】遍历价格范围选项 - 为每个价格范围创建单选按钮 */}
          {priceRanges.map((range) => (
            <label key={range.id} className="flex items-center space-x-3 cursor-pointer py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors duration-200 touch-manipulation">
              <input
                type="radio" // 单选按钮类型，只能选择一个价格范围
                name="priceRange" // 单选按钮组名称，确保只能选择一个
                value={range.id} // 价格范围的唯一标识值
                checked={selectedPriceRange === range.id} // 检查该价格范围是否被选中
                onChange={(e) => setSelectedPriceRange(e.target.value)} // 选择时更新价格范围状态
                className="text-primary-600 focus:ring-primary-500 w-4 h-4 sm:w-auto sm:h-auto" // 单选按钮样式
              />
              <span className="text-gray-600 text-sm sm:text-base">{range.label}</span> {/* 显示价格范围标签 */}
            </label>
          ))}
        </div>
      </div>

      {/* 【重点】产品特性筛选模块 - 让用户按功能特性筛选产品 */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Features</h4> {/* 【可修改】特性筛选标题 */}
        <div className="space-y-2"> {/* 特性选项之间的间距 */}
          {/* 【重点】遍历产品特性选项 - 为每个特性创建复选框，支持多选 */}
          {features.map((feature) => (
            <label key={feature.id} className="flex items-center space-x-3 cursor-pointer py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors duration-200 touch-manipulation">
              <input
                type="checkbox" // 复选框类型，允许同时选择多个特性
                checked={selectedFeatures.includes(feature.id)} // 检查该特性是否在已选择列表中
                onChange={() => toggleFeature(feature.id)} // 点击时切换特性选择状态
                className="text-primary-600 focus:ring-primary-500 rounded w-4 h-4 sm:w-auto sm:h-auto" // 复选框样式
              />
              <span className="text-gray-600 flex-1 text-sm sm:text-base">{feature.label}</span> {/* 显示特性名称，如"防水"、"抗震" */}
              <span className="text-xs text-gray-400">({feature.count})</span> {/* 显示具有该特性的产品数量 */}
            </label>
          ))}
        </div>
      </div>

      {/* 【重点】防护等级筛选模块 - 让用户按防护等级筛选产品 */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Protection Rating</h4> {/* 【可修改】防护等级筛选标题 */}
        <div className="space-y-2"> {/* 防护等级选项之间的间距 */}
          {/* 【重点】遍历防护等级选项 - 为每个等级创建复选框，支持多选 */}
          {protectionRatings.map((protection) => (
            <label key={protection.id} className="flex items-center space-x-3 cursor-pointer py-2 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors duration-200 touch-manipulation">
              <input
                type="checkbox" // 复选框类型，允许同时选择多个防护等级
                checked={selectedProtection.includes(protection.id)} // 检查该防护等级是否在已选择列表中
                onChange={() => toggleProtection(protection.id)} // 点击时切换防护等级选择状态
                className="text-primary-600 focus:ring-primary-500 rounded w-4 h-4 sm:w-auto sm:h-auto" // 复选框样式
              />
              <span className="text-gray-600 flex-1 text-sm sm:text-base">{protection.label}</span> {/* 显示防护等级名称，如"IP67"、"军用级" */}
              <span className="text-xs text-gray-400">({protection.count})</span> {/* 显示具有该防护等级的产品数量 */}
            </label>
          ))}
        </div>
      </div>

      {/* 【重点】清除筛选按钮 - 重置所有筛选条件到默认状态 */}
      {hasActiveFilters && ( // 只在有激活的筛选条件时显示此按钮
        <button
          onClick={clearAllFilters} // 点击时调用清除所有筛选条件的函数
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 sm:py-2 px-4 rounded-lg font-medium transition-colors duration-300 touch-manipulation text-sm sm:text-base"
        >
          Clear All Filters {/* 【可修改】清除按钮文字 */}
        </button>
      )}
    </div>
  )
}