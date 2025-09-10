import { ObjectId } from 'mongodb'

// Base interface for all documents
interface BaseDocument {
  _id?: ObjectId
  createdAt: Date
  updatedAt: Date
}

// Inquiry/Contact form submission
export interface Inquiry extends BaseDocument {
  name: string
  email: string
  phone?: string
  country: string
  company?: string
  productInterest?: string
  productId?: string
  productName?: string
  quantity?: string
  message: string
  status: 'new' | 'contacted' | 'quoted' | 'closed'
  priority: 'low' | 'medium' | 'high'
  assignedTo?: string
  notes?: string[]
  source: 'website' | 'email' | 'phone' | 'trade_show' | 'referral'
  ipAddress?: string
  userAgent?: string
}

// Product information
export interface Product extends BaseDocument {
  name: string
  slug: string
  category: string
  subcategory?: string
  description: string
  longDescription?: string
  images: string[]
  specifications: {
    dimensions?: string
    weight?: string
    material?: string
    waterproof?: string
    [key: string]: string | undefined
  }
  features: string[]
  applications: string[]
  certifications: string[]
  colors?: Array<{
    name: string
    code: string
  }>
  accessories?: string[]
  price?: {
    currency: string
    amount: number
    unit: string
  }
  dimensions?: {
    external: {
      length: number
      width: number
      height: number
      unit: string
    }
    internal: {
      length: number
      width: number
      height: number
      unit: string
    }
  }
  weight?: {
    value: number
    unit: string
  }
  volume?: {
    value: number
    unit: string
  }
  protectionRating?: string
  temperatureRange?: {
    min: number
    max: number
    unit: string
  }
  featured: boolean
  active: boolean
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  sortOrder: number
  // Frontend compatibility fields
  id?: string // For frontend compatibility
  image?: string // For frontend compatibility
}

// Product category
export interface Category extends BaseDocument {
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: ObjectId
  active: boolean
  sortOrder: number
  seoTitle?: string
  seoDescription?: string
}

// User/Admin
export interface User extends BaseDocument {
  email: string
  name: string
  role: 'admin' | 'sales' | 'manager'
  password: string // hashed
  active: boolean
  lastLogin?: Date
  permissions: string[]
}

// Site settings
export interface SiteSettings extends BaseDocument {
  key: string
  value: any
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  description?: string
  category: 'general' | 'email' | 'seo' | 'social' | 'analytics'
}

// Analytics/Statistics
export interface Analytics extends BaseDocument {
  type: 'page_view' | 'inquiry' | 'product_view' | 'download'
  page?: string
  productId?: ObjectId
  inquiryId?: ObjectId
  country?: string
  ipAddress?: string
  userAgent?: string
  referrer?: string
  sessionId?: string
}

// Newsletter subscription
export interface Newsletter extends BaseDocument {
  email: string
  name?: string
  country?: string
  active: boolean
  source: 'website' | 'trade_show' | 'manual'
  tags?: string[]
}

// File/Media
export interface Media extends BaseDocument {
  filename: string
  originalName: string
  mimeType: string
  size: number
  path: string
  url: string
  alt?: string
  caption?: string
  tags?: string[]
  uploadedBy: ObjectId
}

// Quote/RFQ
export interface Quote extends BaseDocument {
  inquiryId: ObjectId
  quoteNumber: string
  customerName: string
  customerEmail: string
  products: Array<{
    productId: ObjectId
    quantity: number
    unitPrice: number
    customizations?: string[]
    notes?: string
  }>
  totalAmount: number
  currency: string
  validUntil: Date
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  terms?: string
  notes?: string
  createdBy: ObjectId
  sentAt?: Date
  respondedAt?: Date
}

// Type guards
export function isInquiry(obj: any): obj is Inquiry {
  return obj && 
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.country === 'string' &&
    typeof obj.message === 'string'
}

export function isProduct(obj: any): obj is Product {
  return obj &&
    typeof obj.name === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.description === 'string' &&
    Array.isArray(obj.images)
}

export function isUser(obj: any): obj is User {
  return obj &&
    typeof obj.email === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.role === 'string'
}

