import { NextRequest, NextResponse } from 'next/server'
import { successResponse, handleError, HttpStatus } from '@/lib/utils/errors'

export async function POST(request: NextRequest) {
  try {
    const response = successResponse(
      null,
      'Logout successful',
      HttpStatus.OK
    )

    // Clear the token cookie
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    })

    return response
  } catch (error: any) {
    return handleError(error)
  }
}

