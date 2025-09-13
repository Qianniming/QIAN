// 【重点】数据库种子数据文件 - 为数据库提供初始示例数据
// 这个文件包含了NANUK保护箱网站的所有示例产品和分类数据

import { getDatabase, COLLECTIONS, initializeDatabase } from './mongodb' // 数据库连接和集合管理
import { Product, Category } from './models' // 产品和分类的数据模型

// 【重点】示例产品数据 - 包含完整的产品信息用于网站展示
// 每个产品包含详细的规格、特性、应用场景等信息
export const sampleProducts: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
    // 【重点】NANUK 910 小型保护箱 - 轻量级专业设备保护
    name: 'NANUK 910 Protective Case', // 产品名称
    slug: 'nanuk-910-protective-case', // URL友好的产品标识符
    category: 'Small Cases', // 产品分类：小型箱子
    subcategory: 'Handheld Cases', // 子分类：手持设备箱
    description: 'Ultra-lightweight and virtually unbreakable protective case for small equipment.', // 简短描述
    longDescription: 'The NANUK 910 is designed for professionals who demand the highest level of protection for their valuable equipment. Built with NK-7 resin, this case offers superior impact resistance while maintaining a lightweight profile.', // 详细描述
    images: [ // 产品图片列表
      '/images/products/military-case-1.svg', // 主要产品图片 - 使用现有SVG
      '/images/products/industrial-case-1.svg', // 侧面视图
      '/images/products/tool-case-1.svg'  // 内部结构图
    ],
    specifications: { // 【重点】产品技术规格 - 详细的技术参数
      'External Dimensions': '13.8" × 11.6" × 6.0" (35.1 × 29.5 × 15.2 cm)', // 外部尺寸
      'Internal Dimensions': '12.0" × 9.5" × 4.5" (30.5 × 24.1 × 11.4 cm)', // 内部尺寸
      'Weight': '3.3 lbs (1.5 kg)', // 重量
      'Volume': '2.4 L', // 容积
      'Material': 'NK-7 Resin', // 材料：NK-7树脂
      'Protection Rating': 'IP67', // 防护等级：防水防尘
      'Temperature Range': '-40°F to +140°F (-40°C to +60°C)', // 工作温度范围
      'Pressure Relief': 'Automatic' // 自动压力释放
    },
    features: [ // 【重点】产品特性 - 核心功能和优势
      'Waterproof and dustproof (IP67)', // 防水防尘（IP67级别）
      'Impact resistant NK-7 resin shell', // 抗冲击NK-7树脂外壳
      'PowerClaw superior latching system', // PowerClaw优质锁扣系统
      'Integrated bezel system', // 集成边框系统
      'Automatic pressure relief valve', // 自动压力释放阀
      'Soft grip ergonomic handle', // 软握人体工学手柄
      'Stainless steel hardware', // 不锈钢五金件
      'Lifetime warranty' // 终身保修
    ],
    applications: [ // 【重点】应用场景 - 适用的设备和行业
      'Photography Equipment', // 摄影设备
      'Electronic Devices', // 电子设备
      'Medical Instruments', // 医疗器械
      'Scientific Equipment', // 科学仪器
      'Military & Defense', // 军用和国防
      'Industrial Tools' // 工业工具
    ],
    certifications: [
      'IP67 Waterproof Rating',
      'MIL-STD-810G',
      'STANAG 4280',
      'ATA 300',
      'IATA Compliant'
    ],
    colors: [
      { name: 'Black', code: '#000000' },
      { name: 'Orange', code: '#FF6B35' },
      { name: 'Yellow', code: '#FFD23F' },
      { name: 'Olive', code: '#8B8C7A' }
    ],
    accessories: [
      'Foam Insert Set',
      'Padded Divider Set',
      'Shoulder Strap',
      'Wheels Kit',
      'TSA Lock'
    ],
    dimensions: {
      external: {
        length: 35.1,
        width: 29.5,
        height: 15.2,
        unit: 'cm'
      },
      internal: {
        length: 30.5,
        width: 24.1,
        height: 11.4,
        unit: 'cm'
      }
    },
    weight: {
      value: 1.5,
      unit: 'kg'
    },
    volume: {
      value: 2.4,
      unit: 'L'
    },
    protectionRating: 'IP67',
    temperatureRange: {
      min: -40,
      max: 60,
      unit: 'C'
    },
    featured: true,
    active: true,
    seoTitle: 'NANUK 910 Protective Case - Waterproof & Impact Resistant',
    seoDescription: 'Ultra-lightweight NANUK 910 protective case with IP67 rating. Perfect for photography, electronics, and professional equipment protection.',
    seoKeywords: ['protective case', 'waterproof case', 'impact resistant', 'photography case', 'equipment protection'],
    sortOrder: 1
  },
  {
    name: 'NANUK 920 Professional Case',
    slug: 'nanuk-920-professional-case',
    category: 'Medium Cases',
    subcategory: 'Professional Cases',
    description: 'Medium-sized professional case with customizable foam interior for versatile equipment protection.',
    longDescription: 'The NANUK 920 offers the perfect balance of size and protection for professional equipment. With its modular foam system and robust construction, it adapts to your specific needs.',
    images: [
      '/images/products/industrial-case-1.svg',
      '/images/products/electronics-case-1.svg',
      '/images/products/camera-case-1.svg'
    ],
    specifications: {
      'External Dimensions': '16.7" × 13.0" × 6.9" (42.4 × 33.0 × 17.5 cm)',
      'Internal Dimensions': '14.8" × 10.9" × 5.4" (37.6 × 27.7 × 13.7 cm)',
      'Weight': '4.8 lbs (2.2 kg)',
      'Volume': '4.2 L',
      'Material': 'NK-7 Resin',
      'Protection Rating': 'IP67',
      'Temperature Range': '-40°F to +140°F (-40°C to +60°C)',
      'Pressure Relief': 'Automatic'
    },
    features: [
      'Waterproof and dustproof (IP67)',
      'Impact resistant NK-7 resin shell',
      'PowerClaw superior latching system',
      'Modular foam system',
      'Automatic pressure relief valve',
      'Comfortable carry handle',
      'Stainless steel hardware',
      'Lifetime warranty'
    ],
    applications: [
      'Camera Equipment',
      'Drone Storage',
      'Medical Devices',
      'Test Equipment',
      'Audio Equipment',
      'Tool Storage'
    ],
    certifications: [
      'IP67 Waterproof Rating',
      'MIL-STD-810G',
      'STANAG 4280',
      'ATA 300'
    ],
    colors: [
      { name: 'Black', code: '#000000' },
      { name: 'Orange', code: '#FF6B35' },
      { name: 'Yellow', code: '#FFD23F' }
    ],
    accessories: [
      'Modular Foam Set',
      'Padded Dividers',
      'Shoulder Strap',
      'Lid Organizer'
    ],
    dimensions: {
      external: {
        length: 42.4,
        width: 33.0,
        height: 17.5,
        unit: 'cm'
      },
      internal: {
        length: 37.6,
        width: 27.7,
        height: 13.7,
        unit: 'cm'
      }
    },
    weight: {
      value: 2.2,
      unit: 'kg'
    },
    volume: {
      value: 4.2,
      unit: 'L'
    },
    protectionRating: 'IP67',
    temperatureRange: {
      min: -40,
      max: 60,
      unit: 'C'
    },
    featured: true,
    active: true,
    seoTitle: 'NANUK 920 Professional Case - Medium Protective Case',
    seoDescription: 'Professional NANUK 920 case with modular foam system. Ideal for cameras, drones, and professional equipment.',
    seoKeywords: ['professional case', 'camera case', 'drone case', 'modular foam', 'equipment protection'],
    sortOrder: 2
  },
  {
    name: 'WL-1200 Medical Antimicrobial Case',
    slug: 'wl-1200-medical-antimicrobial-case',
    category: 'medical',
    subcategory: 'Medical Cases',
    description: 'Specialized antimicrobial case designed for medical equipment with advanced sterilization features.',
    longDescription: 'The WL-1200 features antimicrobial coating and specialized sealing systems designed specifically for medical environments. Perfect for protecting sensitive medical instruments and maintaining sterile conditions.',
    images: [
      '/images/products/wl-1200.svg'
    ],
    specifications: {
      'External Dimensions': '12.0" × 8.0" × 4.0"',
      'Weight': '2.8 lbs (1.3 kg)',
      'Material': 'Medical-Grade Polymer',
      'Protection Rating': 'IP65 (Medical Grade)',
      'Antimicrobial Coating': 'Yes',
      'Sterilization Compatible': 'Autoclave Safe'
    },
    features: [
      'Antimicrobial Surface Coating',
      'Autoclave Compatible',
      'Medical-Grade Materials',
      'Precision Foam Inserts',
      'Tamper-Evident Seals',
      'Easy Decontamination'
    ],
    applications: [
      'Surgical Instruments',
      'Medical Devices',
      'Laboratory Equipment',
      'Diagnostic Tools',
      'Emergency Medical Supplies'
    ],
    certifications: [
      'FDA Approved Materials',
      'ISO 13485 Compliant',
      'Medical Device Regulation (MDR)'
    ],
    colors: [
      { name: 'Medical White', code: '#FFFFFF' },
      { name: 'Hospital Blue', code: '#4A90E2' }
    ],
    dimensions: {
      external: {
        length: 30.5,
        width: 20.3,
        height: 10.2,
        unit: 'cm'
      },
      internal: {
        length: 28.0,
        width: 18.0,
        height: 8.5,
        unit: 'cm'
      }
    },
    weight: {
      value: 1.3,
      unit: 'kg'
    },
    protectionRating: 'IP65',
    featured: true,
    active: true,
    seoTitle: 'WL-1200 Medical Antimicrobial Case - Sterile Equipment Protection',
    seoDescription: 'Medical-grade antimicrobial case for surgical instruments and medical devices. Autoclave safe with FDA approved materials.',
    seoKeywords: ['medical case', 'antimicrobial', 'surgical instruments', 'autoclave safe', 'medical equipment'],
    sortOrder: 3
  },
  {
    name: 'WL-2800 Industrial Heavy Duty Case',
    slug: 'wl-2800-industrial-heavy-duty-case',
    category: 'industrial',
    subcategory: 'Industrial Cases',
    description: 'Heavy-duty industrial case built for extreme environments and maximum equipment protection.',
    longDescription: 'The WL-2800 is engineered for the harshest industrial environments. With reinforced construction and advanced shock absorption, it provides uncompromising protection for critical industrial equipment.',
    images: [
      '/images/products/wl-2800.svg'
    ],
    specifications: {
      'External Dimensions': '28.0" × 18.0" × 12.0"',
      'Weight': '12.5 lbs (5.7 kg)',
      'Material': 'Industrial-Grade Composite',
      'Protection Rating': 'IP68 (Submersible)',
      'Load Capacity': '150 lbs (68 kg)',
      'Drop Test': 'MIL-STD-810G'
    },
    features: [
      'Extreme Impact Resistance',
      'Submersible Design (IP68)',
      'Reinforced Corner Protection',
      'Heavy-Duty Latching System',
      'Pressure Equalization Valve',
      'Industrial Wheels and Handle'
    ],
    applications: [
      'Heavy Machinery Parts',
      'Industrial Tools',
      'Mining Equipment',
      'Oil & Gas Instruments',
      'Construction Equipment',
      'Calibration Instruments'
    ],
    certifications: [
      'IP68 Waterproof Rating',
      'MIL-STD-810G',
      'OSHA Compliant',
      'Industrial Safety Standards'
    ],
    colors: [
      { name: 'Industrial Black', code: '#1A1A1A' },
      { name: 'Safety Orange', code: '#FF6B35' },
      { name: 'High-Vis Yellow', code: '#FFD23F' }
    ],
    dimensions: {
      external: {
        length: 71.1,
        width: 45.7,
        height: 30.5,
        unit: 'cm'
      },
      internal: {
        length: 66.0,
        width: 40.6,
        height: 27.9,
        unit: 'cm'
      }
    },
    weight: {
      value: 5.7,
      unit: 'kg'
    },
    protectionRating: 'IP68',
    featured: true,
    active: true,
    seoTitle: 'WL-2800 Industrial Heavy Duty Case - Extreme Protection',
    seoDescription: 'Heavy-duty industrial case with IP68 rating. Built for extreme environments and heavy industrial equipment protection.',
    seoKeywords: ['industrial case', 'heavy duty', 'waterproof', 'impact resistant', 'industrial equipment'],
    sortOrder: 4
  },
  {
    name: 'WL-1600 Studio Case',
    slug: 'wl-1600-studio-case',
    category: 'photography',
    subcategory: 'Studio Cases',
    description: 'Professional studio case with customizable compartments for photography and video production equipment.',
    longDescription: 'The WL-1600 is designed specifically for studio environments. With its modular interior system and professional appearance, it provides organized storage and easy access to photography and video equipment.',
    images: [
      '/images/products/wl-1600.svg'
    ],
    specifications: {
      'External Dimensions': '16.0" × 12.0" × 8.0"',
      'Weight': '5.5 lbs (2.5 kg)',
      'Material': 'Professional-Grade ABS',
      'Protection Rating': 'IP54 (Splash Resistant)',
      'Interior System': 'Modular Compartments',
      'Wheels': 'Silent Rolling'
    },
    features: [
      'Modular Interior System',
      'Silent Wheels',
      'Professional Appearance',
      'Cable Management',
      'Quick Access Design',
      'Stackable Design'
    ],
    applications: [
      'Studio Lighting',
      'Camera Accessories',
      'Audio Equipment',
      'Production Tools',
      'Video Equipment',
      'Photography Gear'
    ],
    certifications: [
      'Professional Studio Standards',
      'IP54 Splash Resistant'
    ],
    colors: [
      { name: 'Studio Black', code: '#000000' },
      { name: 'Professional Gray', code: '#6B7280' }
    ],
    dimensions: {
      external: {
        length: 40.6,
        width: 30.5,
        height: 20.3,
        unit: 'cm'
      },
      internal: {
        length: 37.5,
        width: 27.9,
        height: 17.8,
        unit: 'cm'
      }
    },
    weight: {
      value: 2.5,
      unit: 'kg'
    },
    protectionRating: 'IP54',
    featured: true,
    active: true,
    seoTitle: 'WL-1600 Studio Case - Professional Photography Equipment Storage',
    seoDescription: 'Professional studio case with modular compartments for photography and video production equipment. Silent wheels and quick access design.',
    seoKeywords: ['studio case', 'photography case', 'video equipment', 'modular storage', 'professional gear'],
    sortOrder: 5
  },
  {
    name: 'NANUK 930 Heavy Duty Case',
    slug: 'nanuk-930-heavy-duty-case',
    category: 'Large Cases',
    subcategory: 'Heavy Duty Cases',
    description: 'Large heavy-duty case designed for maximum protection of valuable and sensitive equipment.',
    longDescription: 'The NANUK 930 is built for the most demanding environments. Its robust construction and advanced protection features make it the choice for military, aerospace, and industrial applications.',
    images: [
      '/images/products/military-case-1.svg',
      '/images/products/industrial-case-1.svg',
      '/images/products/electronics-case-1.svg'
    ],
    specifications: {
      'External Dimensions': '18.8" × 14.6" × 7.6" (47.8 × 37.1 × 19.3 cm)',
      'Internal Dimensions': '16.9" × 12.6" × 6.1" (42.9 × 32.0 × 15.5 cm)',
      'Weight': '6.2 lbs (2.8 kg)',
      'Volume': '6.8 L',
      'Material': 'NK-7 Resin',
      'Protection Rating': 'IP67',
      'Temperature Range': '-40°F to +140°F (-40°C to +60°C)',
      'Pressure Relief': 'Automatic'
    },
    features: [
      'Waterproof and dustproof (IP67)',
      'Impact resistant NK-7 resin shell',
      'PowerClaw superior latching system',
      'Reinforced corners',
      'Automatic pressure relief valve',
      'Heavy-duty handle',
      'Military-grade hardware',
      'Lifetime warranty'
    ],
    applications: [
      'Military Equipment',
      'Aerospace Components',
      'Industrial Instruments',
      'Broadcasting Equipment',
      'Scientific Instruments',
      'Emergency Response'
    ],
    certifications: [
      'IP67 Waterproof Rating',
      'MIL-STD-810G',
      'STANAG 4280',
      'ATA 300',
      'NATO Approved'
    ],
    colors: [
      { name: 'Black', code: '#000000' },
      { name: 'Olive', code: '#8B8C7A' }
    ],
    accessories: [
      'Military Foam Kit',
      'Shock Mount System',
      'Wheels Kit',
      'Security Lock'
    ],
    dimensions: {
      external: {
        length: 47.8,
        width: 37.1,
        height: 19.3,
        unit: 'cm'
      },
      internal: {
        length: 42.9,
        width: 32.0,
        height: 15.5,
        unit: 'cm'
      }
    },
    weight: {
      value: 2.8,
      unit: 'kg'
    },
    volume: {
      value: 6.8,
      unit: 'L'
    },
    protectionRating: 'IP67',
    temperatureRange: {
      min: -40,
      max: 60,
      unit: 'C'
    },
    featured: true,
    active: true,
    seoTitle: 'NANUK 930 Heavy Duty Case - Military Grade Protection',
    seoDescription: 'Heavy-duty NANUK 930 case with military-grade protection. Perfect for aerospace, military, and industrial applications.',
    seoKeywords: ['heavy duty case', 'military case', 'aerospace case', 'industrial protection', 'rugged case'],
    sortOrder: 3
  },
  {
    name: 'NANUK 915 Tool Case',
    slug: 'nanuk-915-tool-case',
    category: 'Tool Cases',
    subcategory: 'Professional Tools',
    description: 'Specialized tool case with organized compartments for professional tool storage and transport.',
    longDescription: 'The NANUK 915 is specifically designed for tool organization and protection. Its intelligent layout and durable construction make it perfect for professionals who need their tools protected and organized.',
    images: [
      '/images/products/tool-case-1.svg',
      '/images/products/industrial-case-1.svg'
    ],
    specifications: {
      'External Dimensions': '15.0" × 12.0" × 6.5" (38.1 × 30.5 × 16.5 cm)',
      'Internal Dimensions': '13.2" × 10.0" × 5.0" (33.5 × 25.4 × 12.7 cm)',
      'Weight': '3.8 lbs (1.7 kg)',
      'Volume': '3.2 L',
      'Material': 'NK-7 Resin',
      'Protection Rating': 'IP65',
      'Temperature Range': '-20°F to +120°F (-29°C to +49°C)'
    },
    features: [
      'Waterproof and dustproof (IP65)',
      'Impact resistant construction',
      'Organized tool compartments',
      'Secure latching system',
      'Comfortable grip handle',
      'Tool retention system',
      'Corrosion resistant hardware'
    ],
    applications: [
      'Professional Tools',
      'Precision Instruments',
      'Electronic Tools',
      'Maintenance Equipment',
      'Field Service Tools',
      'Repair Kits'
    ],
    certifications: [
      'IP65 Protection Rating',
      'Professional Tool Standard'
    ],
    colors: [
      { name: 'Black', code: '#000000' },
      { name: 'Red', code: '#DC2626' }
    ],
    accessories: [
      'Tool Organizer Inserts',
      'Foam Tool Cutouts',
      'Parts Trays'
    ],
    dimensions: {
      external: {
        length: 38.1,
        width: 30.5,
        height: 16.5,
        unit: 'cm'
      },
      internal: {
        length: 33.5,
        width: 25.4,
        height: 12.7,
        unit: 'cm'
      }
    },
    weight: {
      value: 1.7,
      unit: 'kg'
    },
    volume: {
      value: 3.2,
      unit: 'L'
    },
    protectionRating: 'IP65',
    temperatureRange: {
      min: -29,
      max: 49,
      unit: 'C'
    },
    featured: false,
    active: true,
    seoTitle: 'NANUK 915 Tool Case - Professional Tool Storage',
    seoDescription: 'Organized NANUK 915 tool case with compartments for professional tool storage and protection.',
    seoKeywords: ['tool case', 'tool storage', 'professional tools', 'organized case', 'tool protection'],
    sortOrder: 4
  },
  {
    name: 'NANUK 925 Custom Case',
    slug: 'nanuk-925-custom-case',
    category: 'Custom Cases',
    subcategory: 'Bespoke Solutions',
    description: 'Fully customizable case solution designed to meet specific equipment protection requirements.',
    longDescription: 'The NANUK 925 Custom Case represents the pinnacle of personalized protection. Every aspect can be tailored to your exact specifications, ensuring perfect fit and maximum protection for your unique equipment.',
    images: [
      '/images/products/camera-case-1.svg',
      '/images/products/electronics-case-1.svg',
      '/images/products/medical-case-1.svg'
    ],
    specifications: {
      'External Dimensions': 'Customizable',
      'Internal Dimensions': 'Customizable',
      'Weight': 'Varies by configuration',
      'Volume': 'Customizable',
      'Material': 'NK-7 Resin',
      'Protection Rating': 'Up to IP68',
      'Temperature Range': '-40°F to +140°F (-40°C to +60°C)',
      'Customization': 'Full custom foam, colors, hardware'
    },
    features: [
      'Fully customizable design',
      'Precision foam cutting',
      'Custom color options',
      'Specialized hardware',
      'Logo and branding options',
      'Multiple latch configurations',
      'Custom handle options',
      'Tailored protection solutions'
    ],
    applications: [
      'Specialized Equipment',
      'Prototype Protection',
      'Custom Instruments',
      'Unique Configurations',
      'Brand-Specific Solutions',
      'OEM Applications'
    ],
    certifications: [
      'Custom Certification Available',
      'Client-Specific Standards',
      'Industry Compliance'
    ],
    colors: [
      { name: 'Custom Colors Available', code: '#6B7280' }
    ],
    accessories: [
      'Custom Foam Solutions',
      'Branded Hardware',
      'Specialized Inserts',
      'Custom Accessories'
    ],
    dimensions: {
      external: {
        length: 0,
        width: 0,
        height: 0,
        unit: 'cm'
      },
      internal: {
        length: 0,
        width: 0,
        height: 0,
        unit: 'cm'
      }
    },
    weight: {
      value: 0,
      unit: 'kg'
    },
    volume: {
      value: 0,
      unit: 'L'
    },
    protectionRating: 'Custom',
    temperatureRange: {
      min: -40,
      max: 60,
      unit: 'C'
    },
    featured: true,
    active: true,
    seoTitle: 'NANUK 925 Custom Case - Bespoke Protection Solutions',
    seoDescription: 'Fully customizable NANUK 925 case with precision foam cutting and custom design options for specialized equipment.',
    seoKeywords: ['custom case', 'bespoke protection', 'custom foam', 'specialized case', 'tailored solution'],
    sortOrder: 5
  },
  {
    name: 'NANUK 940 Wheeled Case',
    slug: 'nanuk-940-wheeled-case',
    category: 'Large Cases',
    subcategory: 'Wheeled Cases',
    description: 'Large wheeled case for easy transport of heavy equipment with maximum protection.',
    longDescription: 'The NANUK 940 combines the ultimate in protection with convenient mobility. Its robust wheel system and telescoping handle make transporting heavy, valuable equipment effortless.',
    images: [
      '/images/products/industrial-case-1.svg',
      '/images/products/military-case-1.svg'
    ],
    specifications: {
      'External Dimensions': '22.0" × 17.5" × 10.0" (55.9 × 44.5 × 25.4 cm)',
      'Internal Dimensions': '20.0" × 15.5" × 8.5" (50.8 × 39.4 × 21.6 cm)',
      'Weight': '12.5 lbs (5.7 kg)',
      'Volume': '12.8 L',
      'Material': 'NK-7 Resin',
      'Protection Rating': 'IP67',
      'Wheels': 'Heavy-duty polyurethane',
      'Handle': 'Telescoping aluminum'
    },
    features: [
      'Heavy-duty wheel system',
      'Telescoping handle',
      'Waterproof and dustproof (IP67)',
      'Impact resistant construction',
      'PowerClaw latching system',
      'Reinforced corners',
      'Pressure relief valve',
      'Comfortable grip handles'
    ],
    applications: [
      'Broadcast Equipment',
      'Large Instruments',
      'Trade Show Equipment',
      'Mobile Workstations',
      'Heavy Tools',
      'Presentation Equipment'
    ],
    certifications: [
      'IP67 Waterproof Rating',
      'IATA Compliant',
      'ATA 300'
    ],
    colors: [
      { name: 'Black', code: '#000000' }
    ],
    accessories: [
      'Foam Insert System',
      'Divider Kit',
      'TSA Locks',
      'Handle Wrap'
    ],
    dimensions: {
      external: {
        length: 55.9,
        width: 44.5,
        height: 25.4,
        unit: 'cm'
      },
      internal: {
        length: 50.8,
        width: 39.4,
        height: 21.6,
        unit: 'cm'
      }
    },
    weight: {
      value: 5.7,
      unit: 'kg'
    },
    volume: {
      value: 12.8,
      unit: 'L'
    },
    protectionRating: 'IP67',
    temperatureRange: {
      min: -40,
      max: 60,
      unit: 'C'
    },
    featured: false,
    active: true,
    seoTitle: 'NANUK 940 Wheeled Case - Mobile Protection Solution',
    seoDescription: 'Large wheeled NANUK 940 case with telescoping handle for easy transport of heavy equipment.',
    seoKeywords: ['wheeled case', 'mobile case', 'transport case', 'heavy equipment', 'travel case'],
    sortOrder: 6
  }
]

