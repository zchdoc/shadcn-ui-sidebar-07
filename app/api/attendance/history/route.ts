import { NextResponse } from "next/server"
import { headers } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { employeeId, startDate, endDate, clientInfo } = await req.json()
    const headersList = headers()
    const ipAddress = headersList.get('x-forwarded-for') || 'unknown'

    // 完整的客户端信息
    const simplifiedClientInfo = {
      // 浏览器和系统信息
      userAgent: clientInfo.userAgent,
      browser: {
        name: clientInfo.browserInfo.name,
        version: clientInfo.browserInfo.version,
        language: clientInfo.browserInfo.language,
        cookiesEnabled: clientInfo.browserInfo.cookiesEnabled,
        jsEnabled: clientInfo.browserInfo.jsEnabled
      },
      operatingSystem: clientInfo.operatingSystem,
      
      // 时间和地区信息
      systemTime: clientInfo.systemTime,
      timeZone: clientInfo.timeZone,
      
      // 设备信息
      screen: {
        width: clientInfo.screenInfo.width,
        height: clientInfo.screenInfo.height,
        colorDepth: clientInfo.screenInfo.colorDepth,
        pixelRatio: clientInfo.screenInfo.pixelRatio,
        resolution: `${clientInfo.screenInfo.width}x${clientInfo.screenInfo.height}`
      },
      window: {
        width: clientInfo.windowSize.width,
        height: clientInfo.windowSize.height,
        size: `${clientInfo.windowSize.width}x${clientInfo.windowSize.height}`
      },
      
      // 存储信息
      storage: {
        localStorage: clientInfo.storageAvailable.localStorage,
        sessionStorage: clientInfo.storageAvailable.sessionStorage,
        cookiesEnabled: clientInfo.storageAvailable.cookiesEnabled
      },
      
      // 硬件信息
      hardware: {
        cpuCores: clientInfo.hardwareInfo.cpuCores,
        deviceMemory: clientInfo.hardwareInfo.deviceMemory,
        maxTouchPoints: clientInfo.hardwareInfo.maxTouchPoints,
        battery: clientInfo.hardwareInfo.batteryStatus ? {
          charging: clientInfo.hardwareInfo.batteryStatus.charging,
          level: clientInfo.hardwareInfo.batteryStatus.level
        } : undefined
      },
      
      // 网络信息
      network: clientInfo.connection ? {
        effectiveType: clientInfo.connection.effectiveType,
        downlink: clientInfo.connection.downlink,
        rtt: clientInfo.connection.rtt
      } : undefined,
      
      // IP 地址
      ipAddress: ipAddress
    }
    
    const clientInfoStr = encodeURIComponent(JSON.stringify(clientInfo))

    const myHeaders = new Headers()
    const url = 'http://127.0.0.1:8081'
    const uri = '/xb/zk/attendance/v2/record.do'
    const tmpOpenId = 'o45LO4l28n6aa4dFCXB3BBYOFWNs'
    const tmpUserVerifyNumber = '15824821718'
    
    // 基础参数
    const baseParams = new URLSearchParams({
      userNo: employeeId,
      timeStart: startDate,
      timeEnd: endDate,
      openId: tmpOpenId,
      userVerifyNumber: tmpUserVerifyNumber,
      clientInfo: clientInfoStr
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
    
    // 记录完整的客户端信息（可以存储到数据库或日志中）
    console.log('Full Client Information:', simplifiedClientInfo)

    return NextResponse.json(data)
  }
  catch (error) {
    console.error('Error details:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { message: "Unknown error occurred" },
      { status: 500 }
    )
  }
}
