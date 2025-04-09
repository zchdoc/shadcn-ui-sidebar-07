"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  label?: string
  className?: string
  componentId?: string
}

const DateTimePickerCn = ({
  date,
  setDate,
  label = "选择日期和时间",
  className,
  componentId = "DateTimePickerCn",
}: DateTimePickerProps) => {
  if (componentId) {
  }
  const [hours, setHours] = React.useState(date ? date.getHours() : 0)
  const [minutes, setMinutes] = React.useState(date ? date.getMinutes() : 0)
  const [seconds, setSeconds] = React.useState(date ? date.getSeconds() : 0)

  // 监听外部 date 变化
  React.useEffect(() => {
    if (date) {
      // 防止useEffect触发时间更新标志
      timeChangedByUser.current = false
      setHours(date.getHours())
      setMinutes(date.getMinutes())
      setSeconds(date.getSeconds())
    }
  }, [date])

  // 监听内部时间变化
  const updateDate = React.useCallback(() => {
    if (date) {
      const newDate = new Date(date)
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      newDate.setSeconds(seconds)
      setDate(newDate)
    }
  }, [date, hours, minutes, seconds, setDate])

  // 使用ref跟踪时间组件是否由用户手动更改
  const timeChangedByUser = React.useRef(false)
  
  // 当内部时间组件变化时更新日期
  React.useEffect(() => {
    // 只有当时间组件由用户手动更改时才更新日期
    if (timeChangedByUser.current) {
      updateDate()
      timeChangedByUser.current = false
    }
  }, [updateDate])

  // 添加处理时间变化的函数
  const handleTimeChange = (type: 'hours' | 'minutes' | 'seconds', value: number) => {
    timeChangedByUser.current = true
    if (type === 'hours') setHours(value)
    else if (type === 'minutes') setMinutes(value)
    else if (type === 'seconds') setSeconds(value)
  }

  // 添加 Popover 开关状态控制
  const [open, setOpen] = React.useState(false)

  const hoursOptions = Array.from({ length: 24 }, (_, i) => i)
  const minutesOptions = Array.from({ length: 60 }, (_, i) => i)
  const secondsOptions = Array.from({ length: 60 }, (_, i) => i)

  const formatDate = (date: Date) => {
    return format(date, "PPP HH:mm:ss", { locale: zhCN })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal", // 移除固定宽度
            !date && "text-muted-foreground",
            className // 应用传入的 className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : <span>{label}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              const updatedDate = new Date(newDate)
              updatedDate.setHours(hours)
              updatedDate.setMinutes(minutes)
              updatedDate.setSeconds(seconds)
              setDate(updatedDate)
            } else {
              setDate(undefined)
            }
          }}
          locale={zhCN}
          initialFocus
        />

        <div className="border-t p-3 flex gap-2">
          <Select
            value={hours.toString()}
            onValueChange={(value) => handleTimeChange('hours', parseInt(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="时" />
            </SelectTrigger>
            <SelectContent position="popper" className="h-48">
              {hoursOptions.map((hour) => (
                <SelectItem key={hour} value={hour.toString()}>
                  {hour.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={minutes.toString()}
            onValueChange={(value) => handleTimeChange('minutes', parseInt(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="分" />
            </SelectTrigger>
            <SelectContent position="popper" className="h-48">
              {minutesOptions.map((minute) => (
                <SelectItem key={minute} value={minute.toString()}>
                  {minute.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={seconds.toString()}
            onValueChange={(value) => handleTimeChange('seconds', parseInt(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="秒" />
            </SelectTrigger>
            <SelectContent position="popper" className="h-48">
              {secondsOptions.map((second) => (
                <SelectItem key={second} value={second.toString()}>
                  {second.toString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={() => setOpen(false)}>
            确定
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DateTimePickerCn
