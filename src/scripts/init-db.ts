#!/usr/bin/env node

/**
 * Database initialization script
 * Run this script to set up the database with initial data and indexes
 */

// 加载环境变量
require('dotenv').config({ path: '.env.local' })

import { seedDatabase, checkAndSeedDatabase } from '../lib/seed-data'
import { initializeDatabase, testConnection } from '../lib/mongodb'

async function initDatabase() {
  console.log('🚀 Starting database initialization...')
  
  try {
    // Test database connection
    console.log('🔗 Testing database connection...')
    await testConnection()
    console.log('✅ Database connection successful')
    
    // Initialize database indexes
    console.log('📊 Initializing database indexes...')
    await initializeDatabase()
    console.log('✅ Database indexes created')
    
    // Check and seed database if needed
    console.log('🌱 Checking if database needs seeding...')
    await checkAndSeedDatabase()
    console.log('✅ Database seeding completed')
    
    console.log('🎉 Database initialization completed successfully!')
    console.log('\n📋 Summary:')
    console.log('   - Database connection: ✅ Connected')
    console.log('   - Indexes: ✅ Created')
    console.log('   - Sample data: ✅ Available')
    console.log('\n🚀 Your NANUK website is ready to go!')
    
  } catch (error) {
    console.error('❌ Database initialization failed:')
    console.error(error)
    process.exit(1)
  }
}

// Force seed database (useful for development)
async function forceSeed() {
  console.log('🌱 Force seeding database...')
  
  try {
    await testConnection()
    await initializeDatabase()
    await seedDatabase()
    console.log('✅ Force seeding completed')
  } catch (error) {
    console.error('❌ Force seeding failed:')
    console.error(error)
    process.exit(1)
  }
}

// Main execution
const command = process.argv[2]

switch (command) {
  case 'force-seed':
    forceSeed()
    break
  case 'init':
  default:
    initDatabase()
    break
}

export { initDatabase, forceSeed }