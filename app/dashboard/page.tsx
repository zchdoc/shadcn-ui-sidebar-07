'use client'

import { useCallback, useState } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { ManualClock } from '@/components/attendance/manual-clock'
import { HistoryView } from '@/components/attendance/history-view'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useAuth } from '@/components/auth-provider'

export default function Page() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null // 让 layout 处理未认证状态
  }
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="container mx-auto p-4">
        <HistoryView />
      </div>
    </div>
  )
}
