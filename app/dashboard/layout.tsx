'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { SecureStorage } from '@/lib/secure-storage'
import { validateToken } from '@/lib/auth'
import { AppSidebar } from '@/components/app-sidebar'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'

// Helper function to generate breadcrumbs based on pathname
const generateBreadcrumbs = (pathname: string) => {
  const pathSegments = pathname.split('/').filter((segment) => segment)
  // Remove 'dashboard' as it's the base
  if (pathSegments[0] === 'dashboard') {
    pathSegments.shift()
  }

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/dashboard/' + pathSegments.slice(0, index + 1).join('/')
    const isLast = index === pathSegments.length - 1
    // Capitalize the first letter
    const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

    return {
      href,
      title,
      isLast,
    }
  })

  return breadcrumbs
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
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

  const breadcrumbs = generateBreadcrumbs(pathname)

  return isAuthenticated ? (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <main className="flex-1 flex flex-col overflow-y-auto w-full">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 md:px-6">
              <div className="flex items-center gap-2 w-full justify-between">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1 md:hidden" />
                  <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb.href}>
                          <BreadcrumbItem>
                            {crumb.isLast ? (
                              <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink href={crumb.href}>
                                {crumb.title}
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {!crumb.isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                      ))}
                      {breadcrumbs.length === 0 && (
                        <BreadcrumbItem>
                          <BreadcrumbPage>Dashboard</BreadcrumbPage>
                        </BreadcrumbItem>
                      )}
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <ThemeToggle />
              </div>
            </header>
            <div className="flex-1 p-4 md:p-8 w-full max-w-[calc(100vw-var(--sidebar-width))] mx-auto">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ) : null
}