// Enhanced validation functions
export function validateInquiry(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required')
  } else {
    const name = data.name.trim()
    if (name.length < InquiryValidation.name.minLength || name.length > InquiryValidation.name.maxLength) {
      errors.push(`Name must be between ${InquiryValidation.name.minLength} and ${InquiryValidation.name.maxLength} characters`)
    }
    // Check for suspicious patterns
    if (/[<>"'&\{\}]/.test(name)) {
      errors.push('Name contains invalid characters')
    }
  }
  
  // Email validation
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required')
  } else {
    const email = data.email.trim().toLowerCase()
    if (!InquiryValidation.email.pattern.test(email)) {
      errors.push('Invalid email format')
    }
    if (email.length > 254) { // RFC 5321 limit
      errors.push('Email address is too long')
    }
  }
  
  // Country validation
  if (!data.country || typeof data.country !== 'string') {
    errors.push('Country is required')
  } else {
    const country = data.country.trim()
    if (country.length > InquiryValidation.country.maxLength) {
      errors.push(`Country must be less than ${InquiryValidation.country.maxLength} characters`)
    }
    if (/[<>"'&\{\}]/.test(country)) {
      errors.push('Country contains invalid characters')
    }
  }
  
  // Message validation
  if (!data.message || typeof data.message !== 'string') {
    errors.push('Message is required')
  } else {
    const message = data.message.trim()
    if (message.length < InquiryValidation.message.minLength || message.length > InquiryValidation.message.maxLength) {
      errors.push(`Message must be between ${InquiryValidation.message.minLength} and ${InquiryValidation.message.maxLength} characters`)
    }
  }
  
  // Optional fields validation
  if (data.phone && typeof data.phone === 'string') {
    const phone = data.phone.trim()
    if (phone.length > InquiryValidation.phone.maxLength) {
      errors.push(`Phone must be less than ${InquiryValidation.phone.maxLength} characters`)
    }
    // Basic phone format validation
    if (!/^[+\d\s\-\(\)]+$/.test(phone)) {
      errors.push('Phone number contains invalid characters')
    }
  }
  
  if (data.company && typeof data.company === 'string') {
    const company = data.company.trim()
    if (company.length > InquiryValidation.company.maxLength) {
      errors.push(`Company must be less than ${InquiryValidation.company.maxLength} characters`)
    }
    if (/[<>"'&\{\}]/.test(company)) {
      errors.push('Company name contains invalid characters')
    }
  }
  
  // Additional security checks
  const suspiciousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:(?:text\/html|application\/javascript)/gi
  ]
  
  const textFields = [data.name, data.message, data.company, data.productInterest]
  for (const field of textFields) {
    if (typeof field === 'string') {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(field)) {
          errors.push('Invalid content detected')
          break
        }
      }
    }
  }
  
  return { isValid: errors.length === 0, errors }
}

