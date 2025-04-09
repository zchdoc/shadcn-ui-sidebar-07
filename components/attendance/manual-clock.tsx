"use client"

import * as React from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import DateTimePickerCn from "@/components/data-picker-custom-cn"
import { useState, useEffect } from "react"
import { Alert } from "antd"
import { useAuth } from "@/components/auth-provider"
import { getEmployeeIdByUsername } from "@/lib/employee-mapping"
import { getClientInfo } from "@/lib/client-info"

interface ManualClockProps {
  selectedDate?: Date
}

export function ManualClock({ selectedDate }: ManualClockProps) {
  const { username } = useAuth()
  const [date, setDate] = React.useState<Date>()
  const [employeeId, setEmployeeId] = React.useState(() =>
    getEmployeeIdByUsername(username)
  )

  // 监听 username 变化并更新 employeeId
  React.useEffect(() => {
    setEmployeeId(getEmployeeIdByUsername(username))
  }, [username])

  // 监听外部传入的selectedDate变化
  React.useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate)
    }
  }, [selectedDate])

  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)

  // Function to set random time based on button clicked
  const setRandomTime = (type: string) => {
    if (!date) return // 如果没有选中日期，直接返回

    // 使用当前选中的日期创建新的时间范围
    const startTime = new Date(date)
    const endTime = new Date(date)

    switch (type) {
      case "上上":
        startTime.setHours(8, 10, 0, 0)
        endTime.setHours(8, 29, 59, 999)
        break
      case "上下":
        startTime.setHours(12, 1, 0, 0)
        endTime.setHours(12, 29, 59, 999)
        break
      case "下上":
        startTime.setHours(12, 31, 0, 0)
        endTime.setHours(12, 59, 59, 999)
        break
      case "下下":
        startTime.setHours(18, 10, 0, 0)
        endTime.setHours(21, 39, 59, 999)
        break
    }

    const randomTimestamp =
      startTime.getTime() +
      Math.random() * (endTime.getTime() - startTime.getTime())
    const randomTime = new Date(randomTimestamp)

    // 创建新的日期对象，保持原有日期，只更新时分秒
    const newDate = new Date(date)
    newDate.setHours(randomTime.getHours())
    newDate.setMinutes(randomTime.getMinutes())
    newDate.setSeconds(randomTime.getSeconds())

    setDate(newDate)
  }

  // 只在组件挂载时设置一次当前时间
  useEffect(() => {
    setDate(new Date())
  }, [])

  const handleClockIn = async () => {
    setError(null)
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
      // 获取客户端信息并等待所有异步操作完成
      const clientInfo = await getClientInfo()

      // 添加延迟以确保异步操作完成
      await new Promise((resolve) => setTimeout(resolve, 100))

      const userNo = employeeId // Assuming this is the correct user number
      const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss")
      const data = `${userNo}\t${formattedDate}\t0\t15\t\t0\t0`

      const queryParams = new URLSearchParams({
        sn: "CJDE193560303",
        table: "ATTLOG",
        Stamp: formattedDate,
      }).toString()
      // `/api/iclock/attDataCustom?${queryParams}`
      const response = await fetch(`/api/attendance/clock-in?${queryParams}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: data,
          clientInfo: clientInfo,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      let result
      console.info("contentType:", contentType)

      if (contentType && contentType.includes("application/json")) {
        result = await response.json()
      } else {
        result = await response.text()
      }
      // alert(result);
      toast({
        title: "Success:" + result,
        description: "Successfully clocked in",
      })
    } catch (err) {
      console.error("Error recording attendance:", err)
      setError("Failed to record attendance. Please try again.")
      // 添加定时器，5秒后自动清除错误信息
      setTimeout(() => {
        setError(null)
      }, 5000)

      if (err instanceof Error) {
        // 使用instanceof检查错误是否为Error类型
        toast({
          title: "Error",
          description: err.message || "Failed to clock in", // 显示更详细的错误信息
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to clock in",
          variant: "destructive",
        })
      }
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          disabled
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <DateTimePickerCn
          componentId={`3${date}`}
          date={date}
          setDate={setDate}
          label={"模拟日期"}
          className={"w-full"}
        />
      </div>
      <Button className="w-full" onClick={handleClockIn} disabled={loading}>
        {loading ? "Processing..." : "模拟"}
      </Button>
      <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => setRandomTime("上上")}
        >
          上上
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => setRandomTime("上下")}
        >
          上下
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => setRandomTime("下上")}
        >
          下上
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => setRandomTime("下下")}
        >
          下下
        </Button>
      </div>
      {error && (
        <Alert message="Error" description={error} type="error" showIcon />
      )}
    </div>
  )
}
