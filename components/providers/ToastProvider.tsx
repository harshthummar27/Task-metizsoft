'use client'

import { ToastProvider as Provider } from '@/contexts/ToastContext'

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>
}

