'use client'

import * as React from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import AttendanceCalendar from '@/components/attendance/attendance-calendar'
import { useEffect, useState } from 'react'
import { ConfigProvider, theme } from 'antd'
import locale from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import DateTimePickerCn from '@/components/data-picker-custom-cn'
import { format } from 'date-fns'
import MobileAttendanceCalendar from '@/components/attendance/record-on-mobile-calendar'
import { ManualClock } from '@/components/attendance/manual-clock'
import { useAuth } from '@/components/auth-provider'
import { getEmployeeIdByUsername } from '@/lib/employee-mapping'
import { useTheme } from 'next-themes'
import { getClientInfo } from '@/lib/client-info'
import { getClientInfoV1 } from '@/lib/client-info-v1'
import { getClientInfoV2 } from '@/lib/client-info-v2'

dayjs.locale('zh-cn')

interface AttendanceRecord {
  id: number
  date: string
  time: string
  signInStateStr: string
  beLateTime: string
}

export function HistoryView() {
  const { username } = useAuth()
  const [employeeId, setEmployeeId] = React.useState(() =>
    getEmployeeIdByUsername(username)
  )

  // 监听 username 变化并更新 employeeId
  React.useEffect(() => {
    setEmployeeId(getEmployeeIdByUsername(username))
  }, [username])

  const [startDate, setStartDate] = React.useState<Date>()
  const [endDate, setEndDate] = React.useState<Date>()
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === 'dark'

  // 新增的状态用于保存日历选择的日期
  const [selectedCalendarDate, setSelectedCalendarDate] = React.useState<Date>()

  // 处理日历日期选择的函数
  const handleCalendarDateSelect = (date: dayjs.Dayjs) => {
    // 创建新的 Date 对象，只使用日历中选择的年月日
    const newDate = new Date(date.year(), date.month(), date.date())

    // 如果已经有一个手动时钟的日期，保留其时分秒
    if (selectedCalendarDate) {
      newDate.setHours(selectedCalendarDate.getHours())
      newDate.setMinutes(selectedCalendarDate.getMinutes())
      newDate.setSeconds(selectedCalendarDate.getSeconds())
    } else {
      // 默认设置为当前时间
      const now = new Date()
      newDate.setHours(now.getHours())
      newDate.setMinutes(now.getMinutes())
      newDate.setSeconds(now.getSeconds())
    }

    setSelectedCalendarDate(newDate)
  }

  // 处理移动端日历日期选择的函数
  const handleMobileCalendarDateSelect = (date: Date) => {
    // 创建新的 Date 对象，只使用日历中选择的年月日
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )

    // 如果已经有一个手动时钟的日期，保留其时分秒
    if (selectedCalendarDate) {
      newDate.setHours(selectedCalendarDate.getHours())
      newDate.setMinutes(selectedCalendarDate.getMinutes())
      newDate.setSeconds(selectedCalendarDate.getSeconds())
    } else {
      // 默认设置为当前时间
      const now = new Date()
      newDate.setHours(now.getHours())
      newDate.setMinutes(now.getMinutes())
      newDate.setSeconds(now.getSeconds())
    }

    setSelectedCalendarDate(newDate)
  }

  // [attendanceRecords] 改为空数组，只在组件挂载时执行一次
  useEffect(() => {
    // // 设置 startDate 默认为当天 00:00:00
    // setStartDate(dayjs().startOf("day").toDate());
    // 设置 startDate 默认为当月 的 00:00:00
    setStartDate(dayjs().startOf('month').toDate())
    // 设置 endDate 默认为当天 23:59:59
    setEndDate(dayjs().endOf('day').toDate())
    // 初始化日历选择日期为当前日期
    setSelectedCalendarDate(new Date())
  }, [])
  const fetchRecords = async () => {
    if (!employeeId || !startDate || !endDate) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      // 获取客户端信息并等待所有异步操作完成
      const clientInfo = await getClientInfo()

      // 添加延迟以确保异步操作完成
      await new Promise((resolve) => setTimeout(resolve, 100))

      console.info('Client Info Details:', JSON.stringify(clientInfo))

      const clientInfoV1 = await getClientInfoV1()
      console.info('clientInfoV1 Details:', JSON.stringify(clientInfoV1))

      const clientInfoV2 = await getClientInfoV2()
      console.info('clientInfoV2 Details:', JSON.stringify(clientInfoV2))

      const reqBody = JSON.stringify({
        employeeId,
        startDate: format(startDate, 'yyyy-MM-dd HH:mm:ss'),
        endDate: format(endDate, 'yyyy-MM-dd HH:mm:ss'),
        clientInfo,
      })
      const response = await fetch('/api/attendance/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: reqBody,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch records')
      }
      const data = await response.json()
      // setRecords(data.data || [])
      setAttendanceRecords(data || [])
    } catch (error: unknown) {
      // 指定error的类型为unknown
      if (error instanceof Error) {
        // 使用instanceof检查错误是否为Error类型
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch records', // 显示更详细的错误信息
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Unexpected error occurred', // 显示未知错误信息
          variant: 'destructive',
        })
      }
    } finally {
      setLoading(false)
    }
  }
  const formatAttendanceData = (records: AttendanceRecord[][]) => {
    const formattedData: { [key: string]: AttendanceRecord[] } = {}

    try {
      // 如果 records 是字符串，尝试解析它
      const recordsArray =
        typeof records === 'string' ? JSON.parse(records) : records

      // 确保 recordsArray 是数组
      if (!Array.isArray(recordsArray)) {
        console.warn('Invalid records format:', recordsArray)
        return formattedData
      }

      // 处理每一天的记录
      recordsArray.forEach((dayRecords) => {
        if (!Array.isArray(dayRecords)) {
          console.warn('Invalid day records format:', dayRecords)
          return
        }

        dayRecords.forEach((record) => {
          if (!record.date) {
            console.warn('Record missing date:', record)
            return
          }

          if (!formattedData[record.date]) {
            formattedData[record.date] = []
          }
          formattedData[record.date].push({
            date: record.date,
            time: record.time,
            signInStateStr: record.signInStateStr,
            beLateTime: record.beLateTime,
            id: record.id,
          })
        })
      })
    } catch (error) {
      console.error('Error formatting attendance data:', error)
    }

    return formattedData
  }

  return (
    <div className={cn('flex gap-2', isMobile ? 'flex-col' : 'flex-row')}>
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
                componentId="start-date-picker"
                date={startDate}
                setDate={setStartDate}
                label={'开始日期'}
                className={'w-60'}
              />

              <DateTimePickerCn
                componentId="end-date-picker"
                date={endDate}
                setDate={setEndDate}
                label={'结束日期'}
                className={'w-60'}
              />
            </div>
            <div className="flex">
              <Button
                className="w-60"
                onClick={fetchRecords}
                disabled={loading}
              >
                {loading ? 'Loading...' : '查询'}
              </Button>
            </div>
            {/* 上一周期按钮 */}
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  // 前一天：第一次点击时基于当前日期，之后基于上次选择的日期
                  if (startDate) {
                    // 获取当前选择的开始日期
                    const currentStartDate = new Date(startDate)

                    // 判断当前选择的日期是否为一整天（00:00:00 到 23:59:59）
                    const isFullDay =
                      currentStartDate.getHours() === 0 &&
                      currentStartDate.getMinutes() === 0 &&
                      currentStartDate.getSeconds() === 0 &&
                      endDate &&
                      endDate.getHours() === 23 &&
                      endDate.getMinutes() === 59 &&
                      endDate.getSeconds() === 59;

                    // 如果是一整天，则直接往前推一天
                    if (isFullDay) {
                      // 往前推一天
                      const newStartDate = new Date(currentStartDate)
                      newStartDate.setDate(currentStartDate.getDate() - 1)
                      newStartDate.setHours(0, 0, 0, 0)
                      setStartDate(newStartDate)

                      // 结束日期也往前推一天
                      const newEndDate = new Date(newStartDate)
                      newEndDate.setHours(23, 59, 59, 999)
                      setEndDate(newEndDate)
                    } else {
                      // 如果不是一整天，则设置为当前日期的前一天
                      const today = new Date()
                      const yesterday = new Date(today)
                      yesterday.setDate(today.getDate() - 1)
                      yesterday.setHours(0, 0, 0, 0)
                      setStartDate(yesterday)

                      const yesterdayEnd = new Date(yesterday)
                      yesterdayEnd.setHours(23, 59, 59, 999)
                      setEndDate(yesterdayEnd)
                    }
                  } else {
                    // 如果没有选择日期，则默认设置为昨天
                    const today = new Date()
                    const yesterday = new Date(today)
                    yesterday.setDate(today.getDate() - 1)
                    yesterday.setHours(0, 0, 0, 0)
                    setStartDate(yesterday)

                    const yesterdayEnd = new Date(yesterday)
                    yesterdayEnd.setHours(23, 59, 59, 999)
                    setEndDate(yesterdayEnd)
                  }
                }}
              >
                前一天
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  // 前一周：始终基于当前选择的日期往前推一周
                  if (startDate && endDate) {
                    // 无论当前选择的是什么，都直接往前推7天
                    const newStartDate = new Date(startDate)
                    newStartDate.setDate(startDate.getDate() - 7)
                    newStartDate.setHours(0, 0, 0, 0)
                    setStartDate(newStartDate)

                    const newEndDate = new Date(endDate)
                    newEndDate.setDate(endDate.getDate() - 7)
                    newEndDate.setHours(23, 59, 59, 999)
                    setEndDate(newEndDate)
                  } else {
                    // 如果没有选择日期，则默认设置为上周
                    const today = new Date()
                    const currentDay = today.getDay() || 7 // 将0（周日）转换为7

                    // 计算上周一的日期
                    const lastMonday = new Date(today)
                    lastMonday.setDate(today.getDate() - currentDay - 6) // 回到上周一
                    lastMonday.setHours(0, 0, 0, 0)
                    setStartDate(lastMonday)

                    // 计算上周日的日期
                    const lastSunday = new Date(lastMonday)
                    lastSunday.setDate(lastMonday.getDate() + 6) // 上周一 + 6天 = 上周日
                    lastSunday.setHours(23, 59, 59, 999)
                    setEndDate(lastSunday)
                  }
                }}
              >
                前一周
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  // 前一月：始终基于当前选择的日期往前推一个月
                  if (startDate && endDate) {
                    // 获取当前选择的开始日期
                    const currentStartDate = new Date(startDate)

                    // 获取当前选择的年月
                    const currentYear = currentStartDate.getFullYear()
                    const currentMonth = currentStartDate.getMonth()

                    // 计算上一个月的第一天
                    const newStartDate = new Date(
                      currentYear,
                      currentMonth - 1,
                      1
                    )
                    newStartDate.setHours(0, 0, 0, 0)
                    setStartDate(newStartDate)

                    // 计算上一个月的最后一天
                    const newEndDate = new Date(currentYear, currentMonth, 0)
                    newEndDate.setHours(23, 59, 59, 999)
                    setEndDate(newEndDate)
                  } else {
                    // 如果没有选择日期，则默认设置为上个月
                    const today = new Date()

                    // 上个月的第一天
                    const firstDayLastMonth = new Date(
                      today.getFullYear(),
                      today.getMonth() - 1,
                      1
                    )
                    firstDayLastMonth.setHours(0, 0, 0, 0)
                    setStartDate(firstDayLastMonth)

                    // 上个月的最后一天
                    const lastDayLastMonth = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      0
                    )
                    lastDayLastMonth.setHours(23, 59, 59, 999)
                    setEndDate(lastDayLastMonth)
                  }
                }}
              >
                前一月
              </Button>
            </div>
            {/* 当前周期按钮 */}
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  // 当天：设置为今天的00:00:00到23:59:59
                  const today = new Date()
                  const todayStart = new Date(today)
                  todayStart.setHours(0, 0, 0, 0)
                  setStartDate(todayStart)

                  const todayEnd = new Date(today)
                  todayEnd.setHours(23, 59, 59, 999)
                  setEndDate(todayEnd)
                }}
              >
                当天
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  // 当周：设置为本周一00:00:00到本周日23:59:59
                  const today = new Date()
                  const currentDay = today.getDay() || 7 // 将0（周日）转换为7

                  // 计算本周一的日期
                  const thisMonday = new Date(today)
                  thisMonday.setDate(today.getDate() - currentDay + 1) // 调整到本周一
                  thisMonday.setHours(0, 0, 0, 0)
                  setStartDate(thisMonday)

                  // 计算本周日的日期
                  const thisSunday = new Date(thisMonday)
                  thisSunday.setDate(thisMonday.getDate() + 6) // 本周一 + 6天 = 本周日
                  thisSunday.setHours(23, 59, 59, 999)
                  setEndDate(thisSunday)
                }}
              >
                当周
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  // 当月：设置为本月1号00:00:00到本月最后一天23:59:59
                  const today = new Date()

                  // 本月的第一天
                  const firstDayThisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
                  firstDayThisMonth.setHours(0, 0, 0, 0)
                  setStartDate(firstDayThisMonth)

                  // 本月的最后一天
                  const lastDayThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
                  lastDayThisMonth.setHours(23, 59, 59, 999)
                  setEndDate(lastDayThisMonth)
                }}
              >
                当月
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
                onDateSelect={handleMobileCalendarDateSelect}
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
                  onDateSelect={handleCalendarDateSelect}
                />
              </ConfigProvider>
            )}
          </div>
          <Button className="w-full" onClick={fetchRecords} disabled={loading}>
            {loading ? 'Loading...' : '查询'}
          </Button>
        </CardContent>
        <CardFooter />
      </Card>
      {/*  模拟参数*/}
      <Card>
        <CardHeader />
        <CardContent>
          <ManualClock selectedDate={selectedCalendarDate} />
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  )
}
