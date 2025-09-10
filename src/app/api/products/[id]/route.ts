// 【重点】产品详情API接口 - 处理单个产品的增删改查操作
// 这个文件负责根据产品ID或slug获取、更新、删除特定产品

import { NextRequest, NextResponse } from 'next/server' // Next.js服务器端请求和响应处理
import { getDatabase, COLLECTIONS } from '@/lib/mongodb' // 数据库连接和集合定义
import { Product, validateProduct, sanitizeString } from '@/lib/models' // 产品数据模型和验证函数
import { ObjectId } from 'mongodb' // MongoDB对象ID类型
import { sampleProducts } from '@/lib/seed-data' // 示例产品数据

// 【重点】路由参数接口 - 定义动态路由参数类型
interface RouteParams {
  params: { id: string } // 产品ID或slug
}

// 【重点】GET /api/products/[id] - 获取单个产品详情
// 根据产品ID或slug获取产品信息和相关产品，用于产品详情页面
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // 【重点】获取路由参数 - 提取产品ID或slug
    const { id } = params
    
    // 【重点】参数验证 - 确保ID参数存在
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' }, // 产品ID必需
        { status: 400 } // HTTP 400 请求错误
      )
    }

    // 【重点】初始化变量 - 准备存储产品和相关产品数据
    let product: any = null
    let relatedProducts: any[] = []

    // 【重点】使用模拟数据 - 当前直接使用示例数据（开发阶段）
    console.log('Using mock data for product:', id)
    // 【重点】查找产品 - 支持通过slug或ID查找
    product = sampleProducts.find(p => p.slug === id || p.id === id)
    if (product) {
      // 【重点】查找相关产品 - 同分类的其他产品，最多4个
      relatedProducts = sampleProducts
        .filter(p => p.category === product.category && p.slug !== id) // 同分类但不是当前产品
        .slice(0, 4) // 限制4个相关产品
    }
    console.log('Found product:', product ? product.name : 'Not found')

    // 【重点】产品不存在处理 - 返回404错误
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' }, // 产品未找到
        { status: 404 } // HTTP 404 未找到
      )
    }

    // 【重点】返回产品数据 - 包含产品详情和相关产品
    return NextResponse.json({
      product, // 产品详情
      relatedProducts, // 相关产品列表
      success: true // 成功标识
    })

  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product', success: false },
      { status: 500 }
    )
  }
}

// 【重点】PUT /api/products/[id] - 更新产品信息（仅管理员）
// 用于后台管理系统更新产品信息，包含数据验证和安全检查
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // 【重点】获取参数和请求体 - 提取产品ID和更新数据
    const { id } = params
    const body: Partial<Product> = await request.json()
    
    // 【重点】ID格式验证 - 确保是有效的MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' }, // 无效的产品ID
        { status: 400 } // HTTP 400 请求错误
      )
    }
    
    // 【重点】数据验证 - 如果提供了数据则进行验证
    if (Object.keys(body).length > 0) {
      const validation = validateProduct(body)
      if (!validation.isValid) {
        return NextResponse.json(
          { 
            error: 'Validation failed', // 验证失败
            details: validation.errors // 详细错误信息
          },
          { status: 400 } // HTTP 400 请求错误
        )
      }
    }
    
    // 【重点】数据清理 - 防止XSS攻击，清理字符串字段
    const sanitizedBody: Partial<Product> = { ...body }
    if (body.name) sanitizedBody.name = sanitizeString(body.name) // 清理产品名称
    if (body.description) sanitizedBody.description = sanitizeString(body.description) // 清理产品描述
    if (body.category) sanitizedBody.category = sanitizeString(body.category) // 清理产品分类

    // 【重点】获取数据库连接
    const db = await getDatabase()
    const collection = db.collection(COLLECTIONS.PRODUCTS)

    // 【重点】检查产品是否存在 - 确保要更新的产品存在
    const existingProduct = await collection.findOne({ _id: new ObjectId(id) })
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' }, // 产品未找到
        { status: 404 } // HTTP 404 未找到
      )
    }

    // 【重点】更新slug处理 - 如果产品名称改变则更新URL友好标识符
    if (sanitizedBody.name && sanitizedBody.name !== existingProduct.name) {
      const newSlug = sanitizedBody.name
        .toLowerCase() // 转小写
        .replace(/[^a-z0-9]+/g, '-') // 非字母数字字符替换为连字符
        .replace(/(^-|-$)/g, '') // 移除首尾连字符
      
      // 【重点】检查新slug是否已存在 - 防止重复的URL标识符
      const slugExists = await collection.findOne({ 
        slug: newSlug, // 查找相同slug
        _id: { $ne: new ObjectId(id) } // 排除当前产品
      })
      
      if (slugExists) {
        return NextResponse.json(
          { error: 'Product with this name already exists' }, // 产品名称已存在
          { status: 409 } // HTTP 409 冲突
        )
      }
      
      sanitizedBody.slug = newSlug // 设置新的slug
    }

    // 【重点】准备更新数据 - 添加更新时间戳
    const updateData = {
      ...sanitizedBody, // 包含所有更新字段
      updatedAt: new Date() // 更新时间
    }

    // 【重点】执行数据库更新操作
    const result = await collection.updateOne(
      { _id: new ObjectId(id) }, // 查找条件：根据ID
      { $set: updateData } // 更新操作：设置新数据
    )

    // 【重点】检查更新结果 - 确保产品确实被更新
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' }, // 产品未找到
        { status: 404 } // HTTP 404 未找到
      )
    }

    // 【重点】返回成功响应 - 告知更新成功
    return NextResponse.json({
      message: 'Product updated successfully', // 更新成功消息
      success: true // 成功标识
    })

  } catch (error) {
    // 【重点】错误处理 - 记录错误并返回错误响应
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product', success: false }, // 更新失败
      { status: 500 } // HTTP 500 服务器错误
    )
  }
}

// 【重点】DELETE /api/products/[id] - 删除产品（仅管理员）
// 使用软删除方式，将产品标记为非活跃状态而不是物理删除
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // 【重点】获取路由参数 - 提取产品ID
    const { id } = params
    
    // 【重点】ID格式验证 - 确保是有效的MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' }, // 无效的产品ID
        { status: 400 } // HTTP 400 请求错误
      )
    }

    // 【重点】获取数据库连接
    const db = await getDatabase()
    const collection = db.collection(COLLECTIONS.PRODUCTS)

    // 【重点】软删除操作 - 设置active为false而不是物理删除
    // 这样可以保留数据用于审计和恢复
    const result = await collection.updateOne(
      { _id: new ObjectId(id) }, // 查找条件：根据ID
      { 
        $set: { 
          active: false, // 标记为非活跃
          updatedAt: new Date() // 更新时间
        } 
      }
    )

    // 【重点】检查删除结果 - 确保产品确实被找到并标记删除
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' }, // 产品未找到
        { status: 404 } // HTTP 404 未找到
      )
    }

    // 【重点】返回成功响应 - 告知删除成功
    return NextResponse.json({
      message: 'Product deleted successfully', // 删除成功消息
      success: true // 成功标识
    })

  } catch (error) {
    // 【重点】错误处理 - 记录错误并返回错误响应
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product', success: false }, // 删除失败
      { status: 500 } // HTTP 500 服务器错误
    )
  }
}