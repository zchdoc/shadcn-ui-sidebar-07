import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET() {
  const headersList = headers()

  // 获取真实的用户 IP
  const forwardedFor = headersList.get('x-forwarded-for')
  const realIP = headersList.get('x-real-ip')
  const ip = forwardedFor?.split(',')[0] || realIP || 'unknown'

  return NextResponse.json({ ip })
}
