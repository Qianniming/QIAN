// 【重点】MongoDB数据库连接配置 - 管理数据库连接和操作
// 这个文件是整个应用的数据库核心，负责建立和维护MongoDB连接

import { MongoClient, Db, MongoClientOptions } from 'mongodb' // MongoDB官方驱动

// 【重点】环境变量检查函数 - 延迟检查，避免模块加载时报错
function checkEnvironment(): string {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local') // 缺少数据库连接字符串
  }
  return process.env.MONGODB_URI
}
// 【重点】连接选项配置 - 优化数据库连接性能和稳定性，解决SSL问题
const options: MongoClientOptions = {
  maxPoolSize: 10, // 最大连接池大小：10个并发连接
  serverSelectionTimeoutMS: 5000, // 服务器选择超时：5秒
  socketTimeoutMS: 45000, // Socket超时：45秒
  family: 4, // 使用IPv4，跳过IPv6尝试（提高连接速度）
  
  // SSL/TLS配置 - 解决SSL连接问题
  tls: true, // 启用TLS
  tlsAllowInvalidCertificates: false, // 严格证书验证
  tlsAllowInvalidHostnames: false, // 严格主机名验证
  
  // 连接重试配置
  retryWrites: true, // 启用写操作重试
  retryReads: true, // 启用读操作重试
  
  // 认证配置
  authSource: 'admin', // 认证数据库
}

// 【重点】客户端连接管理 - 根据环境采用不同的连接策略
let client: MongoClient
let clientPromise: Promise<MongoClient>

// 改为函数形式，延迟初始化
function initializeClient(): Promise<MongoClient> {
  if (clientPromise) {
    return clientPromise
  }
  
  const uri = checkEnvironment() // 在需要时才检查环境变量
  
  if (process.env.NODE_ENV === 'development') {
    // 【重点】开发环境连接策略 - 使用全局变量避免热重载时重复连接
    // 在开发模式下，使用全局变量保存连接，避免HMR（热模块替换）导致的重复连接
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options) // 创建新的MongoDB客户端
      globalWithMongo._mongoClientPromise = client.connect() // 建立连接并保存到全局变量
    }
    clientPromise = globalWithMongo._mongoClientPromise // 使用已存在的连接
  } else {
    // 【重点】生产环境连接策略 - 直接创建连接，不使用全局变量
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
  
  return clientPromise
}

// 【重点】导出客户端连接Promise - 在模块间共享数据库连接
// 通过在独立模块中导出，可以在不同函数间共享同一个客户端连接
export default function getClientPromise(): Promise<MongoClient> {
  return initializeClient()
}

// 【重点】数据库辅助函数 - 获取数据库实例
export async function getDatabase(): Promise<Db> {
  try {
    const client = await initializeClient() // 使用新的初始化函数
    return client.db('wellicases') // 返回指定数据库实例（修正数据库名称）
  } catch (error) {
    // 【重点】连接错误处理 - 记录错误并抛出友好的错误信息
    console.error('Failed to connect to database:', error)
    throw new Error('Database connection failed') // 抛出数据库连接失败错误
  }
}

// 【重点】集合名称常量 - 统一管理数据库集合名称
// 使用常量避免硬编码，便于维护和重构
export const COLLECTIONS = {
  INQUIRIES: 'inquiries', // 咨询记录集合
  PRODUCTS: 'products', // 产品信息集合
  USERS: 'users', // 用户信息集合
  SETTINGS: 'settings' // 系统设置集合
} as const

// 【重点】增强的数据库连接测试 - 带重试逻辑的连接检查
export async function testConnection(retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await initializeClient() // 使用新的初始化函数
      await client.db('admin').command({ ping: 1 }) // 发送ping命令测试连接
      console.log('✅ MongoDB connection successful') // 连接成功
      return true
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, (error as Error).message) // 简化错误信息
      if (i === retries - 1) {
        // 【重点】所有重试都失败 - 记录最终失败状态
        console.error('❌ All MongoDB connection attempts failed')
        console.warn('⚠️ This might be due to SSL/TLS compatibility issues on Windows')
        console.warn('⚠️ The application will continue without database connection')
        return false
      }
      // 【重点】等待后重试 - 递增延迟避免频繁重试
      // 【重点】等待后重试 - 递增延迟避免频繁重试
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  return false
}

// 【重点】数据库初始化 - 创建索引优化查询性能
export async function initializeDatabase(): Promise<void> {
  try {
    const db = await getDatabase() // 获取数据库实例
    
    // 【重点】咨询集合索引 - 优化常用查询字段的性能
    const inquiriesIndexes = [
      { key: { email: 1 } }, // 邮箱索引：用于查找特定用户的咨询
      { key: { createdAt: -1 } }, // 创建时间倒序索引：用于按时间排序
      { key: { country: 1 } }, // 国家索引：用于地区统计
      { key: { productInterest: 1 } }, // 产品兴趣索引：用于产品分析
      { key: { status: 1 } } // 状态索引：用于筛选处理状态
    ] as any
    
    const productsIndexes = [
      { key: { name: 'text', description: 'text' } }, // 全文搜索索引：支持产品名称和描述搜索
      { key: { category: 1 } }, // 分类索引：用于分类筛选
      { key: { featured: 1 } }, // 特色产品索引：用于首页特色产品查询
      { key: { active: 1 } }, // 活跃状态索引：用于筛选可用产品
      { key: { slug: 1 }, unique: true } // 唯一slug索引：确保URL标识符唯一性
    ] as any
    
    // 【重点】并行创建索引 - 同时为多个集合创建索引提高效率
    await Promise.all([
      db.collection(COLLECTIONS.INQUIRIES).createIndexes(inquiriesIndexes)
        .catch(err => console.warn('Failed to create inquiries indexes:', err)), // 咨询集合索引创建失败处理
      db.collection(COLLECTIONS.PRODUCTS).createIndexes(productsIndexes)
        .catch(err => console.warn('Failed to create products indexes:', err)) // 产品集合索引创建失败处理
    ])
    
    console.log('✅ Database indexes created successfully') // 索引创建成功
  } catch (error) {
    // 【重点】数据库初始化错误处理 - 避免应用崩溃
    console.error('❌ Failed to initialize database:', error)
    // 不抛出错误以防止应用崩溃 - 应用可以在没有索引的情况下运行
    console.warn('Database initialization failed, continuing without indexes')
  }
}