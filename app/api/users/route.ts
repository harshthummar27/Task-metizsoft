import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import User from '@/lib/models/User'
import { getCurrentUser } from '@/lib/auth/middleware'
import { createUserSchema, paginationSchema } from '@/lib/utils/validation'
import { handleError, successResponse, errorResponse, HttpStatus } from '@/lib/utils/errors'
import bcrypt from 'bcryptjs'

// GET /api/users - List users with pagination (Admin only)
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

    // Get pagination parameters
    const { searchParams } = new URL(request.url)
    const pageParam = searchParams.get('page') || '1'
    const limitParam = searchParams.get('limit') || '10'

    const paginationResult = paginationSchema.safeParse({
      page: pageParam,
      limit: limitParam,
    })

    if (!paginationResult.success) {
      return handleError(paginationResult.error)
    }

    const { page, limit } = paginationResult.data
    const skip = (page - 1) * limit

    // Connect to database
    await connectDB()

    // Get users with pagination
    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ])

    const totalPages = Math.ceil(total / limit)

    return successResponse(
      {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      undefined,
      HttpStatus.OK
    )
  } catch (error: any) {
    return handleError(error)
  }
}

// POST /api/users - Create new user (Admin only)
export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json()
    const validationResult = createUserSchema.safeParse(body)

    if (!validationResult.success) {
      return handleError(validationResult.error)
    }

    const { name, email, password, phone, address, role } = validationResult.data

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return errorResponse(
        'Conflict',
        'User with this email already exists',
        HttpStatus.CONFLICT
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || undefined,
      address: address || undefined,
      role,
    })

    // Return user without password
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
      'User created successfully',
      HttpStatus.CREATED
    )
  } catch (error: any) {
    return handleError(error)
  }
}

