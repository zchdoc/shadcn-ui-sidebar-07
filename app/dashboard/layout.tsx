'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { SecureStorage } from '@/lib/secure-storage'
import { validateToken } from '@/lib/auth'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = SecureStorage.getItem('auth_token')
        console.log('Dashboard Layout - Checking auth:', {
          token: token ? 'exists' : 'missing',
          isAuthenticated,
        })

        if (!isAuthenticated || !validateToken(token)) {
          console.log(
            'Dashboard Layout - Auth check failed, redirecting to login'
          )
          router.replace('/login')
          return
        }

        // console.log('Dashboard Layout - Auth check passed');
        setIsChecking(false)
      } catch (error) {
        console.error('Dashboard Layout - Auth check error:', error)
        router.replace('/login')
      }
    }

    checkAuth()
  }, [isAuthenticated, router])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p>正在验证身份...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  ) : null
}
