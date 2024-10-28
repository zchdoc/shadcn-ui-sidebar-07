import {NextResponse} from "next/server"

export async function POST(req: Request) {
  try {
    const {employeeId, startDate, endDate} = await req.json()

    const myHeaders = new Headers()
    myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)")

    const response = await fetch(
      `http://a2.4000063966.com:81/xb/zk/attendance/v2/record.do?userNo=${employeeId}&timeStart=${startDate} 00:00:00&timeEnd=${endDate} 23:59:59&openId=o45LO4l28n6aa4dFCXB3BBYOFWNs&userVerifyNumber=15824821718`,
      {
        method: "GET",
        headers: myHeaders,
      }
    )
    console.log('response0:', response);
    if (!response.ok) {
      throw new Error("Failed to fetch records")
    }

    const data = await response.json()
    console.log('data0:', data);
    return NextResponse.json(data)
  }
  catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {error: error.message || "Failed to fetch records"},  // 使用 error.message
        {status: 500}
      )
    }
    else {
      // 如果不是 Error 对象，返回一个通用的错误信息
      return NextResponse.json(
        {error: "Failed to fetch records"},
        {status: 500}
      )
    }
  }
}
