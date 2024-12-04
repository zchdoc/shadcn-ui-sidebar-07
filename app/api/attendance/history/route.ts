import { NextResponse } from "next/server"
// import { headers } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { employeeId, startDate, endDate, clientInfo } = await req.json()
    // const headersList = headers()

    const clientInfoStr = encodeURIComponent(JSON.stringify(clientInfo))

    const myHeaders = new Headers()
    // a2.4000063966.com:81 127.0.0.1:8081
    const url = "http://a2.4000063966.com:81"
    const uri = "/xb/zk/attendance/v2/record.do"
    const tmpOpenId = "o45LO4l28n6aa4dFCXB3BBYOFWNs"
    const tmpUserVerifyNumber = "15824821718"

    // 基础参数
    const baseParams = new URLSearchParams({
      userNo: employeeId,
      timeStart: startDate,
      timeEnd: endDate,
      openId: tmpOpenId,
      userVerifyNumber: tmpUserVerifyNumber,
      clientInfo: clientInfoStr,
    })

    const fullUrl = `${url}${uri}?${baseParams.toString()}`

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: myHeaders,
    })

    if (!response.ok) {
      throw new Error("Failed to fetch records")
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error details:", error)
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 })
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    )
  }
}