// 【重点】示例分类数据 - 产品分类的基础数据结构
// 定义了不同类型的保护箱分类，用于产品组织和导航
const sampleCategories: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Small Cases', // 分类名称：小型箱子
    slug: 'small-cases', // URL友好的分类标识符
    description: 'Compact protective cases for handheld equipment and small devices', // 分类描述：紧凑型保护箱
    active: true, // 分类状态：激活
    sortOrder: 1, // 排序顺序：第一位
    seoTitle: 'Small Protective Cases - Compact Equipment Protection', // SEO标题
    seoDescription: 'Small protective cases perfect for cameras, electronics, and handheld equipment protection.' // SEO描述
  },
  {
    name: 'Medium Cases', // 分类名称：中型箱子
    slug: 'medium-cases', // URL友好的分类标识符
    description: 'Medium-sized cases for professional equipment and instruments', // 分类描述：专业设备中型箱
    active: true, // 分类状态：激活
    sortOrder: 2, // 排序顺序：第二位
    seoTitle: 'Medium Protective Cases - Professional Equipment Storage', // SEO标题
    seoDescription: 'Medium protective cases ideal for professional cameras, drones, and scientific instruments.' // SEO描述
  },
  {
    name: 'Large Cases', // 分类名称：大型箱子
    slug: 'large-cases', // URL友好的分类标识符
    description: 'Large cases for heavy-duty equipment and multiple items', // 分类描述：重型设备大型箱
    active: true, // 分类状态：激活
    sortOrder: 3, // 排序顺序：第三位
    seoTitle: 'Large Protective Cases - Heavy Duty Equipment Protection', // SEO标题
    seoDescription: 'Large protective cases for heavy equipment, broadcast gear, and industrial instruments.' // SEO描述
  },
  {
    name: 'Tool Cases', // 分类名称：工具箱
    slug: 'tool-cases', // URL友好的分类标识符
    description: 'Specialized cases designed for tool organization and protection', // 分类描述：专业工具组织保护箱
    active: true, // 分类状态：激活
    sortOrder: 4, // 排序顺序：第四位
    seoTitle: 'Tool Cases - Professional Tool Storage Solutions', // SEO标题
    seoDescription: 'Organized tool cases with compartments for professional tool storage and protection.' // SEO描述
  },
  {
    name: 'Custom Cases', // 分类名称：定制箱子
    slug: 'custom-cases', // URL友好的分类标识符
    description: 'Fully customizable cases tailored to specific requirements', // 分类描述：完全可定制的专用箱子
    active: true, // 分类状态：激活
    sortOrder: 5, // 排序顺序：第五位
    seoTitle: 'Custom Protective Cases - Bespoke Protection Solutions', // SEO标题
    seoDescription: 'Custom protective cases designed to your exact specifications with precision foam cutting.' // SEO描述
  }
]

