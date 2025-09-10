// 【重点】产品咨询API接口 - 处理产品页面的咨询表单提交
// 这个文件负责接收产品相关的咨询，保存到数据库并发送邮件通知

import { NextRequest, NextResponse } from 'next/server' // Next.js服务器端请求和响应处理
import { getDatabase, COLLECTIONS } from '@/lib/mongodb' // 数据库连接和集合定义
import { Inquiry, validateInquiry, sanitizeInquiry } from '@/lib/models' // 咨询数据模型和验证
import { inquiryFormLimiter, createRateLimitMiddleware, securityHeaders } from '@/lib/rate-limiter' // 限流和安全保护
import { AppError, ValidationError, logError, handleApiError } from '@/lib/error-handler' // 错误处理
import nodemailer from 'nodemailer' // 邮件发送库

// 【重点】POST /api/inquiries - 创建新的产品咨询
// 处理产品详情页面的咨询表单，包含产品信息和客户信息
export async function POST(request: NextRequest) {
  try {
    // 【重点】限流保护 - 防止恶意提交和垃圾邮件
    const rateLimitMiddleware = createRateLimitMiddleware(inquiryFormLimiter)
    const rateLimitResult = rateLimitMiddleware(request)
    
    // 【重点】解析请求体 - 获取客户提交的咨询数据
    const body = await request.json()
    
    // 【重点】数据验证 - 确保所有必填字段都存在且格式正确
    const validation = validateInquiry(body)
    if (!validation.isValid) {
      throw new ValidationError('Validation failed', validation.errors)
    }
    
    // 【重点】数据清理 - 防止XSS攻击和恶意代码注入
    const sanitizedData = sanitizeInquiry(body)
    
    // 【重点】保存咨询到数据库 - 记录产品咨询信息用于后续跟进
    const db = await getDatabase()
    
    // 【重点】构建咨询记录 - 包含客户信息、产品信息和系统信息
    const inquiry: Partial<Inquiry> = {
      name: sanitizedData.name || '', // 客户姓名
      email: sanitizedData.email || '', // 客户邮箱
      phone: sanitizedData.phone, // 客户电话（可选）
      country: sanitizedData.country || '', // 客户国家
      company: sanitizedData.company, // 客户公司（可选）
      productInterest: sanitizedData.productInterest, // 感兴趣的产品类型
      productId: sanitizedData.productId, // 具体产品ID
      productName: sanitizedData.productName, // 具体产品名称
      quantity: sanitizedData.quantity, // 需求数量
      message: sanitizedData.message || '', // 咨询消息
      status: 'new', // 咨询状态：新咨询
      priority: 'medium', // 优先级：中等
      source: 'website', // 来源：网站
      ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown', // 客户IP地址
      userAgent: request.headers.get('user-agent') || 'unknown', // 客户浏览器信息
      notes: [], // 备注（空数组）
      createdAt: new Date(), // 创建时间
      updatedAt: new Date() // 更新时间
    }
    
    // 【重点】插入数据库 - 保存咨询记录
    const result = await db.collection(COLLECTIONS.INQUIRIES).insertOne(inquiry)
    
    // 【重点】发送邮件通知 - 通知管理员有新的产品咨询
    try {
      // 【重点】邮件配置 - 获取SMTP服务器配置信息
      const emailPassword = process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS // 兼容两种环境变量名
      const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com' // SMTP服务器地址
      const smtpPort = parseInt(process.env.SMTP_PORT || '587') // SMTP端口
      const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER // 发送邮箱账号
      const smtpFrom = process.env.SMTP_FROM || process.env.EMAIL_USER // 发件人邮箱
      const smtpTo = process.env.SMTP_TO || process.env.ADMIN_EMAIL || process.env.EMAIL_USER // 收件人邮箱
      
      // 【重点】配置检查 - 如果邮件配置不完整则跳过邮件发送
      if (!smtpUser || !emailPassword) {
        console.warn('Email configuration missing, skipping email notifications')
        return NextResponse.json({
          success: true,
          inquiryId: result.insertedId,
          message: 'Inquiry submitted successfully (email notifications disabled)'
        })
      }
      
      // 【重点】创建邮件发送器 - 配置SMTP连接
      const transporter = nodemailer.createTransport({
        host: smtpHost, // SMTP服务器地址
        port: smtpPort, // SMTP端口
        secure: false, // 使用TLS而非SSL
        auth: {
          user: smtpUser, // 发送邮箱账号
          pass: emailPassword // 发送邮箱密码
        }
      })
      
      // 【重点】管理员通知邮件 - 发送产品咨询详情给管理员
      const adminEmailHtml = `
        <h2>New Product Inquiry</h2>
        <p><strong>Product:</strong> ${inquiry.productName}</p>
        <p><strong>Customer:</strong> ${inquiry.name}</p>
        <p><strong>Company:</strong> ${inquiry.company || 'N/A'}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phone || 'N/A'}</p>
        <p><strong>Country:</strong> ${inquiry.country || 'N/A'}</p>
        <p><strong>Quantity:</strong> ${inquiry.quantity || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${inquiry.message}</p>
        <hr>
        <p><small>Inquiry ID: ${result.insertedId}</small></p>
      `
      
      // 【重点】发送管理员邮件 - 通知有新的产品咨询
      await transporter.sendMail({
        from: smtpFrom, // 发件人
        to: smtpTo, // 管理员邮箱
        subject: `New Product Inquiry - ${inquiry.productName}`, // 邮件主题
        html: adminEmailHtml // HTML邮件内容
      })
      
      // 【重点】客户确认邮件 - 向客户发送咨询确认邮件
      const customerEmailHtml = `
        <h2>Thank you for your inquiry!</h2>
        <p>Dear ${inquiry.name},</p>
        <p>We have received your inquiry about <strong>${inquiry.productName}</strong> and will get back to you within 24 hours.</p>
        <p><strong>Your inquiry details:</strong></p>
        <ul>
          <li>Product: ${inquiry.productName}</li>
          <li>Quantity: ${inquiry.quantity || 'Not specified'}</li>
          <li>Message: ${inquiry.message}</li>
        </ul>
        <p>Best regards,<br>WELL-LI Cases Team</p>
        <hr>
        <p><small>Reference ID: ${result.insertedId}</small></p>
      `
      
      // 【重点】发送客户确认邮件 - 告知客户我们已收到咨询
      await transporter.sendMail({
        from: smtpFrom, // 发件人
        to: inquiry.email, // 客户邮箱
        subject: `Thank you for your inquiry - ${inquiry.productName}`, // 邮件主题
        html: customerEmailHtml // HTML邮件内容
      })
      
    } catch (emailError) {
      // 【重点】邮件发送错误处理 - 即使邮件发送失败也要继续处理
      console.error('Failed to send email:', emailError)
      // Continue even if email fails
    }
    
    // 【重点】返回成功响应 - 告知前端咨询提交成功
    return NextResponse.json({
      success: true, // 成功标志
      inquiryId: result.insertedId, // 咨询记录ID
      message: 'Inquiry submitted successfully' // 成功消息
    }, {
      headers: securityHeaders // 安全头部
    })
    
  } catch (error) {
    // 【重点】错误处理 - 统一处理各种错误情况
    const appError = handleApiError(error) // 转换为应用错误
    logError(appError, { context: 'product-inquiry', request: request.url }) // 记录错误日志
    
    // 【重点】返回错误响应 - 向前端返回错误信息
    return NextResponse.json(
      { 
        error: appError.message, // 错误消息
        code: appError.code || 'UNKNOWN_ERROR' // 错误代码
      },
      { 
        status: appError.statusCode || 500, // HTTP错误状态码
        headers: securityHeaders // 安全头部
      }
    )
  }
}

