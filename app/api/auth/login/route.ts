import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/auth/jwt'
import { loginSchema } from '@/lib/utils/validation'
import { handleError, successResponse, errorResponse, HttpStatus } from '@/lib/utils/errors'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate input
    const validationResult = loginSchema.safeParse(body)

    if (!validationResult.success) {
      return handleError(validationResult.error)
    }

    const { email, password } = validationResult.data

    // Connect to database
    await connectDB()

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')

    if (!user) {
      return errorResponse(
        'Invalid credentials',
        'Email or password is incorrect',
        HttpStatus.UNAUTHORIZED
      )
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password!)

    if (!isPasswordValid) {
      return errorResponse(
        'Invalid credentials',
        'Email or password is incorrect',
        HttpStatus.UNAUTHORIZED
      )
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role)

    // Create response with user data (without password)
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

    const response = successResponse(
      { user: userData },
      'Login successful',
      HttpStatus.OK
    )

    // Set HTTP-only cookie with JWT token
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error: any) {
    return handleError(error)
  }
}

