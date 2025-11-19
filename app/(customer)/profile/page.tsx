import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth/jwt'
import connectDB from '@/lib/db/connect'
import User from '@/lib/models/User'
import ProfileForm from '@/components/customer/ProfileForm'
import { redirect } from 'next/navigation'

async function getCurrentUser() {
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

  if (!user || user.role !== 'customer') {
    redirect('/')
  }

  return user
}

export default async function ProfilePage() {
  const user = await getCurrentUser()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">View and update your profile information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="text-center mb-6">
              <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#1282a2', opacity: 0.2 }}>
                <svg
                  className="w-12 h-12"
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
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 text-white text-xs font-semibold rounded-full" style={{ backgroundColor: '#001f54' }}>
                {user.role}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
                <p className="text-sm text-gray-900 mt-1">{user.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Address</p>
                <p className="text-sm text-gray-900 mt-1">{user.address || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Member Since</p>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(user.createdAt!).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
            <ProfileForm
              initialData={{
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                address: user.address || '',
              }}
              userId={user._id.toString()}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
