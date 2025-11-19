import dotenv from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import connectDB from '../lib/db/connect'
import User from '../lib/models/User'
import bcrypt from 'bcryptjs'

async function seed() {
  try {
    // Connect to database
    await connectDB()

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@metizsoft.com' })

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists')
      process.exit(0)
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@metizsoft.com',
      password: hashedPassword,
      phone: '+1234567890',
      address: '123 Admin Street, Admin City',
      role: 'admin',
    })

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@metizsoft.com')
    console.log('🔑 Password: admin123')
    console.log('⚠️  Please change the password after first login!')
    console.log('\nAdmin ID:', admin._id)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seed()

