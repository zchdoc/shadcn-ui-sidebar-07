"use client"

import { ManualClock } from "@/components/attendance/manual-clock"

export default function ManualClockPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manual Clock</h1>
      <div className="max-w-md mx-auto">
        <ManualClock />
      </div>
    </div>
  )
}