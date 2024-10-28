import React from "react";
import {Badge, Calendar, Tooltip, CalendarProps} from "antd";
import {theme, ConfigProvider, Col, Radio, Row, Select} from "antd";
import {HolidayUtil, Lunar} from "lunar-typescript";
import {createStyles} from "antd-style";
import type {Dayjs} from "dayjs";
import classNames from "classnames";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import locale from "antd/locale/zh_CN";

import "dayjs/locale/zh-cn";

dayjs.extend(localizedFormat); // 如果需要使用格式化插件
dayjs.locale("zh-cn");

interface AttendanceRecord {
  date: string;
  time: string;
  signInStateStr: string;
}

interface AttendanceData {
  [date: string]: AttendanceRecord[];
}

interface AttendanceCalendarProps {
  attendanceData: AttendanceData;
}

const useStyle = createStyles(({token, css, cx}) => {
  const lunar = css`
    color: ${token.colorTextTertiary};
    font-size: ${token.fontSizeSM}px;
    margin-left: 4px;
  `;
  const weekend = css`
    color: ${token.colorError};
    &.gray {
      opacity: 0.4;
    }
  `;
  return {
    wrapper: css`
      width: 450px;
      border: 1px solid ${token.colorBorderSecondary};
      border-radius: ${token.borderRadiusOuter};
      padding: 5px;
    `,
    dateCell: css`
      position: relative;
      height: 100%;
      &:before {
        content: "";
        position: absolute;
        inset-inline-start: 0;
        inset-inline-end: 0;
        top: 0;
        bottom: 0;
        margin: 0;
        background: transparent;
        transition: background-color 300ms;
        border-radius: ${token.borderRadiusOuter}px;
        border: 1px solid transparent;
        box-sizing: border-box;
      }
      &:hover:before {
        background: rgba(0, 0, 0, 0.04);
      }
    `,
    today: css`
      &:before {
        border: 1px solid ${token.colorPrimary};
      }
    `,
    text: css`
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
    dateWrapper: css`
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px 8px;
    `,
    recordsWrapper: css`
      flex: 1;
      padding: 4px 8px;
    `,
    lunar,
    current: css`
      color: ${token.colorTextLightSolid};
      &:before {
        background: ${token.colorPrimary};
      }
      &:hover:before {
        background: ${token.colorPrimary};
        opacity: 0.8;
      }
      .${cx(lunar)} {
        color: ${token.colorTextLightSolid};
        opacity: 0.9;
      }
      .${cx(weekend)} {
        color: ${token.colorTextLightSolid};
      }
    `,
    monthCell: css`
      width: 120px;
      color: ${token.colorTextBase};
      border-radius: ${token.borderRadiusOuter}px;
      padding: 5px 0;
      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }
    `,
    monthCellCurrent: css`
      color: ${token.colorTextLightSolid};
      background: ${token.colorPrimary};
      &:hover {
        background: ${token.colorPrimary};
        opacity: 0.8;
      }
    `,
    weekend,
  };
});
const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
                                                                 attendanceData,
                                                               }) => {
  const {styles} = useStyle({test: true});
  const [selectDate, setSelectDate] = React.useState<Dayjs>(dayjs());
  const [panelDateDate, setPanelDate] = React.useState<Dayjs>(dayjs());

  const getBadgeStatus = (status: string) => {
    switch (status) {
      case "正常签到":
        return "success";
      case "正常签退":
        return "success";
      case "迟到":
        return "warning";
      case "加班":
        return "processing";
      case "未签退":
        return "error";
      default:
        return "default";
    }
  };

  const getYearLabel = (year: number) => {
    const d = Lunar.fromDate(new Date(year + 1, 0));
    return `${d.getYearInChinese()}年（${d.getYearInGanZhi()}${d.getYearShengXiao()}年）`;
  };

  const getMonthLabel = (month: number, value: Dayjs) => {
    const d = Lunar.fromDate(new Date(value.year(), month));
    const lunar = d.getMonthInChinese();
    return `${month + 1}月（${lunar}月）`;
  };

  const renderAttendanceRecords = (date: Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    const records = attendanceData[dateStr];

    if (!records || records.length === 0) {
      return null;
    }

    return (
      <ConfigProvider
        locale={locale}
        theme={{algorithm: theme.darkAlgorithm}}
      >
        <ul
          className="events"
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            fontSize: "12px",
          }}
        >
          {records.map((record, index) => (
            <Tooltip
              key={index}
              title={`${record.time} - ${record.signInStateStr}`}
            >
              <li style={{margin: "2px 0"}}>
                <Badge
                  status={getBadgeStatus(record.signInStateStr)}
                  text={`${record.time.split(":")[0]}:${
                    record.time.split(":")[1]
                  } ${record.signInStateStr}`}
                  style={{fontSize: "12px"}}
                />
              </li>
            </Tooltip>
          ))}
        </ul>
      </ConfigProvider>
    );
  };

  const cellRender: CalendarProps<Dayjs>["fullCellRender"] = (date, info) => {
    const d = Lunar.fromDate(date.toDate());
    const lunar = d.getDayInChinese();
    const solarTerm = d.getJieQi();
    const isWeekend = date.day() === 6 || date.day() === 0;
    const h = HolidayUtil.getHoliday(
      date.get("year"),
      date.get("month") + 1,
      date.get("date")
    );
    const displayHoliday =
      h?.getTarget() === h?.getDay() ? h?.getName() : undefined;

    if (info.type === "date") {
      return React.cloneElement(info.originNode, {
        ...info.originNode.props,
        className: classNames(styles.dateCell, {
          [styles.current]: selectDate.isSame(date, "date"),
          [styles.today]: date.isSame(dayjs(), "date"),
        }),
        children: (
          <div className={styles.text}>
            <div className={styles.dateWrapper}>
              <span
                className={classNames({
                  [styles.weekend]: isWeekend,
                  gray: !panelDateDate.isSame(date, "month"),
                })}
              >
                {date.get("date")}
              </span>
              <span className={styles.lunar}>
                {displayHoliday || solarTerm || lunar}
              </span>
            </div>
            <div className={styles.recordsWrapper}>
              {renderAttendanceRecords(date)}
            </div>
          </div>
        ),
      });
    }

    if (info.type === "month") {
      const d2 = Lunar.fromDate(new Date(date.get("year"), date.get("month")));
      const month = d2.getMonthInChinese();
      return (
        <div
          className={classNames(styles.monthCell, {
            [styles.monthCellCurrent]: selectDate.isSame(date, "month"),
          })}
        >
          {date.get("month") + 1}月（{month}月）
        </div>
      );
    }
  };

  return (
    <Calendar
      fullCellRender={cellRender}
      fullscreen={false}
      headerRender={({value, type, onChange, onTypeChange}) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];
        const options = [];

        for (let i = start; i < end; i++) {
          monthOptions.push({
            label: getMonthLabel(i, value),
            value: i,
          });
        }

        const year = value.year();
        for (let i = year - 10; i < year + 10; i += 1) {
          options.push({
            label: getYearLabel(i),
            value: i,
          });
        }

        return (
          <Row justify="end" gutter={8} style={{padding: 8}}>
            <Col>
              <Select
                size="small"
                popupMatchSelectWidth={false}
                className="my-year-select"
                value={year}
                options={options}
                onChange={(newYear) => {
                  const now = value.clone().year(newYear);
                  onChange(now);
                }}
              />
            </Col>
            <Col>
              <Select
                size="small"
                popupMatchSelectWidth={false}
                value={value.month()}
                options={monthOptions}
                onChange={(newMonth) => {
                  const now = value.clone().month(newMonth);
                  onChange(now);
                }}
              />
            </Col>
            <Col>
              <Radio.Group
                size="small"
                onChange={(e) => onTypeChange(e.target.value)}
                value={type}
              >
                <Radio.Button value="month">月</Radio.Button>
                <Radio.Button value="year">年</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        );
      }}
    />
  );
};

export default AttendanceCalendar;
