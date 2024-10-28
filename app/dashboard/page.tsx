"use client"

import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { ManualClock } from "@/components/attendance/manual-clock"
import { HistoryView } from "@/components/attendance/history-view"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  const pathname = usePathname()

  const getContent = () => {
    switch (pathname) {
      case "/dashboard/history":
        return (
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Attendance History</h1>
            <HistoryView />
          </div>
        )
      case "/dashboard/manual-clock":
        return (
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Manual Clock</h1>
            <div className="max-w-md mx-auto">
              <ManualClock />
            </div>
          </div>
        )
      default:
        return (
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>
            <p>Select an option from the sidebar to get started.</p>
          </div>
        )
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Attendance</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Management</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {getContent()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}