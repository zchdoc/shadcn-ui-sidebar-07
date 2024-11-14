"use client"

import * as React from "react"
import {useMediaQuery} from "@/hooks/use-media-query"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {useToast} from "@/components/ui/use-toast"
import AttendanceCalendar from '@/components/attendance/attendance-calendar'
import {useEffect, useState} from 'react';
import {ConfigProvider, theme} from 'antd';
import locale from 'antd/locale/zh_CN';
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import DateTimePickerCn from '@/components/data-picker-custom-cn';
import {format} from "date-fns"
import MobileAttendanceCalendar from '@/components/attendance/record-on-mobile-calendar';
import {ManualClock} from '@/components/attendance/manual-clock';

dayjs.locale("zh-cn");

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
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = React.useState(false)
  const {toast} = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")
  // [attendanceRecords] 改为空数组，只在组件挂载时执行一次
  useEffect(() => {
    // // 设置 startDate 默认为当天 00:00:00
    // setStartDate(dayjs().startOf("day").toDate());
    // 设置 startDate 默认为当月 的 00:00:00
    setStartDate(dayjs().startOf("month").toDate());
    // 设置 endDate 默认为当天 23:59:59
    setEndDate(dayjs().endOf("day").toDate());
  }, []);
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
      const reqBody = JSON.stringify({
        employeeId,
        startDate: format(startDate, "yyyy-MM-dd HH:mm:ss"),
        endDate: format(endDate, "yyyy-MM-dd HH:mm:ss"),
      });
      const response = await fetch("/api/attendance/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: reqBody,
      })

      if (!response.ok) {
        throw new Error("Failed to fetch records")
      }
      const data = await response.json()
      // setRecords(data.data || [])
      setAttendanceRecords(data || [])
    }
      // 指定error的类型为unknown
    catch (error: unknown) {
      if (error instanceof Error) { // 使用instanceof检查错误是否为Error类型
        toast({
          title: "Error",
          description: error.message || "Failed to fetch records", // 显示更详细的错误信息
          variant: "destructive",
        });
      }
      else {
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
  const formatAttendanceData = (records: AttendanceRecord[][]) => {
    const formattedData: { [key: string]: AttendanceRecord[] } = {};
    // 判断 records 是否为空数组 是否为 undefined 是否为 null
    if (!records || records.length === 0) {
      return formattedData;
    }

    records.forEach((dayRecords) => {
      dayRecords.forEach((record) => {
        if (!formattedData[record.date]) {
          formattedData[record.date] = [];
        }
        formattedData[record.date].push({
          date: record.date, // 确保包含 date 属性
          time: record.time,
          signInStateStr: record.signInStateStr,
          beLateTime: record.beLateTime,
          id: record.id,
        });
      });
    });

    return formattedData;
  };

  return (
    <div className={cn("flex gap-2", isMobile ? "flex-col" : "flex-row")}>
      {/*查询参数*/}
      <Card>
        <CardHeader/>
        <CardContent>
          <div className="flex flex-col space-y-1.5 content-center items-center">
            <div className="flex">
              <Input
                className="w-60"
                type="text"
                placeholder="编号"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5 w-60">
              <DateTimePickerCn componentId={`1${startDate}`} date={startDate} setDate={setStartDate} label={"开始日期"} className={"w-60"}/>
              <DateTimePickerCn componentId={`2${endDate}`} date={endDate} setDate={setEndDate} label={"结束日期"} className={"w-60"}/>
            </div>
            <div className="flex">
              <Button className="w-60" onClick={fetchRecords} disabled={loading}>
                {loading ? "Loading..." : "查询"}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter/>
      </Card>
      {/*查询结果*/}
      <Card>
        <CardContent>
          <div className="mt-4 content-center items-center">
            {isMobile ? (
              // <NextUICalendar
              //   onChange={() => {}}
              // />
              <MobileAttendanceCalendar
                attendanceData={formatAttendanceData(attendanceRecords)}
              />
            ) : (
              <ConfigProvider locale={locale} theme={{algorithm: theme.darkAlgorithm}}>
                <AttendanceCalendar
                  attendanceData={formatAttendanceData(attendanceRecords)}
                />
              </ConfigProvider>
            )}
          </div>
          <Button className="w-full" onClick={fetchRecords} disabled={loading}>
            {loading ? "Loading..." : "查询"}
          </Button>
        </CardContent>
        <CardFooter/>
      </Card>
      {/*  模拟参数*/}
      <Card>
        <CardHeader/>
        <CardContent>
          <ManualClock/>
        </CardContent>
        <CardFooter/>
      </Card>
    </div>
  )
}
