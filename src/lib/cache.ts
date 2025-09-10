// In-memory cache implementation for Next.js

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    }
    this.cache.set(key, item)
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Get cache size
  size(): number {
    return this.cache.size
  }

  // Clean expired items
  cleanup(): number {
    const now = Date.now()
    let cleaned = 0

    for (const entry of Array.from(this.cache.entries())) {
      const [key, item] = entry
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
        cleaned++
      }
    }

    return cleaned
  }

  // Get cache statistics
  stats(): {
    size: number
    keys: string[]
    memoryUsage: number
  } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      memoryUsage: JSON.stringify(Array.from(this.cache.entries())).length
    }
  }
}

// Global cache instance
export const cache = new MemoryCache()

// Cache key generators
export const cacheKeys = {
  products: (filters?: any) => `products:${JSON.stringify(filters || {})}`,
  productById: (id: string) => `product:${id}`,
  categories: () => 'categories',
  inquiries: (page: number, limit: number, status?: string) => 
    `inquiries:${page}:${limit}:${status || 'all'}`,
  healthCheck: () => 'health:check'
}

// Cache wrapper for async functions
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args)
    
    // Try to get from cache
    const cached = cache.get(key)
    if (cached !== null) {
      return cached
    }

    // Execute function and cache result
    try {
      const result = await fn(...args)
      cache.set(key, result, ttl)
      return result
    } catch (error) {
      // Don't cache errors
      throw error
    }
  }) as T
}

// Cache invalidation patterns
export const cacheInvalidation = {
  // Invalidate all product-related cache
  products: () => {
    const keys = Array.from(cache['cache'].keys())
    keys.forEach(key => {
      if (key.startsWith('products:') || key.startsWith('product:')) {
        cache.delete(key)
      }
    })
  },

  // Invalidate category cache
  categories: () => {
    cache.delete(cacheKeys.categories())
  },

  // Invalidate inquiry cache
  inquiries: () => {
    const keys = Array.from(cache['cache'].keys())
    keys.forEach(key => {
      if (key.startsWith('inquiries:')) {
        cache.delete(key)
      }
    })
  }
}

// Auto cleanup - run every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const cleaned = cache.cleanup()
    if (cleaned > 0) {
      console.log(`Cache cleanup: removed ${cleaned} expired items`)
    }
  }, 10 * 60 * 1000)
}

// Response caching helper for API routes
export function createCachedResponse<T>(
  data: T,
  ttl: number = 5 * 60 * 1000,
  headers: Record<string, string> = {}
) {
  return {
    data,
    headers: {
      'Cache-Control': `public, max-age=${Math.floor(ttl / 1000)}`,
      'ETag': `"${Date.now()}"`,
      ...headers
    }
  }
}

// Client-side cache (for browser)
export class ClientCache {
  private prefix = 'wellLi:'

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    if (typeof window === 'undefined') return

    const item = {
      data,
      timestamp: Date.now(),
      ttl
    }

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(this.prefix + key)
      if (!stored) return null

      const item = JSON.parse(stored)
      if (Date.now() - item.timestamp > item.ttl) {
        localStorage.removeItem(this.prefix + key)
        return null
      }

      return item.data as T
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return null
    }
  }

  delete(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.prefix + key)
  }

  clear(): void {
    if (typeof window === 'undefined') return

    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    })
  }
}

export const clientCache = new ClientCache()