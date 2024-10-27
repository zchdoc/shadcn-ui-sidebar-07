import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { employeeId, startDate, endDate } = await req.json()
    
    const myHeaders = new Headers()
    myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)")
    
    const response = await fetch(
      `http://a2.4000063966.com:81/xb/zk/attendance/v2/record.do?userNo=${employeeId}&timeStart=${startDate} 00:00:00&timeEnd=${endDate} 23:59:59&openId=o45LO4l28n6aa4dFCXB3BBYOFWNs&userVerifyNumber=15824821718`,
      {
        method: "GET",
        headers: myHeaders,
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch records")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    )
  }
}