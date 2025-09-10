// Global error handling utilities

export interface ErrorInfo {
  message: string
  stack?: string
  code?: string
  statusCode?: number
  timestamp: Date
  userAgent?: string
  url?: string
}

export class AppError extends Error {
  public statusCode: number
  public code?: string
  public isOperational: boolean

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

// Error types
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR')
    this.name = 'DatabaseError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super(message, 503, 'NETWORK_ERROR')
    this.name = 'NetworkError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR')
    this.name = 'AuthenticationError'
  }
}

// Error logging function
export function logError(error: Error | AppError, context?: any) {
  const errorInfo: ErrorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date(),
    ...(error instanceof AppError && { 
      code: error.code, 
      statusCode: error.statusCode 
    }),
    ...(typeof window !== 'undefined' && {
      userAgent: window.navigator?.userAgent,
      url: window.location?.href
    }),
    ...context
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorInfo)
  }

  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Replace with your error tracking service
    // sendErrorToMonitoring(errorInfo)
  }

  return errorInfo
}

// API error handler
export function handleApiError(error: any): AppError {
  // Network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return new NetworkError('Failed to connect to server')
  }

  // HTTP errors
  if (error.response) {
    const status = error.response.status
    const message = error.response.data?.message || error.message

    switch (status) {
      case 400:
        return new ValidationError(message)
      case 401:
        return new AuthenticationError(message)
      case 404:
        return new AppError('Resource not found', 404, 'NOT_FOUND')
      case 429:
        return new AppError('Too many requests', 429, 'RATE_LIMIT')
      case 500:
        return new AppError('Internal server error', 500, 'SERVER_ERROR')
      default:
        return new AppError(message, status)
    }
  }

  // Database errors
  if (error.name === 'MongoError' || error.name === 'MongoServerError') {
    return new DatabaseError(`Database error: ${error.message}`)
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return new ValidationError(error.message)
  }

  // Default error
  return new AppError(error.message || 'An unexpected error occurred')
}

// Async error wrapper
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      const appError = handleApiError(error)
      logError(appError, { context, args })
      throw appError
    }
  }) as T
}

// Client-side error handler
export function handleClientError(error: Error, context?: any) {
  logError(error, { context, source: 'client' })
  
  // Show user-friendly message
  if (process.env.NODE_ENV === 'production') {
    return 'Something went wrong. Please try again.'
  } else {
    return error.message
  }
}

// Form error handler
export function getFieldError(errors: any, field: string): string | undefined {
  if (!errors || typeof errors !== 'object') return undefined
  
  const error = errors[field]
  if (typeof error === 'string') return error
  if (Array.isArray(error) && error.length > 0) return error[0]
  if (error?.message) return error.message
  
  return undefined
}

// Retry mechanism
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      if (i === maxRetries) {
        throw lastError
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, i)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

// Safe async function wrapper
export function safeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  fallback?: any
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      logError(error as Error, { function: fn.name, args })
      return fallback
    }
  }) as T
}