'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface ProfileFormData {
  name: string
  email: string
  phone: string
  address: string
}

interface ProfileFormProps {
  initialData: ProfileFormData
  userId: string
}

export default function ProfileForm({ initialData, userId }: ProfileFormProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [formData, setFormData] = useState<ProfileFormData>({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError(null)
    if (success) setSuccess(false)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.message || data.error || 'An error occurred'
        setError(errorMsg)
        showToast(errorMsg, 'error')
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setIsLoading(false)
      showToast('Profile updated successfully!', 'success')
      
      // Refresh the page data after a short delay
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred'
      setError(errorMsg)
      showToast(errorMsg, 'error')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">Profile updated successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: '#0a1128' }}>
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ borderColor: '#1282a2', color: '#000000' }}
            onFocus={(e) => {
              e.target.style.borderColor = '#034078'
              e.target.style.boxShadow = '0 0 0 2px rgba(3, 64, 120, 0.2)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#1282a2'
              e.target.style.boxShadow = ''
            }}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#0a1128' }}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ borderColor: '#1282a2', color: '#000000' }}
            onFocus={(e) => {
              e.target.style.borderColor = '#034078'
              e.target.style.boxShadow = '0 0 0 2px rgba(3, 64, 120, 0.2)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#1282a2'
              e.target.style.boxShadow = ''
            }}
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: '#0a1128' }}>
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ borderColor: '#1282a2', color: '#000000' }}
            onFocus={(e) => {
              e.target.style.borderColor = '#034078'
              e.target.style.boxShadow = '0 0 0 2px rgba(3, 64, 120, 0.2)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#1282a2'
              e.target.style.boxShadow = ''
            }}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium mb-2" style={{ color: '#0a1128' }}>
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ borderColor: '#1282a2', color: '#000000' }}
            onFocus={(e) => {
              e.target.style.borderColor = '#034078'
              e.target.style.boxShadow = '0 0 0 2px rgba(3, 64, 120, 0.2)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#1282a2'
              e.target.style.boxShadow = ''
            }}
            placeholder="Enter your address"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium flex items-center space-x-2"
          style={{ backgroundColor: '#001f54' }}
        >
          {isLoading && <LoadingSpinner size="sm" />}
          <span>{isLoading ? 'Updating...' : 'Update Profile'}</span>
        </button>
      </div>
    </form>
  )
}

