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
import { getClientInfoV1 } from "@/lib/client-info-v1"
import { getClientInfoV2 } from "@/lib/client-info-v2"

export function ManualClock() {
  const { username } = useAuth()
  const [date, setDate] = React.useState<Date>()
  const [employeeId, setEmployeeId] = React.useState(() =>
    getEmployeeIdByUsername(username)
  )

  // 监听 username 变化并更新 employeeId
  React.useEffect(() => {
    setEmployeeId(getEmployeeIdByUsername(username))
  }, [username])

  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    // 设置 date 默认为当前时间
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

      console.info("Client Info Details:", JSON.stringify(clientInfo))

      const clientInfoV1 = await getClientInfoV1()
      console.info("clientInfoV1 Details:", JSON.stringify(clientInfoV1))

      const clientInfoV2 = await getClientInfoV2()
      console.info("clientInfoV2 Details:", JSON.stringify(clientInfoV2))

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
          clientInfo: clientInfo 
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
      {error && (
        <Alert message="Error" description={error} type="error" showIcon />
      )}
    </div>
  )
}
