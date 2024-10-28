import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DayContent, DayContentProps } from "react-day-picker";

interface AttendanceRecord {
  id: number;
  date: string;
  time: string;
  signInStateStr: string;
  beLateTime: string;
}

interface AttendanceData {
  [key: string]: AttendanceRecord[];
}

interface MobileAttendanceCalendarProps {
  attendanceData: AttendanceData;
}

const MobileAttendanceCalendar: React.FC<MobileAttendanceCalendarProps> = ({ attendanceData }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [selectedRecords, setSelectedRecords] = React.useState<AttendanceRecord[]>([]);

  // 判断日期是否有考勤记录
  const hasAttendanceRecord = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return Boolean(attendanceData[dateStr]?.length > 0);
  };

  // 处理日期选择
  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateStr = date.toISOString().split('T')[0];
      setSelectedRecords(attendanceData[dateStr] || []);
    } else {
      setSelectedRecords([]);
    }
  };

  // 自定义日期渲染
  const renderDay = (props: DayContentProps) => {
    console.info('props:',props);
    console.info('props.date:',props.date);
    console.info('props.activeModifiers:',props.activeModifiers);
    console.info('props.activeModifiers.selected:',props.activeModifiers.selected);
    console.info('props.activeModifiers.disabled:',props.activeModifiers.disabled);
    console.info('props.activeModifiers.hidden:',props.activeModifiers.hidden);
    console.info('props.activeModifiers.outside:',props.activeModifiers.outside);
    console.info('props.activeModifiers.today:',props.activeModifiers.today);
    console.info('props.activeModifiers.range_end:',props.activeModifiers.range_end);
    console.info('props.activeModifiers.range_middle:',props.activeModifiers.range_middle);
    console.info('props.activeModifiers.range_start:',props.activeModifiers.range_start);
    console.info('props.displayMonth:',props.displayMonth);
    const date = props.date;
    const hasRecord = hasAttendanceRecord(date);
    // selected
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-full relative",
            props.activeModifiers.selected && "bg-primary text-primary-foreground",
          )}
        >
          <DayContent {...props} />
          {hasRecord && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
          )}
        </div>
      </div>
    );
  };
  // const formatTime = (timeStr: string): string => {
  //   return timeStr.split(' ')[1] || timeStr;
  // };

  return (
    <div className="flex flex-col gap-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        components={{
          DayContent: renderDay
        }}
        className="rounded-md border shadow"
      />

      {selectedDate && selectedRecords.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                {selectedDate.toLocaleDateString('zh-CN')} 考勤记录：
              </Label>
              {selectedRecords.map((record) => (
                <div
                  key={record.id}
                  className={cn(
                    "p-2 rounded-md",
                    record.signInStateStr === "正常签到" || record.signInStateStr === "正常签退"
                      ? "bg-green-100 dark:bg-green-900/20"
                      : record.signInStateStr === "迟到"
                        ? "bg-yellow-100 dark:bg-yellow-900/20"
                        : record.signInStateStr === "未签退"
                          ? "bg-red-100 dark:bg-red-900/20"
                          : record.signInStateStr === "加班"
                            ? "bg-blue-100 dark:bg-blue-900/20"
                            : "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{record.signInStateStr}</span>
                    <span>{record.time}</span>
                  </div>
                  {record.beLateTime && record.beLateTime !== "0" && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      延时：{record.beLateTime}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MobileAttendanceCalendar;
