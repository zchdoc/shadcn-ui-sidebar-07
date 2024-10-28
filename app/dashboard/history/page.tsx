"use client"

import { HistoryView } from "@/components/attendance/history-view"

export default function HistoryPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance History</h1>
      <HistoryView />
    </div>
  )
}