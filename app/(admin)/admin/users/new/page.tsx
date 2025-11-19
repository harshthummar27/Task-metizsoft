import UserForm from '@/components/admin/UserForm'

export default function NewUserPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New User</h1>
        <p className="text-gray-600">Add a new user to the system</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <UserForm />
      </div>
    </div>
  )
}