// 【重点】数据库种子函数 - 初始化数据库并插入示例数据
// 用于在空数据库中创建初始的产品和分类数据，便于开发和测试
export async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Starting database seeding...')
    
    // 【重点】初始化数据库并创建索引 - 确保数据库结构正确
    // 调用 initializeDatabase 函数创建必要的索引以提高查询性能
    await initializeDatabase()
    
    // 获取数据库连接实例
    const db = await getDatabase()
    
    // 【重点】清理现有数据 - 避免重复数据和冲突
    // 删除产品集合中的所有现有数据，确保干净的起始状态
    await db.collection(COLLECTIONS.PRODUCTS).deleteMany({})
    console.log('🗑️  Cleared existing products')
    
    // 【重点】为分类数据添加时间戳 - 数据完整性要求
    // 为每个分类添加创建时间和更新时间，符合数据模型要求
    const categoriesWithTimestamps = sampleCategories.map(category => ({
      ...category,
      createdAt: new Date(), // 创建时间
      updatedAt: new Date()  // 更新时间
    }))
    
    // 【重点】为产品数据添加时间戳 - 数据完整性要求
    // 为每个产品添加创建时间和更新时间，符合数据模型要求
    const productsWithTimestamps = sampleProducts.map(product => ({
      ...product,
      createdAt: new Date(), // 创建时间
      updatedAt: new Date()  // 更新时间
    }))
    
    // 【重点】批量插入产品数据 - 高效的数据插入操作
    // 使用 insertMany 进行批量插入，比逐个插入更高效
    const productResult = await db.collection(COLLECTIONS.PRODUCTS).insertMany(productsWithTimestamps)
    console.log(`✅ Inserted ${productResult.insertedCount} products`)
    
    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    // 【重点】错误处理 - 记录详细错误信息并重新抛出
    // 确保调用者能够捕获和处理种子数据失败的情况
    console.error('❌ Database seeding failed:', error)
    throw error // 重新抛出错误，让调用者处理
  }
}

// 【重点】智能种子数据检查函数 - 避免重复种子和数据冲突
// 检查数据库是否为空，只在需要时进行种子数据操作
export async function checkAndSeedDatabase(): Promise<void> {
  try {
    // 获取数据库连接实例
    const db = await getDatabase()
    
    // 【重点】检查产品数量 - 判断是否需要种子数据
    // 统计产品集合中的文档数量，用于判断数据库状态
    const productCount = await db.collection(COLLECTIONS.PRODUCTS).countDocuments()
    
    // 【重点】条件种子逻辑 - 只在数据库为空时执行种子操作
    if (productCount === 0) {
      console.log('📦 Database is empty, seeding with sample data...')
      await seedDatabase() // 执行种子数据插入
    } else {
      // 数据库已有数据，跳过种子操作
      console.log(`📊 Database already contains ${productCount} products`)
    }
    
  } catch (error) {
    // 【重点】错误处理 - 记录检查失败但不中断应用启动
    // 即使种子数据检查失败，也不应该阻止应用正常启动
    console.error('❌ Database seeding check failed:', error)
    // 注意：这里不抛出错误，避免影响应用启动
  }
}