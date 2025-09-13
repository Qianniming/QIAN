import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, COLLECTIONS } from '@/lib/mongodb'
import { Product, validateProduct, sanitizeString } from '@/lib/models'
import { ObjectId } from 'mongodb'
import { checkAndSeedDatabase, sampleProducts } from '@/lib/seed-data'
import { cache, cacheKeys, withCache, createCachedResponse } from '@/lib/cache'
import { securityHeaders } from '@/lib/rate-limiter'
import getClientPromise from '@/lib/mongodb' // 更新导入方式

// 临时解决方案：在数据库连接失败时返回模拟数据
function getFallbackData() {
  const transformedProducts = sampleProducts.map((product, index) => ({
    ...product,
    _id: `sample_${index}`,
    id: `sample_${index}`,
    image: Array.isArray(product.images) && product.images.length > 0 
      ? product.images[0] 
      : '/images/products/default.svg'
  }))
  
  return {
    products: transformedProducts,
    pagination: {
      total: transformedProducts.length,
      limit: 20,
      skip: 0,
      hasMore: false
    },
    categories: ['Small Cases', 'Medium Cases', 'Large Cases', 'Tool Cases', 'Custom Cases'],
    success: true
  }
}

// Cached database query function
const getCachedProducts = withCache(
  async (filters: any) => {
    // 此函数现在只在数据库连接可用时调用
    await checkAndSeedDatabase()
    
    const db = await getDatabase()
    const collection = db.collection(COLLECTIONS.PRODUCTS)

    const [products, total, categories] = await Promise.all([
      collection
        .find(filters.query)
        .sort({ [filters.sortBy]: filters.sortOrder })
        .skip(filters.skip)
        .limit(filters.limit)
        .toArray(),
      collection.countDocuments(filters.query),
      collection.distinct('category', { active: true })
    ])

    return { products, total, categories }
  },
  (filters) => cacheKeys.products(filters),
  5 * 60 * 1000 // 5 minutes cache
)

// GET /api/products - Get all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // Limit max to 100
    const skip = Math.max(parseInt(searchParams.get('skip') || '0'), 0) // Ensure non-negative
    const sortBy = searchParams.get('sortBy') || 'sortOrder'
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1

    // 尝试连接数据库，如果失败则使用模拟数据
    try {
      // Check and seed database if empty
      await checkAndSeedDatabase()
      
      const db = await getDatabase()
      const collection = db.collection(COLLECTIONS.PRODUCTS)

      // Build query with proper validation
      const query: any = { active: true }
      
      if (category && category !== 'all' && typeof category === 'string') {
        query.category = category.trim()
      }
      
      if (featured === 'true') {
        query.featured = true
      }
      
      if (search && typeof search === 'string' && search.trim().length > 0) {
        // Use regex search as fallback if text index doesn't exist
        const searchTerm = search.trim()
        query.$or = [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } }
        ]
      }

      // Validate sortBy field to prevent injection
      const allowedSortFields = ['sortOrder', 'name', 'category', 'createdAt', 'updatedAt']
      const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'sortOrder'

      // Prepare filters for caching
      const filters = {
        query,
        sortBy: finalSortBy,
        sortOrder,
        skip,
        limit
      }

      // Execute cached query
      const { products, total, categories } = await getCachedProducts(filters)

      // Transform products to match frontend expectations
      const transformedProducts = products.map(product => ({
        ...product,
        id: product._id?.toString() || product.slug, // Use _id as string or fallback to slug
        image: Array.isArray(product.images) && product.images.length > 0 
          ? product.images[0] 
          : '/images/products/default.svg' // Use first image or default
      }))

      return NextResponse.json({
        products: transformedProducts,
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total
        },
        categories,
        success: true
      }, {
        headers: {
          ...securityHeaders,
          'Cache-Control': 'public, max-age=300', // 5 minutes
          'ETag': `"products-${Date.now()}"`
        }
      })
    } catch (dbError) {
      // 数据库连接失败，使用模拟数据
      console.warn('⚠️  Database connection failed, using fallback data:', dbError)
      
      let fallbackData = getFallbackData()
      
      // 对模拟数据应用筛选器
      if (category && category !== 'all') {
        fallbackData.products = fallbackData.products.filter(p => p.category === category)
      }
      
      if (featured === 'true') {
        fallbackData.products = fallbackData.products.filter(p => p.featured)
      }
      
      if (search) {
        const searchTerm = search.toLowerCase()
        fallbackData.products = fallbackData.products.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
        )
      }
      
      // 应用排序
      if (sortBy === 'name') {
        fallbackData.products.sort((a, b) => a.name.localeCompare(b.name))
      } else if (sortBy === 'category') {
        fallbackData.products.sort((a, b) => a.category.localeCompare(b.category))
      }
      
      // 应用分页
      const startIndex = skip
      const endIndex = skip + limit
      const paginatedProducts = fallbackData.products.slice(startIndex, endIndex)
      
      return NextResponse.json({
        products: paginatedProducts,
        pagination: {
          total: fallbackData.products.length,
          limit,
          skip,
          hasMore: endIndex < fallbackData.products.length
        },
        categories: fallbackData.categories,
        success: true,
        note: '使用模拟数据（数据库连接不可用）'
      }, {
        headers: {
          ...securityHeaders,
          'Cache-Control': 'no-cache', // Don't cache fallback data
          'X-Data-Source': 'fallback'
        }
      })
    }

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products', success: false },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const body: Partial<Product> = await request.json()
    
    // Validate input data
    const validation = validateProduct(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.errors
        },
        { status: 400 }
      )
    }
    
    // Sanitize string fields
    const sanitizedBody = {
      ...body,
      name: sanitizeString(body.name || ''),
      description: sanitizeString(body.description || ''),
      category: sanitizeString(body.category || '')
    }

    const db = await getDatabase()
    const collection = db.collection(COLLECTIONS.PRODUCTS)

    // Generate slug from name
    const slug = sanitizedBody.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingProduct = await collection.findOne({ slug })
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this name already exists' },
        { status: 409 }
      )
    }

    const product: Partial<Product> = {
      ...sanitizedBody,
      slug,
      active: sanitizedBody.active ?? true,
      featured: sanitizedBody.featured ?? false,
      sortOrder: sanitizedBody.sortOrder ?? 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await collection.insertOne(product)

    return NextResponse.json({
      message: 'Product created successfully',
      productId: result.insertedId,
      success: true
    })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product', success: false },
      { status: 500 }
    )
  }
}