import mongoose, { Schema, Model } from 'mongoose'
import { User, UserRole } from '@/types'

export interface IUser extends Omit<User, '_id'> {
  _id: mongoose.Types.ObjectId
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Please provide a valid phone number'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'customer'],
        message: 'Role must be either admin or customer',
      },
      default: 'customer',
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
)

// Index for faster queries (email already has unique index from unique: true)
userSchema.index({ role: 1 })

// Prevent re-compilation during development
const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default UserModel

