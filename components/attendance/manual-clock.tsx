"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export function ManualClock() {
  const [date, setDate] = React.useState<Date>()
  const [employeeId, setEmployeeId] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()

  const handleClockIn = async () => {
    if (!date || !employeeId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss")
      const response = await fetch("/api/attendance/clock-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          timestamp: formattedDate,
        }),
      })

      if (!response.ok) throw new Error("Failed to clock in")

      toast({
        title: "Success",
        description: "Successfully clocked in",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clock in",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
      <div className="space-y-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP HH:mm:ss") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button 
        className="w-full" 
        onClick={handleClockIn}
        disabled={loading}
      >
        {loading ? "Processing..." : "Clock In"}
      </Button>
    </div>
  )
}