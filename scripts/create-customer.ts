import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import connectDB from '../lib/db/connect'
import User from '../lib/models/User'
import bcrypt from 'bcryptjs'

async function createCustomer() {
  try {
    // Connect to database
    await connectDB()

    // Check if customer already exists
    const existingCustomer = await User.findOne({ email: 'customer@metizsoft.com' })

    if (existingCustomer) {
      console.log('⚠️  Customer user already exists')
      console.log('📧 Email: customer@metizsoft.com')
      process.exit(0)
    }

    // Create customer user
    const hashedPassword = await bcrypt.hash('customer123', 10)

    const customer = await User.create({
      name: 'Customer User',
      email: 'customer@metizsoft.com',
      password: hashedPassword,
      phone: '+1234567891',
      address: '456 Customer Street, Customer City',
      role: 'customer',
    })

    console.log('✅ Customer user created successfully!')
    console.log('📧 Email: customer@metizsoft.com')
    console.log('🔑 Password: customer123')
    console.log('👤 Role: customer')
    console.log('\nCustomer ID:', customer._id)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating customer:', error)
    process.exit(1)
  }
}

createCustomer()

