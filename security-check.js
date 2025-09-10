#!/usr/bin/env node

/**
 * Security validation script
 * Checks for common security vulnerabilities and best practices
 */

const fs = require('fs')
const path = require('path')

// Security check results
let securityResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  total: 0,
  checks: []
}

// Helper function to check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath)
  } catch {
    return false
  }
}

// Helper function to read file content
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return ''
  }
}

// Helper function to find files by pattern
function findFiles(dir, pattern, recursive = true) {
  const files = []
  
  try {
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory() && recursive) {
        files.push(...findFiles(fullPath, pattern, recursive))
      } else if (stat.isFile() && pattern.test(item)) {
        files.push(fullPath)
      }
    }
  } catch {
    // Directory doesn't exist or no permissions
  }
  
  return files
}

// Security check wrapper
function runSecurityCheck(name, checkFn, level = 'error') {
  securityResults.total++
  console.log(`🔍 Checking: ${name}`)
  
  try {
    const result = checkFn()
    
    if (result.passed) {
      securityResults.passed++
      securityResults.checks.push({ name, status: 'PASSED', level })
      console.log(`✅ PASSED: ${name}`)
    } else {
      if (level === 'warning') {
        securityResults.warnings++
        securityResults.checks.push({ name, status: 'WARNING', message: result.message, level })
        console.log(`⚠️  WARNING: ${name} - ${result.message}`)
      } else {
        securityResults.failed++
        securityResults.checks.push({ name, status: 'FAILED', message: result.message, level })
        console.log(`❌ FAILED: ${name} - ${result.message}`)
      }
    }
  } catch (error) {
    securityResults.failed++
    securityResults.checks.push({ name, status: 'ERROR', message: error.message, level })
    console.log(`💥 ERROR: ${name} - ${error.message}`)
  }
}

// Individual security checks
function checkEnvironmentVariables() {
  const envExampleExists = fileExists('.env.example')
  const envLocalExists = fileExists('.env.local')
  const envExists = fileExists('.env')
  
  if (!envExampleExists) {
    return { passed: false, message: '.env.example file is missing' }
  }
  
  if (envLocalExists || envExists) {
    return { passed: false, message: '.env or .env.local files should not be committed to version control' }
  }
  
  return { passed: true }
}

