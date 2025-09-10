'use client'

// 【重点】这个文件是网站的导航栏组件，相当于网站的"菜单栏"
// 导入React的功能模块
import { useState, useEffect } from 'react' // useState用于管理状态，useEffect用于监听页面滚动
import Link from 'next/link' // Next.js的链接组件，用于页面跳转
import { usePathname } from 'next/navigation' // 获取当前页面路径，用于高亮当前菜单
import { HiMenu, HiX } from 'react-icons/hi' // 导入汉堡菜单图标（三条横线）和关闭图标（X）

// 【重点】【修改入口】导航菜单配置 - 如果要修改菜单项，就在这里改
// name: 显示的菜单名称（可以改成中文）
// href: 点击后跳转的页面路径
const navigation = [
  { name: 'Home', href: '/' }, // 首页菜单
  { name: 'Products', href: '/products' }, // 产品页面菜单
  { name: 'About Us', href: '/about' }, // 关于我们页面菜单
  { name: 'Quality & Safety', href: '/quality' }, // 质量安全页面菜单
  { name: 'Contact Us', href: '/contact' }, // 联系我们页面菜单
]

// 【重点】导航栏主组件函数 - 这是整个导航栏的"大脑"
export default function Navbar() {
  // 状态管理：相当于记忆功能，记住当前的状态
  const [isOpen, setIsOpen] = useState(false) // 记住手机菜单是否打开（false=关闭，true=打开）
  const [isScrolled, setIsScrolled] = useState(false) // 记住页面是否滚动了（用于改变导航栏样式）
  const pathname = usePathname() // 获取当前页面的路径，比如"/products"表示在产品页面

  // 【重点】监听页面滚动的功能 - 相当于"眼睛"，时刻观察用户是否滚动页面
  useEffect(() => {
    // 处理滚动的函数：当用户滚动页面时执行
    const handleScroll = () => {
      // 如果滚动距离超过10像素，就改变导航栏样式（变成白色背景）
      setIsScrolled(window.scrollY > 10)
    }

    // 给浏览器窗口添加滚动监听器，相当于"安装眼睛"
    window.addEventListener('scroll', handleScroll)
    // 组件销毁时移除监听器，相当于"卸载眼睛"，避免内存泄漏
    return () => window.removeEventListener('scroll', handleScroll)
  }, []) // 空数组表示只在组件加载时执行一次

  // 切换手机菜单开关的函数 - 相当于"开关按钮"
  const toggleMenu = () => {
    setIsOpen(!isOpen) // 如果菜单是关闭的就打开，如果是打开的就关闭
  }

  // 判断是否在首页
  const isHomePage = pathname === '/'
  // 根据页面和滚动状态决定是否使用深色主题
  const isDarkTheme = isHomePage ? !isScrolled : false

  // 【重点】返回导航栏的HTML结构 - 这是用户看到的导航栏外观
  return (
    // 导航栏容器：固定在页面顶部，始终可见
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled || !isHomePage
        ? 'bg-white/95 backdrop-blur-md shadow-lg' // 滚动后或非首页：白色半透明背景+模糊效果+阴影
        : 'bg-transparent' // 首页未滚动时：透明背景
    }`}>
      {/* 导航栏内容容器：限制最大宽度，居中显示 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 导航栏主要内容：左右分布（Logo在左，菜单在右） */}
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* 【重点】【修改入口】网站Logo区域 - 要改公司名称就在这里改 */}
          <div className="flex-shrink-0">
            {/* 点击Logo跳转到首页 */}
            <Link href="/" className="flex items-center">
              <div className="text-2xl lg:text-3xl font-bold">
                {/* 公司名称主体部分：根据页面和滚动状态改变颜色 */}
                <span className={`transition-colors duration-300 ${
                  isDarkTheme ? 'text-white' : 'text-gray-900' // 首页未滚动时白色，其他情况黑色
                }`}>
                  WELL-LI {/* 【修改入口】这里改公司名称 */}
                </span>
                {/* 公司名称后缀部分：始终保持蓝色 */}
                <span className="text-primary-600 ml-2">Cases</span> {/* 【修改入口】这里改公司名称后缀 */}
              </div>
            </Link>
          </div>

          {/* 【重点】电脑版导航菜单 - 只在大屏幕（电脑）上显示 */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {/* 遍历导航菜单数组，为每个菜单项创建链接 */}
              {navigation.map((item) => {
                // 判断当前菜单项是否是当前页面（用于高亮显示）
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name} // React要求的唯一标识
                    href={item.href} // 点击后跳转的页面
                    className={`px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      isActive
                        ? 'text-primary-600 border-b-2 border-primary-600' // 当前页面：蓝色文字+底部蓝线
                        : isDarkTheme
                        ? 'text-white hover:text-primary-200' // 首页未滚动：白色文字，悬停变浅蓝
                        : 'text-gray-700 hover:text-primary-600' // 其他情况：灰色文字，悬停变蓝
                    }`}
                  >
                    {item.name} {/* 显示菜单名称 */}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* 【重点】手机版菜单按钮 - 只在小屏幕（手机）上显示 */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu} // 点击时切换菜单开关
              className={`p-2 rounded-md transition-colors duration-300 ${
                isDarkTheme
                  ? 'text-white hover:text-primary-200' // 首页未滚动：白色，悬停变浅蓝
                  : 'text-gray-700 hover:text-primary-600' // 其他情况：灰色，悬停变蓝
              }`}
            >
              {/* 根据菜单状态显示不同图标 */}
              {isOpen ? (
                <HiX className="h-6 w-6" /> // 菜单打开时显示X图标
              ) : (
                <HiMenu className="h-6 w-6" /> // 菜单关闭时显示汉堡图标（三条横线）
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 【重点】手机版下拉菜单 - 只在小屏幕上显示，可以展开收起 */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isOpen 
          ? 'max-h-96 opacity-100' // 菜单打开：显示完整高度，完全不透明
          : 'max-h-0 opacity-0 overflow-hidden' // 菜单关闭：高度为0，完全透明，隐藏溢出内容
      }`}>
        {/* 手机菜单内容容器：白色半透明背景 */}
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md shadow-lg">
          {/* 遍历导航菜单，创建手机版菜单项 */}
          {navigation.map((item) => {
            const isActive = pathname === item.href // 判断是否为当前页面
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-300 ${
                  isActive
                    ? 'text-primary-600 bg-primary-50' // 当前页面：蓝色文字+浅蓝背景
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50' // 其他页面：灰色文字，悬停变蓝+浅灰背景
                }`}
                onClick={() => setIsOpen(false)} // 点击菜单项后自动关闭菜单
              >
                {item.name} {/* 显示菜单名称 */}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

/**
 * 【重点】【小白修改指南】
 * 
 * 1. 修改菜单项：
 *    - 找到文件顶部的 navigation 数组
 *    - 修改 name 字段改变显示的菜单名称
 *    - 修改 href 字段改变跳转的页面路径
 * 
 * 2. 修改公司名称：
 *    - 找到 "WELL-LI" 文字，改成你的公司名
 *    - 找到 "Cases" 文字，改成你想要的后缀
 * 
 * 3. 修改颜色：
 *    - text-primary-600 是主要蓝色，可以在 tailwind.config.js 中修改
 *    - text-white 是白色文字
 *    - text-gray-700 是深灰色文字
 * 
 * 4. 这个组件的作用：
 *    - 在网站顶部显示导航菜单
 *    - 响应式设计：电脑上显示横向菜单，手机上显示汉堡菜单
 *    - 滚动时改变样式：从透明变成白色背景
 *    - 高亮当前页面的菜单项
 */