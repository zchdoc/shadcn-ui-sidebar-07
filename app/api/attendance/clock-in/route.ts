import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { employeeId, timestamp } = await req.json()
    
    const myHeaders = new Headers()
    myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)")
    myHeaders.append("Content-Type", "text/plain")
    
    const raw = `${employeeId}\t${timestamp}\t0\t15\t\t0\t0`
    
    const response = await fetch(
      "http://a2.4000063966.com:81/iclock/cdata?SN=CJDE193560303&table=ATTLOG&Stamp=666",
      {
        method: "POST",
        headers: myHeaders,
        body: raw,
      }
    )

    if (!response.ok) {
      throw new Error("Failed to clock in")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to clock in" },
      { status: 500 }
    )
  }
}