"use client"

import * as React from "react"
import {useMediaQuery} from "@/hooks/use-media-query"
import {Calendar as NextUICalendar} from "@nextui-org/calendar"
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
import {useState} from 'react';
import {ConfigProvider, theme} from 'antd';
import locale from 'antd/locale/zh_CN';
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import DateTimePickerCn from '@/components/data-picker-custom-cn';
import { format} from "date-fns"
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
      console.log('reqBody:', reqBody);
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
      console.log('response:', response);
      const data = await response.json()
      console.log('data:', data);
      console.log('data:', JSON.stringify(data));
      // setRecords(data.data || [])
      setAttendanceRecords(data || [])
    }
      // 指定error的类型为unknown
    catch (error: unknown) {
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
  const formatAttendanceData = (records: AttendanceRecord[][]) => {
    const formattedData: { [key: string]: AttendanceRecord[] } = {};
    // 判断 records 是否为空数组 是否为 undefined 是否为 null
    if (!records || records.length === 0) {
      return formattedData;
    }
    // console.info('records:', records)

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
              <DateTimePickerCn date={startDate} setDate={setStartDate} label={"开始日期"} className={"w-60"}/>
              <DateTimePickerCn date={endDate} setDate={setEndDate} label={"结束日期"} className={"w-60"}/>
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
      <Card>
        <CardContent>
          <div className="mt-4 content-center items-center">
            {isMobile ? (
              <NextUICalendar
                onChange={() => {}}
              />
            ) : (
              <ConfigProvider locale={locale} theme={{algorithm: theme.darkAlgorithm}}>
                <AttendanceCalendar
                  attendanceData={formatAttendanceData(attendanceRecords)}
                />
              </ConfigProvider>
            )}
          </div>
        </CardContent>
        <CardFooter/>
      </Card>
    </div>
  )
}
