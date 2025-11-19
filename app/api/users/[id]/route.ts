import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import User from '@/lib/models/User'
import { getCurrentUser } from '@/lib/auth/middleware'
import { updateUserSchema, updateProfileSchema } from '@/lib/utils/validation'
import { handleError, successResponse, errorResponse, HttpStatus } from '@/lib/utils/errors'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

// GET /api/users/[id] - Get user by ID (Admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
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

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(
        'Bad Request',
        `Invalid user ID: ${id}`,
        HttpStatus.BAD_REQUEST
      )
    }

    // Connect to database
    await connectDB()

    // Find user
    const user = await User.findById(id).select('-password')

    if (!user) {
      return errorResponse(
        'Not Found',
        'User not found',
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

    return successResponse({ user: userData }, undefined, HttpStatus.OK)
  } catch (error: any) {
    return handleError(error)
  }
}

// PUT /api/users/[id] - Update user (Admin can update any, Customer can update own)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check authentication
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return errorResponse(
        'Unauthorized',
        'Authentication required',
        HttpStatus.UNAUTHORIZED
      )
    }

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(
        'Bad Request',
        `Invalid user ID: ${id}`,
        HttpStatus.BAD_REQUEST
      )
    }

    // Check permissions: Admin can update any user, Customer can only update own profile
    const isAdmin = currentUser.role === 'admin'
    const isOwnProfile = currentUser._id === id

    if (!isAdmin && !isOwnProfile) {
      return errorResponse(
        'Forbidden',
        'You can only update your own profile',
        HttpStatus.FORBIDDEN
      )
    }

    // Parse and validate request body
    const body = await request.json()
    
    // Use appropriate schema: customers use updateProfileSchema (no role), admins use updateUserSchema
    const validationResult = isAdmin
      ? updateUserSchema.safeParse(body)
      : updateProfileSchema.safeParse(body)

    if (!validationResult.success) {
      return handleError(validationResult.error)
    }

    const updateData: any = { ...validationResult.data }

    // Customers cannot change their role
    if (!isAdmin && 'role' in updateData) {
      delete updateData.role
    }

    // Hash password if provided
    if (updateData.password && updateData.password.trim() !== '') {
      updateData.password = await bcrypt.hash(updateData.password, 10)
    } else {
      delete updateData.password
    }

    // Remove empty strings
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === '') {
        delete updateData[key]
      }
    })

    // Connect to database
    await connectDB()

    // Check if email is being changed and if it's already taken
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email.toLowerCase(),
        _id: { $ne: id },
      })

      if (existingUser) {
        return errorResponse(
          'Conflict',
          'User with this email already exists',
          HttpStatus.CONFLICT
        )
      }

      updateData.email = updateData.email.toLowerCase()
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return errorResponse(
        'Not Found',
        'User not found',
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
      'User updated successfully',
      HttpStatus.OK
    )
  } catch (error: any) {
    return handleError(error)
  }
}

// DELETE /api/users/[id] - Delete user (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
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

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(
        'Bad Request',
        `Invalid user ID: ${id}`,
        HttpStatus.BAD_REQUEST
      )
    }

    // Prevent deleting own account
    if (currentUser._id === id) {
      return errorResponse(
        'Bad Request',
        'Cannot delete your own account',
        HttpStatus.BAD_REQUEST
      )
    }

    // Connect to database
    await connectDB()

    // Find and delete user
    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return errorResponse(
        'Not Found',
        'User not found',
        HttpStatus.NOT_FOUND
      )
    }

    return successResponse(
      null,
      'User deleted successfully',
      HttpStatus.OK
    )
  } catch (error: any) {
    return handleError(error)
  }
}

