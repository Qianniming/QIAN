// 【重点】联系表单API接口 - 处理网站联系表单提交和邮件发送
// 这个文件负责接收用户咨询，保存到数据库，并发送邮件通知

import { NextRequest, NextResponse } from 'next/server' // Next.js服务器端请求和响应处理
import nodemailer from 'nodemailer' // 邮件发送库
import { getDatabase, COLLECTIONS } from '@/lib/mongodb' // 数据库连接和集合定义
import { Inquiry, DefaultInquiry, validateInquiry, sanitizeInquiry } from '@/lib/models' // 咨询数据模型和验证
import { AppError, ValidationError, DatabaseError, logError, handleApiError } from '@/lib/error-handler' // 错误处理
import { contactFormLimiter, createRateLimitMiddleware, securityHeaders } from '@/lib/rate-limiter' // 限流和安全保护

// 【重点】联系表单数据类型定义 - 定义前端提交的表单数据结构
interface ContactFormData {
  name: string // 客户姓名（必填）
  email: string // 客户邮箱（必填）
  phone?: string // 客户电话（可选）
  country: string // 客户国家（必填）
  company?: string // 客户公司（可选）
  productInterest?: string // 感兴趣的产品（可选）
  message: string // 咨询消息（必填）
}

// 【重点】创建邮件发送器 - 配置SMTP服务器连接
// 支持Gmail和其他SMTP服务器，用于发送通知邮件
const createTransporter = () => {
  // 【重点】兼容性处理 - 支持多种环境变量名称
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER
  const emailPassword = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
  const smtpPort = parseInt(process.env.SMTP_PORT || '587')
  
  // 【重点】配置检查 - 确保邮件配置完整
  if (!emailUser || !emailPassword) {
    throw new Error('Email configuration missing. Please set SMTP_USER and SMTP_PASS environment variables.')
  }
  
  // 【重点】创建163邮箱SMTP传输器 - 适配网易163邮箱配置
  const isPort465 = smtpPort === 465
  
  return nodemailer.createTransport({
    host: smtpHost, // SMTP服务器地址
    port: smtpPort, // SMTP端口
    secure: isPort465, // 465端口使用SSL，587使用TLS
    auth: { // 认证信息
      user: emailUser, // 发送邮箱账号
      pass: emailPassword // 发送邮箱密码或应用密码
    },
    tls: {
      rejectUnauthorized: false // 允许自签名证书
    }
  })
}

