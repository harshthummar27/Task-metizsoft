import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth/jwt'
import connectDB from '@/lib/db/connect'
import User from '@/lib/models/User'
import MobileNav from '@/components/admin/MobileNav'

async function checkAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/')
  }

  const decoded = verifyToken(token)
  if (!decoded || !decoded.userId) {
    redirect('/')
  }

  await connectDB()
  const user = await User.findById(decoded.userId).select('-password')

  if (!user || user.role !== 'admin') {
    redirect('/')
  }

  return user
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await checkAuth()

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fefcfb' }}>
      {/* Navigation Bar */}
      <MobileNav userName={user.name} userRole="admin" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

