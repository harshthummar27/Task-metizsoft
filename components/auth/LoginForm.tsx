'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface LoginFormData {
  email: string
  password: string
}

interface LoginError {
  message: string
  field?: string
}

export default function LoginForm() {
  const router = useRouter()
  const { showToast } = useToast()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [error, setError] = useState<LoginError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.message || data.error || 'Login failed'
        setError({
          message: errorMsg,
        })
        showToast(errorMsg, 'error')
        setIsLoading(false)
        return
      }

      if (data.success && data.data?.user) {
        // Get user role from response
        const userRole = data.data.user.role

        // Redirect based on user role automatically
        if (userRole === 'admin') {
          router.push('/admin')
        } else if (userRole === 'customer') {
          router.push('/profile')
        } else {
          // Fallback for any other role
          setError({
            message: 'Unknown user role. Please contact support.',
          })
          setIsLoading(false)
          return
        }
        router.refresh()
      } else {
        setError({
          message: 'Login failed. Please try again.',
        })
        setIsLoading(false)
      }
    } catch (err: any) {
      setError({
        message: err.message || 'An error occurred. Please try again.',
      })
      showToast(err.message || 'An error occurred. Please try again.', 'error')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{error.message}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-2"
          style={{ color: '#0a1128' }}
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          style={{ 
            borderColor: '#1282a2',
            color: '#000000',
            '--tw-ring-color': '#034078'
          } as React.CSSProperties & { '--tw-ring-color': string }}
          onFocus={(e) => {
            e.target.style.borderColor = '#034078'
            e.target.style.boxShadow = '0 0 0 2px rgba(3, 64, 120, 0.2)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#1282a2'
            e.target.style.boxShadow = ''
          }}
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium mb-2"
          style={{ color: '#0a1128' }}
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
          className="w-full px-4 py-2.5 border rounded-lg shadow-sm focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          style={{ 
            borderColor: '#1282a2',
            color: '#000000'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#034078'
            e.target.style.boxShadow = '0 0 0 2px rgba(3, 64, 120, 0.2)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#1282a2'
            e.target.style.boxShadow = ''
          }}
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{ backgroundColor: '#034078' }}
        className="w-full text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md hover:opacity-90"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <LoadingSpinner size="sm" className="mr-3 !text-white" />
            Logging in...
          </span>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  )
}