export function validateProduct(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required')
  } else {
    const name = data.name.trim()
    if (name.length < ProductValidation.name.minLength || name.length > ProductValidation.name.maxLength) {
      errors.push(`Name must be between ${ProductValidation.name.minLength} and ${ProductValidation.name.maxLength} characters`)
    }
    if (/[<>"'&\{\}]/.test(name)) {
      errors.push('Name contains invalid characters')
    }
  }
  
  // Category validation
  if (!data.category || typeof data.category !== 'string') {
    errors.push('Category is required')
  } else {
    const category = data.category.trim()
    if (category.length > ProductValidation.category.maxLength) {
      errors.push(`Category must be less than ${ProductValidation.category.maxLength} characters`)
    }
    if (/[<>"'&\{\}]/.test(category)) {
      errors.push('Category contains invalid characters')
    }
  }
  
  // Description validation
  if (!data.description || typeof data.description !== 'string') {
    errors.push('Description is required')
  } else {
    const description = data.description.trim()
    if (description.length < ProductValidation.description.minLength || description.length > ProductValidation.description.maxLength) {
      errors.push(`Description must be between ${ProductValidation.description.minLength} and ${ProductValidation.description.maxLength} characters`)
    }
  }
  
  // Images validation
  if (!Array.isArray(data.images)) {
    errors.push('Images must be an array')
  } else if (data.images.length < ProductValidation.images.minItems) {
    errors.push(`At least ${ProductValidation.images.minItems} image is required`)
  } else {
    // Validate image URLs
    for (const image of data.images) {
      if (typeof image !== 'string' || !image.trim()) {
        errors.push('All images must be valid URLs')
        break
      }
    }
  }
  
  // Specifications validation
  if (!data.specifications || typeof data.specifications !== 'object') {
    errors.push('Specifications are required')
  }
  
  // Features validation
  if (!Array.isArray(data.features)) {
    errors.push('Features must be an array')
  } else if (data.features.length < ProductValidation.features.minItems) {
    errors.push(`At least ${ProductValidation.features.minItems} feature is required`)
  } else {
    // Validate feature strings
    for (const feature of data.features) {
      if (typeof feature !== 'string' || !feature.trim()) {
        errors.push('All features must be valid strings')
        break
      }
    }
  }
  
  // Optional fields validation
  if (data.slug && typeof data.slug === 'string') {
    if (!/^[a-z0-9-]+$/.test(data.slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens')
    }
  }
  
  return { isValid: errors.length === 0, errors }
}

// Enhanced sanitization functions
export function sanitizeString(str: string): string {
  if (typeof str !== 'string') return ''
  
  return str
    .trim()
    .replace(/[<>"'&]/g, (match) => {
      const entities: { [key: string]: string } = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      }
      return entities[match] || match
    })
    // Remove potentially dangerous patterns
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/data:(?:text\/html|application\/javascript)/gi, '')
    // Limit length to prevent abuse
    .substring(0, 2000)
}

export function sanitizeInquiry(data: any): Partial<Inquiry> {
  const sanitized = {
    name: data.name ? sanitizeString(data.name) : '',
    email: data.email ? sanitizeString(data.email.toLowerCase().trim()) : '',
    phone: data.phone ? sanitizeString(data.phone) : undefined,
    country: data.country ? sanitizeString(data.country) : '',
    company: data.company ? sanitizeString(data.company) : undefined,
    productInterest: data.productInterest ? sanitizeString(data.productInterest) : undefined,
    productId: data.productId ? sanitizeString(data.productId) : undefined,
    productName: data.productName ? sanitizeString(data.productName) : undefined,
    quantity: data.quantity ? sanitizeString(data.quantity) : undefined,
    message: data.message ? sanitizeString(data.message) : ''
  }
  
  // Remove empty optional fields
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key as keyof typeof sanitized] === undefined || 
        sanitized[key as keyof typeof sanitized] === '') {
      if (key !== 'name' && key !== 'email' && key !== 'country' && key !== 'message') {
        delete sanitized[key as keyof typeof sanitized]
      }
    }
  })
  
  return sanitized
}

// Validation schemas (basic)
export const InquiryValidation = {
  name: { required: true, minLength: 2, maxLength: 100 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { required: false, maxLength: 20 },
  country: { required: true, maxLength: 50 },
  company: { required: false, maxLength: 100 },
  productInterest: { required: false, maxLength: 50 },
  productId: { required: false, maxLength: 50 },
  productName: { required: false, maxLength: 200 },
  quantity: { required: false, maxLength: 50 },
  message: { required: true, minLength: 10, maxLength: 2000 }
}

export const ProductValidation = {
  name: { required: true, minLength: 3, maxLength: 200 },
  category: { required: true, maxLength: 50 },
  description: { required: true, minLength: 10, maxLength: 500 },
  images: { required: true, minItems: 1 },
  specifications: { required: true },
  features: { required: true, minItems: 1 }
}

// Default values
export const DefaultInquiry: Partial<Inquiry> = {
  status: 'new',
  priority: 'medium',
  source: 'website',
  notes: [],
  createdAt: new Date(),
  updatedAt: new Date()
}

export const DefaultProduct: Partial<Product> = {
  featured: false,
  active: true,
  sortOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}