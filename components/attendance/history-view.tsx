"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import AttendanceCalendar from "@/components/attendance/attendance-calendar";
import { useEffect, useState } from "react";
import { ConfigProvider, theme } from "antd";
import locale from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import DateTimePickerCn from "@/components/data-picker-custom-cn";
import { format } from "date-fns";
import MobileAttendanceCalendar from "@/components/attendance/record-on-mobile-calendar";
import { ManualClock } from "@/components/attendance/manual-clock";
import { useAuth } from "@/components/auth-provider";
import { getEmployeeIdByUsername } from "@/lib/employee-mapping";
import { useTheme } from "next-themes";
import { getClientInfo } from "@/lib/client-info";
import { getClientInfoV1 } from "@/lib/client-info-v1";
import { getClientInfoV2 } from "@/lib/client-info-v2";

dayjs.locale("zh-cn");

interface AttendanceRecord {
  id: number;
  date: string;
  time: string;
  signInStateStr: string;
  beLateTime: string;
}

export function HistoryView() {
  const { username } = useAuth();
  const [employeeId, setEmployeeId] = React.useState(() =>
    getEmployeeIdByUsername(username)
  );

  // 监听 username 变化并更新 employeeId
  React.useEffect(() => {
    setEmployeeId(getEmployeeIdByUsername(username));
  }, [username]);

  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
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
      });
      return;
    }

    setLoading(true);
    try {
      // 获取客户端信息并等待所有异步操作完成
      const clientInfo = await getClientInfo();

      // 添加延迟以确保异步操作完成
      await new Promise((resolve) => setTimeout(resolve, 100));

      console.info("Client Info Details:", JSON.stringify(clientInfo));

      const clientInfoV1 = await getClientInfoV1();
      console.info("clientInfoV1 Details:", JSON.stringify(clientInfoV1));

      const clientInfoV2 = await getClientInfoV2();
      console.info("clientInfoV2 Details:", JSON.stringify(clientInfoV2));

      const reqBody = JSON.stringify({
        employeeId,
        startDate: format(startDate, "yyyy-MM-dd HH:mm:ss"),
        endDate: format(endDate, "yyyy-MM-dd HH:mm:ss"),
        clientInfo,
      });
      const response = await fetch("/api/attendance/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: reqBody,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }
      const data = await response.json();
      // setRecords(data.data || [])
      setAttendanceRecords(data || []);
    } catch (error: unknown) {
      // 指定error的类型为unknown
      if (error instanceof Error) {
        // 使用instanceof检查错误是否为Error类型
        toast({
          title: "Error",
          description: error.message || "Failed to fetch records", // 显示更详细的错误信息
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Unexpected error occurred", // 显示未知错误信息
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const formatAttendanceData = (records: AttendanceRecord[][]) => {
    const formattedData: { [key: string]: AttendanceRecord[] } = {};

    try {
      // 如果 records 是字符串，尝试解析它
      const recordsArray =
        typeof records === "string" ? JSON.parse(records) : records;

      // 确保 recordsArray 是数组
      if (!Array.isArray(recordsArray)) {
        console.warn("Invalid records format:", recordsArray);
        return formattedData;
      }

      // 处理每一天的记录
      recordsArray.forEach((dayRecords) => {
        if (!Array.isArray(dayRecords)) {
          console.warn("Invalid day records format:", dayRecords);
          return;
        }

        dayRecords.forEach((record) => {
          if (!record.date) {
            console.warn("Record missing date:", record);
            return;
          }

          if (!formattedData[record.date]) {
            formattedData[record.date] = [];
          }
          formattedData[record.date].push({
            date: record.date,
            time: record.time,
            signInStateStr: record.signInStateStr,
            beLateTime: record.beLateTime,
            id: record.id,
          });
        });
      });
    } catch (error) {
      console.error("Error formatting attendance data:", error);
    }

    return formattedData;
  };

  return (
    <div className={cn("flex gap-2", isMobile ? "flex-col" : "flex-row")}>
      {/*查询参数*/}
      <Card>
        <CardHeader />
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
              <DateTimePickerCn
                componentId={`1${startDate}`}
                date={startDate}
                setDate={setStartDate}
                label={"开始日期"}
                className={"w-60"}
              />
              <DateTimePickerCn
                componentId={`2${endDate}`}
                date={endDate}
                setDate={setEndDate}
                label={"结束日期"}
                className={"w-60"}
              />
            </div>
            <div className="flex">
              <Button
                className="w-60"
                onClick={fetchRecords}
                disabled={loading}
              >
                {loading ? "Loading..." : "查询"}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter />
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
              <ConfigProvider
                locale={locale}
                theme={{
                  algorithm: isDarkMode
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm,
                }}
              >
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
        <CardFooter />
      </Card>
      {/*  模拟参数*/}
      <Card>
        <CardHeader />
        <CardContent>
          <ManualClock />
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
}
