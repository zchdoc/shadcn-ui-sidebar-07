"use client"

import * as React from "react"
import {format} from "date-fns"
import {Calendar as CalendarIcon} from "lucide-react"
import {useMediaQuery} from "@/hooks/use-media-query"
import {Calendar as AntCalendar} from "antd"
import {Calendar as NextUICalendar} from "@nextui-org/calendar"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {Input} from "@/components/ui/input"
import {useToast} from "@/components/ui/use-toast"

interface AttendanceRecord {
  id: number
  date: string
  time: string
  signInStateStr: string
  beLateTime: string
}

export function HistoryView() {
  const [employeeId, setEmployeeId] = React.useState("3000002")
  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()
  const [records, setRecords] = React.useState<AttendanceRecord[]>([])
  const [loading, setLoading] = React.useState(false)
  const {toast} = useToast()
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
      const startDateStr = format(startDate, "yyyy-MM-dd 00:00:00");
      const endDateStr = format(endDate, "yyyy-MM-dd 23:59:59");
      const response = await fetch("/api/attendance/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          employeeId,
          startDate: startDateStr,
          endDate: endDateStr,
        }),
      })

      if (!response.ok) throw new Error("Failed to fetch records")
      console.log('response:', response);
      const data = await response.json()
      console.log('data:', data);
      setRecords(data.data || [])
    }
    catch (error: unknown) { // 指定error的类型为unknown
      if (error instanceof Error) { // 使用instanceof检查错误是否为Error类型
        console.error(error); // 打印错误信息到控制台
        toast({
          title: "Error",
          description: error.message || "Failed to fetch records", // 显示更详细的错误信息
          variant: "destructive",
        });
      }
      else {
        console.error("Unexpected error", error); // 处理未知类型的错误
        toast({
          title: "Error",
          description: "Unexpected error occurred", // 显示未知错误信息
          variant: "destructive",
        });
      }
    }
    finally {
      setLoading(false);
    }

  }

  const dateCellRender = (value: any) => {
    const dateStr = format(value.toDate(), "yyyy-MM-dd")
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
              <CalendarIcon className="mr-2 h-4 w-4"/>
              {startDate ? format(startDate, "PPP") : <span>Start date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
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
              <CalendarIcon className="mr-2 h-4 w-4"/>
              {endDate ? format(endDate, "PPP") : <span>End date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
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
            cellRender={dateCellRender}
          />
        )}
      </div>
    </div>
  )
}
