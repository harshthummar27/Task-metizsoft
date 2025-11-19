import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#fefcfb' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
           
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: '#0a1128' }}>
            Welcome to Metizsoft
          </h1>
          <p className="text-lg" style={{ color: '#034078' }}>
            Admin/Customer Management System
          </p>
        </div>

        {/* Single Login Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl" style={{ borderColor: '#1282a2' }}>
          <div className="px-6 py-4" style={{ backgroundColor: '#034078' }}>
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#fefcfb' }}>
                <svg
                  className="w-6 h-6"
                  style={{ color: '#034078' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Login</h2>
                <p className="text-sm" style={{ color: '#1282a2' }}>Sign in to your account</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <LoginForm />
            <div className="mt-6 pt-6 border-t" style={{ borderColor: '#1282a2' }}>
              <p className="text-xs text-center" style={{ color: '#034078' }}>
                <span className="font-semibold">Demo Admin:</span> admin@metizsoft.com / admin123
              </p>
              <p className="text-xs text-center mt-1" style={{ color: '#034078' }}>
                <span className="font-semibold">Demo Customer:</span> customer@metizsoft.com / customer123
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
