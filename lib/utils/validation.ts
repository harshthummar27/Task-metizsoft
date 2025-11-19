import { z } from 'zod'
import { UserRole } from '@/types'

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
})

/**
 * User creation schema (for admin creating users)
 */
export const createUserSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters'),
  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      'Please provide a valid phone number'
    )
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(500, 'Address cannot exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  role: z.enum(['admin', 'customer'], {
    errorMap: () => ({ message: 'Role must be either admin or customer' }),
  }),
})

/**
 * User update schema (for admin updating users)
 */
export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      'Please provide a valid phone number'
    )
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(500, 'Address cannot exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  role: z.enum(['admin', 'customer']).optional(),
})

/**
 * Profile update schema (for customers updating their own profile)
 * Excludes role and password (password change would be separate endpoint)
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      'Please provide a valid phone number'
    )
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(500, 'Address cannot exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
})

/**
 * Pagination query schema
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a positive number')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1, 'Page must be at least 1'))
    .default('1'),
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a positive number')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100'))
    .default('10'),
})

// Type exports for TypeScript
export type LoginInput = z.infer<typeof loginSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type PaginationInput = z.infer<typeof paginationSchema>

