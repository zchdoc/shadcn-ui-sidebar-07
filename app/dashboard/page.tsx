'use client'

import { HistoryView } from '@/components/attendance/history-view'
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
