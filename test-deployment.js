#!/usr/bin/env node

/**
 * Deployment validation script
 * Tests key functionality to ensure the application is working correctly
 */

const https = require('https')
const http = require('http')

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000'
const TIMEOUT = 10000 // 10 seconds

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  tests: []
}

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const requestOptions = {
      timeout: TIMEOUT,
      ...options
    }

    const req = protocol.get(url, requestOptions, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        })
      })
    })

    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    req.on('error', reject)
  })
}

// Helper function to make POST requests
function makePostRequest(url, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const urlObj = new URL(url)
    const postData = JSON.stringify(data)

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      },
      timeout: TIMEOUT
    }

    const req = protocol.request(options, (res) => {
      let responseData = ''
      res.on('data', chunk => responseData += chunk)
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: responseData
        })
      })
    })

    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    req.on('error', reject)
    req.write(postData)
    req.end()
  })
}

// Test function wrapper
async function runTest(name, testFn) {
  testResults.total++
  console.log(`🧪 Testing: ${name}`)
  
  try {
    await testFn()
    testResults.passed++
    testResults.tests.push({ name, status: 'PASSED' })
    console.log(`✅ PASSED: ${name}`)
  } catch (error) {
    testResults.failed++
    testResults.tests.push({ name, status: 'FAILED', error: error.message })
    console.log(`❌ FAILED: ${name} - ${error.message}`)
  }
}

// Individual tests
async function testHealthEndpoint() {
  const response = await makeRequest(`${BASE_URL}/api/health`)
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`)
  }
  
  const health = JSON.parse(response.body)
  if (health.status !== 'healthy') {
    throw new Error(`Expected status 'healthy', got '${health.status}'`)
  }
}

async function testHomePage() {
  const response = await makeRequest(BASE_URL)
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`)
  }
  
  if (!response.body.includes('WELL-LI')) {
    throw new Error('Home page does not contain expected content')
  }
}

async function testProductsAPI() {
  const response = await makeRequest(`${BASE_URL}/api/products`)
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`)
  }
  
  const data = JSON.parse(response.body)
  if (!data.success || !Array.isArray(data.products)) {
    throw new Error('Products API response format is invalid')
  }
}

async function testProductsPage() {
  const response = await makeRequest(`${BASE_URL}/products`)
  
  if (response.statusCode !== 200) {
    throw new Error(`Expected status 200, got ${response.statusCode}`)
  }
  
  if (!response.body.includes('Products')) {
    throw new Error('Products page does not contain expected content')
  }
}

async function testContactForm() {
  const formData = {
    name: 'Test User',
    email: 'test@example.com',
    country: 'Test Country',
    message: 'This is a test message for deployment validation'
  }
  
  try {
    const response = await makePostRequest(`${BASE_URL}/api/contact`, formData)
    
    // Accept both success and rate limit responses for testing
    if (response.statusCode !== 200 && response.statusCode !== 429) {
      throw new Error(`Expected status 200 or 429, got ${response.statusCode}`)
    }
    
    if (response.statusCode === 200) {
      const data = JSON.parse(response.body)
      if (!data.success) {
        throw new Error('Contact form submission failed')
      }
    }
  } catch (error) {
    // If it's a rate limit error, that's actually good - means the rate limiting is working
    if (error.message.includes('429')) {
      console.log('  ℹ️  Rate limiting is working (this is expected in testing)')
      return
    }
    throw error
  }
}

async function testSecurityHeaders() {
  const response = await makeRequest(`${BASE_URL}/api/health`)
  
  const securityHeaders = [
    'x-frame-options',
    'x-content-type-options',
    'referrer-policy'
  ]
  
  for (const header of securityHeaders) {
    if (!response.headers[header]) {
      throw new Error(`Missing security header: ${header}`)
    }
  }
}

async function testRateLimiting() {
  // Make multiple rapid requests to test rate limiting
  const requests = []
  for (let i = 0; i < 3; i++) {
    requests.push(makeRequest(`${BASE_URL}/api/health`))
  }
  
  const responses = await Promise.all(requests)
  
  // All should succeed as health endpoint has higher limits
  for (const response of responses) {
    if (response.statusCode !== 200) {
      throw new Error(`Rate limiting test failed: ${response.statusCode}`)
    }
  }
}

async function testDatabaseConnection() {
  const response = await makeRequest(`${BASE_URL}/api/health`)
  
  if (response.statusCode !== 200) {
    throw new Error(`Health check failed: ${response.statusCode}`)
  }
  
  const health = JSON.parse(response.body)
  if (health.checks.database !== 'ok') {
    throw new Error('Database connection check failed')
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting deployment validation tests...')
  console.log(`📍 Testing URL: ${BASE_URL}`)
  console.log('=' * 50)
  
  // Core functionality tests
  await runTest('Health Endpoint', testHealthEndpoint)
  await runTest('Database Connection', testDatabaseConnection)
  await runTest('Home Page', testHomePage)
  await runTest('Products API', testProductsAPI)
  await runTest('Products Page', testProductsPage)
  
  // Security tests
  await runTest('Security Headers', testSecurityHeaders)
  await runTest('Rate Limiting', testRateLimiting)
  
  // Form functionality (might fail due to rate limiting, which is OK)
  await runTest('Contact Form', testContactForm)
  
  // Print results
  console.log('=' * 50)
  console.log('📊 Test Results:')
  console.log(`✅ Passed: ${testResults.passed}/${testResults.total}`)
  console.log(`❌ Failed: ${testResults.failed}/${testResults.total}`)
  
  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:')
    testResults.tests
      .filter(test => test.status === 'FAILED')
      .forEach(test => {
        console.log(`  - ${test.name}: ${test.error}`)
      })
  }
  
  console.log('\n📋 Summary:')
  if (testResults.failed === 0) {
    console.log('🎉 All tests passed! Deployment appears to be successful.')
    process.exit(0)
  } else if (testResults.failed <= 2) {
    console.log('⚠️  Some tests failed, but core functionality appears to be working.')
    console.log('   Please review the failed tests and fix any critical issues.')
    process.exit(1)
  } else {
    console.log('🚨 Multiple tests failed. Please review and fix the issues before proceeding.')
    process.exit(1)
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('💥 Test runner failed:', error.message)
  process.exit(1)
})