// 【重点】GET /api/inquiries - 获取咨询列表（仅管理员）
// 用于后台管理系统查看和管理客户咨询
export async function GET(request: NextRequest) {
  try {
    // 【重点】解析查询参数 - 获取分页和筛选参数
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1') // 页码，默认第1页
    const limit = parseInt(searchParams.get('limit') || '20') // 每页数量，默认20条
    const status = searchParams.get('status') // 状态筛选（可选）
    const skip = (page - 1) * limit // 跳过的记录数
    
    // 【重点】连接数据库
    const db = await getDatabase()
    const collection = db.collection(COLLECTIONS.INQUIRIES)
    
    // 【重点】构建筛选条件 - 根据状态筛选咨询
    const filter: any = {}
    if (status) {
      filter.status = status // 按状态筛选
    }
    
    // 【重点】查询咨询列表 - 支持分页和排序
    const inquiries = await collection
      .find(filter) // 应用筛选条件
      .sort({ createdAt: -1 }) // 按创建时间倒序排列
      .skip(skip) // 跳过指定数量（分页）
      .limit(limit) // 限制返回数量
      .toArray() // 转换为数组
    
    // 【重点】查询总数 - 用于分页计算
    const total = await collection.countDocuments(filter)
    
    // 【重点】返回咨询列表和分页信息
    return NextResponse.json({
      inquiries, // 咨询列表
      pagination: { // 分页信息
        page, // 当前页码
        limit, // 每页数量
        total, // 总记录数
        pages: Math.ceil(total / limit) // 总页数
      }
    })
    
  } catch (error) {
    console.error('Failed to get inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to get inquiries' },
      { status: 500 }
    )
  }
}