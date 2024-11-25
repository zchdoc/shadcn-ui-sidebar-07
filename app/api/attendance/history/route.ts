import {NextResponse} from "next/server"

export async function POST(req: Request) {
  try {
    const {employeeId, startDate, endDate} = await req.json()

    const myHeaders = new Headers()
    myHeaders.append("User-Agent", "ApiFox/1.0.0 (https://apifox.com)")
    // a2.4000063966.com:81 127.0.0.1:8081
    const url = 'http' + '://' + 'a2.4000063966.com:81';
    const uri = '/xb/zk/attendance/v2/record.do';
    const tmpOpenId = 'o45LO4l28n6aa4dFCXB3BBYOFWNs';
    const tmpUserVerifyNumber = '15824821718';
    const params = `?userNo=${employeeId}&timeStart=${startDate}&timeEnd=${endDate}&openId=${tmpOpenId}&userVerifyNumber=${tmpUserVerifyNumber}`;
    const fullUrl = `${url}${uri}${params}`;
    const response = await fetch(fullUrl,
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
