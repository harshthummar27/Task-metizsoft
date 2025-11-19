import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { ApiResponse } from '@/types'

/**
 * Standard error response structure
 */
export interface ErrorResponse {
  success: false
  error: string
  message: string
  details?: any
}

/**
 * HTTP Status Codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  statusCode: HttpStatus
  isOperational: boolean

  constructor(message: string, statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Handle Zod validation errors
 */
export function handleValidationError(error: ZodError): NextResponse {
  const firstError = error.errors[0]
  const message = firstError?.message || 'Validation error'
  const field = firstError?.path.join('.') || 'unknown'

  return NextResponse.json(
    {
      success: false,
      error: 'Validation error',
      message: `${field}: ${message}`,
      details: error.errors,
    },
    { status: HttpStatus.BAD_REQUEST }
  )
}

/**
 * Handle MongoDB duplicate key errors
 */
export function handleMongoError(error: any): NextResponse | null {
  // Duplicate key error (e.g., duplicate email)
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0]
    return NextResponse.json(
      {
        success: false,
        error: 'Duplicate entry',
        message: `${field} already exists`,
      },
      { status: HttpStatus.CONFLICT }
    )
  }

  // Validation error from Mongoose
  if (error.name === 'ValidationError') {
    const firstError = Object.values(error.errors)[0] as any
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        message: firstError?.message || 'Invalid data',
      },
      { status: HttpStatus.BAD_REQUEST }
    )
  }

  return null
}

/**
 * Handle application errors
 */
export function handleAppError(error: AppError): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: error.name || 'Application error',
      message: error.message,
    },
    { status: error.statusCode }
  )
}

/**
 * Handle unknown errors
 */
export function handleUnknownError(error: any): NextResponse {
  console.error('Unknown error:', error)

  // Don't expose internal error details in production
  const isDevelopment = process.env.NODE_ENV === 'development'

  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error',
      message: isDevelopment ? error.message : 'An unexpected error occurred',
      ...(isDevelopment && { stack: error.stack }),
    },
    { status: HttpStatus.INTERNAL_SERVER_ERROR }
  )
}

/**
 * Main error handler - routes errors to appropriate handlers
 */
export function handleError(error: any): NextResponse {
  // Zod validation error
  if (error instanceof ZodError) {
    return handleValidationError(error)
  }

  // Application error
  if (error instanceof AppError) {
    return handleAppError(error)
  }

  // MongoDB error
  const mongoError = handleMongoError(error)
  if (mongoError) {
    return mongoError
  }

  // Unknown error
  return handleUnknownError(error)
}

/**
 * Create a success response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: HttpStatus = HttpStatus.OK
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
  }

  if (message) {
    response.message = message
  }

  return NextResponse.json(response, { status })
}

/**
 * Create an error response
 */
export function errorResponse(
  error: string,
  message: string,
  status: HttpStatus = HttpStatus.BAD_REQUEST,
  details?: any
): NextResponse {
  const response: ErrorResponse = {
    success: false,
    error,
    message,
  }

  if (details) {
    response.details = details
  }

  return NextResponse.json(response, { status })
}

/**
 * Async error handler wrapper for API routes
 * Catches errors and handles them consistently
 */
export function asyncHandler(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  return handler().catch((error) => {
    return handleError(error)
  })
}

