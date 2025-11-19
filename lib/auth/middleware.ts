import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookies, verifyToken } from './jwt'
import User from '@/lib/models/User'
import connectDB from '@/lib/db/connect'
import { UserRole } from '@/types'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    _id: string
    email: string
    name: string
    role: UserRole
  }
}

/**
 * Get the current authenticated user from the request
 * @param request - Next.js request object
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser(
  request: NextRequest
): Promise<{ _id: string; email: string; name: string; role: UserRole } | null> {
  try {
    const token = getTokenFromCookies(request.cookies)

    if (!token) {
      return null
    }

    const decoded = verifyToken(token)

    if (!decoded || !decoded.userId) {
      return null
    }

    // Connect to database
    await connectDB()

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      return null
    }

    return {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Middleware to require authentication
 * Returns 401 if user is not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const user = await getCurrentUser(request)

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required',
      },
      { status: 401 }
    )
  }

  return null // User is authenticated, continue
}

/**
 * Middleware to require specific role
 * Returns 403 if user doesn't have the required role
 */
export async function requireRole(
  request: NextRequest,
  requiredRole: UserRole
): Promise<NextResponse | null> {
  const authError = await requireAuth(request)

  if (authError) {
    return authError
  }

  const user = await getCurrentUser(request)

  if (!user || user.role !== requiredRole) {
    return NextResponse.json(
      {
        success: false,
        error: 'Forbidden',
        message: `Access denied. ${requiredRole} role required.`,
      },
      { status: 403 }
    )
  }

  return null // User has required role, continue
}

/**
 * Helper to create authenticated request handler
 * Injects user into request context
 */
export function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required',
        },
        { status: 401 }
      )
    }

    const authRequest = request as AuthenticatedRequest
    authRequest.user = user

    return handler(authRequest)
  }
}

/**
 * Helper to create role-protected request handler
 */
export function withRole(
  requiredRole: UserRole,
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required',
        },
        { status: 401 }
      )
    }

    if (user.role !== requiredRole) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden',
          message: `Access denied. ${requiredRole} role required.`,
        },
        { status: 403 }
      )
    }

    const authRequest = request as AuthenticatedRequest
    authRequest.user = user

    return handler(authRequest)
  }
}

