import jwt from 'jsonwebtoken'
import { UserRole } from '@/types'

export interface JWTPayload {
  userId: string
  role: UserRole
  iat?: number
  exp?: number
}

const JWT_EXPIRES_IN = '7d' // Token expires in 7 days

/**
 * Generate a JWT token for a user
 * @param userId - User's MongoDB _id
 * @param role - User's role (admin or customer)
 * @returns JWT token string
 */
export function generateToken(userId: string, role: UserRole): string {
  const JWT_SECRET = process.env.JWT_SECRET

  if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env.local')
  }

  const payload: JWTPayload = {
    userId,
    role,
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
  const JWT_SECRET = process.env.JWT_SECRET

  if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env.local')
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Get token from request cookies
 * @param cookies - Cookies object from Next.js request
 * @returns Token string or null
 */
export function getTokenFromCookies(cookies: { get: (name: string) => { value: string } | undefined }): string | null {
  const tokenCookie = cookies.get('token')
  return tokenCookie?.value || null
}

