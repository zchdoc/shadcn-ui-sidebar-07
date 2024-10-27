"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Calendar as AntCalendar, Calendar } from "antd"
import { Calendar as NextUICalendar } from "@nextui-org/calendar"
import dayjs, { Dayjs } from 'dayjs'; 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface AttendanceRecord {
  id: number
  date: string
  time: string
  signInStateStr: string
  beLateTime: string
}

export function HistoryView() {
  const [employeeId, setEmployeeId] = React.useState("")
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()
  const [records, setRecords] = React.useState<AttendanceRecord[]>([])
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const fetchRecords = async () => {
    if (!employeeId || !startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/attendance/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          startDate: format(startDate, "yyyy-MM-dd"),
          endDate: format(endDate, "yyyy-MM-dd"),
        }),
      })

      if (!response.ok) throw new Error("Failed to fetch records")

      const data = await response.json()
      setRecords(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch records",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const dateCellRender = (value: Date) => {
    const dateStr = format(value, "yyyy-MM-dd")
    const dayRecords = records.filter(record => record.date === dateStr)

    if (dayRecords.length === 0) return null

    return (
      <div className="text-xs">
        {dayRecords.map((record, index) => (
          <div key={index} className="truncate">
            {record.time} - {record.signInStateStr}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : <span>Start date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>End date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button 
        className="w-full" 
        onClick={fetchRecords}
        disabled={loading}
      >
        {loading ? "Loading..." : "View Records"}
      </Button>
      <div className="mt-4">
        {isMobile ? (
          <NextUICalendar
            onChange={() => {}}
          />
        ) : (
          <AntCalendar
          />
        )}
      </div>
    </div>
  )
}