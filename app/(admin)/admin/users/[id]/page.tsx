'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import UserForm from '@/components/admin/UserForm'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
  role: 'admin' | 'customer'
}

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          credentials: 'include',
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || data.error || 'Failed to fetch user')
          setIsLoading(false)
          return
        }

        if (data.success && data.data?.user) {
          setUser(data.data.user)
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit User</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit User</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="text-sm font-medium">{error || 'User not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit User</h1>
        <p className="text-gray-600">Update user information</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <UserForm initialData={user} isEdit={true} userId={userId} />
      </div>
    </div>
  )
}

