'use client'
import { ManualClock } from '@/components/attendance/manual-clock'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function ManualClockPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>考勤打卡模拟</CardTitle>
            <CardDescription>请选择打卡时间并点击模拟按钮</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto">
              <ManualClock />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
