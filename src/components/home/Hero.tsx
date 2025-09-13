'use client'

// 【重点】这是首页的英雄区域组件 - 网站最重要的展示区域，相当于"门面"
// 导入React功能模块
import { useState, useEffect } from 'react' // 状态管理和生命周期
import Link from 'next/link' // Next.js页面跳转组件
import { motion } from 'framer-motion' // 动画效果库，让页面更生动
import { HiArrowRight, HiPlay } from 'react-icons/hi' // 箭头和播放图标

// 【重点】【修改入口】轮播图片和文字配置 - 要换图片和文字就在这里改
// 这个数组控制首页大图轮播的内容
const heroImages = [
  {
    url: '/images/hero-1.jpg', // 【修改入口】第一张图片路径（图片放在public/images/文件夹）
    title: 'Reliable Protective Cases Manufacturer', // 【修改入口】第一张图的主标题
    subtitle: 'Customized Safety Cases for Global Clients' // 【修改入口】第一张图的副标题
  },
  {
    url: '/images/hero-2.jpg', // 【修改入口】第二张图片路径
    title: 'Professional Grade Protection', // 【修改入口】第二张图的主标题
    subtitle: 'Waterproof & Dustproof Solutions' // 【修改入口】第二张图的副标题
  },
  {
    url: '/images/hero-3.jpg', // 【修改入口】第三张图片路径
    title: 'Custom Manufacturing Excellence', // 【修改入口】第三张图的主标题
    subtitle: 'Tailored Cases for Every Industry' // 【修改入口】第三张图的副标题
  }
]

