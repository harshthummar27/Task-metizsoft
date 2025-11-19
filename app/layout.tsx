import type { Metadata } from 'next'
import './globals.css'
import ToastProvider from '@/components/providers/ToastProvider'
import ErrorBoundaryProvider from '@/components/providers/ErrorBoundaryProvider'

export const metadata: Metadata = {
  title: 'Metizsoft - Admin/Customer System',
  description: 'Next.js + MongoDB Admin/Customer Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundaryProvider>
          <ToastProvider>{children}</ToastProvider>
        </ErrorBoundaryProvider>
      </body>
    </html>
  )
}

