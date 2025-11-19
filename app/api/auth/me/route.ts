import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/middleware'
import connectDB from '@/lib/db/connect'
import User from '@/lib/models/User'
import { successResponse, errorResponse, handleError, HttpStatus } from '@/lib/utils/errors'

export async function GET(request: NextRequest) {
  try {
    // Get current user from token
    const currentUser = await getCurrentUser(request)

    if (!currentUser) {
      return errorResponse(
        'Unauthorized',
        'Authentication required',
        HttpStatus.UNAUTHORIZED
      )
    }

    // Connect to database and get full user data
    await connectDB()
    const user = await User.findById(currentUser._id).select('-password')

    if (!user) {
      return errorResponse(
        'User not found',
        'User account not found',
        HttpStatus.NOT_FOUND
      )
    }

    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return successResponse(
      { user: userData },
      undefined,
      HttpStatus.OK
    )
  } catch (error: any) {
    return handleError(error)
  }
}