// 【重点】英雄区域主组件函数
export default function Hero() {
  // 状态管理：记住当前显示第几张图片（从0开始计数）
  const [currentSlide, setCurrentSlide] = useState(0)

  // 【重点】自动轮播功能 - 相当于"自动翻页器"
  useEffect(() => {
    // 设置定时器，每10秒自动切换到下一张图片
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length) // 循环播放，到最后一张后回到第一张
    }, 10000) // 10000毫秒 = 10秒

    // 组件销毁时清除定时器，避免内存泄漏
    return () => clearInterval(timer)
  }, []) // 空数组表示只在组件加载时执行一次

  // 手动切换到下一张图片的函数
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length) // 循环到下一张
  }

  // 手动切换到上一张图片的函数
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length) // 循环到上一张
  }

  // 【重点】返回英雄区域的HTML结构
  return (
    // 主容器：全屏高度，内容居中，顶部留出导航栏空间
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20">
      {/* 【重点】背景图片轮播区域 */}
      <div className="absolute inset-0">
        {/* 遍历图片数组，为每张图片创建背景层 */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0' // 当前图片完全显示，其他图片透明
            }`}
          >
            {/* 背景图片容器：添加黑色遮罩让文字更清晰 */}
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                // 渐变遮罩 + 背景图片：让文字在图片上更清晰可读
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${image.url}')`
              }}
            />
          </div>
        ))}
      </div>

      {/* 【重点】前景内容区域 - 显示在图片上方的文字和按钮 */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题和副标题区域：带淡入动画效果 */}
        <motion.div
          key={currentSlide} // 每次切换图片时重新播放动画
          initial={{ opacity: 0, y: 30 }} // 初始状态：透明，向下偏移30像素
          animate={{ opacity: 1, y: 0 }} // 动画结束状态：完全显示，回到原位
          transition={{ duration: 0.8 }} // 动画持续0.8秒
        >
          {/* 【重点】主标题：响应式字体大小，从手机到电脑逐渐变大 */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
            {heroImages[currentSlide].title} {/* 显示当前图片对应的标题 */}
          </h1>
          {/* 副标题：比主标题小一些，颜色稍浅 */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 text-gray-200 font-light px-4">
            {heroImages[currentSlide].subtitle} {/* 显示当前图片对应的副标题 */}
          </p>
        </motion.div>

        {/* 【重点】【修改入口】行动按钮区域 - 引导用户进行下一步操作 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} // 初始状态：透明，向下偏移
          animate={{ opacity: 1, y: 0 }} // 动画结束：完全显示，回到原位
          transition={{ duration: 0.8, delay: 0.3 }} // 延迟0.3秒后开始动画
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4"
        >
          {/* 主要按钮：跳转到产品页面 */}
          <Link
            href="/products" // 【修改入口】点击后跳转的页面路径
            className="group bg-primary-600 hover:bg-primary-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 flex items-center space-x-2 btn-hover w-full sm:w-auto justify-center"
          >
            <span>Explore Products</span> {/* 【修改入口】按钮文字 */}
            {/* 箭头图标：悬停时向右移动 */}
            <HiArrowRight className="h-4 sm:h-5 w-4 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          
          {/* 次要按钮：观看视频（可以改成其他功能） */}
          <button className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 flex items-center space-x-2 btn-hover w-full sm:w-auto justify-center">
            <HiPlay className="h-4 sm:h-5 w-4 sm:w-5" /> {/* 播放图标 */}
            <span>Watch Video</span> {/* 【修改入口】按钮文字 */}
          </button>
        </motion.div>

        {/* 【重点】【修改入口】公司数据展示区域 - 展示公司实力和成就 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} // 初始状态：透明，向下偏移
          animate={{ opacity: 1, y: 0 }} // 动画结束：完全显示
          transition={{ duration: 0.8, delay: 0.6 }} // 延迟0.6秒后开始动画
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16 px-4"
        >
          {/* 第一个数据：经验年数 */}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-400 mb-1 sm:mb-2">15+</div> {/* 【修改入口】数字 */}
            <div className="text-gray-300 text-sm sm:text-base">Years Experience</div> {/* 【修改入口】描述文字 */}
          </div>
          {/* 第二个数据：客户数量 */}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-400 mb-1 sm:mb-2">500+</div> {/* 【修改入口】数字 */}
            <div className="text-gray-300 text-sm sm:text-base">Global Clients</div> {/* 【修改入口】描述文字 */}
          </div>
          {/* 第三个数据：产品交付数量 */}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-400 mb-1 sm:mb-2">1000+</div> {/* 【修改入口】数字 */}
            <div className="text-gray-300 text-sm sm:text-base">Products Delivered</div> {/* 【修改入口】描述文字 */}
          </div>
        </motion.div>
      </div>

      {/* 【重点】轮播指示点 - 显示当前是第几张图，可以点击切换 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {/* 为每张图片创建一个指示点 */}
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)} // 点击切换到对应图片
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-primary-500 scale-125' // 当前图片：蓝色，稍大
                : 'bg-white/50 hover:bg-white/75' // 其他图片：半透明白色，悬停变亮
            }`}
          />
        ))}
      </div>

      {/* 【重点】左右切换箭头 - 手动控制图片切换 */}
      {/* 左箭头：切换到上一张图片 */}
      <button
        onClick={prevSlide} // 点击切换到上一张
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-300 z-20 p-2 sm:p-1 rounded-full bg-black/20 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none"
      >
        {/* 左箭头SVG图标 */}
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* 右箭头：切换到下一张图片 */}
      <button
        onClick={nextSlide} // 点击切换到下一张
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-300 z-20 p-2 sm:p-1 rounded-full bg-black/20 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none"
      >
        {/* 右箭头SVG图标 */}
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 滚动提示器 - 提醒用户可以向下滚动查看更多内容 */}
      <motion.div
        initial={{ opacity: 0 }} // 初始透明
        animate={{ opacity: 1 }} // 淡入显示
        transition={{ duration: 1, delay: 1 }} // 延迟1秒后开始动画
        className="hidden sm:block absolute bottom-8 right-8 text-white/70 z-20" // 只在大屏幕显示
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm font-medium">Scroll</span> {/* "滚动"文字提示 */}
          {/* 动态滚动线条：上下移动提示滚动方向 */}
          <motion.div
            animate={{ y: [0, 8, 0] }} // 垂直移动动画：0→8→0像素
            transition={{ duration: 1.5, repeat: Infinity }} // 1.5秒循环，无限重复
            className="w-px h-8 bg-white/50" // 细线条样式
          />
        </div>
      </motion.div>
    </section>
  )
}

/**
 * 【重点】【小白修改指南】
 * 
 * 1. 修改轮播图片和文字：
 *    - 找到文件顶部的 heroImages 数组
 *    - 修改 url 字段更换图片（图片放在 public/images/ 文件夹）
 *    - 修改 title 和 subtitle 字段更换标题和副标题
 * 
 * 2. 修改按钮：
 *    - "Explore Products" 按钮的跳转链接在 href="/products"
 *    - "Watch Video" 按钮可以改成其他功能
 *    - 按钮文字直接修改 <span> 标签内的内容
 * 
 * 3. 修改公司数据：
 *    - 找到统计数据区域的三个 <div>
 *    - 修改数字（如 "15+"、"500+"）和描述文字
 * 
 * 4. 调整轮播设置：
 *    - 修改 setInterval 的 5000 可以改变自动切换时间（毫秒）
 *    - 可以添加或删除 heroImages 数组中的图片
 * 
 * 5. 这个组件的作用：
 *    - 展示公司最重要的信息和卖点
 *    - 自动轮播多张图片吸引用户注意
 *    - 引导用户进行下一步操作（查看产品、联系等）
 *    - 展示公司实力数据建立信任
 */