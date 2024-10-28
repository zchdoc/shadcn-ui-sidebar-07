import React from 'react';
import {Calendar} from "@/components/ui/calendar";
import {Label} from "@/components/ui/label";
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {DayContent, DayContentProps} from "react-day-picker";
import {zhCN} from 'date-fns/locale';

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

const MobileAttendanceCalendar: React.FC<MobileAttendanceCalendarProps> = ({attendanceData}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [selectedRecords, setSelectedRecords] = React.useState<AttendanceRecord[]>([]);

  // 判断日期是否有考勤记录
  const hasAttendanceRecord = (date: Date): boolean => {
    // 使用 date-fns 格式化日期，确保格式一致
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return Boolean(attendanceData[dateStr]?.length > 0);
  };

  // 处理日期选择
  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      setSelectedRecords(attendanceData[dateStr] || []);
    }
    else {
      setSelectedRecords([]);
    }
  };

  // 自定义日期渲染
  const renderDay = (props: DayContentProps) => {
    const date = props.date;
    const hasRecord = hasAttendanceRecord(date);

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-full relative",
            props.activeModifiers?.selected && "bg-primary text-primary-foreground",
          )}
        >
          <DayContent {...props} />
          {hasRecord && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"/>
          )}
        </div>
      </div>
    );
  };

  /**
   * 正常 success
   * 迟到 error
   * 旷工 error
   * 早退 error
   * 加班 success
   * 正常签到 success
   * 正常签退 success
   * 请假 success
   * 周日不考勤 success
   * 周六签退 success
   * 下面的 状态(processing)需要测试
   * case "加班": return "processing";
   * case "加班": return "bg-blue-100 dark:bg-blue-900/20"
   * default: return "bg-gray-100 dark:bg-gray-800"
   */
  function getSignInStateClass(signInStateStr: string) {
    switch (signInStateStr) {
      case "正常":
      case "加班":
      case "正常签到":
      case "正常签退":
      case "请假":
      case "周日不考勤":
      case "周六签退":
      case "请假(系统)":
      case "未排班(系统)":
        return "bg-green-100 dark:bg-green-900/20"
      case "未签到(系统)":
      case "未签退(系统)":
      case "未签到":
      case "未签退":
        return "bg-yellow-100 dark:bg-yellow-900/20"
      case "迟到":
      case "旷工":
      case "早退":
        return "bg-red-100 dark:bg-red-900/20"

      default:
        return "bg-gray-100 dark:bg-red-900/20"
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        locale={zhCN}
        weekStartsOn={1}
        components={{
          DayContent: renderDay
        }}
        className="rounded-md border shadow"
        ISOWeek
      />
      {selectedDate && selectedRecords.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <Label className="text-base font-semibold">
                {`${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日 考勤记录:`}
              </Label>
              {selectedRecords.map((record) => (
                // <div
                //   key={record.id}
                //   className={cn(
                //     "p-2 rounded-md",
                //     record.signInStateStr === "正常签到" || record.signInStateStr === "正常签退"
                //       ? "bg-green-100 dark:bg-green-900/20"
                //       : record.signInStateStr === "迟到"
                //         ? "bg-yellow-100 dark:bg-yellow-900/20"
                //         : record.signInStateStr === "未签退"
                //           ? "bg-red-100 dark:bg-red-900/20"
                //           : record.signInStateStr === "加班"
                //             ? "bg-blue-100 dark:bg-blue-900/20"
                //             : "bg-gray-100 dark:bg-gray-800"
                //   )}
                // >
                <div
                  key={record.id}
                  className={cn("p-2 rounded-md", getSignInStateClass(record.signInStateStr))}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{record.signInStateStr}</span>
                    <span>{record.time}</span>
                  </div>
                  {record.beLateTime && record.beLateTime !== "0" && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      延时: {record.beLateTime}
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
