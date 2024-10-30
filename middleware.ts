import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { validateToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  // 如果已经在登录页面，直接放行
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.next()
  }

  // 排除静态资源和API路由
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // 获取token
  const authToken = request.cookies.get('auth_token')?.value

  // 如果没有token或token无效，重定向到登录页
  if (!authToken || !validateToken(authToken)) {
    const loginUrl = new URL('/login', request.url)
    // 保存原始URL作为重定向目标
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}