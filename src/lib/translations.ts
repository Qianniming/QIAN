// Translation keys and values
export type TranslationKey = 
  | 'nav.home'
  | 'nav.products'
  | 'nav.about'
  | 'nav.quality'
  | 'nav.contact'
  | 'common.learnMore'
  | 'common.contactUs'
  | 'common.getQuote'
  | 'common.viewAll'
  | 'common.loading'
  | 'common.error'
  | 'hero.title'
  | 'hero.subtitle'
  | 'hero.cta'
  | 'products.title'
  | 'products.subtitle'
  | 'about.title'
  | 'about.subtitle'
  | 'quality.title'
  | 'quality.subtitle'
  | 'contact.title'
  | 'contact.subtitle'
  | 'footer.company'
  | 'footer.quickLinks'
  | 'footer.contact'
  | 'footer.followUs'

export const translations = {
  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.about': 'About Us',
    'nav.quality': 'Quality & Safety',
    'nav.contact': 'Contact',
    'common.learnMore': 'Learn More',
    'common.contactUs': 'Contact Us',
    'common.getQuote': 'Get Quote',
    'common.viewAll': 'View All',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'hero.title': 'Professional Protective Cases',
    'hero.subtitle': 'Leading manufacturer of high-quality protective cases, safety cases, and custom solutions for global clients.',
    'hero.cta': 'Explore Products',
    'products.title': 'Our Products',
    'products.subtitle': 'Discover our comprehensive range of protective cases',
    'about.title': 'About WELL-LI',
    'about.subtitle': 'Learn about our company story and values',
    'quality.title': 'Quality & Safety',
    'quality.subtitle': 'Our commitment to excellence and safety standards',
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in touch for inquiries and support',
    'footer.company': 'Company',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact Info',
    'footer.followUs': 'Follow Us',
  },
  zh: {
    'nav.home': '首页',
    'nav.products': '产品中心',
    'nav.about': '关于我们',
    'nav.quality': '质量与安全',
    'nav.contact': '联系我们',
    'common.learnMore': '了解更多',
    'common.contactUs': '联系我们',
    'common.getQuote': '获取报价',
    'common.viewAll': '查看全部',
    'common.loading': '加载中...',
    'common.error': '发生错误',
    'hero.title': '专业防护箱制造商',
    'hero.subtitle': '为全球客户提供高品质防护箱、安全箱和定制解决方案的领先制造商。',
    'hero.cta': '浏览产品',
    'products.title': '我们的产品',
    'products.subtitle': '探索我们全面的防护箱产品系列',
    'about.title': '关于威力',
    'about.subtitle': '了解我们的公司故事和价值观',
    'quality.title': '质量与安全',
    'quality.subtitle': '我们对卓越和安全标准的承诺',
    'contact.title': '联系我们',
    'contact.subtitle': '如有咨询和支持需求，请联系我们',
    'footer.company': '公司',
    'footer.quickLinks': '快速链接',
    'footer.contact': '联系信息',
    'footer.followUs': '关注我们',
  },
} as const

// Get translation function
export function getTranslation(locale: 'en' | 'zh') {
  return function t(key: TranslationKey): string {
    return translations[locale][key] || translations.en[key] || key
  }
}