'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/contexts/ToastContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
  role: 'admin' | 'customer'
  createdAt: string
  updatedAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function UsersPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async (page: number = 1) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users?page=${page}&limit=10`, {
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || data.error || 'Failed to fetch users')
        setIsLoading(false)
        return
      }

      if (data.success && data.data) {
        setUsers(data.data.users)
        setPagination(data.data.pagination)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.message || data.error || 'Failed to delete user'
        showToast(errorMsg, 'error')
        return
      }

      showToast('User deleted successfully', 'success')
      // Refresh the list
      fetchUsers(pagination.page)
    } catch (err: any) {
      showToast(err.message || 'An error occurred', 'error')
    }
  }

  const getRoleBadgeStyle = (role: string) => {
    return role === 'admin'
      ? { backgroundColor: '#034078', color: '#fefcfb' }
      : { backgroundColor: '#1282a2', color: '#fefcfb' }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
          <p className="text-gray-600">Manage all users in the system</p>
        </div>
        <Link
          href="/admin/users/new"
          className="text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity font-medium"
          style={{ backgroundColor: '#034078' }}
        >
          + Add New User
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No users found</p>
          <Link
            href="/admin/users/new"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create your first user
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          style={getRoleBadgeStyle(user.role)}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/users/${user._id}`}
                            className="nav-link font-medium transition-colors"
                            style={{ color: '#034078' }}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            className="delete-link font-medium transition-colors"
                            style={{ color: '#dc2626' }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} users
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchUsers(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchUsers(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

