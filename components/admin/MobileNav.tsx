'use client'

import { useState } from 'react'
import Link from 'next/link'
import LogoutButton from '@/components/admin/LogoutButton'

interface MobileNavProps {
  userName: string
  userRole: 'admin' | 'customer'
}

export default function MobileNav({ userName, userRole }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const adminLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/users', label: 'Users' },
  ]

  const customerLinks = [
    { href: '/profile', label: 'My Profile' },
  ]

  const links = userRole === 'admin' ? adminLinks : customerLinks
  const brandName = userRole === 'admin' ? 'Metizsoft Admin' : 'Metizsoft'
  const brandHref = userRole === 'admin' ? '/admin' : '/profile'

  return (
    <nav className="bg-white shadow-sm border-b" style={{ borderColor: '#1282a2' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Links */}
          <div className="flex items-center">
            <Link href={brandHref} className="text-xl font-bold" style={{ color: '#0a1128' }}>
              {brandName}
            </Link>
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:ml-8 md:space-x-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{ color: '#034078' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop User Info and Logout */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <span className="text-sm" style={{ color: '#034078' }}>
              Welcome, <span className="font-semibold">{userName}</span>
            </span>
            <LogoutButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <span className="text-xs" style={{ color: '#034078' }}>
              {userName}
            </span>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md"
              style={{ color: '#034078' }}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t" style={{ borderColor: '#1282a2' }}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="nav-link block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  style={{ color: '#034078' }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t" style={{ borderColor: '#1282a2' }}>
                <div className="px-3 py-2">
                  <p className="text-sm" style={{ color: '#034078' }}>
                    Welcome, <span className="font-semibold">{userName}</span>
                  </p>
                </div>
                <div className="px-3 py-2">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