// 【重点】管理员通知邮件模板 - 当有新咨询时发送给管理员的邮件
// 使用HTML格式，包含完整的客户信息和专业的邮件样式
const createAdminEmailTemplate = (data: ContactFormData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Inquiry from WELL-LI Website</title>
      <style>
        /* 【重点】邮件样式 - 确保在各种邮件客户端中正常显示 */
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; }
        .value { margin-top: 5px; padding: 10px; background: white; border-left: 4px solid #3b82f6; }
        .message { background: white; padding: 15px; border-radius: 5px; margin-top: 10px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- 【重点】邮件头部 - 显示公司信息和通知类型 -->
        <div class="header">
          <h1>New Customer Inquiry</h1>
          <p>WELL-LI Cases Website</p>
        </div>
        
        <!-- 【重点】邮件内容 - 显示客户提交的所有信息 -->
        <div class="content">
          <!-- 客户姓名 -->
          <div class="field">
            <div class="label">Customer Name:</div>
            <div class="value">${data.name}</div>
          </div>
          
          <!-- 客户邮箱 -->
          <div class="field">
            <div class="label">Email Address:</div>
            <div class="value">${data.email}</div>
          </div>
          
          <!-- 客户电话（如果提供） -->
          ${data.phone ? `
          <div class="field">
            <div class="label">Phone Number:</div>
            <div class="value">${data.phone}</div>
          </div>
          ` : ''}
          
          <!-- 客户国家 -->
          <div class="field">
            <div class="label">Country:</div>
            <div class="value">${data.country}</div>
          </div>
          
          <!-- 客户公司（如果提供） -->
          ${data.company ? `
          <div class="field">
            <div class="label">Company:</div>
            <div class="value">${data.company}</div>
          </div>
          ` : ''}
          
          <!-- 感兴趣的产品（如果选择） -->
          ${data.productInterest ? `
          <div class="field">
            <div class="label">Product of Interest:</div>
            <div class="value">${data.productInterest}</div>
          </div>
          ` : ''}
          
          <!-- 客户咨询消息 -->
          <div class="field">
            <div class="label">Message:</div>
            <div class="message">${data.message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        
        <!-- 【重点】邮件底部 - 提醒管理员及时回复 -->
        <div class="footer">
          <p>This inquiry was submitted through the WELL-LI Cases website contact form.</p>
          <p>Please respond to the customer within 24 hours.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// 【重点】客户确认邮件模板 - 向客户发送的自动确认邮件
// 告知客户我们已收到咨询，并说明后续处理流程
const createCustomerEmailTemplate = (data: ContactFormData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Thank you for your inquiry - WELL-LI Cases</title>
      <style>
        /* 【重点】客户邮件样式 - 专业友好的确认邮件样式 */
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 20px; }
        .highlight { background: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .contact-info { background: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- 【重点】感谢标题 - 表达对客户咨询的感谢 -->
        <div class="header">
          <h1>Thank You for Your Inquiry!</h1>
          <p>WELL-LI Plastic Products Co., Ltd.</p>
        </div>
        
        <!-- 【重点】邮件主体内容 - 详细说明后续处理流程 -->
        <div class="content">
          <p>Dear ${data.name},</p>
          
          <p>Thank you for your interest in WELL-LI Cases. We have received your inquiry and our team will review your requirements carefully.</p>
          
          <!-- 【重点】处理流程说明 - 让客户了解接下来会发生什么 -->
          <div class="highlight">
            <h3>What happens next?</h3>
            <ul>
              <li>Our sales team will review your inquiry within 24 hours</li>
              <li>We'll prepare a customized quote based on your requirements</li>
              <li>You'll receive a detailed response with product specifications and pricing</li>
              <li>Our team will be available to answer any additional questions</li>
            </ul>
          </div>
          
          <!-- 【重点】联系信息 - 提供直接联系方式 -->
          <div class="contact-info">
            <h3>Contact Information</h3>
            <p><strong>Email:</strong> info@well-li.com</p>
            <p><strong>Phone:</strong> +86 20 1234 5678</p>
            <p><strong>Address:</strong> Industrial Zone, Guangzhou, China</p>
            <p><strong>Business Hours:</strong> Mon-Fri 8:00 AM - 6:00 PM (GMT+8)</p>
          </div>
          
          <p>If you have any urgent questions, please don't hesitate to contact us directly.</p>
          
          <p>Best regards,<br>
          The WELL-LI Cases Team</p>
        </div>
        
        <!-- 【重点】邮件底部 - 公司信息和免责声明 -->
        <div class="footer">
          <p>WELL-LI Plastic Products Co., Ltd. | Reliable Protective Cases Manufacturer</p>
          <p>This is an automated confirmation email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// 【重点】POST接口 - 处理联系表单提交
// 这是主要的API端点，负责接收表单数据、验证、保存到数据库并发送邮件
export async function POST(request: NextRequest) {
  try {
    // 【重点】限流保护 - 防止恶意提交和垃圾邮件
    const rateLimitMiddleware = createRateLimitMiddleware(contactFormLimiter)
    const rateLimitResult = rateLimitMiddleware(request)
    
    // 【重点】解析请求体 - 获取客户提交的表单数据
    const body: ContactFormData = await request.json()
    
    // 【重点】数据验证 - 确保所有必填字段都存在且格式正确
    const validation = validateInquiry(body)
    if (!validation.isValid) {
      throw new ValidationError('Validation failed', validation.errors)
    }
    
    // 【重点】数据清理 - 防止XSS攻击和恶意代码注入
    const sanitizedData = sanitizeInquiry(body)
    
    // 【重点】创建邮件发送器 - 准备发送通知邮件
    const transporter = createTransporter()
    
    // 【重点】准备管理员通知邮件 - 将客户咨询发送给管理员
    const adminEmailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || process.env.EMAIL_USER, // 发件人邮箱
      to: process.env.SMTP_TO || process.env.ADMIN_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER, // 管理员邮箱
      subject: `New Inquiry from ${sanitizedData.name} - WELL-LI Cases`, // 邮件主题
      html: createAdminEmailTemplate(sanitizedData as ContactFormData) // HTML邮件内容
    }
    
    // 【重点】准备客户确认邮件 - 向客户发送确认收到咨询的邮件
    const customerEmailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER || process.env.EMAIL_USER, // 发件人邮箱
      to: sanitizedData.email, // 客户邮箱
      subject: 'Thank you for your inquiry - WELL-LI Cases', // 邮件主题
      html: createCustomerEmailTemplate(sanitizedData as ContactFormData) // HTML邮件内容
    }
    
    // 【重点】并行发送邮件 - 同时发送管理员通知和客户确认邮件
    await Promise.all([
      transporter.sendMail(adminEmailOptions),
      transporter.sendMail(customerEmailOptions)
    ])
    
    // 【重点】保存咨询到数据库 - 记录客户咨询信息用于后续跟进
    try {
      const db = await getDatabase() // 连接数据库
      
      // 【重点】构建咨询记录 - 包含客户信息和系统信息
      const inquiry: Partial<Inquiry> = {
        ...DefaultInquiry, // 默认字段值
        name: sanitizedData.name, // 客户姓名
        email: sanitizedData.email, // 客户邮箱
        phone: sanitizedData.phone, // 客户电话
        country: sanitizedData.country, // 客户国家
        company: sanitizedData.company, // 客户公司
        productInterest: sanitizedData.productInterest, // 感兴趣的产品
        message: sanitizedData.message, // 咨询消息
        ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown', // 客户IP地址
        userAgent: request.headers.get('user-agent') || 'unknown', // 客户浏览器信息
        createdAt: new Date(), // 创建时间
        updatedAt: new Date() // 更新时间
      }
      
      // 【重点】插入数据库 - 保存咨询记录
      const result = await db.collection(COLLECTIONS.INQUIRIES).insertOne(inquiry)
      console.log('Inquiry saved to database:', result.insertedId)
    } catch (dbError) {
      // 【重点】数据库错误处理 - 即使数据库保存失败也要继续发送邮件
      console.error('Failed to save inquiry to database:', dbError)
      logError(new DatabaseError('Failed to save inquiry'), { context: 'contact-form' })
      // Continue with email sending even if database save fails
    }
    
    // 【重点】返回成功响应 - 告知前端提交成功
    return NextResponse.json(
      { 
        message: 'Inquiry submitted successfully', // 成功消息
        success: true // 成功标志
      },
      { 
        status: 200, // HTTP状态码
        headers: securityHeaders // 安全头部
      }
    )
    
  } catch (error) {
    // 【重点】错误处理 - 统一处理各种错误情况
    const appError = handleApiError(error) // 转换为应用错误
    logError(appError, { context: 'contact-form', request: request.url }) // 记录错误日志
    
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

// 【重点】GET接口 - 用于测试API是否正常工作
// 可选功能，主要用于健康检查和调试
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Contact API endpoint is working',
      methods: ['POST']
    },
    { 
      status: 200,
      headers: securityHeaders
    }
  )
}