'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface DashboardStats {
  totalUsers: number
  adminCount: number
  customerCount: number
  recentUsers: Array<{
    _id: string
    name: string
    email: string
    role: string
    createdAt: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/dashboard/stats', {
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || data.error || 'Failed to load dashboard stats')
        return
      }

      if (data.success && data.data) {
        setStats(data.data)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p className="text-sm font-medium">{error}</p>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#0a1128' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#034078' }}>Welcome back! Here's an overview of your system.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Users Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border" style={{ borderColor: '#1282a2' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: '#034078' }}>
                Total Users
              </p>
              <p className="text-3xl font-bold" style={{ color: '#0a1128' }}>
                {stats.totalUsers}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: '#1282a2', opacity: 0.2 }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: '#034078' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Admin Users Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border" style={{ borderColor: '#1282a2' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: '#034078' }}>
                Admin Users
              </p>
              <p className="text-3xl font-bold" style={{ color: '#0a1128' }}>
                {stats.adminCount}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: '#1282a2', opacity: 0.2 }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: '#034078' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Customer Users Card */}
        <div className="bg-white rounded-lg shadow-md p-6 border" style={{ borderColor: '#1282a2' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: '#034078' }}>
                Customer Users
              </p>
              <p className="text-3xl font-bold" style={{ color: '#0a1128' }}>
                {stats.customerCount}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: '#1282a2', opacity: 0.2 }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: '#001f54' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border" style={{ borderColor: '#1282a2' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold" style={{ color: '#0a1128' }}>
              Recent Users
            </h2>
            <Link
              href="/admin/users"
              className="text-sm font-medium nav-link"
              style={{ color: '#034078' }}
            >
              View All →
            </Link>
          </div>

          {stats.recentUsers.length === 0 ? (
            <p className="text-sm" style={{ color: '#034078' }}>
              No users found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: '#1282a2' }}>
                    <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#034078' }}>
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#034078' }}>
                      Email
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#034078' }}>
                      Role
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: '#034078' }}>
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                      style={{ borderColor: 'rgba(18, 130, 162, 0.2)' }}
                    >
                      <td className="py-3 px-4 text-sm" style={{ color: '#0a1128' }}>
                        {user.name}
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#034078' }}>
                        {user.email}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 text-xs font-semibold rounded-full text-white"
                          style={{
                            backgroundColor: user.role === 'admin' ? '#034078' : '#1282a2',
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: '#034078' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border" style={{ borderColor: '#1282a2' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#0a1128' }}>
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/admin/users/new"
                className="block w-full text-center py-3 px-4 rounded-lg font-medium transition-opacity hover:opacity-90 text-white"
                style={{ backgroundColor: '#034078' }}
              >
                + Add New User
              </Link>
              <Link
                href="/admin/users"
                className="block w-full text-center py-3 px-4 rounded-lg font-medium transition-colors border"
                style={{
                  borderColor: '#1282a2',
                  color: '#034078',
                }}
              >
                Manage Users
              </Link>
            </div>
          </div>

          {/* System Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border" style={{ borderColor: '#1282a2' }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#0a1128' }}>
              System Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#034078' }}>
                  Database
                </span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full text-white" style={{ backgroundColor: '#1282a2' }}>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#034078' }}>
                  System
                </span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full text-white" style={{ backgroundColor: '#1282a2' }}>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