function checkSecretKeys() {
  const packageJson = readFile('package.json')
  const nextConfig = readFile('next.config.js')
  const envExample = readFile('.env.example')
  
  // Check for hardcoded secrets
  const secretPatterns = [
    /password\s*[:=]\s*['"]\w+['"]/i,
    /secret\s*[:=]\s*['"]\w+['"]/i,
    /key\s*[:=]\s*['"]\w+['"]/i,
    /token\s*[:=]\s*['"]\w+['"]/i,
  ]
  
  const files = [
    { name: 'package.json', content: packageJson },
    { name: 'next.config.js', content: nextConfig },
  ]
  
  for (const file of files) {
    for (const pattern of secretPatterns) {
      if (pattern.test(file.content)) {
        return { passed: false, message: `Potential hardcoded secret found in ${file.name}` }
      }
    }
  }
  
  return { passed: true }
}

function checkInputValidation() {
  const apiFiles = findFiles('src/app/api', /\.ts$/)
  const issues = []
  
  for (const file of apiFiles) {
    const content = readFile(file)
    
    // Check for input validation
    if (content.includes('request.json()') && !content.includes('validate')) {
      issues.push(`${file}: Missing input validation`)
    }
    
    // Check for SQL injection protection
    if (content.includes('query') && content.includes('$') && !content.includes('sanitize')) {
      issues.push(`${file}: Potential SQL injection vulnerability`)
    }
  }
  
  if (issues.length > 0) {
    return { passed: false, message: issues.join('; ') }
  }
  
  return { passed: true }
}

function checkErrorHandling() {
  const apiFiles = findFiles('src/app/api', /\.ts$/)
  const issues = []
  
  for (const file of apiFiles) {
    const content = readFile(file)
    
    // Check for try-catch blocks
    if (content.includes('async function') && !content.includes('try {')) {
      issues.push(`${file}: Missing error handling`)
    }
    
    // Check for error logging
    if (content.includes('catch') && !content.includes('console.error') && !content.includes('logError')) {
      issues.push(`${file}: Missing error logging`)
    }
  }
  
  if (issues.length > 0) {
    return { passed: false, message: issues.join('; ') }
  }
  
  return { passed: true }
}

function checkRateLimiting() {
  const contactApi = readFile('src/app/api/contact/route.ts')
  const inquiriesApi = readFile('src/app/api/inquiries/route.ts')
  
  if (!contactApi.includes('rateLimitMiddleware') && !contactApi.includes('limit')) {
    return { passed: false, message: 'Contact API missing rate limiting' }
  }
  
  if (!inquiriesApi.includes('rateLimitMiddleware') && !inquiriesApi.includes('limit')) {
    return { passed: false, message: 'Inquiries API missing rate limiting' }
  }
  
  return { passed: true }
}

function checkSecurityHeaders() {
  const nextConfig = readFile('next.config.js')
  
  const requiredHeaders = [
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
  ]
  
  for (const header of requiredHeaders) {
    if (!nextConfig.includes(header)) {
      return { passed: false, message: `Missing security header: ${header}` }
    }
  }
  
  return { passed: true }
}

function checkDependencyVersions() {
  const packageJson = JSON.parse(readFile('package.json'))
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
  
  const outdatedPackages = []
  
  // Check for known vulnerable packages (basic check)
  const knownVulnerable = {
    'lodash': '< 4.17.21',
    'axios': '< 0.21.1',
    'express': '< 4.17.1',
  }
  
  for (const [pkg, version] of Object.entries(dependencies)) {
    if (knownVulnerable[pkg]) {
      outdatedPackages.push(`${pkg}@${version}`)
    }
  }
  
  if (outdatedPackages.length > 0) {
    return { passed: false, message: `Potentially vulnerable packages: ${outdatedPackages.join(', ')}` }
  }
  
  return { passed: true }
}

function checkFilePermissions() {
  const sensitiveFiles = [
    '.env.example',
    'next.config.js',
    'package.json',
    'tsconfig.json',
  ]
  
  // This is a basic check - in production, you'd want to check actual file permissions
  for (const file of sensitiveFiles) {
    if (!fileExists(file)) {
      return { passed: false, message: `Required file missing: ${file}` }
    }
  }
  
  return { passed: true }
}

function checkCORSConfiguration() {
  const apiFiles = findFiles('src/app/api', /\.ts$/)
  const issues = []
  
  for (const file of apiFiles) {
    const content = readFile(file)
    
    // Check for proper CORS headers
    if (content.includes('NextResponse') && content.includes('headers') && 
        !content.includes('Access-Control-Allow-Origin')) {
      // This is actually good - we don't want open CORS
      continue
    }
    
    // Check for open CORS
    if (content.includes('Access-Control-Allow-Origin: *')) {
      issues.push(`${file}: Open CORS policy detected`)
    }
  }
  
  if (issues.length > 0) {
    return { passed: false, message: issues.join('; ') }
  }
  
  return { passed: true }
}

function checkDockerSecurity() {
  const dockerfile = readFile('Dockerfile')
  
  if (!dockerfile) {
    return { passed: false, message: 'Dockerfile not found' }
  }
  
  // Check for running as root
  if (!dockerfile.includes('USER ') || dockerfile.includes('USER root')) {
    return { passed: false, message: 'Docker container running as root user' }
  }
  
  // Check for unnecessary packages
  if (dockerfile.includes('curl') && !dockerfile.includes('healthcheck')) {
    return { passed: false, message: 'Unnecessary packages in Docker image' }
  }
  
  return { passed: true }
}

// Main security check runner
async function runAllSecurityChecks() {
  console.log('🔒 Starting security validation checks...')
  console.log('=' * 50)
  
  // Environment and configuration security
  runSecurityCheck('Environment Variables', checkEnvironmentVariables)
  runSecurityCheck('Secret Keys', checkSecretKeys)
  runSecurityCheck('File Permissions', checkFilePermissions)
  
  // Application security
  runSecurityCheck('Input Validation', checkInputValidation)
  runSecurityCheck('Error Handling', checkErrorHandling)
  runSecurityCheck('Rate Limiting', checkRateLimiting)
  runSecurityCheck('Security Headers', checkSecurityHeaders)
  runSecurityCheck('CORS Configuration', checkCORSConfiguration)
  
  // Dependency and infrastructure security
  runSecurityCheck('Dependency Versions', checkDependencyVersions, 'warning')
  runSecurityCheck('Docker Security', checkDockerSecurity)
  
  // Print results
  console.log('=' * 50)
  console.log('🔒 Security Check Results:')
  console.log(`✅ Passed: ${securityResults.passed}/${securityResults.total}`)
  console.log(`❌ Failed: ${securityResults.failed}/${securityResults.total}`)
  console.log(`⚠️  Warnings: ${securityResults.warnings}/${securityResults.total}`)
  
  if (securityResults.failed > 0) {
    console.log('\n❌ Critical Security Issues:')
    securityResults.checks
      .filter(check => check.status === 'FAILED')
      .forEach(check => {
        console.log(`  - ${check.name}: ${check.message}`)
      })
  }
  
  if (securityResults.warnings > 0) {
    console.log('\n⚠️  Security Warnings:')
    securityResults.checks
      .filter(check => check.status === 'WARNING')
      .forEach(check => {
        console.log(`  - ${check.name}: ${check.message}`)
      })
  }
  
  console.log('\n📋 Security Summary:')
  if (securityResults.failed === 0) {
    console.log('🛡️  No critical security issues found!')
    if (securityResults.warnings > 0) {
      console.log('   Please review the warnings above.')
    }
    process.exit(0)
  } else if (securityResults.failed <= 2) {
    console.log('⚠️  Some security issues found. Please address them before deployment.')
    process.exit(1)
  } else {
    console.log('🚨 Multiple critical security issues found. Do not deploy until fixed!')
    process.exit(1)
  }
}

// Run security checks
runAllSecurityChecks().catch(error => {
  console.error('💥 Security checker failed:', error.message)
  process.exit(1)
})