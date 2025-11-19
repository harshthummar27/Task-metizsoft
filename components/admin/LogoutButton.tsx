'use client'

import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
      style={{ backgroundColor: '#034078' }}
    >
      Logout
    </button>
  )
}

