import { NextRequest, NextResponse } from 'next/server'
import { testConnection } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    // Check database connectivity
    const dbHealthy = await testConnection(1) // Single retry for health check
    
    // Check basic application health
    const appHealthy = true // Add more checks as needed
    
    const health = {
      status: dbHealthy && appHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbHealthy ? 'ok' : 'error',
        application: appHealthy ? 'ok' : 'error'
      },
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    }

    const status = health.status === 'healthy' ? 200 : 503

    return NextResponse.json(health, { 
      status,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      checks: {
        database: 'error',
        application: 'error'
      }
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })
  }
}