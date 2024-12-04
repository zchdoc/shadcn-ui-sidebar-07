"use client";

import { useCallback, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { ManualClock } from "@/components/attendance/manual-clock";
import { HistoryView } from "@/components/attendance/history-view";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/components/auth-provider";

export default function Page() {
  const [activeView, setActiveView] = useState<
    "default" | "history" | "manual-clock"
  >("history");

  const onAppSidebarViewChange = useCallback(function (e: string) {
    if (["default", "history", "manual-clock"].includes(e)) {
      setActiveView(e as "history" | "manual-clock" | "default");
    }
  }, []);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // 让 layout 处理未认证状态
  }
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar onViewChange={onAppSidebarViewChange} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-8 w-full justify-between">
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
                    <BreadcrumbPage>
                      {activeView === "history"
                        ? "History"
                        : activeView === "manual-clock"
                          ? "Manual Clock"
                          : "Management"}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {activeView === "history" ? (
            <div className="container mx-auto p-4">
              {/*<h1 className="text-2xl font-bold mb-4">Attendance History</h1>*/}
              <HistoryView />
            </div>
          ) : activeView === "manual-clock" ? (
            <div className="container mx-auto p-4">
              <h1 className="text-2xl font-bold mb-4">Manual Clock</h1>
              <div className="max-w-md mx-auto">
                <ManualClock />
              </div>
            </div>
          ) : (
            <div className="container mx-auto p-4">
              <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard</h1>
              <p>Select an option from the sidebar to get started.</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
