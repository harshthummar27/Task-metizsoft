import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import User from '@/lib/models/User'

export async function GET() {
  try {
    // Test database connection
    await connectDB()

    // Test query
    const userCount = await User.countDocuments()

    return NextResponse.json(
      {
        success: true,
        message: 'Database connection successful!',
        data: {
          connected: true,
          userCount,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Database test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection failed',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}

