// import { NextResponse } from 'next/server'

// export async function POST(req: Request) {
//   const data = await req.text()
  
//   const response = await fetch(
//     "http:///iclock/cdata?SN=CJDE193560303&table=ATTLOG&Stamp=666",
//     {
//       method: 'POST',
//       headers: {
//         'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
//         'Content-Type': 'text/plain',
//       },
//       body: data,
//     }
//   )

//   const result = await response.text()
//   return NextResponse.json({ result })
// }

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url)
//   const userNo = searchParams.get('userNo')
//   const timeStart = searchParams.get('timeStart')
//   const timeEnd = searchParams.get('timeEnd')
  
//   const response = await fetch(
//     `http:///xb/zk/attendance/v2/record.do?userNo=${userNo}&timeStart=${timeStart}&timeEnd=${timeEnd}&openId=o45LO4l28n6aa4dFCXB3BBYOFWNs&userVerifyNumber=15824821718`,
//     {
//       headers: {
//         'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
//       },
//     }
//   )

//   const result = await response.json()
//   return NextResponse.json(result)
// }