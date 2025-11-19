import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import User from '@/lib/models/User'
import { getCurrentUser } from '@/lib/auth/middleware'
import { successResponse, errorResponse, handleError, HttpStatus } from '@/lib/utils/errors'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return errorResponse(
        'Unauthorized',
        'Authentication required',
        HttpStatus.UNAUTHORIZED
      )
    }

    if (currentUser.role !== 'admin') {
      return errorResponse(
        'Forbidden',
        'Admin access required',
        HttpStatus.FORBIDDEN
      )
    }

    // Connect to database
    await connectDB()

    // Get statistics
    const [totalUsers, adminCount, customerCount, recentUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'customer' }),
      User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(5),
    ])

    // Format recent users
    const recentUsersData = recentUsers.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }))

    return successResponse(
      {
        totalUsers,
        adminCount,
        customerCount,
        recentUsers: recentUsersData,
      },
      undefined,
      HttpStatus.OK
    )
  } catch (error: any) {
    return handleError(error)
  }
}

