import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#fefcfb' }}>
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#0a1128' }}>Access Denied</h1>
            <p style={{ color: '#034078' }}>
              You don't have permission to access this page.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity font-medium text-center"
              style={{ backgroundColor: '#034078' }}
            >
              Go to Login
            </Link>
            <Link
              href="/admin"
              className="block w-full border py-2 px-4 rounded-md hover:opacity-90 transition-opacity font-medium text-center"
              style={{ 
                borderColor: '#1282a2',
                color: '#034078'
              }}
            >
              Try Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

