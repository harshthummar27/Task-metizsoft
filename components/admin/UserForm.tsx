'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface UserFormData {
  name: string
  email: string
  password: string
  phone: string
  address: string
  role: 'admin' | 'customer'
}

interface UserFormProps {
  initialData?: Partial<UserFormData>
  isEdit?: boolean
  userId?: string
}

export default function UserForm({ initialData, isEdit = false, userId }: UserFormProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [formData, setFormData] = useState<UserFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    role: initialData?.role || 'customer',
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const url = isEdit ? `/api/users/${userId}` : '/api/users'
      const method = isEdit ? 'PUT' : 'POST'

      // Remove password if empty in edit mode
      const submitData: any = { ...formData }
      if (isEdit && !submitData.password) {
        delete submitData.password
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.message || data.error || 'An error occurred'
        setError(errorMsg)
        showToast(errorMsg, 'error')
        setIsLoading(false)
        return
      }

      // Show success toast and redirect
      showToast(
        isEdit ? 'User updated successfully!' : 'User created successfully!',
        'success'
      )
      setTimeout(() => {
        router.push('/admin/users')
        router.refresh()
      }, 500)
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
            placeholder="Enter full name"
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
            placeholder="Enter email address"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#0a1128' }}>
            Password {!isEdit && <span className="text-red-500">*</span>}
            {isEdit && <span className="text-xs" style={{ color: '#034078' }}>(leave blank to keep current)</span>}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!isEdit}
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
            placeholder={isEdit ? 'Enter new password (optional)' : 'Enter password'}
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
            placeholder="Enter phone number"
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
            placeholder="Enter address"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-2" style={{ color: '#0a1128' }}>
            Role <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
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
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="px-6 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ 
            borderColor: '#1282a2',
            color: '#034078'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) e.currentTarget.style.backgroundColor = '#fefcfb'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 text-white rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium flex items-center space-x-2"
          style={{ backgroundColor: '#034078' }}
        >
          {isLoading && <LoadingSpinner size="sm" />}
          <span>{isLoading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}</span>
        </button>
      </div>
    </form>
  )
}

